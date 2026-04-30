import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '../lib/apiResponse';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    // Zod Validation Error
    if (err instanceof ZodError) {
        const errors = err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        ApiResponse.error(res, errors, 'Validation Error', 400);
        return;
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        ApiResponse.error(res, err.message, 'Validation Error', 400);
        return;
    }

    // Mongoose Duplicate Key Error
    if (err.name === 'MongoServerError' && (err as any).code === 11000) {
        const field = Object.keys((err as any).keyPattern)[0];
        ApiResponse.error(res, `${field} already exists`, 'Duplicate Entry', 409);
        return;
    }

    // Mongoose CastError
    if (err.name === 'CastError') {
        ApiResponse.error(res, 'Invalid ID format', 'Invalid Request', 400);
        return;
    }

    // Custom AppError
    if (err instanceof AppError) {
        ApiResponse.error(res, err.message, 'Application Error', err.statusCode);
        return;
    }

    // Default Error
    console.error('Unhandled Error:', err);
    ApiResponse.error(res, 'Internal Server Error', 'Server Error', 500);
};

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};