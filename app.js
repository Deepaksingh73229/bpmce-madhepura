import express from 'express';
import cors from 'cors';

import studentRoutes from './modules/student/routes/student.routes.js';
import userRoutes from './modules/user/routes/user.routes.js';
import authRoutes from './modules/auth/routes/auth.routes.js';
import hostelRoutes from './modules/hostel/routes/hostel.routes.js';

import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/hostels', hostelRoutes);

// 404 Handler
app.use('*', (_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error Handler (must be last)
app.use(errorHandler);

export default app;