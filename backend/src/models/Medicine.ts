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

        await pool.request()
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
                VALUES (@MedicineId, @Name, @Category, @Unit, @Stock, @MinThreshold, @Price, @ExpiryDate, @Manufacturer, @Description)
            `);

        const medicine = await this.findById(data.medicineId);
        if (!medicine) throw new Error('Failed to create medicine');
        return medicine;
    }

    static async findById(medicineId: string): Promise<Medicine | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('MedicineId', sql.NVarChar, medicineId)
            .query('SELECT * FROM Medicines WHERE MedicineId = @MedicineId');

        return result.recordset[0] || null;
    }

    static async findAll(filters?: { category?: string }): Promise<Medicine[]> {
        const pool = await getConnection();
        let query = 'SELECT * FROM Medicines WHERE 1=1';
        const request = pool.request();

        if (filters?.category) {
            query += ' AND Category = @Category';
            request.input('Category', sql.NVarChar, filters.category);
        }

        query += ' ORDER BY Name';
        const result = await request.query(query);
        return result.recordset;
    }

    static async findLowStock(): Promise<Medicine[]> {
        const pool = await getConnection();
        const result = await pool.request()
            .query('SELECT * FROM Medicines WHERE Stock <= MinThreshold ORDER BY Stock ASC');

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
            .query('DELETE FROM Medicines WHERE MedicineId = @MedicineId');
    }
}
