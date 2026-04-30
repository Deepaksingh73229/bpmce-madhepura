import { Response } from 'express';

export class ApiResponse {
    static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200) {
        return res.status(statusCode).json({
            success: true,
            data,
            message,
        });
    }

    static error(res: Response, error: string, message: string = 'Error occurred', statusCode: number = 500) {
        return res.status(statusCode).json({
            success: false,
            error,
            message,
        });
    }

    static paginated<T>(
        res: Response,
        data: T[],
        total: number,
        page: number,
        limit: number,
        message: string = 'Success'
    ) {
        return res.status(200).json({
            success: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            message,
        });
    }
}