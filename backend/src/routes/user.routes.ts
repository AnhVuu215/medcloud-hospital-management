import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin, requireStaff } from '../middleware/roleCheck.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// List all users (Admin only)
router.get('/', requireAdmin, UserController.listUsers);

// Get specific user
router.get('/doctors', UserController.listDoctors);
router.get('/patients', requireStaff, UserController.listPatients);
router.get('/:id', UserController.getUserById);

// Update user
router.put('/:id', UserController.updateUser);

// Update user status (Admin only)
router.put('/:id/status', requireAdmin, UserController.updateUserStatus);

export default router;
