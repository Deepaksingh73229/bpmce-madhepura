import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import studentRoutes from './modules/student/routes/student.routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/v1/students', studentRoutes);

// 404 Handler
app.use(/.+/, (_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error Handler (must be last)
app.use(errorHandler);

export default app;