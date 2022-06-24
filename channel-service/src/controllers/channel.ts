import { Request, Response } from 'express';

const getChannel = async (req: Request | any, res: Response) => {
    const { title } = req.body;
    const fetchedChannel = await req.channelRepository.findOneBy({
        title,
    });
    return res.send(fetchedChannel);
};

const parseChannel = async (req: Request | any, res: Response) => {
    const { link } = req.body;
    req.channel.sendToQueue('parse_channel', Buffer.from(link));
    return res.sendStatus(200);
};

export { getChannel, parseChannel };
