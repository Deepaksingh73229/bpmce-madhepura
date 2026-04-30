import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    PORT: number;
    NODE_ENV: string;
    MONGODB_URI: string;
}

const env: EnvConfig = {
    PORT: parseInt(process.env.PORT || '5000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_management',
};

export default env;