import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { generateUserId } from '../utils/generateId.js';
import { isValidEmail, isStrongPassword, sanitizeInput } from '../utils/validators.js';
import { logAudit, extractAuditInfo } from '../utils/auditLogger.js';
import { AuthRequest } from '../middleware/auth.js';

export class AuthController {
    // POST /api/auth/register
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, role, phone, address, dateOfBirth, bloodType, specialization, department } = req.body;

            // Validation
            if (!name || !email || !password || !role) {
                res.status(400).json({ error: 'Validation Error', message: 'Name, email, password, and role are required' });
                return;
            }

            if (!isValidEmail(email)) {
                res.status(400).json({ error: 'Validation Error', message: 'Invalid email format' });
                return;
            }

            if (!isStrongPassword(password)) {
                res.status(400).json({
                    error: 'Validation Error',
                    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
                });
                return;
            }

            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                res.status(409).json({ error: 'Conflict', message: 'Email already registered' });
                return;
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Generate user ID based on role
            const userId = generateUserId(role);

            // Create user
            const user = await UserModel.create({
                userId,
                name: sanitizeInput(name),
                email: email.toLowerCase(),
                passwordHash,
                role,
                phone,
                address,
                dateOfBirth,
                bloodType,
                specialization,
                department
            });

            // Log audit
            await logAudit({
                userId: user.userId,
                action: 'USER_REGISTERED',
                details: `New ${role} account created`,
                ...extractAuditInfo(req)
            });

            // Remove password from response
            const { passwordHash: _, ...userWithoutPassword } = user;

            res.status(201).json({
                message: 'User registered successfully',
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to register user' });
        }
    }

    // POST /api/auth/login
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                res.status(400).json({ error: 'Validation Error', message: 'Email and password are required' });
                return;
            }

            // Find user
            const user = await UserModel.findByEmail(email.toLowerCase());
            if (!user) {
                res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
                return;
            }

            // Check if user is active
            if (user.status !== 'ACTIVE') {
                res.status(403).json({ error: 'Forbidden', message: 'Account is inactive' });
                return;
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
                return;
            }

            // Update last login
            await UserModel.updateLastLogin(user.userId);

            // Generate JWT token
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                res.status(500).json({ error: 'Server Error', message: 'JWT secret not configured' });
                return;
            }

            const token = jwt.sign(
                {
                    userId: user.userId,
                    email: user.email,
                    role: user.role,
                    name: user.name
                },
                secret,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            // Log audit
            await logAudit({
                userId: user.userId,
                action: 'USER_LOGIN',
                details: 'User logged in successfully',
                ...extractAuditInfo(req)
            });

            // Remove password from response
            const { passwordHash: _, ...userWithoutPassword } = user;

            res.status(200).json({
                message: 'Login successful',
                token,
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to login' });
        }
    }

    // GET /api/auth/me
    static async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
                return;
            }

            const user = await UserModel.findById(req.user.userId);
            if (!user) {
                res.status(404).json({ error: 'Not Found', message: 'User not found' });
                return;
            }

            // Remove password from response
            const { passwordHash: _, ...userWithoutPassword } = user;

            res.status(200).json({
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to get profile' });
        }
    }

    // POST /api/auth/logout
    static async logout(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (req.user) {
                // Log audit
                await logAudit({
                    userId: req.user.userId,
                    action: 'USER_LOGOUT',
                    details: 'User logged out',
                    ...extractAuditInfo(req)
                });
            }

            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to logout' });
        }
    }
}
