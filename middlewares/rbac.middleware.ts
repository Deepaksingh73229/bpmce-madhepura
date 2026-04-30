import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../lib/apiResponse';

export type Role = 'admin' | 'superintendent' | 'warden' | 'student';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: Role;
    };
}

export const rbacMiddleware = (allowedRoles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        // Mock: Read role from header (x-user-role)
        // In production, extract from JWT token
        const userRole = (req.headers['x-user-role'] as Role) || 'student';
        const userId = (req.headers['x-user-id'] as string) || '';

        req.user = {
            id: userId,
            role: userRole,
        };

        if (!allowedRoles.includes(userRole)) {
            ApiResponse.error(res, 'Access Denied', 'Forbidden', 403);
            return;
        }

        next();
    };
};

export const checkStudentAccess = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const { id } = req.params;
    const user = req.user;

    // Students can only access their own data
    if (user?.role === 'student' && user.id !== id) {
        ApiResponse.error(res, 'Access Denied', 'Forbidden', 403);
        return;
    }

    next();
};