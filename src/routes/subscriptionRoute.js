import express from 'express';
import { subscriptionController } from '../controllers';
import { customerMiddleware, authMiddleware } from '../middleware';

const router = express.Router();

router.post(
	'/create',
	customerMiddleware,
	subscriptionController.createSubscription,
);

router.get('/get', authMiddleware, subscriptionController.getSubscription);
router.get(
	'/user/get',
	customerMiddleware,
	subscriptionController.getSubscription,
);

module.exports = router;
