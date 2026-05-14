import { z } from 'zod';

// ─────────────────────────────────────────────
// HOSTEL
// ─────────────────────────────────────────────
export const createHostelSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Hostel name is required').trim(),

        hostelType: z.enum(['male', 'female'], {
            errorMap: () => ({ message: 'Hostel type must be male or female' }),
        }),

        // address: z.string().optional(),

        // totalFloors: z.number().int().positive(),

        // capacity: z.number().int().positive(),

        staff: z
            .array(
                z.object({
                    user: z.string().min(1),
                    role: z.string().min(1),
                })
            )
            .optional(),
    }),
});

export const updateHostelSchema = z.object({
    body: z
        .object({
            name: z.string().min(1).trim().optional(),
            hostelType: z.enum(['male', 'female']).optional(),
            address: z.string().optional(),
            totalFloors: z.number().int().positive().optional(),
            capacity: z.number().int().positive().optional(),
            isActive: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'At least one field is required to update',
        }),
});

// ─────────────────────────────────────────────
// FLOOR
// ─────────────────────────────────────────────
export const createFloorSchema = z.object({
    body: z.object({
        hostel: z.string().min(1, 'Hostel ID is required'),

        floorNumber: z.number().int().nonnegative(),

        name: z.string().optional(),
    }),
});

export const updateFloorSchema = z.object({
    body: z
        .object({
            floorNumber: z.number().int().nonnegative().optional(),
            name: z.string().optional(),
            isActive: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'At least one field is required to update',
        }),
});

// ─────────────────────────────────────────────
// ROOM
// ─────────────────────────────────────────────
export const createRoomSchema = z.object({
    body: z.object({
        hostel: z.string().min(1, 'Hostel ID is required'),
        floor: z.string().min(1, 'Floor ID is required'),

        roomNumber: z.string().min(1, 'Room number is required').trim(),

        type: z.enum(['single', 'triple']),

        capacity: z.number().int().positive(),
    }),
});

export const updateRoomSchema = z.object({
    body: z
        .object({
            roomNumber: z.string().min(1).trim().optional(),
            type: z.enum(['single', 'triple']).optional(),
            capacity: z.number().int().positive().optional(),
            isActive: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'At least one field is required to update',
        }),
});

// ─────────────────────────────────────────────
// BED
// ─────────────────────────────────────────────
export const createBedSchema = z.object({
    body: z.object({
        room: z.string().min(1, 'Room ID is required'),
        bedNumber: z.string().min(1, 'Bed number is required'),
    }),
});

// ─────────────────────────────────────────────
// ROOM ALLOCATION
// ─────────────────────────────────────────────
export const allocateRoomSchema = z.object({
    body: z.object({
        studentId: z.string().min(1, 'Student ID is required'),
        hostelId: z.string().min(1, 'Hostel ID is required'),
        roomId: z.string().min(1, 'Room ID is required'),
        bedId: z.string().min(1, 'Bed ID is required'),
    }),
});

export const vacateRoomSchema = z.object({
    body: z.object({
        studentId: z.string().min(1, 'Student ID is required'),
    }),
});

// ─────────────────────────────────────────────
// QUERY (FILTER + PAGINATION)
// ─────────────────────────────────────────────
export const queryHostelSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),

        search: z.string().optional(),
        hostelType: z.enum(['male', 'female']).optional(),
        isActive: z.coerce.boolean().optional(),
    }),
});

export const queryRoomSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),

        hostelId: z.string().optional(),
        floorId: z.string().optional(),
        type: z.enum(['single', 'triple']).optional(),
        availableOnly: z.coerce.boolean().optional(),
    }),
});

// ─────────────────────────────────────────────
// VALIDATE MIDDLEWARE (IMPORTANT FIX)
// ─────────────────────────────────────────────
export const validate = (schema) => {
    return async (req, _res, next) => {
        try {
            const data = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            // ✅ Apply sanitized values
            req.body = data.body;
            req.query = data.query;
            req.params = data.params;

            next();
        } catch (error) {
            next(error);
        }
    };
};