import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireStaff } from '../middleware/roleCheck.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Create appointment (any authenticated user)
router.post('/', AppointmentController.createAppointment);

// List appointments (filtered by role)
router.get('/', AppointmentController.listAppointments);

// Get specific appointment
router.get('/:id', AppointmentController.getAppointment);

// Update appointment (staff only)
router.put('/:id', requireStaff, AppointmentController.updateAppointment);

// Update appointment status (staff only)
router.put('/:id/status', requireStaff, AppointmentController.updateStatus);

// Cancel appointment
router.delete('/:id', AppointmentController.cancelAppointment);

export default router;
