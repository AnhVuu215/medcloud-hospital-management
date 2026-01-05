-- MedCloud Hospital Management System - SQL Server Database Schema
-- Created: 2026-01-05
-- Description: Complete database schema for hospital management system

USE master;
GO

-- Create database if not exists
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'MedCloudDB')
BEGIN
    CREATE DATABASE MedCloudDB;
END
GO

USE MedCloudDB;
GO

-- =============================================
-- Table: Users
-- Description: Stores all system users (Admin, Doctor, Receptionist, Patient)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserId NVARCHAR(50) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Email NVARCHAR(200) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(500) NOT NULL,
        Role NVARCHAR(20) NOT NULL CHECK (Role IN ('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')),
        Status NVARCHAR(20) DEFAULT 'ACTIVE' CHECK (Status IN ('ACTIVE', 'INACTIVE')),
        Phone NVARCHAR(20),
        Address NVARCHAR(500),
        DateOfBirth DATE,
        BloodType NVARCHAR(5),
        Specialization NVARCHAR(100), -- For doctors
        Department NVARCHAR(100), -- For doctors
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        LastLogin DATETIME
    );
    
    CREATE INDEX IX_Users_Email ON Users(Email);
    CREATE INDEX IX_Users_Role ON Users(Role);
END
GO

-- =============================================
-- Table: Appointments
-- Description: Stores appointment bookings
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Appointments')
BEGIN
    CREATE TABLE Appointments (
        AppointmentId NVARCHAR(50) PRIMARY KEY,
        PatientId NVARCHAR(50) NOT NULL,
        DoctorId NVARCHAR(50) NOT NULL,
        AppointmentDate DATE NOT NULL,
        AppointmentTime TIME NOT NULL,
        Status NVARCHAR(20) DEFAULT 'PENDING' CHECK (Status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
        Fee DECIMAL(18, 2) NOT NULL,
        Reason NVARCHAR(500),
        CancellationReason NVARCHAR(500),
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        
        CONSTRAINT FK_Appointments_Patient FOREIGN KEY (PatientId) REFERENCES Users(UserId),
        CONSTRAINT FK_Appointments_Doctor FOREIGN KEY (DoctorId) REFERENCES Users(UserId)
    );
    
    CREATE INDEX IX_Appointments_Patient ON Appointments(PatientId);
    CREATE INDEX IX_Appointments_Doctor ON Appointments(DoctorId);
    CREATE INDEX IX_Appointments_Date ON Appointments(AppointmentDate);
    CREATE INDEX IX_Appointments_Status ON Appointments(Status);
END
GO

-- =============================================
-- Table: MedicalRecords
-- Description: Stores patient medical records
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MedicalRecords')
BEGIN
    CREATE TABLE MedicalRecords (
        RecordId NVARCHAR(50) PRIMARY KEY,
        PatientId NVARCHAR(50) NOT NULL,
        DoctorId NVARCHAR(50) NOT NULL,
        AppointmentId NVARCHAR(50),
        RecordDate DATE NOT NULL,
        Diagnosis NVARCHAR(1000) NOT NULL,
        Symptoms NVARCHAR(1000),
        Prescription NVARCHAR(2000),
        TreatmentPlan NVARCHAR(2000),
        Notes NVARCHAR(2000),
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        
        CONSTRAINT FK_MedicalRecords_Patient FOREIGN KEY (PatientId) REFERENCES Users(UserId),
        CONSTRAINT FK_MedicalRecords_Doctor FOREIGN KEY (DoctorId) REFERENCES Users(UserId),
        CONSTRAINT FK_MedicalRecords_Appointment FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId)
    );
    
    CREATE INDEX IX_MedicalRecords_Patient ON MedicalRecords(PatientId);
    CREATE INDEX IX_MedicalRecords_Doctor ON MedicalRecords(DoctorId);
    CREATE INDEX IX_MedicalRecords_Date ON MedicalRecords(RecordDate);
END
GO

-- =============================================
-- Table: Medicines
-- Description: Stores pharmacy inventory
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Medicines')
BEGIN
    CREATE TABLE Medicines (
        MedicineId NVARCHAR(50) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Category NVARCHAR(100) NOT NULL,
        Unit NVARCHAR(50) NOT NULL,
        Stock INT NOT NULL DEFAULT 0,
        MinThreshold INT NOT NULL DEFAULT 0,
        Price DECIMAL(18, 2) NOT NULL,
        ExpiryDate DATE NOT NULL,
        Manufacturer NVARCHAR(200),
        Description NVARCHAR(1000),
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE()
    );
    
    CREATE INDEX IX_Medicines_Category ON Medicines(Category);
    CREATE INDEX IX_Medicines_ExpiryDate ON Medicines(ExpiryDate);
END
GO

-- =============================================
-- Table: Payments
-- Description: Stores payment transactions
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Payments')
BEGIN
    CREATE TABLE Payments (
        PaymentId NVARCHAR(50) PRIMARY KEY,
        AppointmentId NVARCHAR(50) NOT NULL,
        PatientId NVARCHAR(50) NOT NULL,
        TotalAmount DECIMAL(18, 2) NOT NULL,
        InsuranceAmount DECIMAL(18, 2) DEFAULT 0,
        PatientPaidAmount DECIMAL(18, 2) NOT NULL,
        Status NVARCHAR(20) DEFAULT 'UNPAID' CHECK (Status IN ('PAID', 'UNPAID', 'PARTIAL')),
        PaymentMethod NVARCHAR(50) CHECK (PaymentMethod IN ('MOMO', 'VNPAY', 'CASH', 'BANK_TRANSFER', 'CARD')),
        TransactionId NVARCHAR(100),
        PaymentDate DATETIME,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        
        CONSTRAINT FK_Payments_Appointment FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId),
        CONSTRAINT FK_Payments_Patient FOREIGN KEY (PatientId) REFERENCES Users(UserId)
    );
    
    CREATE INDEX IX_Payments_Patient ON Payments(PatientId);
    CREATE INDEX IX_Payments_Status ON Payments(Status);
    CREATE INDEX IX_Payments_Date ON Payments(PaymentDate);
END
GO

-- =============================================
-- Table: Insurance
-- Description: Stores patient insurance profiles
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Insurance')
BEGIN
    CREATE TABLE Insurance (
        InsuranceId NVARCHAR(50) PRIMARY KEY,
        PatientId NVARCHAR(50) NOT NULL,
        InsuranceNumber NVARCHAR(100) UNIQUE NOT NULL,
        Provider NVARCHAR(200),
        CoveragePercentage INT NOT NULL CHECK (CoveragePercentage >= 0 AND CoveragePercentage <= 100),
        ExpiryDate DATE NOT NULL,
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        
        CONSTRAINT FK_Insurance_Patient FOREIGN KEY (PatientId) REFERENCES Users(UserId)
    );
    
    CREATE INDEX IX_Insurance_Patient ON Insurance(PatientId);
    CREATE INDEX IX_Insurance_Number ON Insurance(InsuranceNumber);
END
GO

-- =============================================
-- Table: AuditLogs
-- Description: Stores system audit logs for security and compliance
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditLogs')
BEGIN
    CREATE TABLE AuditLogs (
        LogId NVARCHAR(50) PRIMARY KEY,
        UserId NVARCHAR(50) NOT NULL,
        Action NVARCHAR(100) NOT NULL,
        Target NVARCHAR(200),
        Details NVARCHAR(1000),
        IpAddress NVARCHAR(50),
        UserAgent NVARCHAR(500),
        Timestamp DATETIME DEFAULT GETDATE(),
        
        CONSTRAINT FK_AuditLogs_User FOREIGN KEY (UserId) REFERENCES Users(UserId)
    );
    
    CREATE INDEX IX_AuditLogs_User ON AuditLogs(UserId);
    CREATE INDEX IX_AuditLogs_Timestamp ON AuditLogs(Timestamp);
    CREATE INDEX IX_AuditLogs_Action ON AuditLogs(Action);
END
GO

-- =============================================
-- Table: DoctorSchedule
-- Description: Stores doctor availability schedules
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DoctorSchedule')
BEGIN
    CREATE TABLE DoctorSchedule (
        ScheduleId NVARCHAR(50) PRIMARY KEY,
        DoctorId NVARCHAR(50) NOT NULL,
        DayOfWeek INT NOT NULL CHECK (DayOfWeek >= 0 AND DayOfWeek <= 6), -- 0=Sunday, 6=Saturday
        StartTime TIME NOT NULL,
        EndTime TIME NOT NULL,
        IsAvailable BIT DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        
        CONSTRAINT FK_DoctorSchedule_Doctor FOREIGN KEY (DoctorId) REFERENCES Users(UserId)
    );
    
    CREATE INDEX IX_DoctorSchedule_Doctor ON DoctorSchedule(DoctorId);
END
GO

-- =============================================
-- Table: Prescriptions
-- Description: Stores detailed prescription information
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Prescriptions')
BEGIN
    CREATE TABLE Prescriptions (
        PrescriptionId NVARCHAR(50) PRIMARY KEY,
        RecordId NVARCHAR(50) NOT NULL,
        MedicineId NVARCHAR(50) NOT NULL,
        Quantity INT NOT NULL,
        Dosage NVARCHAR(200) NOT NULL,
        Frequency NVARCHAR(200) NOT NULL,
        Duration NVARCHAR(100) NOT NULL,
        Instructions NVARCHAR(500),
        CreatedAt DATETIME DEFAULT GETDATE(),
        
        CONSTRAINT FK_Prescriptions_Record FOREIGN KEY (RecordId) REFERENCES MedicalRecords(RecordId),
        CONSTRAINT FK_Prescriptions_Medicine FOREIGN KEY (MedicineId) REFERENCES Medicines(MedicineId)
    );
    
    CREATE INDEX IX_Prescriptions_Record ON Prescriptions(RecordId);
    CREATE INDEX IX_Prescriptions_Medicine ON Prescriptions(MedicineId);
END
GO

PRINT 'Database schema created successfully!';
GO
