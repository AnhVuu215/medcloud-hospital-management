import { Response } from 'express';
import { MedicineModel } from '../models/Medicine.js';
import { AuthRequest } from '../middleware/auth.js';
import { generateMedicineId } from '../utils/generateId.js';
import { logAudit, extractAuditInfo } from '../utils/auditLogger.js';

export class MedicineController {
    // GET /api/medicines - List all medicines
    static async listMedicines(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { category, search, page, limit } = req.query;
            const filters: {
                category?: string;
                search?: string;
                page?: number;
                limit?: number;
            } = {};

            if (category) filters.category = category as string;
            if (search) filters.search = search as string;
            if (page) filters.page = parseInt(page as string);
            if (limit) filters.limit = parseInt(limit as string);

            const result = await MedicineModel.findAll(filters);

            // Add cache headers for better performance
            res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 60 seconds

            res.status(200).json(result);
        } catch (error) {
            console.error('List medicines error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to retrieve medicines' });
        }
    }

    // GET /api/medicines/low-stock - Get low stock medicines
    static async getLowStock(req: AuthRequest, res: Response): Promise<void> {
        try {
            const medicines = await MedicineModel.findLowStock();

            res.status(200).json({
                count: medicines.length,
                medicines
            });
        } catch (error) {
            console.error('Get low stock error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get low stock medicines' });
        }
    }

    // GET /api/medicines/:id - Get medicine by ID
    static async getMedicine(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const medicine = await MedicineModel.findById(id);

            if (!medicine) {
                res.status(404).json({ error: 'Not Found', message: 'Medicine not found' });
                return;
            }

            res.status(200).json({ medicine });
        } catch (error) {
            console.error('Get medicine error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get medicine' });
        }
    }

    // POST /api/medicines - Add new medicine (Admin only)
    static async createMedicine(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { name, category, unit, stock, minThreshold, price, expiryDate, manufacturer, description } = req.body;

            if (!name || !category || !unit || stock === undefined || minThreshold === undefined || !price || !expiryDate) {
                res.status(400).json({
                    error: 'Validation Error',
                    message: 'Name, category, unit, stock, minThreshold, price, and expiryDate are required'
                });
                return;
            }

            const medicineId = generateMedicineId();

            const medicine = await MedicineModel.create({
                medicineId,
                name,
                category,
                unit,
                stock,
                minThreshold,
                price,
                expiryDate,
                manufacturer,
                description
            });

            // Log audit
            if (req.user) {
                await logAudit({
                    userId: req.user.userId,
                    action: 'MEDICINE_CREATED',
                    target: `Medicine ${medicineId}`,
                    details: `Added new medicine: ${name}`,
                    ...extractAuditInfo(req)
                });
            }

            res.status(201).json({
                message: 'Medicine created successfully',
                medicine
            });
        } catch (error) {
            console.error('Create medicine error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to create medicine' });
        }
    }

    // PUT /api/medicines/:id - Update medicine (Admin only)
    static async updateMedicine(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;

            delete updateData.medicineId;

            const medicine = await MedicineModel.update(id, updateData);

            // Log audit
            if (req.user) {
                await logAudit({
                    userId: req.user.userId,
                    action: 'MEDICINE_UPDATED',
                    target: `Medicine ${id}`,
                    details: 'Updated medicine information',
                    ...extractAuditInfo(req)
                });
            }

            res.status(200).json({
                message: 'Medicine updated successfully',
                medicine
            });
        } catch (error) {
            console.error('Update medicine error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to update medicine' });
        }
    }

    // DELETE /api/medicines/:id - Delete medicine (Admin only)
    static async deleteMedicine(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            await MedicineModel.delete(id);

            // Log audit
            if (req.user) {
                await logAudit({
                    userId: req.user.userId,
                    action: 'MEDICINE_DELETED',
                    target: `Medicine ${id}`,
                    details: 'Deleted medicine',
                    ...extractAuditInfo(req)
                });
            }

            res.status(200).json({ message: 'Medicine deleted successfully' });
        } catch (error) {
            console.error('Delete medicine error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to delete medicine' });
        }
    }
}
