import { ApiResponse } from '../lib/apiResponse.js';
import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';

// Resolve all permissions including parent roles
export const resolveRoleHierarchy = async (roleIds) => {
    const allPermissions = new Set();

    const resolveRole = async (roleId, visited = new Set()) => {
        const roleIdStr = roleId.toString();

        if (visited.has(roleIdStr)) return;
        visited.add(roleIdStr);

        const role = await Role.findById(roleId);
        if (!role) return;

        (role.permissions || []).forEach((perm) => allPermissions.add(perm));

        if (role.parentRole) {
            await resolveRole(role.parentRole, visited);
        }
    };

    for (const roleId of roleIds) {
        await resolveRole(roleId);
    }

    return allPermissions;
};

// RBAC middleware
export const rbacMiddleware = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.userId;

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

            // Extract role IDs safely
            const roleIds = (user.roles || []).map((r) => r._id || r);

            // Resolve permissions
            const allPermissions = await resolveRoleHierarchy(roleIds);

            // Check permissions
            const hasPermission = requiredPermissions.some((perm) =>
                allPermissions.has(perm)
            );

            if (!hasPermission) {
                ApiResponse.error(
                    res,
                    'Access Denied - Insufficient Permissions',
                    'Forbidden',
                    403
                );
                return;
            }

            next();
        } catch (error) {
            ApiResponse.error(res, 'Authorization failed', 'Unauthorized', 401);
        }
    };
};