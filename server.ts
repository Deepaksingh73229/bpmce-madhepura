import app from './app';
import env from './config/env';
import { connectDB } from './lib/db';

const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();

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