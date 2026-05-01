import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../../../middlewares/error.middleware.js';
import {
    validate,
    loginSchema,
    registerSchema,
    refreshTokenSchema,
} from '../validators/auth.validator.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';

const router = Router();
const controller = new AuthController();

// Public routes
router.post('/register', validate(registerSchema), asyncHandler(controller.register));
router.post('/login', validate(loginSchema), asyncHandler(controller.login));
router.post('/refresh-token', validate(refreshTokenSchema), asyncHandler(controller.refreshToken));

// Protected routes
router.post('/logout', authMiddleware, asyncHandler(controller.logout));
router.get('/me', authMiddleware, asyncHandler(controller.getCurrentUser));

export default router;