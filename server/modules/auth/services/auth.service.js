import { AuthRepository } from '../repositories/auth.repository.js';
import { AuthUtils } from '../utils/auth.utils.js';
import { AppError } from '../../../middlewares/error.middleware.js';

export class AuthService {
    constructor() {
        this.repository = new AuthRepository();
    }

    async register(data) {
        try {
            // Check if user already exists
            const existingUser = await this.repository.findUserByEmail(data.email);
            if (existingUser) {
                throw new AppError('Email already exists', 409);
            }

            // Validate roles
            const roles = await this.repository.findRolesByNames(data.roles);
            if (roles.length !== data.roles.length) {
                throw new AppError('One or more roles not found', 404);
            }

            const roleIds = roles.map((r) => r._id);

            // Create user
            const user = await this.repository.createUser({
                ...data,
                roles: roleIds,
            });

            // Generate tokens
            const tokenPayload = {
                userId: user._id.toString(),
                email: user.email,
            };

            const accessToken = AuthUtils.generateAccessToken(tokenPayload);
            const refreshToken = AuthUtils.generateRefreshToken(tokenPayload);

            // Save refresh token
            await this.repository.updateRefreshToken(user._id.toString(), refreshToken);

            return {
                user: AuthUtils.sanitizeUser(user),
                accessToken,
                refreshToken,
            };
        } catch (error) {
            throw error;
        }
    }

    async login(data) {
        try {
            const user = await this.repository.findUserByEmail(data.email);

            if (!user) {
                throw new AppError('Invalid email or password', 401);
            }

            if (!user.isActive) {
                throw new AppError('Account is deactivated', 403);
            }

            const isPasswordValid = await user.comparePassword(data.password);

            if (!isPasswordValid) {
                throw new AppError('Invalid email or password', 401);
            }

            const tokenPayload = {
                userId: user._id.toString(),
                email: user.email,
            };

            const accessToken = AuthUtils.generateAccessToken(tokenPayload);
            const refreshToken = AuthUtils.generateRefreshToken(tokenPayload);

            await this.repository.updateRefreshToken(user._id.toString(), refreshToken);

            return {
                user: AuthUtils.sanitizeUser(user),
                accessToken,
                refreshToken,
            };
        } catch (error) {
            throw error;
        }
    }

    async refreshToken(data) {
        try {
            const payload = AuthUtils.verifyRefreshToken(data.refreshToken);

            if (!payload) {
                throw new AppError('Invalid refresh token', 401);
            }

            const user = await this.repository.findUserByRefreshToken(data.refreshToken);

            if (!user) {
                throw new AppError('Invalid refresh token', 401);
            }

            if (!user.isActive) {
                throw new AppError('Account is deactivated', 403);
            }

            const tokenPayload = {
                userId: user._id.toString(),
                email: user.email,
            };

            const accessToken = AuthUtils.generateAccessToken(tokenPayload);
            const newRefreshToken = AuthUtils.generateRefreshToken(tokenPayload);

            await this.repository.updateRefreshToken(user._id.toString(), newRefreshToken);

            return {
                user: AuthUtils.sanitizeUser(user),
                accessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            throw error;
        }
    }

    async logout(userId) {
        try {
            await this.repository.clearRefreshToken(userId);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser(userId) {
        try {
            const user = await this.repository.findUserById(userId);

            if (!user) {
                throw new AppError('User not found', 404);
            }

            return AuthUtils.sanitizeUser(user);
        } catch (error) {
            throw error;
        }
    }
}