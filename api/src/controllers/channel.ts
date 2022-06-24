import { Request, Response } from 'express';
import axios from 'axios';

const getChannel = async (req: Request, res: Response) => {
    const result = await axios.post(
        `${process.env.CHANNEL_SERVICE_URL}/get`,
        req.body
    );
    return res.send(result.data);
};

const parseChannel = async (req: Request, res: Response) => {
    const result = await axios.post(
        `${process.env.CHANNEL_SERVICE_URL}/parse`,
        req.body
    );
    return res.send(result.data);
};

export { getChannel, parseChannel };
