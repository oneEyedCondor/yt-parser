import { Router } from 'express';

import { getChannel, parseChannel } from '../controllers/channel';
import validatorMiddleware from '../middlewares/validator.middleware';

const router = Router();

router.post('/get', validatorMiddleware('validatorGetChannel'), getChannel);
router.post(
    '/parse',
    validatorMiddleware('validatorParseChannel'),
    parseChannel
);

export default router;
