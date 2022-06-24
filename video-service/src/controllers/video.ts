import { Request, Response } from 'express';

const getVideo = async (req: Request | any, res: Response) => {
    const { link } = req.body;
    const fetchedVideo = await req.videoRepository.findOneBy({
        link,
    });
    return res.send(fetchedVideo);
};

const parseVideo = async (req: Request | any, res: Response) => {
    const { link } = req.body;
    req.channel.sendToQueue('parse_video', Buffer.from(link));
    return res.sendStatus(200);
};

export { getVideo, parseVideo };
