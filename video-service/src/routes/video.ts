import { Router } from 'express';

import { getVideo, parseVideo } from '../controllers/video';

const router = Router();

router.post('/get', getVideo);
router.post('/parse', parseVideo);

export default router;
