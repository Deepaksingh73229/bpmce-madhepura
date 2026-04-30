import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').trim(),
        email: z.string().email('Invalid email format').trim().toLowerCase(),
        phone: z.string().optional(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        roles: z.array(z.string()).min(1, 'At least one role is required'),
    }),
});

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(1).trim().optional(),
        email: z.string().email().trim().toLowerCase().optional(),
        phone: z.string().optional(),
        password: z.string().min(6).optional(),
    }),
});

export const assignRolesSchema = z.object({
    body: z.object({
        roles: z.array(z.string()).min(1, 'At least one role is required'),
    }),
});

export const queryUserSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
        search: z.string().optional(),
        role: z.string().optional(),
        isActive: z.coerce.boolean().optional(),
    }),
});

export const validate = (schema: z.ZodSchema) => {
    return async (req: any, _res: any, next: any) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            next(error);
        }
    };
};
