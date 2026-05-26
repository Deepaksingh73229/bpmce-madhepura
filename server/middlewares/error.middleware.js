import { ZodError } from 'zod';
import { ApiResponse } from '../lib/apiResponse.js';

export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export const errorHandler = (err, _req, res, _next) => {
    // Zod Validation Error
    if (err instanceof ZodError) {
        const errors = err.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', ');
        ApiResponse.error(res, errors, 'Validation Error', 400);
        return;
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        ApiResponse.error(res, err.message, 'Validation Error', 400);
        return;
    }

    // Mongoose Duplicate Key Error
    if (err.name === 'MongoServerError' && err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || 'Field';
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

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};