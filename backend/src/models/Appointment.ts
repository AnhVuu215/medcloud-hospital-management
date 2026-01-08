import { getConnection } from '../config/database.js';
import sql from 'mssql';

export interface Appointment {
    appointmentId: string;
    patientId: string;
    doctorId: string;
    appointmentDate: Date;
    appointmentTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    fee: number;
    reason?: string;
    cancellationReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateAppointmentData {
    appointmentId: string;
    patientId: string;
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    fee: number;
    reason?: string;
}

export class AppointmentModel {
    static async create(data: CreateAppointmentData): Promise<Appointment> {
        const pool = await getConnection();

        await pool.request()
            .input('AppointmentId', sql.NVarChar, data.appointmentId)
            .input('PatientId', sql.NVarChar, data.patientId)
            .input('DoctorId', sql.NVarChar, data.doctorId)
            .input('AppointmentDate', sql.Date, data.appointmentDate)
            .input('AppointmentTime', sql.Time, data.appointmentTime)
            .input('Fee', sql.Decimal(18, 2), data.fee)
            .input('Reason', sql.NVarChar, data.reason || null)
            .query(`
                INSERT INTO Appointments (AppointmentId, PatientId, DoctorId, AppointmentDate, AppointmentTime, Fee, Reason)
                VALUES (@AppointmentId, @PatientId, @DoctorId, @AppointmentDate, @AppointmentTime, @Fee, @Reason)
            `);

        const appointment = await this.findById(data.appointmentId);
        if (!appointment) throw new Error('Failed to create appointment');
        return appointment;
    }

    static async findById(appointmentId: string): Promise<Appointment | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('AppointmentId', sql.NVarChar, appointmentId)
            .query(`
                SELECT AppointmentId as appointmentId, PatientId as patientId, DoctorId as doctorId,
                       AppointmentDate as appointmentDate, AppointmentTime as appointmentTime,
                       Status as status, Reason as reason, Notes as notes,
                       CreatedAt as createdAt, UpdatedAt as updatedAt
                FROM Appointments WHERE AppointmentId = @AppointmentId
            `);

        return result.recordset[0] || null;
    }

    static async findByPatient(patientId: string): Promise<Appointment[]> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('PatientId', sql.NVarChar, patientId)
            .query(`
                SELECT AppointmentId as appointmentId, PatientId as patientId, DoctorId as doctorId,
                       AppointmentDate as appointmentDate, AppointmentTime as appointmentTime,
                       Status as status, Reason as reason, Notes as notes,
                       CreatedAt as createdAt, UpdatedAt as updatedAt
                FROM Appointments WHERE PatientId = @PatientId ORDER BY AppointmentDate DESC, AppointmentTime DESC
            `);

        return result.recordset;
    }

    static async findByDoctor(doctorId: string, date?: string): Promise<Appointment[]> {
        const pool = await getConnection();
        let query = `SELECT AppointmentId as appointmentId, PatientId as patientId, DoctorId as doctorId,
                            AppointmentDate as appointmentDate, AppointmentTime as appointmentTime,
                            Status as status, Reason as reason, Notes as notes,
                            CreatedAt as createdAt, UpdatedAt as updatedAt
                     FROM Appointments WHERE DoctorId = @DoctorId`;
        const request = pool.request().input('DoctorId', sql.NVarChar, doctorId);

        if (date) {
            query += ' AND AppointmentDate = @Date';
            request.input('Date', sql.Date, date);
        }

        query += ' ORDER BY AppointmentDate DESC, AppointmentTime DESC';
        const result = await request.query(query);
        return result.recordset;
    }

    static async findAll(filters?: { status?: string; date?: string }): Promise<Appointment[]> {
        const pool = await getConnection();
        let query = `SELECT AppointmentId as appointmentId, PatientId as patientId, DoctorId as doctorId,
                            AppointmentDate as appointmentDate, AppointmentTime as appointmentTime,
                            Status as status, Reason as reason, Notes as notes,
                            CreatedAt as createdAt, UpdatedAt as updatedAt
                     FROM Appointments WHERE 1=1`;
        const request = pool.request();

        if (filters?.status) {
            query += ' AND Status = @Status';
            request.input('Status', sql.NVarChar, filters.status);
        }

        if (filters?.date) {
            query += ' AND AppointmentDate = @Date';
            request.input('Date', sql.Date, filters.date);
        }

        query += ' ORDER BY AppointmentDate DESC, AppointmentTime DESC';
        const result = await request.query(query);
        return result.recordset;
    }

    static async updateStatus(appointmentId: string, status: string, cancellationReason?: string): Promise<Appointment> {
        const pool = await getConnection();

        const request = pool.request()
            .input('AppointmentId', sql.NVarChar, appointmentId)
            .input('Status', sql.NVarChar, status);

        let query = 'UPDATE Appointments SET Status = @Status, UpdatedAt = GETDATE()';

        if (cancellationReason) {
            query += ', CancellationReason = @CancellationReason';
            request.input('CancellationReason', sql.NVarChar, cancellationReason);
        }

        query += ' WHERE AppointmentId = @AppointmentId';
        await request.query(query);

        const appointment = await this.findById(appointmentId);
        if (!appointment) throw new Error('Appointment not found');
        return appointment;
    }

    static async update(appointmentId: string, updateData: Partial<Appointment>): Promise<Appointment> {
        const pool = await getConnection();
        const fields: string[] = [];
        const request = pool.request().input('AppointmentId', sql.NVarChar, appointmentId);

        if (updateData.appointmentDate) {
            fields.push('AppointmentDate = @AppointmentDate');
            request.input('AppointmentDate', sql.Date, updateData.appointmentDate);
        }
        if (updateData.appointmentTime) {
            fields.push('AppointmentTime = @AppointmentTime');
            request.input('AppointmentTime', sql.Time, updateData.appointmentTime);
        }
        if (updateData.fee !== undefined) {
            fields.push('Fee = @Fee');
            request.input('Fee', sql.Decimal(18, 2), updateData.fee);
        }
        if (updateData.reason) {
            fields.push('Reason = @Reason');
            request.input('Reason', sql.NVarChar, updateData.reason);
        }

        fields.push('UpdatedAt = GETDATE()');

        await request.query(`UPDATE Appointments SET ${fields.join(', ')} WHERE AppointmentId = @AppointmentId`);

        const appointment = await this.findById(appointmentId);
        if (!appointment) throw new Error('Appointment not found');
        return appointment;
    }

    static async delete(appointmentId: string): Promise<void> {
        const pool = await getConnection();
        await pool.request()
            .input('AppointmentId', sql.NVarChar, appointmentId)
            .query('DELETE FROM Appointments WHERE AppointmentId = @AppointmentId');
    }
}
