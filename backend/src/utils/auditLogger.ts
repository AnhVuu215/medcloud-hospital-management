import { Request } from 'express';
import { getConnection } from '../config/database.js';
import { generateLogId } from './generateId.js';

interface AuditLogData {
    userId: string;
    action: string;
    target?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
}

export async function logAudit(data: AuditLogData): Promise<void> {
    try {
        const pool = await getConnection();
        const logId = generateLogId();

        await pool.request()
            .input('LogId', logId)
            .input('UserId', data.userId)
            .input('Action', data.action)
            .input('Target', data.target || null)
            .input('Details', data.details || null)
            .input('IpAddress', data.ipAddress || null)
            .input('UserAgent', data.userAgent || null)
            .query(`
                INSERT INTO AuditLogs (LogId, UserId, Action, Target, Details, IpAddress, UserAgent)
                VALUES (@LogId, @UserId, @Action, @Target, @Details, @IpAddress, @UserAgent)
            `);
    } catch (error) {
        console.error('Failed to log audit:', error);
        // Don't throw error to prevent audit logging from breaking the main flow
    }
}

export function extractAuditInfo(req: Request): { ipAddress: string; userAgent: string } {
    return {
        ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown'
    };
}
