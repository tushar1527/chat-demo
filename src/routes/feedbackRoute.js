import express from 'express';
import { feedbackController } from '../controllers';
import { customerMiddleware } from '../middleware';

const router = express.Router();

router.post('/create', customerMiddleware, feedbackController.setFeedback);
router.get('/getFeedback', feedbackController.getFeedback);
router.put('/updateFeedback/:id', feedbackController.updateFeedback);
router.put('/deleteFeedback/:id', feedbackController.deleteFeedback);
module.exports = router;
