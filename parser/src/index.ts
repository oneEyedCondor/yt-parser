import 'dotenv/config';
import express from 'express';
import * as amqp from 'amqplib/callback_api';
import { createConnection } from 'typeorm';
import * as cheerio from 'cheerio';

import { Channel } from './entity/channel';
import { Video } from './entity/video';
import { PuppeteerHandler } from './util/puppeteer';

createConnection().then((db) => {
    const channelRepository = db.getMongoRepository(Channel);
    const videoRepository = db.getMongoRepository(Video);

    amqp.connect('amqp://guest:guest@localhost:5672/', (error0, connection) => {
        if (error0) {
            throw error0;
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            channel.assertQueue('parse_channel', { durable: false });
            channel.assertQueue('parse_video', { durable: false });
            channel.assertQueue('parse_video_list', { durable: false });

            const app = express();
            const port = process.env.PORT;

            channel.consume(
                'parse_channel',
                async (msg) => {
                    const link = msg.content.toString();

                    const puppeteerHandler = new PuppeteerHandler();
                    const pageContent = await puppeteerHandler.getPageContent(
                        link
                    );
                    await puppeteerHandler.closeBrowser();

                    const $ = cheerio.load(pageContent);

                    let title, description, subscribers, views;

                    $('#channel-header-container #text-container:eq(0)').each(
                        (index, element) => {
                            title = $(element).text().trim();
                        }
                    );

                    $(
                        '#description-container > .ytd-channel-about-metadata-renderer:eq(1)'
                    ).each((index, element) => {
                        description = $(element).text();
                    });

                    $('#subscriber-count').each((index, element) => {
                        subscribers = $(element).text().split(' ')[0];
                    });

                    $(
                        '#right-column > .ytd-channel-about-metadata-renderer:eq(2)'
                    ).each((index, element) => {
                        views = $(element)
                            .text()
                            .split(' ')[0]
                            .replace(/[\s.,%]/g, '');
                    });

                    const ytChannel = await channelRepository.create({
                        title,
                        description,
                        subscribers,
                        views: Number(views),
                    });
                    await channelRepository.save(ytChannel);
                },
                { noAck: true }
            );

            channel.consume(
                'parse_video',
                async (msg) => {
                    const link = msg.content.toString();

                    const puppeteerHandler = new PuppeteerHandler();
                    const pageContent = await puppeteerHandler.getPageContent(
                        link
                    );
                    await puppeteerHandler.closeBrowser();

                    const $ = cheerio.load(pageContent);

                    let title, description, views, likes, comments;

                    $('#columns > .watch-active-metadata').each(
                        (index, element) => {
                            title = $(element)
                                .find('h1 .ytd-watch-metadata')
                                .text();
                        }
                    );

                    $('#description').each((index, element) => {
                        description = $(element).find('span').text();
                    });

                    $('#description').each((index, element) => {
                        views = $(element).text();
                    });

                    $('#description').each((index, element) => {
                        likes = $(element).text();
                    });

                    $('#description').each((index, element) => {
                        comments = $(element).text();
                    });

                    const ytVideo = await videoRepository.create({
                        title,
                        description,
                        views,
                        likes,
                        comments,
                        link,
                    });
                    await videoRepository.save(ytVideo);
                },
                { noAck: true }
            );

            app.listen(port, () => console.log(`Running on port ${port}`));

            process.on('beforeExit', () => {
                console.log('closing');
                connection.close();
            });
        });
    });
});
