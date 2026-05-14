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
    // Start HTTP server FIRST — always reachable regardless of DB state
    const server = app.listen(env.PORT, () => {
        console.log(`🚀 Server running on port ${env.PORT}`);
        console.log(`📍 Environment: ${env.NODE_ENV}`);
        console.log(`🔗 Health Check: http://localhost:${env.PORT}/health`);
        console.log(`🎓 Students API: http://localhost:${env.PORT}/api/v1/students`);
    });

    server.on('error', (error) => {
        console.error('❌ HTTP server error:', error);
        process.exit(1);
    });

    // Connect to Database after server is up
    try {
        await connect();
    } catch (error) {
        console.error('❌ Failed to connect to database:', error);
        // Server stays up — DB may reconnect; don't exit
    }
};

startServer();