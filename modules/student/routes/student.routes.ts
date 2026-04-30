import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { rbacMiddleware, checkStudentAccess } from '../../../middlewares/rbac.middleware';
import { asyncHandler } from '../../../middlewares/error.middleware';
import { validate, createStudentSchema, updateStudentSchema, queryStudentSchema } from '../validators/student.validator';

const router = Router();
const controller = new StudentController();

// Create Student - Admin & Superintendent only
router.post(
    '/',
    rbacMiddleware(['admin', 'superintendent']),
    validate(createStudentSchema),
    asyncHandler(controller.createStudent)
);

// Get All Students - All roles
router.get(
    '/',
    rbacMiddleware(['admin', 'superintendent', 'warden', 'student']),
    validate(queryStudentSchema),
    asyncHandler(controller.getAllStudents)
);

// Get Student by ID - All roles (students can only view own)
router.get(
    '/:id',
    rbacMiddleware(['admin', 'superintendent', 'warden', 'student']),
    checkStudentAccess,
    asyncHandler(controller.getStudentById)
);

// Update Student - Admin, Superintendent, Warden (limited)
router.patch(
    '/:id',
    rbacMiddleware(['admin', 'superintendent', 'warden']),
    validate(updateStudentSchema),
    asyncHandler(controller.updateStudent)
);

// Soft Delete Student - Admin & Superintendent only
router.delete(
    '/:id',
    rbacMiddleware(['admin', 'superintendent']),
    asyncHandler(controller.deleteStudent)
);

// Get Full Profile - All roles (students can only view own)
router.get(
    '/:id/full-profile',
    rbacMiddleware(['admin', 'superintendent', 'warden', 'student']),
    checkStudentAccess,
    asyncHandler(controller.getFullProfile)
);

export default router;