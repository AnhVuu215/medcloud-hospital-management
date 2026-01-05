import { Response } from 'express';
import { MedicalRecordModel } from '../models/MedicalRecord.js';
import { UserModel } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { generateRecordId } from '../utils/generateId.js';
import { logAudit, extractAuditInfo } from '../utils/auditLogger.js';

export class MedicalRecordController {
    // POST /api/medical-records - Create medical record (Doctor only)
    static async createRecord(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { patientId, appointmentId, recordDate, diagnosis, symptoms, prescription, treatmentPlan, notes } = req.body;

            if (!patientId || !recordDate || !diagnosis) {
                res.status(400).json({
                    error: 'Validation Error',
                    message: 'Patient ID, record date, and diagnosis are required'
                });
                return;
            }

            // Verify patient exists
            const patient = await UserModel.findById(patientId);
            if (!patient || patient.role !== 'PATIENT') {
                res.status(404).json({ error: 'Not Found', message: 'Patient not found' });
                return;
            }

            const recordId = generateRecordId();
            const doctorId = req.user!.userId;

            const record = await MedicalRecordModel.create({
                recordId,
                patientId,
                doctorId,
                appointmentId,
                recordDate,
                diagnosis,
                symptoms,
                prescription,
                treatmentPlan,
                notes
            });

            // Log audit
            await logAudit({
                userId: doctorId,
                action: 'MEDICAL_RECORD_CREATED',
                target: `Record ${recordId}`,
                details: `Created medical record for patient ${patientId}`,
                ...extractAuditInfo(req)
            });

            res.status(201).json({
                message: 'Medical record created successfully',
                record
            });
        } catch (error) {
            console.error('Create medical record error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to create medical record' });
        }
    }

    // GET /api/medical-records/patient/:patientId - Get patient medical history
    static async getPatientRecords(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { patientId } = req.params;

            // Check access rights
            if (req.user?.role === 'PATIENT' && req.user.userId !== patientId) {
                res.status(403).json({ error: 'Forbidden', message: 'You can only view your own medical records' });
                return;
            }

            const records = await MedicalRecordModel.findByPatient(patientId);

            res.status(200).json({
                count: records.length,
                records
            });
        } catch (error) {
            console.error('Get patient records error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get patient records' });
        }
    }

    // GET /api/medical-records/:id - Get specific record
    static async getRecord(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const record = await MedicalRecordModel.findById(id);

            if (!record) {
                res.status(404).json({ error: 'Not Found', message: 'Medical record not found' });
                return;
            }

            // Check access rights
            if (req.user?.role === 'PATIENT' && record.patientId !== req.user.userId) {
                res.status(403).json({ error: 'Forbidden', message: 'You can only view your own medical records' });
                return;
            }

            res.status(200).json({ record });
        } catch (error) {
            console.error('Get medical record error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get medical record' });
        }
    }

    // PUT /api/medical-records/:id - Update medical record (Doctor only)
    static async updateRecord(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const record = await MedicalRecordModel.findById(id);
            if (!record) {
                res.status(404).json({ error: 'Not Found', message: 'Medical record not found' });
                return;
            }

            // Only the doctor who created the record can update it
            if (req.user?.role === 'DOCTOR' && record.doctorId !== req.user.userId) {
                res.status(403).json({ error: 'Forbidden', message: 'You can only update your own medical records' });
                return;
            }

            delete updateData.recordId;
            delete updateData.patientId;
            delete updateData.doctorId;

            const updatedRecord = await MedicalRecordModel.update(id, updateData);

            // Log audit
            if (req.user) {
                await logAudit({
                    userId: req.user.userId,
                    action: 'MEDICAL_RECORD_UPDATED',
                    target: `Record ${id}`,
                    details: 'Updated medical record',
                    ...extractAuditInfo(req)
                });
            }

            res.status(200).json({
                message: 'Medical record updated successfully',
                record: updatedRecord
            });
        } catch (error) {
            console.error('Update medical record error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to update medical record' });
        }
    }
}
