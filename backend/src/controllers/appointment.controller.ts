import { Response } from 'express';
import { AppointmentModel } from '../models/Appointment.js';
import { UserModel } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { generateAppointmentId } from '../utils/generateId.js';
import { logAudit, extractAuditInfo } from '../utils/auditLogger.js';

export class AppointmentController {
    // POST /api/appointments - Create new appointment
    static async createAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { patientId, doctorId, appointmentDate, appointmentTime, fee, reason } = req.body;

            // Validation
            if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !fee) {
                res.status(400).json({
                    error: 'Validation Error',
                    message: 'Patient ID, Doctor ID, date, time, and fee are required'
                });
                return;
            }

            // Verify patient and doctor exist
            const patient = await UserModel.findById(patientId);
            const doctor = await UserModel.findById(doctorId);

            if (!patient || patient.role !== 'PATIENT') {
                res.status(404).json({ error: 'Not Found', message: 'Patient not found' });
                return;
            }

            if (!doctor || doctor.role !== 'DOCTOR') {
                res.status(404).json({ error: 'Not Found', message: 'Doctor not found' });
                return;
            }

            // Generate appointment ID
            const appointmentId = generateAppointmentId();

            // Create appointment
            const appointment = await AppointmentModel.create({
                appointmentId,
                patientId,
                doctorId,
                appointmentDate,
                appointmentTime,
                fee,
                reason
            });

            // Log audit
            if (req.user) {
                await logAudit({
                    userId: req.user.userId,
                    action: 'APPOINTMENT_CREATED',
                    target: `Appointment ${appointmentId}`,
                    details: `Created appointment for patient ${patientId} with doctor ${doctorId}`,
                    ...extractAuditInfo(req)
                });
            }

            res.status(201).json({
                message: 'Appointment created successfully',
                appointment
            });
        } catch (error) {
            console.error('Create appointment error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to create appointment' });
        }
    }

    // GET /api/appointments - List appointments
    static async listAppointments(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { status, date } = req.query;
            let appointments: any[];

            // Filter based on user role
            if (req.user?.role === 'PATIENT') {
                appointments = await AppointmentModel.findByPatient(req.user.userId);
            } else if (req.user?.role === 'DOCTOR') {
                appointments = await AppointmentModel.findByDoctor(req.user.userId, date as string);
            } else {
                // Admin or Receptionist can see all
                const filters: { status?: string; date?: string } = {};
                if (status) filters.status = status as string;
                if (date) filters.date = date as string;
                appointments = await AppointmentModel.findAll(filters);
            }

            res.status(200).json({
                count: appointments.length,
                appointments
            });
        } catch (error) {
            console.error('List appointments error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to list appointments' });
        }
    }

    // GET /api/appointments/:id - Get appointment details
    static async getAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const appointment = await AppointmentModel.findById(id);

            if (!appointment) {
                res.status(404).json({ error: 'Not Found', message: 'Appointment not found' });
                return;
            }

            // Check access rights
            if (req.user?.role === 'PATIENT' && appointment.patientId !== req.user.userId) {
                res.status(403).json({ error: 'Forbidden', message: 'You can only view your own appointments' });
                return;
            }

            if (req.user?.role === 'DOCTOR' && appointment.doctorId !== req.user.userId) {
                res.status(403).json({ error: 'Forbidden', message: 'You can only view your own appointments' });
                return;
            }

            res.status(200).json({ appointment });
        } catch (error) {
            console.error('Get appointment error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get appointment' });
        }
    }

    // PUT /api/appointments/:id - Update appointment
    static async updateAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const appointment = await AppointmentModel.findById(id);
            if (!appointment) {
                res.status(404).json({ error: 'Not Found', message: 'Appointment not found' });
                return;
            }

            // Only allow updating if appointment is PENDING
            if (appointment.status !== 'PENDING') {
                res.status(400).json({ error: 'Bad Request', message: 'Can only update pending appointments' });
                return;
            }

            const updatedAppointment = await AppointmentModel.update(id, updateData);

            // Log audit
            if (req.user) {
                await logAudit({
                    userId: req.user.userId,
                    action: 'APPOINTMENT_UPDATED',
                    target: `Appointment ${id}`,
                    details: 'Updated appointment details',
                    ...extractAuditInfo(req)
                });
            }

            res.status(200).json({
                message: 'Appointment updated successfully',
                appointment: updatedAppointment
            });
        } catch (error) {
            console.error('Update appointment error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to update appointment' });
        }
    }

    // PUT /api/appointments/:id/status - Update appointment status
    static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status, cancellationReason } = req.body;

            if (!status || !['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
                res.status(400).json({ error: 'Validation Error', message: 'Invalid status' });
                return;
            }

            const appointment = await AppointmentModel.findById(id);
            if (!appointment) {
                res.status(404).json({ error: 'Not Found', message: 'Appointment not found' });
                return;
            }

            const updatedAppointment = await AppointmentModel.updateStatus(id, status, cancellationReason);

            // Log audit
            if (req.user) {
                await logAudit({
                    userId: req.user.userId,
                    action: 'APPOINTMENT_STATUS_CHANGED',
                    target: `Appointment ${id}`,
                    details: `Changed status to ${status}`,
                    ...extractAuditInfo(req)
                });
            }

            res.status(200).json({
                message: 'Appointment status updated successfully',
                appointment: updatedAppointment
            });
        } catch (error) {
            console.error('Update appointment status error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to update appointment status' });
        }
    }

    // DELETE /api/appointments/:id - Cancel appointment
    static async cancelAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { cancellationReason } = req.body;

            const appointment = await AppointmentModel.findById(id);
            if (!appointment) {
                res.status(404).json({ error: 'Not Found', message: 'Appointment not found' });
                return;
            }

            await AppointmentModel.updateStatus(id, 'CANCELLED', cancellationReason);

            // Log audit
            if (req.user) {
                await logAudit({
                    userId: req.user.userId,
                    action: 'APPOINTMENT_CANCELLED',
                    target: `Appointment ${id}`,
                    details: cancellationReason || 'Appointment cancelled',
                    ...extractAuditInfo(req)
                });
            }

            res.status(200).json({ message: 'Appointment cancelled successfully' });
        } catch (error) {
            console.error('Cancel appointment error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to cancel appointment' });
        }
    }
}
