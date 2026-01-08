-- Add DeletedAt columns for soft delete functionality

-- Medicines table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'Medicines') AND name = 'DeletedAt')
BEGIN
    ALTER TABLE Medicines ADD DeletedAt DATETIME NULL;
END
GO

-- Appointments table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'Appointments') AND name = 'DeletedAt')
BEGIN
    ALTER TABLE Appointments ADD DeletedAt DATETIME NULL;
END
GO

-- Users table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'Users') AND name = 'DeletedAt')
BEGIN
    ALTER TABLE Users ADD DeletedAt DATETIME NULL;
END
GO

PRINT 'DeletedAt columns added successfully for soft delete functionality';
