import express from 'express';

import { liveEventController } from '../controllers';
import { authMiddleware } from '../middleware';

const router = express.Router();

router.post('/create', authMiddleware, liveEventController.createLiveEvent);
router.delete(
	'/delete/:id',
	authMiddleware,
	liveEventController.deleteLiveEvent,
);
router.get('/get', liveEventController.getLiveEvent);
router.put(
	'/update/:id',
	authMiddleware,

	liveEventController.updateLiveEvent,
);

module.exports = router;
