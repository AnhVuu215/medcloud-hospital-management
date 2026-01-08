import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Clock, AlertCircle, Info } from 'lucide-react';
import { notificationAPI } from '../services/apiService';

interface Notification {
    _id: string;
    type: string;
    priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'INFO';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

const NotificationBell: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Fetch unread count
    const fetchUnreadCount = async () => {
        try {
            const data = await notificationAPI.getUnreadCount();
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    // Fetch all notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationAPI.getAll(20);
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mark notification as read
    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    // Mark all as read
    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    // Delete notification
    const handleDelete = async (id: string) => {
        try {
            await notificationAPI.delete(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
            const notification = notifications.find(n => n._id === id);
            if (notification && !notification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    // Toggle panel
    const togglePanel = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Auto-refresh unread count every 30 seconds
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Get priority icon and color
    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case 'CRITICAL':
                return { icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
            case 'HIGH':
                return { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
            case 'NORMAL':
                return { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
            case 'INFO':
                return { icon: Info, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };
            default:
                return { icon: Info, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };
        }
    };

    // Format time ago
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Vừa xong';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Button */}
            <button
                onClick={togglePanel}
                className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
                <Bell size={20} className="text-slate-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Thông báo</h3>
                            {unreadCount > 0 && (
                                <p className="text-xs text-slate-500">{unreadCount} chưa đọc</p>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                            >
                                <CheckCheck size={14} />
                                <span>Đọc tất cả</span>
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-sm text-slate-500 mt-2">Đang tải...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell size={48} className="text-slate-300 mx-auto mb-3" />
                                <p className="text-sm font-bold text-slate-900">Không có thông báo</p>
                                <p className="text-xs text-slate-500 mt-1">Bạn đã xem hết thông báo</p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const config = getPriorityConfig(notification.priority);
                                const Icon = config.icon;

                                return (
                                    <div
                                        key={notification._id}
                                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`p-2 rounded-lg ${config.bg} border ${config.border} flex-shrink-0`}>
                                                <Icon size={16} className={config.color} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <h4 className={`text-sm font-bold ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <button
                                                        onClick={() => handleDelete(notification._id)}
                                                        className="text-slate-400 hover:text-rose-600 transition-colors flex-shrink-0 ml-2"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>

                                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center text-[10px] text-slate-400">
                                                        <Clock size={10} className="mr-1" />
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </div>

                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification._id)}
                                                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                                                        >
                                                            <Check size={10} />
                                                            <span>Đánh dấu đã đọc</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
