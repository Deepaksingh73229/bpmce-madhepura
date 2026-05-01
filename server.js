import app from './app.js';
import env from './config/env.js';
import { connect, getDbStatus } from './config/db.config.js';

// Health Check (enhanced with DB status)
app.get('/health', (_req, res) => {
    const db = getDbStatus();

    return res.status(db.healthy ? 200 : 503).json({
        status: db.healthy ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
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