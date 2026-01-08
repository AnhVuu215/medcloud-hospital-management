import { getConnection } from '../config/database.js';
import sql from 'mssql';

export interface User {
    userId: string;
    name: string;
    email: string;
    passwordHash: string;
    role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';
    status: 'ACTIVE' | 'INACTIVE';
    phone?: string;
    address?: string;
    dateOfBirth?: Date;
    bloodType?: string;
    specialization?: string;
    department?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
}

export interface CreateUserData {
    userId: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    bloodType?: string;
    specialization?: string;
    department?: string;
}

export class UserModel {
    static async findByEmail(email: string): Promise<User | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query(`
                SELECT 
                    UserId as userId,
                    Name as name,
                    Email as email,
                    PasswordHash as passwordHash,
                    Role as role,
                    Status as status,
                    Phone as phone,
                    Address as address,
                    DateOfBirth as dateOfBirth,
                    BloodType as bloodType,
                    Specialization as specialization,
                    Department as department,
                    CreatedAt as createdAt,
                    UpdatedAt as updatedAt,
                    LastLogin as lastLogin
                FROM Users WHERE Email = @Email
            `);

        console.log('🔍 findByEmail result:', { email, found: !!result.recordset[0], recordCount: result.recordset.length });
        if (result.recordset[0]) {
            console.log('📋 User data:', { userId: result.recordset[0].userId, email: result.recordset[0].email, status: result.recordset[0].status });
        }
        return result.recordset[0] || null;
    }

    static async findById(userId: string): Promise<User | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('UserId', sql.NVarChar, userId)
            .query(`
                SELECT 
                    UserId as userId, Name as name, Email as email,
                    PasswordHash as passwordHash, Role as role, Status as status,
                    Phone as phone, Address as address, DateOfBirth as dateOfBirth,
                    BloodType as bloodType, Specialization as specialization,
                    Department as department, CreatedAt as createdAt,
                    UpdatedAt as updatedAt, LastLogin as lastLogin
                FROM Users WHERE UserId = @UserId
            `);

        return result.recordset[0] || null;
    }

    static async create(userData: CreateUserData): Promise<User> {
        const pool = await getConnection();

        await pool.request()
            .input('UserId', sql.NVarChar, userData.userId)
            .input('Name', sql.NVarChar, userData.name)
            .input('Email', sql.NVarChar, userData.email)
            .input('PasswordHash', sql.NVarChar, userData.passwordHash)
            .input('Role', sql.NVarChar, userData.role)
            .input('Phone', sql.NVarChar, userData.phone || null)
            .input('Address', sql.NVarChar, userData.address || null)
            .input('DateOfBirth', sql.Date, userData.dateOfBirth || null)
            .input('BloodType', sql.NVarChar, userData.bloodType || null)
            .input('Specialization', sql.NVarChar, userData.specialization || null)
            .input('Department', sql.NVarChar, userData.department || null)
            .query(`
                INSERT INTO Users (UserId, Name, Email, PasswordHash, Role, Phone, Address, DateOfBirth, BloodType, Specialization, Department)
                VALUES (@UserId, @Name, @Email, @PasswordHash, @Role, @Phone, @Address, @DateOfBirth, @BloodType, @Specialization, @Department)
            `);

        const user = await this.findById(userData.userId);
        if (!user) throw new Error('Failed to create user');
        return user;
    }

    static async updateLastLogin(userId: string): Promise<void> {
        const pool = await getConnection();
        await pool.request()
            .input('UserId', sql.NVarChar, userId)
            .query('UPDATE Users SET LastLogin = GETDATE() WHERE UserId = @UserId');
    }

    static async findAll(filters: { role?: string; status?: string } = {}): Promise<User[]> {
        const pool = await getConnection();
        const request = pool.request();

        let query = `
            SELECT 
                UserId as userId, Name as name, Email as email, 
                Role as role, Status as status, Phone as phoneNumber,
                Address as address, DateOfBirth as dateOfBirth, BloodType as bloodType,
                CreatedAt as createdAt, UpdatedAt as updatedAt, LastLogin as lastLogin
            FROM Users
            WHERE DeletedAt IS NULL
        `;

        if (filters.role) {
            query += ' AND Role = @Role';
            request.input('Role', sql.NVarChar, filters.role);
        }

        if (filters.status) {
            query += ' AND Status = @Status';
            request.input('Status', sql.NVarChar, filters.status);
        }

        const result = await request.query(query);
        return result.recordset.map(record => ({
            ...record,
            userId: record.userId
        }));
    }

    static async update(userId: string, updateData: Partial<User>): Promise<User> {
        const pool = await getConnection();
        const fields: string[] = [];
        const request = pool.request().input('UserId', sql.NVarChar, userId);

        if (updateData.name) {
            fields.push('Name = @Name');
            request.input('Name', sql.NVarChar, updateData.name);
        }
        if (updateData.phone) {
            fields.push('Phone = @Phone');
            request.input('Phone', sql.NVarChar, updateData.phone);
        }
        if (updateData.address) {
            fields.push('Address = @Address');
            request.input('Address', sql.NVarChar, updateData.address);
        }
        if (updateData.dateOfBirth) {
            fields.push('DateOfBirth = @DateOfBirth');
            request.input('DateOfBirth', sql.Date, updateData.dateOfBirth);
        }
        if (updateData.bloodType) {
            fields.push('BloodType = @BloodType');
            request.input('BloodType', sql.NVarChar, updateData.bloodType);
        }
        if (updateData.status) {
            fields.push('Status = @Status');
            request.input('Status', sql.NVarChar, updateData.status);
        }

        fields.push('UpdatedAt = GETDATE()');

        await request.query(`UPDATE Users SET ${fields.join(', ')} WHERE UserId = @UserId`);

        const user = await this.findById(userId);
        if (!user) throw new Error('User not found');
        return user;
    }

    static async findDoctors(): Promise<User[]> {
        return this.findAll({ role: 'DOCTOR', status: 'ACTIVE' });
    }

    static async findPatients(): Promise<User[]> {
        return this.findAll({ role: 'PATIENT' });
    }

    static async delete(userId: string): Promise<void> {
        const pool = await getConnection();
        // Soft delete: set DeletedAt timestamp instead of hard delete
        await pool.request()
            .input('UserId', sql.NVarChar, userId)
            .query('UPDATE Users SET DeletedAt = GETDATE() WHERE UserId = @UserId');
    }

    static async restore(userId: string): Promise<void> {
        const pool = await getConnection();
        // Restore soft-deleted user
        await pool.request()
            .input('UserId', sql.NVarChar, userId)
            .query('UPDATE Users SET DeletedAt = NULL WHERE UserId = @UserId');
    }
}
