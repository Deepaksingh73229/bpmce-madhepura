import { Router } from 'express';
import { HostelController } from '../controllers/hostel.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../../middlewares/rbac.middleware.js';
import { asyncHandler } from '../../../middlewares/error.middleware.js';

import {
    validate,
    createHostelSchema,
    updateHostelSchema,
    createFloorSchema,
    updateFloorSchema,
    createRoomSchema,
    updateRoomSchema,
    createBedSchema,
    allocateRoomSchema,
    vacateRoomSchema,
    queryHostelSchema,
    queryRoomSchema,
} from '../validators/hostel.validator.js';

const router = Router();
const controller = new HostelController();

// ─────────────────────────────────────────────
// AUTH (all routes protected)
// ─────────────────────────────────────────────
router.use(authMiddleware);

// ─────────────────────────────────────────────
// HOSTEL ROUTES
// ─────────────────────────────────────────────

// Create Hostel
router.post(
    '/',
    rbacMiddleware(['hostel.manage']),
    validate(createHostelSchema),
    asyncHandler(controller.createHostel)
);

// Get All Hostels
router.get(
    '/',
    rbacMiddleware(['hostel.manage']),
    validate(queryHostelSchema),
    asyncHandler(controller.getAllHostels)
);

// Get Hostel by ID
router.get(
    '/:id',
    rbacMiddleware(['hostel.manage']),
    asyncHandler(controller.getHostelById)
);

// Update Hostel
router.patch(
    '/:id',
    rbacMiddleware(['hostel.manage']),
    validate(updateHostelSchema),
    asyncHandler(controller.updateHostel)
);

// Delete (Soft)
router.delete(
    '/:id',
    rbacMiddleware(['hostel.manage']),
    asyncHandler(controller.deleteHostel)
);

// ─────────────────────────────────────────────
// FLOOR ROUTES
// ─────────────────────────────────────────────

router.post(
    '/floors',
    rbacMiddleware(['hostel.manage']),
    validate(createFloorSchema),
    asyncHandler(controller.createFloor)
);

router.get(
    '/:hostelId/floors',
    rbacMiddleware(['hostel.manage']),
    asyncHandler(controller.getFloorsByHostel)
);

router.patch(
    '/floors/:id',
    rbacMiddleware(['hostel.manage']),
    validate(updateFloorSchema),
    asyncHandler(controller.updateFloor)
);

// ─────────────────────────────────────────────
// ROOM ROUTES
// ─────────────────────────────────────────────

router.post(
    '/rooms',
    rbacMiddleware(['hostel.manage']),
    validate(createRoomSchema),
    asyncHandler(controller.createRoom)
);

router.get(
    '/:hostelId/rooms',
    rbacMiddleware(['hostel.manage']),
    asyncHandler(controller.getRoomsByHostel)
);

router.get(
    '/:hostelId/floors/:floorNumber',
    rbacMiddleware(['hostel.manage']),
    asyncHandler(controller.getFloorByNumber)
);

router.get(
    '/:hostelId/rooms/status/:status',
    rbacMiddleware(['hostel.manage']),
    asyncHandler(controller.getRoomsByStatus)
);

router.patch(
    '/rooms/:id',
    rbacMiddleware(['hostel.manage']),
    validate(updateRoomSchema),
    asyncHandler(controller.updateRoom)
);

// ─────────────────────────────────────────────
// BED ROUTES
// ─────────────────────────────────────────────

router.post(
    '/beds',
    rbacMiddleware(['hostel.manage']),
    validate(createBedSchema),
    asyncHandler(controller.createBed)
);

// ═══════════════════════════════════════════════
// STAFF ROUTES
// ═══════════════════════════════════════════════

router.post(
    '/:hostelId',
    rbacMiddleware(['hostel.manage']),
    asyncHandler(controller.createStaffByHostel)
);

router.get(
    '/:hostelId/staff',
    rbacMiddleware(['hostel.manage']),
    asyncHandler(controller.getStaffByHostel)
);

// ═══════════════════════════════════════════════
// STUDENT ROUTES
// ═══════════════════════════════════════════════

router.get(
    '/:hostelId/students',
    rbacMiddleware(['hostel.manage']),
    asyncHandler(controller.getStudentsByHostel)
);

// ─────────────────────────────────────────────
// 🔥 ALLOCATION ROUTES
// ─────────────────────────────────────────────

// Allocate room
router.post(
    '/allocate',
    rbacMiddleware(['hostel.manage']),
    validate(allocateRoomSchema),
    asyncHandler(controller.allocateRoom)
);

// Vacate room
router.post(
    '/vacate',
    rbacMiddleware(['hostel.manage']),
    validate(vacateRoomSchema),
    asyncHandler(controller.vacateRoom)
);

// Shift room
router.post(
    '/shift',
    rbacMiddleware(['hostel.manage']),
    asyncHandler(controller.shiftRoom)
);

export default router;