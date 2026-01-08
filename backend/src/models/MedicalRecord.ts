import { getConnection } from '../config/database.js';
import sql from 'mssql';

export interface MedicalRecord {
    recordId: string;
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    recordDate: Date;
    diagnosis: string;
    symptoms?: string;
    prescription?: string;
    treatmentPlan?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateMedicalRecordData {
    recordId: string;
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    recordDate: string;
    diagnosis: string;
    symptoms?: string;
    prescription?: string;
    treatmentPlan?: string;
    notes?: string;
}

export class MedicalRecordModel {
    static async create(data: CreateMedicalRecordData): Promise<MedicalRecord> {
        const pool = await getConnection();

        await pool.request()
            .input('RecordId', sql.NVarChar, data.recordId)
            .input('PatientId', sql.NVarChar, data.patientId)
            .input('DoctorId', sql.NVarChar, data.doctorId)
            .input('AppointmentId', sql.NVarChar, data.appointmentId || null)
            .input('RecordDate', sql.Date, data.recordDate)
            .input('Diagnosis', sql.NVarChar, data.diagnosis)
            .input('Symptoms', sql.NVarChar, data.symptoms || null)
            .input('Prescription', sql.NVarChar, data.prescription || null)
            .input('TreatmentPlan', sql.NVarChar, data.treatmentPlan || null)
            .input('Notes', sql.NVarChar, data.notes || null)
            .query(`
                INSERT INTO MedicalRecords (RecordId, PatientId, DoctorId, AppointmentId, RecordDate, Diagnosis, Symptoms, Prescription, TreatmentPlan, Notes)
                VALUES (@RecordId, @PatientId, @DoctorId, @AppointmentId, @RecordDate, @Diagnosis, @Symptoms, @Prescription, @TreatmentPlan, @Notes)
            `);

        const record = await this.findById(data.recordId);
        if (!record) throw new Error('Failed to create medical record');
        return record;
    }

    static async findById(recordId: string): Promise<MedicalRecord | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('RecordId', sql.NVarChar, recordId)
            .query(`
                SELECT RecordId as recordId, PatientId as patientId, DoctorId as doctorId,
                       RecordDate as recordDate, Diagnosis as diagnosis, Treatment as treatment,
                       Prescription as prescription, Notes as notes,
                       CreatedAt as createdAt, UpdatedAt as updatedAt
                FROM MedicalRecords WHERE RecordId = @RecordId
            `);

        return result.recordset[0] || null;
    }

    static async findByPatient(patientId: string): Promise<MedicalRecord[]> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('PatientId', sql.NVarChar, patientId)
            .query(`
                SELECT RecordId as recordId, PatientId as patientId, DoctorId as doctorId,
                       RecordDate as recordDate, Diagnosis as diagnosis, Treatment as treatment,
                       Prescription as prescription, Notes as notes,
                       CreatedAt as createdAt, UpdatedAt as updatedAt
                FROM MedicalRecords WHERE PatientId = @PatientId ORDER BY RecordDate DESC
            `);

        return result.recordset;
    }

    static async findByDoctor(doctorId: string): Promise<MedicalRecord[]> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('DoctorId', sql.NVarChar, doctorId)
            .query(`
                SELECT RecordId as recordId, PatientId as patientId, DoctorId as doctorId,
                       RecordDate as recordDate, Diagnosis as diagnosis, Treatment as treatment,
                       Prescription as prescription, Notes as notes,
                       CreatedAt as createdAt, UpdatedAt as updatedAt
                FROM MedicalRecords WHERE DoctorId = @DoctorId ORDER BY RecordDate DESC
            `);

        return result.recordset;
    }

    static async update(recordId: string, updateData: Partial<MedicalRecord>): Promise<MedicalRecord> {
        const pool = await getConnection();
        const fields: string[] = [];
        const request = pool.request().input('RecordId', sql.NVarChar, recordId);

        if (updateData.diagnosis) {
            fields.push('Diagnosis = @Diagnosis');
            request.input('Diagnosis', sql.NVarChar, updateData.diagnosis);
        }
        if (updateData.symptoms) {
            fields.push('Symptoms = @Symptoms');
            request.input('Symptoms', sql.NVarChar, updateData.symptoms);
        }
        if (updateData.prescription) {
            fields.push('Prescription = @Prescription');
            request.input('Prescription', sql.NVarChar, updateData.prescription);
        }
        if (updateData.treatmentPlan) {
            fields.push('TreatmentPlan = @TreatmentPlan');
            request.input('TreatmentPlan', sql.NVarChar, updateData.treatmentPlan);
        }
        if (updateData.notes) {
            fields.push('Notes = @Notes');
            request.input('Notes', sql.NVarChar, updateData.notes);
        }

        fields.push('UpdatedAt = GETDATE()');

        await request.query(`UPDATE MedicalRecords SET ${fields.join(', ')} WHERE RecordId = @RecordId`);

        const record = await this.findById(recordId);
        if (!record) throw new Error('Medical record not found');
        return record;
    }
}
