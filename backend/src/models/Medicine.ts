import { getConnection } from '../config/database.js';
import sql from 'mssql';

export interface Medicine {
    medicineId: string;
    name: string;
    category: string;
    unit: string;
    stock: number;
    minThreshold: number;
    price: number;
    expiryDate: Date;
    manufacturer?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export interface CreateMedicineData {
    medicineId: string;
    name: string;
    category: string;
    unit: string;
    stock: number;
    minThreshold: number;
    price: number;
    expiryDate: string;
    manufacturer?: string;
    description?: string;
}

export class MedicineModel {
    static async create(data: CreateMedicineData): Promise<Medicine> {
        const pool = await getConnection();

        const result = await pool.request()
            .input('MedicineId', sql.NVarChar, data.medicineId)
            .input('Name', sql.NVarChar, data.name)
            .input('Category', sql.NVarChar, data.category)
            .input('Unit', sql.NVarChar, data.unit)
            .input('Stock', sql.Int, data.stock)
            .input('MinThreshold', sql.Int, data.minThreshold)
            .input('Price', sql.Decimal(18, 2), data.price)
            .input('ExpiryDate', sql.Date, data.expiryDate)
            .input('Manufacturer', sql.NVarChar, data.manufacturer || null)
            .input('Description', sql.NVarChar, data.description || null)
            .query(`
                INSERT INTO Medicines (MedicineId, Name, Category, Unit, Stock, MinThreshold, Price, ExpiryDate, Manufacturer, Description)
                OUTPUT INSERTED.*
                VALUES (@MedicineId, @Name, @Category, @Unit, @Stock, @MinThreshold, @Price, @ExpiryDate, @Manufacturer, @Description)
            `);

        return result.recordset[0];
    }

    static async findById(medicineId: string): Promise<Medicine | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('MedicineId', sql.NVarChar, medicineId)
            .query(`
                SELECT MedicineId as medicineId, Name as name, Category as category,
                       Unit as unit, Price as price, Stock as stock, MinThreshold as minThreshold,
                       ExpiryDate as expiryDate, Manufacturer as manufacturer,
                       Description as description, CreatedAt as createdAt, UpdatedAt as updatedAt
                FROM Medicines WHERE MedicineId = @MedicineId
            `);

        return result.recordset[0] || null;
    }

    static async findAll(filters?: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{ medicines: Medicine[]; total: number; page: number; totalPages: number }> {
        const pool = await getConnection();
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE DeletedAt IS NULL';
        const request = pool.request();

        if (filters?.category) {
            whereClause += ' AND Category = @Category';
            request.input('Category', sql.NVarChar, filters.category);
        }

        if (filters?.search) {
            whereClause += ' AND (Name LIKE @Search OR MedicineId LIKE @Search)';
            request.input('Search', sql.NVarChar, `%${filters.search}%`);
        }

        // Get total count
        const countResult = await request.query(`SELECT COUNT(*) as total FROM Medicines ${whereClause}`);
        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);

        // Get paginated results
        request.input('Limit', sql.Int, limit);
        request.input('Offset', sql.Int, offset);

        const result = await request.query(`
            SELECT MedicineId as medicineId, Name as name, Category as category,
                   Unit as unit, Price as price, Stock as stock, MinThreshold as minThreshold,
                   ExpiryDate as expiryDate, Manufacturer as manufacturer,
                   Description as description, CreatedAt as createdAt, UpdatedAt as updatedAt
            FROM Medicines ${whereClause}
            ORDER BY Name
            OFFSET @Offset ROWS
            FETCH NEXT @Limit ROWS ONLY
        `);

        return {
            medicines: result.recordset,
            total,
            page,
            totalPages
        };
    }

    static async findLowStock(): Promise<Medicine[]> {
        const pool = await getConnection();
        const result = await pool.request()
            .query(`
                SELECT MedicineId as medicineId, Name as name, Category as category,
                       Unit as unit, Price as price, Stock as stock, MinThreshold as minThreshold,
                       ExpiryDate as expiryDate, Manufacturer as manufacturer,
                       Description as description, CreatedAt as createdAt, UpdatedAt as updatedAt
                FROM Medicines WHERE Stock <= MinThreshold ORDER BY Stock ASC
            `);

        return result.recordset;
    }

    static async update(medicineId: string, updateData: Partial<Medicine>): Promise<Medicine> {
        const pool = await getConnection();
        const fields: string[] = [];
        const request = pool.request().input('MedicineId', sql.NVarChar, medicineId);

        if (updateData.name) {
            fields.push('Name = @Name');
            request.input('Name', sql.NVarChar, updateData.name);
        }
        if (updateData.category) {
            fields.push('Category = @Category');
            request.input('Category', sql.NVarChar, updateData.category);
        }
        if (updateData.stock !== undefined) {
            fields.push('Stock = @Stock');
            request.input('Stock', sql.Int, updateData.stock);
        }
        if (updateData.price !== undefined) {
            fields.push('Price = @Price');
            request.input('Price', sql.Decimal(18, 2), updateData.price);
        }
        if (updateData.expiryDate) {
            fields.push('ExpiryDate = @ExpiryDate');
            request.input('ExpiryDate', sql.Date, updateData.expiryDate);
        }

        fields.push('UpdatedAt = GETDATE()');

        await request.query(`UPDATE Medicines SET ${fields.join(', ')} WHERE MedicineId = @MedicineId`);

        const medicine = await this.findById(medicineId);
        if (!medicine) throw new Error('Medicine not found');
        return medicine;
    }

    static async delete(medicineId: string): Promise<void> {
        const pool = await getConnection();
        await pool.request()
            .input('MedicineId', sql.NVarChar, medicineId)
            .query('UPDATE Medicines SET DeletedAt = GETDATE() WHERE MedicineId = @MedicineId');
    }

    static async restore(medicineId: string): Promise<void> {
        const pool = await getConnection();
        await pool.request()
            .input('MedicineId', sql.NVarChar, medicineId)
            .query('UPDATE Medicines SET DeletedAt = NULL WHERE MedicineId = @MedicineId');
    }
}
