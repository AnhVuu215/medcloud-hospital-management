import { Response } from 'express';
import { getConnection } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';
import sql from 'mssql';

export class ReportController {
    // GET /api/reports/daily - Báo cáo theo ngày
    static async getDailyReport(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { date } = req.query;
            const reportDate = date ? new Date(date as string) : new Date();
            const pool = await getConnection();

            // Thống kê bệnh nhân
            const patientStats = await pool.request()
                .input('Date', sql.Date, reportDate)
                .query(`
                    SELECT 
                        COUNT(*) as totalPatients,
                        COUNT(CASE WHEN CAST(CreatedAt AS DATE) = @Date THEN 1 END) as newToday
                    FROM Users
                    WHERE Role = 'PATIENT' AND DeletedAt IS NULL
                `);

            // Thống kê lịch hẹn
            const appointmentStats = await pool.request()
                .input('Date', sql.Date, reportDate)
                .query(`
                    SELECT 
                        COUNT(*) as totalAppointments,
                        COUNT(CASE WHEN Status = 'COMPLETED' THEN 1 END) as completed,
                        COUNT(CASE WHEN Status = 'PENDING' THEN 1 END) as pending,
                        COUNT(CASE WHEN Status = 'CANCELLED' THEN 1 END) as cancelled
                    FROM Appointments
                    WHERE CAST(AppointmentDate AS DATE) = @Date
                `);

            // Thống kê doanh thu (giả định có bảng Invoices)
            const revenueStats = await pool.request()
                .input('Date', sql.Date, reportDate)
                .query(`
                    SELECT 
                        ISNULL(SUM(TotalAmount), 0) as totalRevenue,
                        COUNT(*) as totalInvoices
                    FROM Invoices
                    WHERE CAST(CreatedAt AS DATE) = @Date AND Status = 'PAID'
                `);

            // Thống kê thuốc bán
            const medicineStats = await pool.request()
                .input('Date', sql.Date, reportDate)
                .query(`
                    SELECT 
                        COUNT(DISTINCT MedicineId) as medicinesSold,
                        ISNULL(SUM(Quantity), 0) as totalQuantity
                    FROM PrescriptionDetails pd
                    INNER JOIN Prescriptions p ON pd.PrescriptionId = p.PrescriptionId
                    WHERE CAST(p.CreatedAt AS DATE) = @Date
                `);

            res.status(200).json({
                date: reportDate,
                patients: patientStats.recordset[0],
                appointments: appointmentStats.recordset[0],
                revenue: revenueStats.recordset[0],
                medicines: medicineStats.recordset[0]
            });
        } catch (error) {
            console.error('Get daily report error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get daily report' });
        }
    }

    // GET /api/reports/summary - Tổng quan hệ thống
    static async getSummaryReport(req: AuthRequest, res: Response): Promise<void> {
        try {
            const pool = await getConnection();

            // Tổng quan
            const summary = await pool.request().query(`
                SELECT 
                    (SELECT COUNT(*) FROM Users WHERE Role = 'PATIENT' AND DeletedAt IS NULL) as totalPatients,
                    (SELECT COUNT(*) FROM Users WHERE Role = 'DOCTOR' AND DeletedAt IS NULL) as totalDoctors,
                    (SELECT COUNT(*) FROM Appointments WHERE DeletedAt IS NULL) as totalAppointments,
                    (SELECT COUNT(*) FROM Medicines WHERE DeletedAt IS NULL) as totalMedicines
            `);

            // Xu hướng 7 ngày gần đây
            const weeklyTrend = await pool.request().query(`
                SELECT 
                    CAST(AppointmentDate AS DATE) as date,
                    COUNT(*) as appointments
                FROM Appointments
                WHERE AppointmentDate >= DATEADD(DAY, -7, GETDATE())
                GROUP BY CAST(AppointmentDate AS DATE)
                ORDER BY date DESC
            `);

            res.status(200).json({
                summary: summary.recordset[0],
                weeklyTrend: weeklyTrend.recordset
            });
        } catch (error) {
            console.error('Get summary report error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get summary report' });
        }
    }

    // GET /api/reports/revenue - Báo cáo doanh thu
    static async getRevenueReport(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;
            const pool = await getConnection();

            const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate as string) : new Date();

            // Doanh thu theo ngày
            const dailyRevenue = await pool.request()
                .input('StartDate', sql.Date, start)
                .input('EndDate', sql.Date, end)
                .query(`
                    SELECT 
                        CAST(CreatedAt AS DATE) as date,
                        ISNULL(SUM(TotalAmount), 0) as revenue,
                        COUNT(*) as invoices
                    FROM Invoices
                    WHERE CAST(CreatedAt AS DATE) BETWEEN @StartDate AND @EndDate
                        AND Status = 'PAID'
                    GROUP BY CAST(CreatedAt AS DATE)
                    ORDER BY date DESC
                `);

            res.status(200).json({
                startDate: start,
                endDate: end,
                dailyRevenue: dailyRevenue.recordset
            });
        } catch (error) {
            console.error('Get revenue report error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get revenue report' });
        }
    }

    // GET /api/reports/stats - Thống kê tổng hợp cho dashboard
    static async getStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            const pool = await getConnection();
            const today = new Date();

            // Stats cards
            const stats = await pool.request()
                .input('Today', sql.Date, today)
                .query(`
                    SELECT 
                        -- Bệnh nhân
                        (SELECT COUNT(*) FROM Users WHERE Role = 'PATIENT' AND DeletedAt IS NULL) as totalPatients,
                        (SELECT COUNT(*) FROM Users WHERE Role = 'PATIENT' AND CAST(CreatedAt AS DATE) = @Today AND DeletedAt IS NULL) as newPatientsToday,
                        
                        -- Lịch hẹn hôm nay
                        (SELECT COUNT(*) FROM Appointments WHERE CAST(AppointmentDate AS DATE) = @Today) as appointmentsToday,
                        (SELECT COUNT(*) FROM Appointments WHERE CAST(AppointmentDate AS DATE) = @Today AND Status = 'COMPLETED') as completedToday,
                        
                        -- Doanh thu hôm nay (tạm thời set = 0 vì chưa có bảng Invoices)
                        0 as revenueToday,
                        
                        -- Thuốc sắp hết
                        (SELECT COUNT(*) FROM Medicines WHERE StockQuantity < MinStockLevel AND DeletedAt IS NULL) as lowStockMedicines
                `);

            res.status(200).json(stats.recordset[0]);
        } catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get statistics' });
        }
    }
}
