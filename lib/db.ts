import mongoose from 'mongoose';
import env from '../config/env';

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Error:', err);
});