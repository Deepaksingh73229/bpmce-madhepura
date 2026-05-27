import jwt from 'jsonwebtoken';
import env from '../../../config/env.js';

export class AuthUtils {
    static generateAccessToken(payload) {
        return jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRY,
        });
    }

    static generateRefreshToken(payload) {
        return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
            expiresIn: env.JWT_REFRESH_EXPIRY,
        });
    }

    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, env.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, env.JWT_REFRESH_SECRET);
        } catch (error) {
            return null;
        }
    }

    static sanitizeUser(user) {
        const data = user?.toObject ? user.toObject() : user;

        if (!data) return null;

        const { password, refreshToken, __v, ...sanitizedData } = data;
        return sanitizedData;
    }
}