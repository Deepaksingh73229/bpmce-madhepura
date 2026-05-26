import { ApiResponse } from '../lib/apiResponse.js';
import { AuthUtils } from '../modules/auth/utils/auth.utils.js';

export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            ApiResponse.error(res, 'No token provided', 'Unauthorized', 401);
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const payload = AuthUtils.verifyAccessToken(token);

        if (!payload) {
            ApiResponse.error(res, 'Invalid or expired token', 'Unauthorized', 401);
            return;
        }

        // Attach user to request
        req.user = {
            userId: payload.userId,
            email: payload.email,
        };

        next();
    } catch (error) {
        ApiResponse.error(res, 'Authentication failed', 'Unauthorized', 401);
    }
};