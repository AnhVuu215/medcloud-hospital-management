import { Router } from 'express';
import { MedicalRecordController } from '../controllers/medicalRecord.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireMedicalStaff } from '../middleware/roleCheck.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Create medical record (Doctor/Admin only)
router.post('/', requireMedicalStaff, MedicalRecordController.createRecord);

// Get patient medical history
router.get('/patient/:patientId', MedicalRecordController.getPatientRecords);

// Get specific record
router.get('/:id', MedicalRecordController.getRecord);

// Update medical record (Doctor/Admin only)
router.put('/:id', requireMedicalStaff, MedicalRecordController.updateRecord);

export default router;
