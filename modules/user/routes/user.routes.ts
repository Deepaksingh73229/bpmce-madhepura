import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { rbacMiddleware } from '../../../middlewares/rbac.middleware';
import { asyncHandler } from '../../../middlewares/error.middleware';
import {
    validate,
    createUserSchema,
    updateUserSchema,
    assignRolesSchema,
    queryUserSchema,
} from '../validators/user.validator';
import multer from 'multer';

const router = Router();
const controller = new UserController();
const upload = multer({ storage: multer.memoryStorage() });

// Create User - Admin only
router.post('/', rbacMiddleware(['user.create']), validate(createUserSchema), asyncHandler(controller.createUser));

// Get All Users - Admin, Staff
router.get('/', rbacMiddleware(['user.read']), validate(queryUserSchema), asyncHandler(controller.getAllUsers));

// Get User by ID - Admin, Staff
router.get('/:id', rbacMiddleware(['user.read']), asyncHandler(controller.getUserById));

// Update User - Admin only
router.patch('/:id', rbacMiddleware(['user.update']), validate(updateUserSchema), asyncHandler(controller.updateUser));

// Deactivate User - Admin only
router.delete('/:id', rbacMiddleware(['user.delete']), asyncHandler(controller.deactivateUser));

// Assign Roles - Admin only
router.post(
    '/:id/roles',
    rbacMiddleware(['user.update']),
    validate(assignRolesSchema),
    asyncHandler(controller.assignRoles)
);

// Bulk Upload - Admin only
router.post(
    '/bulk-upload',
    rbacMiddleware(['user.create']),
    upload.single('file'),
    asyncHandler(controller.bulkUpload)
);

// Get User Permissions - Admin, Staff, Self
router.get('/:id/permissions', rbacMiddleware(['user.read']), asyncHandler(controller.getUserPermissions));

export default router;
