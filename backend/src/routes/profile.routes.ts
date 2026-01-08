import express from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All profile routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/', ProfileController.getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/', ProfileController.updateProfile);

/**
 * @route   PUT /api/profile/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', ProfileController.changePassword);

/**
 * @route   PUT /api/profile/avatar
 * @desc    Update user avatar
 * @access  Private
 */
router.put('/avatar', ProfileController.updateAvatar);

export default router;
