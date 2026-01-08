import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getConnection } from '../config/database';
import { AuthRequest } from '../middleware/auth';

/**
 * Profile Controller
 * Handles user profile operations
 */
export class ProfileController {
    /**
     * Get current user's profile
     */
    static async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            const pool = await getConnection();
            const result = await pool.request()
                .input('userId', userId)
                .query(`
                    SELECT 
                        userId, username, email, fullName, role,
                        phone, address, dateOfBirth, avatar,
                        createdAt, updatedAt
                    FROM Users
                    WHERE userId = @userId
                `);

            if (result.recordset.length === 0) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const user = result.recordset[0];

            // Remove sensitive data
            res.json({
                userId: user.userId,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                phone: user.phone,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                avatar: user.avatar,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Failed to get profile' });
        }
    }

    /**
     * Update current user's profile
     */
    static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            const { fullName, phone, address, dateOfBirth } = req.body;

            // Validation
            if (fullName && (fullName.length < 2 || fullName.length > 100)) {
                res.status(400).json({ message: 'Full name must be between 2 and 100 characters' });
                return;
            }

            if (phone && !/^[\d+\s()-]{10,15}$/.test(phone)) {
                res.status(400).json({ message: 'Invalid phone number format' });
                return;
            }

            if (address && address.length > 200) {
                res.status(400).json({ message: 'Address must not exceed 200 characters' });
                return;
            }

            const pool = await getConnection();

            // Build dynamic update query
            const updates: string[] = [];
            const request = pool.request().input('userId', userId);

            if (fullName !== undefined) {
                updates.push('fullName = @fullName');
                request.input('fullName', fullName);
            }
            if (phone !== undefined) {
                updates.push('phone = @phone');
                request.input('phone', phone);
            }
            if (address !== undefined) {
                updates.push('address = @address');
                request.input('address', address);
            }
            if (dateOfBirth !== undefined) {
                updates.push('dateOfBirth = @dateOfBirth');
                request.input('dateOfBirth', dateOfBirth);
            }

            if (updates.length === 0) {
                res.status(400).json({ message: 'No fields to update' });
                return;
            }

            updates.push('updatedAt = GETDATE()');

            await request.query(`
                UPDATE Users
                SET ${updates.join(', ')}
                WHERE userId = @userId
            `);

            // Get updated profile
            const result = await pool.request()
                .input('userId', userId)
                .query(`
                    SELECT 
                        userId, username, email, fullName, role,
                        phone, address, dateOfBirth, avatar,
                        createdAt, updatedAt
                    FROM Users
                    WHERE userId = @userId
                `);

            res.json({
                message: 'Profile updated successfully',
                user: result.recordset[0]
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Failed to update profile' });
        }
    }

    /**
     * Change user password
     */
    static async changePassword(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            const { oldPassword, newPassword } = req.body;

            // Validation
            if (!oldPassword || !newPassword) {
                res.status(400).json({ message: 'Old password and new password are required' });
                return;
            }

            if (newPassword.length < 8) {
                res.status(400).json({ message: 'New password must be at least 8 characters' });
                return;
            }

            // Password strength validation
            const hasUpperCase = /[A-Z]/.test(newPassword);
            const hasLowerCase = /[a-z]/.test(newPassword);
            const hasNumber = /\d/.test(newPassword);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

            if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
                res.status(400).json({
                    message: 'Password must contain uppercase, lowercase, number, and special character'
                });
                return;
            }

            const pool = await getConnection();

            // Get current password hash
            const userResult = await pool.request()
                .input('userId', userId)
                .query('SELECT password FROM Users WHERE userId = @userId');

            if (userResult.recordset.length === 0) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const currentPasswordHash = userResult.recordset[0].password;

            // Verify old password
            const isValidPassword = await bcrypt.compare(oldPassword, currentPasswordHash);
            if (!isValidPassword) {
                res.status(401).json({ message: 'Current password is incorrect' });
                return;
            }

            // Hash new password
            const newPasswordHash = await bcrypt.hash(newPassword, 10);

            // Update password
            await pool.request()
                .input('userId', userId)
                .input('password', newPasswordHash)
                .query(`
                    UPDATE Users
                    SET password = @password, updatedAt = GETDATE()
                    WHERE userId = @userId
                `);

            res.json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ message: 'Failed to change password' });
        }
    }

    /**
     * Update user avatar
     */
    static async updateAvatar(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            const { avatar } = req.body;

            if (!avatar) {
                res.status(400).json({ message: 'Avatar URL is required' });
                return;
            }

            const pool = await getConnection();
            await pool.request()
                .input('userId', userId)
                .input('avatar', avatar)
                .query(`
                    UPDATE Users
                    SET avatar = @avatar, updatedAt = GETDATE()
                    WHERE userId = @userId
                `);

            res.json({
                message: 'Avatar updated successfully',
                avatar
            });
        } catch (error) {
            console.error('Update avatar error:', error);
            res.status(500).json({ message: 'Failed to update avatar' });
        }
    }
}
