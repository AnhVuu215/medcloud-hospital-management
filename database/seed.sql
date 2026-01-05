-- MedCloud Hospital Management System - Seed Data
-- Created: 2026-01-05
-- Description: Initial data for testing and development

USE MedCloudDB;
GO

-- =============================================
-- Insert Users (Admin, Doctors, Receptionist, Patients)
-- =============================================
-- Password: "password123" hashed with bcrypt (you should hash properly in production)
INSERT INTO Users (UserId, Name, Email, PasswordHash, Role, Status, Phone, Specialization, Department, LastLogin) VALUES
('ADMIN_01', N'Quản trị viên Hệ thống', 'admin@medcloud.vn', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'ADMIN', 'ACTIVE', '0901234567', NULL, NULL, '2023-10-25 08:00:00'),
('D1', N'BS. Trần Thị B', 'tranb@medcloud.vn', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'DOCTOR', 'ACTIVE', '0902345678', N'Nội khoa', N'Khoa Nội Tổng Hợp', '2023-10-25 07:30:00'),
('D2', N'BS. Phạm Văn D', 'phamd@medcloud.vn', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'DOCTOR', 'ACTIVE', '0903456789', N'Nhi khoa', N'Khoa Nhi', '2023-10-24 14:00:00'),
('D3', N'BS. Lê Hoàng Nam', 'lenam@medcloud.vn', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'DOCTOR', 'ACTIVE', '0904567890', N'Ngoại khoa', N'Khoa Ngoại', '2023-10-24 10:00:00'),
('D4', N'BS. Đặng Thu Thảo', 'dangthao@medcloud.vn', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'DOCTOR', 'ACTIVE', '0905678901', N'Sản phụ khoa', N'Khoa Phụ Sản', '2023-10-23 15:00:00'),
('D5', N'BS. Ngô Bảo Châu', 'ngochau@medcloud.vn', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'DOCTOR', 'ACTIVE', '0906789012', N'Nội khoa', N'Khoa Nội Tổng Hợp', '2023-10-25 08:00:00'),
('R1', N'Lễ tân Mai Phương', 'phuong.mai@medcloud.vn', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'RECEPTIONIST', 'ACTIVE', '0907890123', NULL, NULL, '2023-10-25 08:15:00'),
('P00124', N'Nguyễn Văn A', 'nguyenvana@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'PATIENT', 'ACTIVE', '0908901234', NULL, NULL, '2023-10-24 16:00:00'),
('P00125', N'Lê Văn C', 'levanc@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'PATIENT', 'ACTIVE', '0909012345', NULL, NULL, '2023-10-23 14:00:00'),
('P00126', N'Trần Thị E', 'tranthie@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'PATIENT', 'ACTIVE', '0900123456', NULL, NULL, '2023-10-24 18:00:00');

-- Update patient details
UPDATE Users SET DateOfBirth = '1985-05-15', BloodType = 'O+', Address = N'123 Nguyễn Huệ, Q.1, TP.HCM' WHERE UserId = 'P00124';
UPDATE Users SET DateOfBirth = '1990-08-20', BloodType = 'A+', Address = N'456 Lê Lợi, Q.3, TP.HCM' WHERE UserId = 'P00125';
UPDATE Users SET DateOfBirth = '1988-12-10', BloodType = 'B+', Address = N'789 Trần Hưng Đạo, Q.5, TP.HCM' WHERE UserId = 'P00126';

-- =============================================
-- Insert Appointments
-- =============================================
INSERT INTO Appointments (AppointmentId, PatientId, DoctorId, AppointmentDate, AppointmentTime, Status, Fee, Reason) VALUES
('APT001', 'P00124', 'D1', '2023-10-25', '08:30:00', 'CONFIRMED', 200000, N'Khám định kỳ'),
('APT002', 'P00125', 'D2', '2023-10-25', '09:00:00', 'PENDING', 150000, N'Khám sốt cao'),
('APT003', 'P00126', 'D1', '2023-10-24', '14:30:00', 'COMPLETED', 200000, N'Đau họng');

-- =============================================
-- Insert Medical Records
-- =============================================
INSERT INTO MedicalRecords (RecordId, PatientId, DoctorId, AppointmentId, RecordDate, Diagnosis, Symptoms, Prescription, TreatmentPlan) VALUES
('R001', 'P00126', 'D1', 'APT003', '2023-10-24', N'Viêm họng cấp', N'Đau họng, khó nuốt, sốt nhẹ', N'Amoxicillin 500mg x 10 viên', N'Uống thuốc theo đơn, nghỉ ngơi, tái khám sau 3 ngày'),
('R002', 'P00125', 'D2', NULL, '2023-10-20', N'Sốt xuất huyết D1', N'Sốt cao, đau đầu, đau cơ', N'Paracetamol 500mg, Oresol', N'Nhập viện theo dõi, bù nước điện giải');

-- =============================================
-- Insert Medicines
-- =============================================
INSERT INTO Medicines (MedicineId, Name, Category, Unit, Stock, MinThreshold, Price, ExpiryDate, Manufacturer) VALUES
('M001', 'Paracetamol 500mg', N'Giảm đau, hạ sốt', N'Viên', 1250, 200, 2000, '2025-12-01', 'Pymepharco'),
('M002', 'Amoxicillin 500mg', N'Kháng sinh', N'Viên', 85, 100, 5000, '2024-06-15', 'Domesco'),
('M003', 'Oresol 27.9g', N'Bù nước', N'Gói', 500, 50, 3000, '2025-01-10', 'OPC'),
('M004', 'Augmentin 1g', N'Kháng sinh', N'Viên', 0, 50, 15000, '2023-12-20', 'GSK'),
('M005', 'Cetirizine 10mg', N'Kháng dị ứng', N'Viên', 450, 100, 2500, '2026-03-22', 'Teva');

-- =============================================
-- Insert Insurance
-- =============================================
INSERT INTO Insurance (InsuranceId, PatientId, InsuranceNumber, Provider, CoveragePercentage, ExpiryDate, IsActive) VALUES
('INS001', 'P00124', 'DN4012400100234', N'BHYT Đà Nẵng', 80, '2024-12-31', 1),
('INS002', 'P00126', 'GD4012600100567', N'BHYT Gia Định', 100, '2025-06-30', 1);

-- =============================================
-- Insert Payments
-- =============================================
INSERT INTO Payments (PaymentId, AppointmentId, PatientId, TotalAmount, InsuranceAmount, PatientPaidAmount, Status, PaymentMethod, PaymentDate) VALUES
('PAY001', 'APT001', 'P00124', 200000, 160000, 40000, 'PAID', 'MOMO', '2023-10-25 09:15:00'),
('PAY002', 'APT002', 'P00125', 150000, 0, 150000, 'UNPAID', NULL, NULL),
('PAY003', 'APT003', 'P00126', 200000, 200000, 0, 'PAID', 'CASH', '2023-10-24 15:00:00');

-- =============================================
-- Insert Audit Logs
-- =============================================
INSERT INTO AuditLogs (LogId, UserId, Action, Target, Details, IpAddress, Timestamp) VALUES
('LOG001', 'ADMIN_01', 'TRUY_CAP_BENH_AN', N'Hồ sơ BN Nguyễn Văn A', N'Xem chi tiết hồ sơ bệnh án', '192.168.1.1', '2023-10-25 10:20:15'),
('LOG002', 'D1', 'CAP_NHAT_TOA_THUOC', N'Hồ sơ BN Trần Thị E', N'Cập nhật đơn thuốc mới', '192.168.1.5', '2023-10-25 11:05:44'),
('LOG003', 'R1', 'TAO_LICH_HEN', N'Lịch hẹn APT001', N'Tạo lịch hẹn mới cho bệnh nhân', '192.168.1.10', '2023-10-25 08:30:00');

-- =============================================
-- Insert Doctor Schedule
-- =============================================
INSERT INTO DoctorSchedule (ScheduleId, DoctorId, DayOfWeek, StartTime, EndTime, IsAvailable) VALUES
-- BS. Trần Thị B (Monday to Friday, 8:00-17:00)
('SCH001', 'D1', 1, '08:00:00', '17:00:00', 1),
('SCH002', 'D1', 2, '08:00:00', '17:00:00', 1),
('SCH003', 'D1', 3, '08:00:00', '17:00:00', 1),
('SCH004', 'D1', 4, '08:00:00', '17:00:00', 1),
('SCH005', 'D1', 5, '08:00:00', '17:00:00', 1),
-- BS. Phạm Văn D (Monday to Saturday, 8:00-16:00)
('SCH006', 'D2', 1, '08:00:00', '16:00:00', 1),
('SCH007', 'D2', 2, '08:00:00', '16:00:00', 1),
('SCH008', 'D2', 3, '08:00:00', '16:00:00', 1),
('SCH009', 'D2', 4, '08:00:00', '16:00:00', 1),
('SCH010', 'D2', 5, '08:00:00', '16:00:00', 1),
('SCH011', 'D2', 6, '08:00:00', '16:00:00', 1);

-- =============================================
-- Insert Prescriptions
-- =============================================
INSERT INTO Prescriptions (PrescriptionId, RecordId, MedicineId, Quantity, Dosage, Frequency, Duration, Instructions) VALUES
('PRE001', 'R001', 'M002', 10, '500mg', N'2 lần/ngày', N'5 ngày', N'Uống sau ăn'),
('PRE002', 'R002', 'M001', 20, '500mg', N'3 lần/ngày', N'7 ngày', N'Uống khi sốt cao trên 38.5°C'),
('PRE003', 'R002', 'M003', 10, '27.9g', N'Khi cần', N'5 ngày', N'Pha với 200ml nước, uống khi tiêu chảy');

PRINT 'Seed data inserted successfully!';
GO
