import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all notifications for current user
router.get('/', NotificationController.getNotifications);

// Get unread notifications
router.get('/unread', NotificationController.getUnreadNotifications);

// Get unread count
router.get('/unread/count', NotificationController.getUnreadCount);

// Mark notification as read
router.put('/:id/read', NotificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', NotificationController.markAllAsRead);

// Delete notification
router.delete('/:id', NotificationController.deleteNotification);

// Create notification (Admin only, for testing)
router.post('/', requireAdmin, NotificationController.createNotification);

export default router;
