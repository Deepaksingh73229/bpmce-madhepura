export class StudentUtils {
    static buildFilters(query) {
        const filters = {};

        // Active status filter (default: true)
        filters.isActive =
            query.isActive !== undefined ? query.isActive : true;

        // Course filter
        if (query.course) {
            filters.course = query.course;
        }

        // Branch filter
        if (query.branch) {
            filters.branch = query.branch;
        }

        // Batch year filter
        if (query.batchYear) {
            filters.batchYear = query.batchYear;
        }

        // Search filter (name, rollNumber, registrationNumber)
        if (query.search) {
            const safe = escapeRegex(query.search);
            filters.$or = [
                { name: { $regex: safe, $options: 'i' } },
                { rollNumber: { $regex: safe, $options: 'i' } },
                { registrationNumber: { $regex: safe, $options: 'i' } },
            ];
        }

        return filters;
    }

    static getPaginationParams(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return { skip, limit };
    }

    static sanitizeStudentData(student) {
        const data = student?.toObject ? student.toObject() : student;
        if (!data) return null;

        const { __v, ...sanitizedData } = data;
        return sanitizedData;
    }
}

// 🔒 Prevent regex injection / malformed patterns
function escapeRegex(str = '') {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}