import { Router } from 'express';
import { StudentController } from '../controllers/student.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../../middlewares/rbac.middleware.js';
import { asyncHandler } from '../../../middlewares/error.middleware.js';
import {
    validate,
    createStudentSchema,
    updateStudentSchema,
    queryStudentSchema,
} from '../validators/student.validator.js';

const router = Router();
const controller = new StudentController();

// All routes require authentication
router.use(authMiddleware);

// Create Student - Requires student.create permission
router.post(
    '/',
    rbacMiddleware(['student.create']),
    validate(createStudentSchema),
    asyncHandler(controller.createStudent)
);

// Get All Students - Requires student.read permission
router.get(
    '/',
    rbacMiddleware(['student.read']),
    validate(queryStudentSchema),
    asyncHandler(controller.getAllStudents)
);

// ⚠️ Place specific routes BEFORE param routes
// Get Full Profile - Requires student.read permission
router.get(
    '/:id/full-profile',
    rbacMiddleware(['student.read']),
    asyncHandler(controller.getFullProfile)
);

// Get Student by ID - Requires student.read permission
router.get(
    '/:id',
    rbacMiddleware(['student.read']),
    asyncHandler(controller.getStudentById)
);

// Update Student - Requires student.update permission
router.patch(
    '/:id',
    rbacMiddleware(['student.update']),
    validate(updateStudentSchema),
    asyncHandler(controller.updateStudent)
);

// Soft Delete Student - Requires student.delete permission
router.delete(
    '/:id',
    rbacMiddleware(['student.delete']),
    asyncHandler(controller.deleteStudent)
);

export default router;