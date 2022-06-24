import 'dotenv/config';
import express from 'express';
import { Response, NextFunction } from 'express';
import { createConnection } from 'typeorm';
import cors from 'cors';
import * as amqp from 'amqplib/callback_api';
import * as bodyParser from 'body-parser';

import { Channel } from './entity/channel';
import channelRoutes from './routes/channel';

createConnection().then((db) => {
    const channelRepository = db.getMongoRepository(Channel);

    amqp.connect('amqp://guest:guest@localhost:5672/', (error0, connection) => {
        if (error0) {
            throw error0;
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            const app = express();
            const port = process.env.PORT;

            app.use(
                cors({
                    origin: [process.env.API_URL],
                })
            );

            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(bodyParser.json());

            app.use((request: any, response: Response, next: NextFunction) => {
                request.channel = channel;
                request.channelRepository = channelRepository;
                next();
            });

            app.use('/', channelRoutes);

            app.listen(port, () => console.log(`Running on port ${port}`));

            process.on('beforeExit', () => {
                console.log('closing');
                connection.close();
            });
        });
    });
});
