import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
        name: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ error: 'Unauthorized', message: 'Access token is required' });
        return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ error: 'Server Error', message: 'JWT secret not configured' });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as {
            userId: string;
            email: string;
            role: string;
            name: string;
        };

        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Unauthorized', message: 'Token has expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ error: 'Forbidden', message: 'Invalid token' });
        } else {
            res.status(500).json({ error: 'Server Error', message: 'Token verification failed' });
        }
    }
};
