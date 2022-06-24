import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';

import channelRoutes from './routes/channel';
import videoRoutes from './routes/video';

const app = express();
const port = process.env.PORT;

app.use(
    cors({
        origin: [process.env.CLIENT_URL],
    })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/channel', channelRoutes);
app.use('/video', videoRoutes);

app.use((err, req, res, next) => {
    res.status(400).send(err);
});

app.listen(port, () => console.log(`Running on port ${port}`));
