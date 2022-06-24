import { Router } from 'express';

import { getVideo, parseVideo } from '../controllers/video';
import validatorMiddleware from '../middlewares/validator.middleware';

const router = Router();

router.post('/get', validatorMiddleware('validatorGetVideo'), getVideo);
router.post('/parse', validatorMiddleware('validatorParseVideo'), parseVideo);

export default router;
