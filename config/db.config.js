require("dotenv").config();
const mongoose = require("mongoose");

// ─────────────────────────────────────────────
// CONNECTION OPTIONS
// ─────────────────────────────────────────────
const MONGO_OPTIONS = {
    maxPoolSize: 10,        // max concurrent connections in pool
    minPoolSize: 2,         // keep at least 2 alive
    socketTimeoutMS: 45000, // close sockets idle > 45s
    serverSelectionTimeoutMS: 5000, // give up finding a server after 5s
    heartbeatFrequencyMS: 10000,    // check server health every 10s
    retryWrites: true,
    retryReads: true,
};

// ─────────────────────────────────────────────
// RETRY CONFIG
// ─────────────────────────────────────────────
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000; // wait 3s between retries

let retryCount = 0;
let isConnected = false;

// ─────────────────────────────────────────────
// CONNECTION EVENTS
// ─────────────────────────────────────────────
const registerEvents = () => {
    mongoose.connection.on("connected", () => {
        isConnected = true;
        retryCount = 0;
        console.log(`✅ MongoDB connected → ${sanitizeUri(process.env.MONGODB_URI)}`);
    });

    mongoose.connection.on("disconnected", () => {
        isConnected = false;
        console.warn("⚠️  MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
        isConnected = true;
        console.log("🔄 MongoDB reconnected");
    });

    mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err.message);
    });

    // Fires when mongoose gives up reconnecting entirely
    mongoose.connection.on("close", () => {
        isConnected = false;
        console.log("🔒 MongoDB connection closed");
    });
};

// ─────────────────────────────────────────────
// SANITIZE URI
// Strips credentials from the URI before logging
// mongodb+srv://user:pass@cluster → mongodb+srv://***@cluster
// ─────────────────────────────────────────────
const sanitizeUri = (uri = "") => {
    try {
        const url = new URL(uri);
        if (url.username) url.username = "***";
        if (url.password) url.password = "***";
        return url.toString();
    } catch {
        return "[invalid uri]";
    }
};

// ─────────────────────────────────────────────
// SLEEP HELPER
// ─────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────────────────────
// CONNECT WITH RETRY
// ─────────────────────────────────────────────
const connectWithRetry = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("❌ MONGODB_URI is not defined in environment variables");
        process.exit(1);
    }

    while (retryCount < MAX_RETRIES) {
        try {
            if (retryCount > 0) {
                console.log(`🔁 Retry attempt ${retryCount}/${MAX_RETRIES}...`);
            }

            await mongoose.connect(uri, MONGO_OPTIONS);
            return; // success — exit the retry loop

        } catch (error) {
            retryCount += 1;

            console.error(
                `❌ MongoDB connection failed (attempt ${retryCount}/${MAX_RETRIES}): ${error.message}`
            );

            if (retryCount >= MAX_RETRIES) {
                console.error("💀 Max retries reached. Shutting down.");
                process.exit(1);
            }

            console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`);
            await sleep(RETRY_DELAY_MS);
        }
    }
};

// ─────────────────────────────────────────────
// GRACEFUL SHUTDOWN
// Ensures DB connection closes cleanly when the
// process is stopped (Ctrl+C, Docker stop, PM2 reload)
// ─────────────────────────────────────────────
const gracefulShutdown = (signal) => {
    process.on(signal, async () => {
        console.log(`\n📴 ${signal} received — closing MongoDB connection...`);
        try {
            await mongoose.connection.close();
            console.log("✅ MongoDB connection closed gracefully");
            process.exit(0);
        } catch (err) {
            console.error("❌ Error during graceful shutdown:", err.message);
            process.exit(1);
        }
    });
};

// ─────────────────────────────────────────────
// HEALTH CHECK
// Call from a /health route to verify DB status
// ─────────────────────────────────────────────
const isDbHealthy = () => {
    // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    return mongoose.connection.readyState === 1;
};

const getDbStatus = () => {
    const states = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
    };
    return {
        status: states[mongoose.connection.readyState] ?? "unknown",
        healthy: isDbHealthy(),
        host: mongoose.connection.host ?? null,
        name: mongoose.connection.name ?? null,
    };
};

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
exports.connect = async () => {
    registerEvents();
    gracefulShutdown("SIGINT");  // Ctrl+C
    gracefulShutdown("SIGTERM"); // Docker / PM2 stop
    await connectWithRetry();
};

exports.isDbHealthy = isDbHealthy;
exports.getDbStatus = getDbStatus;