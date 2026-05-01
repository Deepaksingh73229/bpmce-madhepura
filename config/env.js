import dotenv from 'dotenv';

dotenv.config();

const env = {
    PORT: parseInt(process.env.PORT || '5000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',

    MONGODB_URI:
        process.env.MONGODB_URI ||
        'mongodb://localhost:27017/campus_management',

    JWT_SECRET:
        process.env.JWT_SECRET ||
        'default_secret_change_in_production',

    JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',

    JWT_REFRESH_SECRET:
        process.env.JWT_REFRESH_SECRET ||
        'default_refresh_secret_change_in_production',

    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '30d',

    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

// 🔒 Validate required environment variables in production
if (env.NODE_ENV === 'production') {
    if (
        !process.env.JWT_SECRET ||
        env.JWT_SECRET === 'default_secret_change_in_production'
    ) {
        throw new Error('❌ JWT_SECRET must be set in production');
    }

    if (
        !process.env.JWT_REFRESH_SECRET ||
        env.JWT_REFRESH_SECRET === 'default_refresh_secret_change_in_production'
    ) {
        throw new Error('❌ JWT_REFRESH_SECRET must be set in production');
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('❌ MONGODB_URI must be set in production');
    }
}

export default env;