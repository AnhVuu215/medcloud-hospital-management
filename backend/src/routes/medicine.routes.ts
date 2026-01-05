import { Router } from 'express';
import { MedicineController } from '../controllers/medicine.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// List medicines (all authenticated users)
router.get('/', MedicineController.listMedicines);

// Get low stock medicines
router.get('/low-stock', MedicineController.getLowStock);

// Get specific medicine
router.get('/:id', MedicineController.getMedicine);

// Admin only routes
router.post('/', requireAdmin, MedicineController.createMedicine);
router.put('/:id', requireAdmin, MedicineController.updateMedicine);
router.delete('/:id', requireAdmin, MedicineController.deleteMedicine);

export default router;
