import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../lib/apiResponse';
import { User } from '../models/user.model';
import { IRole } from '../models/role.model';
import { UserUtils } from '../modules/user/utils/user.utils';
import { Types } from 'mongoose';

export type Role = 'admin' | 'superintendent' | 'warden' | 'student';

type PopulatedRole = IRole & { _id: Types.ObjectId };

export interface AuthRequest extends Request {
    user?: {
        id: string;
        permissions: string[];
        roles: string[];
        role?: Role;
    };
    file?: Express.Multer.File;
}

const isRoleName = (role: string): role is Role => {
    return ['admin', 'superintendent', 'warden', 'student'].includes(role);
};

const isPopulatedRole = (role: Types.ObjectId | PopulatedRole): role is PopulatedRole => {
    return typeof role === 'object' && 'name' in role;
};

export const rbacMiddleware = (requiredPermissions: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Mock: Read user ID from header (x-user-id)
            // In production, extract from JWT token
            const userId = (req.headers['x-user-id'] as string) || '';

            if (!userId) {
                ApiResponse.error(res, 'User ID required', 'Unauthorized', 401);
                return;
            }

            // Fetch user with roles
            const user = await User.findById(userId).populate('roles');
            if (!user) {
                ApiResponse.error(res, 'User not found', 'Unauthorized', 401);
                return;
            }

            if (!user.isActive) {
                ApiResponse.error(res, 'User account is deactivated', 'Forbidden', 403);
                return;
            }

            // Resolve all permissions from role hierarchy
            const roleIds = user.roles as Types.ObjectId[];
            const allPermissions = await UserUtils.resolveRoleHierarchy(roleIds);
            const roles = user.roles as unknown as Array<Types.ObjectId | PopulatedRole>;
            const roleNames = roles.filter(isPopulatedRole).map((role) => role.name);
            const primaryRole = roleNames.find(isRoleName);

            // Attach to request
            req.user = {
                id: userId,
                permissions: Array.from(allPermissions),
                roles: roleNames,
                role: primaryRole,
            };

            // Check if user has required permissions
            const hasPermission = requiredPermissions.some((perm) => allPermissions.has(perm) || roleNames.includes(perm));

            if (!hasPermission) {
                ApiResponse.error(res, 'Access Denied - Insufficient Permissions', 'Forbidden', 403);
                return;
            }

            next();
        } catch (error) {
            ApiResponse.error(res, 'Authorization failed', 'Unauthorized', 401);
        }
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
