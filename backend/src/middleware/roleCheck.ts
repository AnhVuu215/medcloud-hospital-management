import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

type UserRole = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';

export const requireRole = (...allowedRoles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
            return;
        }

        const userRole = req.user.role as UserRole;

        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({
                error: 'Forbidden',
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
            });
            return;
        }

        next();
    };
};

// Convenience middleware for common role checks
export const requireAdmin = requireRole('ADMIN');
export const requireDoctor = requireRole('DOCTOR');
export const requireReceptionist = requireRole('RECEPTIONIST');
export const requirePatient = requireRole('PATIENT');
export const requireStaff = requireRole('ADMIN', 'DOCTOR', 'RECEPTIONIST');
export const requireMedicalStaff = requireRole('ADMIN', 'DOCTOR');
