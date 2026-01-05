import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    // Default error
    let statusCode = 500;
    let errorMessage = 'Internal Server Error';

    // Customize based on error type
    if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = err.message;
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        errorMessage = 'Unauthorized access';
    } else if (err.message.includes('duplicate key')) {
        statusCode = 409;
        errorMessage = 'Resource already exists';
    } else if (err.message.includes('not found')) {
        statusCode = 404;
        errorMessage = err.message;
    }

    res.status(statusCode).json({
        error: err.name || 'Error',
        message: process.env.NODE_ENV === 'development' ? err.message : errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
