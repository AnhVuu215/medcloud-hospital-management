import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get daily report
router.get('/daily', ReportController.getDailyReport);

// Get summary report
router.get('/summary', ReportController.getSummaryReport);

// Get revenue report
router.get('/revenue', ReportController.getRevenueReport);

// Get dashboard stats
router.get('/stats', ReportController.getStats);

export default router;
