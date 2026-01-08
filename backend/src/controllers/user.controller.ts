import { Response } from 'express';
import { UserModel } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAudit, extractAuditInfo } from '../utils/auditLogger.js';

export class UserController {
    // GET /api/users - List all users (Admin only)
    static async listUsers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { role, status } = req.query;

            const filters: { role?: string; status?: string } = {};
            if (role) filters.role = role as string;
            if (status) filters.status = status as string;

            const users = await UserModel.findAll(filters);

            // Remove passwords from response
            const usersWithoutPasswords = users.map(user => {
                const { passwordHash: _, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

            res.status(200).json({
                count: usersWithoutPasswords.length,
                users: usersWithoutPasswords
            });
        } catch (error) {
            console.error('List users error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to list users' });
        }
    }

    // GET /api/users/:id - Get user by ID
    static async getUserById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            // Check if user can access this profile
            if (req.user?.role !== 'ADMIN' && req.user?.userId !== id) {
                res.status(403).json({ error: 'Forbidden', message: 'You can only view your own profile' });
                return;
            }

            const user = await UserModel.findById(id);
            if (!user) {
                res.status(404).json({ error: 'Not Found', message: 'User not found' });
                return;
            }

            const { passwordHash: _, ...userWithoutPassword } = user;
            res.status(200).json({ user: userWithoutPassword });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get user' });
        }
    }

    // PUT /api/users/:id - Update user profile
    static async updateUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Check if user can update this profile
            if (req.user?.role !== 'ADMIN' && req.user?.userId !== id) {
                res.status(403).json({ error: 'Forbidden', message: 'You can only update your own profile' });
                return;
            }

            // Prevent updating sensitive fields
            delete updateData.passwordHash;
            delete updateData.role;
            delete updateData.userId;
            delete updateData.email;

            const updatedUser = await UserModel.update(id, updateData);

            // Log audit
            if (req.user) {
                await logAudit({
                    userId: req.user.userId,
                    action: 'USER_UPDATED',
                    target: `User ${id}`,
                    details: `Updated user profile`,
                    ...extractAuditInfo(req)
                });
            }

            const { passwordHash: _, ...userWithoutPassword } = updatedUser;
            res.status(200).json({
                message: 'User updated successfully',
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to update user' });
        }
    }

    // GET /api/users/doctors - List all doctors
    static async listDoctors(req: AuthRequest, res: Response): Promise<void> {
        try {
            const doctors = await UserModel.findDoctors();

            const doctorsWithoutPasswords = doctors.map(doctor => {
                const { passwordHash: _, ...doctorWithoutPassword } = doctor;
                return doctorWithoutPassword;
            });

            res.status(200).json({
                count: doctorsWithoutPasswords.length,
                doctors: doctorsWithoutPasswords
            });
        } catch (error) {
            console.error('List doctors error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to list doctors' });
        }
    }

    // GET /api/users/patients - List all patients (Admin/Receptionist only)
    static async listPatients(req: AuthRequest, res: Response): Promise<void> {
        try {
            const patients = await UserModel.findPatients();

            const patientsWithoutPasswords = patients.map(patient => {
                const { passwordHash: _, ...patientWithoutPassword } = patient;
                return patientWithoutPassword;
            });

            res.status(200).json({
                count: patientsWithoutPasswords.length,
                patients: patientsWithoutPasswords
            });
        } catch (error) {
            console.error('List patients error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to list patients' });
        }
    }

    // PUT /api/users/:id/status - Update user status (Admin only)
    static async updateUserStatus(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
                res.status(400).json({ error: 'Validation Error', message: 'Invalid status' });
                return;
            }

            const updatedUser = await UserModel.update(id, { status });

            // Log audit
            if (req.user) {
                await logAudit({
                    userId: req.user.userId,
                    action: 'USER_STATUS_CHANGED',
                    target: `User ${id}`,
                    details: `Changed status to ${status}`,
                    ...extractAuditInfo(req)
                });
            }

            const { passwordHash: _, ...userWithoutPassword } = updatedUser;
            res.status(200).json({
                message: 'User status updated successfully',
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Update user status error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to update user status' });
        }
    }

    // DELETE /api/users/:id - Delete user (Admin only)
    static async deleteUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const user = await UserModel.findById(id);
            if (!user) {
                res.status(404).json({ error: 'Not Found', message: 'User not found' });
                return;
            }

            await UserModel.delete(id);

            await logAudit({
                userId: req.user!.userId,
                action: 'DELETE_USER',
                target: `User ${id}`,
                details: `Deleted user: ${user.name} (${user.email})`,
                ...extractAuditInfo(req)
            });

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to delete user' });
        }
    }

    // PUT /api/users/:id/restore - Restore soft-deleted user (Admin only)
    static async restoreUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const user = await UserModel.findById(id);
            if (!user) {
                res.status(404).json({ error: 'Not Found', message: 'User not found' });
                return;
            }

            await UserModel.restore(id);

            await logAudit({
                userId: req.user!.userId,
                action: 'RESTORE_USER',
                target: `User ${id}`,
                details: `Restored user: ${user.name} (${user.email})`,
                ...extractAuditInfo(req)
            });

            res.status(200).json({ message: 'User restored successfully' });
        } catch (error) {
            console.error('Restore user error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to restore user' });
        }
    }
}
