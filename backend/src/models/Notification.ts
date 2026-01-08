import mongoose, { Schema, Document, Model } from 'mongoose';

// Notification Types
export enum NotificationType {
    APPOINTMENT = 'APPOINTMENT',
    MEDICATION = 'MEDICATION',
    PAYMENT = 'PAYMENT',
    SYSTEM = 'SYSTEM',
    MEDICAL_RECORD = 'MEDICAL_RECORD',
    INVENTORY = 'INVENTORY'
}

// Notification Priority
export enum NotificationPriority {
    CRITICAL = 'CRITICAL',
    HIGH = 'HIGH',
    NORMAL = 'NORMAL',
    INFO = 'INFO'
}

// Notification Interface
export interface INotification extends Document {
    userId: string;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    isRead: boolean;
    readAt?: Date;
    relatedEntityType?: string;
    relatedEntityId?: string;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Notification Schema
const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
            index: true
        },
        priority: {
            type: String,
            enum: Object.values(NotificationPriority),
            default: NotificationPriority.NORMAL,
            index: true
        },
        title: {
            type: String,
            required: true,
            maxlength: 200
        },
        message: {
            type: String,
            required: true,
            maxlength: 1000
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true
        },
        readAt: {
            type: Date,
            default: null
        },
        relatedEntityType: {
            type: String,
            default: null
        },
        relatedEntityId: {
            type: String,
            default: null
        },
        expiresAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        collection: 'notifications'
    }
);

// Indexes for better query performance
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, priority: -1, createdAt: -1 });

// TTL Index - Automatically delete expired notifications
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static Methods
NotificationSchema.statics.findByUserId = function (userId: string, limit: number = 50) {
    return this.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
};

NotificationSchema.statics.findUnreadByUserId = function (userId: string) {
    return this.find({ userId, isRead: false })
        .sort({ priority: -1, createdAt: -1 })
        .lean();
};

NotificationSchema.statics.getUnreadCount = function (userId: string) {
    return this.countDocuments({ userId, isRead: false });
};

NotificationSchema.statics.markAsRead = function (notificationId: string) {
    return this.findByIdAndUpdate(
        notificationId,
        { isRead: true, readAt: new Date() },
        { new: true }
    );
};

NotificationSchema.statics.markAllAsRead = function (userId: string) {
    return this.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
    );
};

// Instance Methods
NotificationSchema.methods.markAsRead = function () {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

// Model
const NotificationModel: Model<INotification> = mongoose.model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
