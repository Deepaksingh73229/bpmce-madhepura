export class ApiResponse {
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            data,
            message,
        });
    }

    static error(res, error, message = 'Error occurred', statusCode = 500) {
        return res.status(statusCode).json({
            success: false,
            error,
            message,
        });
    }

    static paginated(
        res,
        data,
        total,
        page,
        limit,
        message = 'Success'
    ) {
        const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

        return res.status(200).json({
            success: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
            message,
        });
    }
}