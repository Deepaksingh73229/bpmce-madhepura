import { z } from 'zod';

export const createStudentSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').trim(),
        email: z.string().email('Invalid email format').trim().toLowerCase(),
        phone: z.string().optional(),
        rollNumber: z.string().min(1, 'Roll Number is required').trim(),
        registrationNumber: z.string().min(1, 'Registration Number is required').trim(),
        course: z.string().optional(),
        branch: z.string().optional(),
        batchYear: z.number().int().positive().optional(),
        gender: z.enum(['Male', 'Female', 'Other']).optional(),
        dateOfBirth: z.coerce.date({
            required_error: "Date of birth is required",
            invalid_type_error: "Invalid date",
        }),
        address: z.string().optional(),
    }),
});

export const updateStudentSchema = z.object({
    body: z.object({
        name: z.string().min(1).trim().optional(),
        email: z.string().email().trim().toLowerCase().optional(),
        phone: z.string().optional(),
        course: z.string().optional(),
        branch: z.string().optional(),
        batchYear: z.number().int().positive().optional(),
        gender: z.enum(['Male', 'Female', 'Other']).optional(),
        dateOfBirth: z.coerce.date().optional(),
        address: z.string().optional(),
    }),
});

export const queryStudentSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
        search: z.string().trim().optional(),
        course: z.string().optional(),
        branch: z.string().optional(),
        batchYear: z.coerce.number().int().positive().optional(),
        isActive: z.coerce.boolean().optional(),
    }),
});

export const validate = (schema) => {
    return async (req, _res, next) => {
        try {
            const data = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            // ✅ Apply sanitized data back
            req.body = data.body;
            req.query = data.query;
            req.params = data.params;

            next();
        } catch (error) {
            next(error);
        }
    };
};