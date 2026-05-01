import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format').trim().toLowerCase(),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').trim(),
        email: z.string().email('Invalid email format').trim().toLowerCase(),
        phone: z.string().optional(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        roles: z.array(z.string()).min(1, 'At least one role is required'),
    }),
});

export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required'),
    }),
});

export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const data = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            // ✅ Attach sanitized/validated data back to req
            req.body = data.body;
            req.query = data.query;
            req.params = data.params;

            next();
        } catch (error) {
            next(error);
        }
    };
};