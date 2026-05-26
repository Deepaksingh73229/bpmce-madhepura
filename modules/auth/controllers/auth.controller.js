import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../../../lib/apiResponse.js';

export class AuthController {
    constructor() {
        this.service = new AuthService();
    }

    register = async (req, res) => {
        const data = req.body;
        const result = await this.service.register(data);
        return ApiResponse.success(res, result, 'Registration successful', 201);
    };

    login = async (req, res) => {
        const data = req.body;
        const result = await this.service.login(data);
        return ApiResponse.success(res, result, 'Login successful');
    };

    refreshToken = async (req, res) => {
        const data = req.body;
        const result = await this.service.refreshToken(data);
        return ApiResponse.success(res, result, 'Token refreshed successfully');
    };

    logout = async (req, res) => {
        const userId = req.user?.userId;

        if (!userId) {
            ApiResponse.error(res, 'Unauthorized', 'User not found', 401);
            return;
        }

        await this.service.logout(userId);
        return ApiResponse.success(res, null, 'Logout successful');
    };

    getCurrentUser = async (req, res) => {
        const userId = req.user?.userId;

        if (!userId) {
            ApiResponse.error(res, 'Unauthorized', 'User not found', 401);
            return;
        }

        const user = await this.service.getCurrentUser(userId);
        return ApiResponse.success(res, user, 'User retrieved successfully');
    };
}