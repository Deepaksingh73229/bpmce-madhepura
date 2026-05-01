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

router.patch(
    '/rooms/:id',
    rbacMiddleware(['hostel.manage']),
    validate(updateRoomSchema),
    asyncHandler(controller.updateRoom)
);

router.get(
    '/rooms',
    rbacMiddleware(['hostel.manage']),
    validate(queryRoomSchema),
    asyncHandler(async (req, res) => {
        const result = await controller.service.getRooms(req.query);

        return res.status(200).json({
            success: true,
            data: result.rooms,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit),
            },
        });
    })
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