import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// ─────────────────────────────────────────────
// CONNECTION OPTIONS
// ─────────────────────────────────────────────
const MONGO_OPTIONS = {
    maxPoolSize: 50, // Increased for serverless concurrency
    minPoolSize: 0,   // Better for serverless cold starts
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 8000, // Fail faster than Vercel's 10s limit
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    retryReads: true,
};

// ─────────────────────────────────────────────
// RETRY CONFIG
// ─────────────────────────────────────────────
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

let retryCount = 0;
let isConnected = false;
let isEventsRegistered = false;

// ─────────────────────────────────────────────
// CONNECTION EVENTS
// ─────────────────────────────────────────────
const registerEvents = () => {
    if (isEventsRegistered) return;

    mongoose.connection.on('connected', () => {
        isConnected = true;
        retryCount = 0;
        console.log(`✅ MongoDB connected → ${sanitizeUri(process.env.MONGODB_URI)}`);
    });

    mongoose.connection.on('disconnected', () => {
        isConnected = false;
        console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
        isConnected = true;
        console.log('🔄 MongoDB reconnected');
    });

    mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB error:', err.message);
    });

    mongoose.connection.on('close', () => {
        isConnected = false;
        console.log('🔒 MongoDB connection closed');
    });

    isEventsRegistered = true;
};

// ─────────────────────────────────────────────
// SANITIZE URI
// ─────────────────────────────────────────────
const sanitizeUri = (uri = '') => {
    try {
        const url = new URL(uri);
        if (url.username) url.username = '***';
        if (url.password) url.password = '***';
        return url.toString();
    } catch {
        return '[invalid uri]';
    }
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────────────────────
// CONNECT WITH RETRY
// ─────────────────────────────────────────────
const connectWithRetry = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }

    while (retryCount < MAX_RETRIES) {
        try {
            if (retryCount > 0) {
                console.log(`🔁 Retry ${retryCount}/${MAX_RETRIES}`);
            }

            await mongoose.connect(uri, MONGO_OPTIONS);
            return;

        } catch (error) {
            retryCount++;

            console.error(
                `❌ MongoDB connection failed (${retryCount}/${MAX_RETRIES}): ${error.message}`
            );

            if (retryCount >= MAX_RETRIES) {
                console.error('💀 Max retries reached. Server will stay up but DB is unavailable.');
                retryCount = 0; // reset so future reconnect attempts can retry
                throw new Error(`MongoDB connection failed after ${MAX_RETRIES} retries: ${error.message}`);
            }

            console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`);
            await sleep(RETRY_DELAY_MS);
        }
    }
};

// ─────────────────────────────────────────────
// GRACEFUL SHUTDOWN
// ─────────────────────────────────────────────
const gracefulShutdown = (signal) => {
    process.on(signal, async () => {
        console.log(`\n📴 ${signal} received — closing MongoDB...`);
        try {
            await mongoose.connection.close();
            console.log('✅ MongoDB closed gracefully');
            process.exit(0);
        } catch (err) {
            console.error('❌ Shutdown error:', err.message);
            process.exit(1);
        }
    });
};

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────
export const isDbHealthy = () => {
    return mongoose.connection.readyState === 1;
};

export const getDbStatus = () => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };

    return {
        status: states[mongoose.connection.readyState] || 'unknown',
        healthy: isDbHealthy(),
        host: mongoose.connection.host || null,
        name: mongoose.connection.name || null,
    };
};

// ─────────────────────────────────────────────
// MAIN CONNECT FUNCTION
// ─────────────────────────────────────────────
export const connect = async () => {
    // Check if already connected or connecting
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        return mongoose.connection;
    }

    registerEvents();
    gracefulShutdown('SIGINT');
    gracefulShutdown('SIGTERM');
    await connectWithRetry();
};