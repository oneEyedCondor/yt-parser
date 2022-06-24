import { Router } from 'express';

import { getChannel, parseChannel } from '../controllers/channel';

const router = Router();

router.post('/get', getChannel);
router.post('/parse', parseChannel);

export default router;
