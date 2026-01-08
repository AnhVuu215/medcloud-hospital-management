import { Response } from 'express';
import NotificationModel, { NotificationType, NotificationPriority } from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';

export class NotificationController {
    // GET /api/notifications - Get all notifications for current user
    static async getNotifications(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const limit = parseInt(req.query.limit as string) || 50;

            const notifications = await NotificationModel.findByUserId(userId, limit);

            res.status(200).json({
                count: notifications.length,
                notifications
            });
        } catch (error) {
            console.error('Get notifications error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get notifications' });
        }
    }

    // GET /api/notifications/unread - Get unread notifications
    static async getUnreadNotifications(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const notifications = await NotificationModel.findUnreadByUserId(userId);

            res.status(200).json({
                count: notifications.length,
                notifications
            });
        } catch (error) {
            console.error('Get unread notifications error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get unread notifications' });
        }
    }

    // GET /api/notifications/unread/count - Get unread count
    static async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const count = await NotificationModel.getUnreadCount(userId);

            res.status(200).json({ count });
        } catch (error) {
            console.error('Get unread count error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get unread count' });
        }
    }

    // PUT /api/notifications/:id/read - Mark notification as read
    static async markAsRead(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            // Verify notification belongs to user
            const notification = await NotificationModel.findById(id);
            if (!notification) {
                res.status(404).json({ error: 'Not Found', message: 'Notification not found' });
                return;
            }

            if (notification.userId !== userId) {
                res.status(403).json({ error: 'Forbidden', message: 'You can only mark your own notifications as read' });
                return;
            }

            await NotificationModel.markAsRead(id);

            res.status(200).json({ message: 'Notification marked as read' });
        } catch (error) {
            console.error('Mark as read error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to mark notification as read' });
        }
    }

    // PUT /api/notifications/read-all - Mark all notifications as read
    static async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            await NotificationModel.markAllAsRead(userId);

            res.status(200).json({ message: 'All notifications marked as read' });
        } catch (error) {
            console.error('Mark all as read error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to mark all notifications as read' });
        }
    }

    // DELETE /api/notifications/:id - Delete notification
    static async deleteNotification(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            // Verify notification belongs to user
            const notification = await NotificationModel.findById(id);
            if (!notification) {
                res.status(404).json({ error: 'Not Found', message: 'Notification not found' });
                return;
            }

            if (notification.userId !== userId) {
                res.status(403).json({ error: 'Forbidden', message: 'You can only delete your own notifications' });
                return;
            }

            await NotificationModel.findByIdAndDelete(id);

            res.status(200).json({ message: 'Notification deleted successfully' });
        } catch (error) {
            console.error('Delete notification error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to delete notification' });
        }
    }

    // POST /api/notifications - Create notification (Admin only, for testing)
    static async createNotification(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { userId, type, priority, title, message, relatedEntityType, relatedEntityId, expiresAt } = req.body;

            // Validate required fields
            if (!userId || !type || !title || !message) {
                res.status(400).json({ error: 'Validation Error', message: 'Missing required fields' });
                return;
            }

            const notification = await NotificationModel.create({
                userId,
                type: type as NotificationType,
                priority: priority as NotificationPriority || NotificationPriority.NORMAL,
                title,
                message,
                relatedEntityType,
                relatedEntityId,
                expiresAt: expiresAt ? new Date(expiresAt) : undefined
            });

            res.status(201).json({
                message: 'Notification created successfully',
                notification
            });
        } catch (error) {
            console.error('Create notification error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to create notification' });
        }
    }
}
