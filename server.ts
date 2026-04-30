import { Request, Response } from "express";

import app from './app';
import env from './config/env';
// import { connectDB } from './lib/db';
const { connect, getDbStatus } = require("./config/db.config");

type HealthResponse = {
    status: "ok" | "degraded";
    timestamp: string;
    version: string;
    db: {
        healthy: boolean;
        // add more fields if needed
    };
};

app.get("/health", (req: Request, res: Response<HealthResponse>) => {
    const db = getDbStatus();

    return res.status(db.healthy ? 200 : 503).json({
        status: db.healthy ? "ok" : "degraded",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version ?? "1.0.0",
        db,
    });
});

const startServer = async () => {
    try {
        // Connect to Database
        await connect();

        // Start Server
        app.listen(env.PORT, () => {
            console.log(`🚀 Server running on port ${env.PORT}`);
            console.log(`📍 Environment: ${env.NODE_ENV}`);
            console.log(`🔗 Health Check: http://localhost:${env.PORT}/health`);
            console.log(`🎓 Students API: http://localhost:${env.PORT}/api/v1/students`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();