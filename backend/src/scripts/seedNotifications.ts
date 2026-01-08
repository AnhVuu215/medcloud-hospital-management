import NotificationModel, { NotificationType, NotificationPriority } from '../models/Notification.js';
import { connectMongoDB, disconnectMongoDB } from '../config/mongodb.js';

const sampleNotifications = [
    {
        userId: 'D3',
        type: NotificationType.APPOINTMENT,
        priority: NotificationPriority.CRITICAL,
        title: 'Lịch khám cấp cứu',
        message: 'Bệnh nhân Nguyễn Văn A cần khám cấp cứu ngay lập tức. Vui lòng đến phòng cấp cứu.',
        isRead: false
    },
    {
        userId: 'ADMIN_01',
        type: NotificationType.INVENTORY,
        priority: NotificationPriority.HIGH,
        title: 'Thuốc sắp hết hàng',
        message: 'Paracetamol 500mg chỉ còn 50 viên. Vui lòng nhập thêm hàng.',
        isRead: false
    },
    {
        userId: 'D4',
        type: NotificationType.APPOINTMENT,
        priority: NotificationPriority.HIGH,
        title: 'Lịch hẹn sắp tới',
        message: 'Bạn có lịch khám với bệnh nhân Trần Thị E lúc 14:00 hôm nay.',
        isRead: false
    },
    {
        userId: 'D5',
        type: NotificationType.APPOINTMENT,
        priority: NotificationPriority.NORMAL,
        title: 'Lịch hẹn mới',
        message: 'Bệnh nhân Lê Văn C đã đặt lịch khám vào ngày mai lúc 9:00.',
        isRead: false
    },
    {
        userId: 'R1',
        type: NotificationType.PAYMENT,
        priority: NotificationPriority.NORMAL,
        title: 'Thanh toán thành công',
        message: 'Bệnh nhân đã thanh toán hóa đơn #INV001 số tiền 500,000 VNĐ.',
        isRead: true
    },
    {
        userId: 'ADMIN_01',
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.INFO,
        title: 'Cập nhật hệ thống',
        message: 'Hệ thống sẽ bảo trì vào 2:00 AM ngày mai. Thời gian dự kiến: 30 phút.',
        isRead: true
    },
    {
        userId: 'D3',
        type: NotificationType.MEDICAL_RECORD,
        priority: NotificationPriority.NORMAL,
        title: 'Kết quả xét nghiệm',
        message: 'Kết quả xét nghiệm máu của bệnh nhân Nguyễn Văn A đã có.',
        isRead: false
    },
    {
        userId: 'D4',
        type: NotificationType.MEDICATION,
        priority: NotificationPriority.HIGH,
        title: 'Cảnh báo tương tác thuốc',
        message: 'Phát hiện tương tác giữa Aspirin và Warfarin trong đơn thuốc của bệnh nhân.',
        isRead: false
    },
    {
        userId: 'R1',
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.INFO,
        title: 'Bệnh nhân mới đăng ký',
        message: 'Bệnh nhân Phạm Thị D đã hoàn tất đăng ký. Mã BN: P123456.',
        isRead: true
    },
    {
        userId: 'D5',
        type: NotificationType.APPOINTMENT,
        priority: NotificationPriority.NORMAL,
        title: 'Hoàn thành khám bệnh',
        message: 'Bạn đã hoàn thành khám cho bệnh nhân Nguyễn Văn E.',
        isRead: true
    }
];

async function seedNotifications() {
    try {
        console.log('🌱 Starting MongoDB notification seeding...');

        // Connect to MongoDB
        await connectMongoDB();

        // Clear existing notifications
        await NotificationModel.deleteMany({});
        console.log('✅ Cleared existing notifications');

        // Insert sample notifications
        const result = await NotificationModel.insertMany(sampleNotifications);
        console.log(`✅ Inserted ${result.length} sample notifications`);

        // Count by status
        const unreadCount = await NotificationModel.countDocuments({ isRead: false });
        const readCount = await NotificationModel.countDocuments({ isRead: true });

        console.log(`📊 Statistics:`);
        console.log(`   - Total: ${result.length}`);
        console.log(`   - Unread: ${unreadCount}`);
        console.log(`   - Read: ${readCount}`);

        console.log('🎉 Seeding completed successfully!');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        await disconnectMongoDB();
    }
}

// Run seeding
seedNotifications()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
