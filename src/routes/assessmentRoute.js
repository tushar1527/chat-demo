import express from 'express';
import { assessmentController } from '../controllers';
// import { customerMiddleware, authMiddleware } from '../middleware';
const router = express.Router();

router.post('/create', assessmentController.setAssessment);
router.get('/getAssessment', assessmentController.getAssessment);

module.exports = router;
