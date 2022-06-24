import { Request, Response } from 'express';
import axios from 'axios';

const getVideo = async (req: Request, res: Response) => {
    const result = await axios.post(
        `${process.env.VIDEO_SERVICE_URL}/get`,
        req.body
    );
    return res.send(result.data);
};

const parseVideo = async (req: Request, res: Response) => {
    const result = await axios.post(
        `${process.env.VIDEO_SERVICE_URL}/parse`,
        req.body
    );
    return res.send(result.data);
};

export { getVideo, parseVideo };
