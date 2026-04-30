import { StudentQueryParams, StudentFilters } from '../types/student.types';

export class StudentUtils {
    static buildFilters(query: StudentQueryParams): StudentFilters {
        const filters: StudentFilters = {};

        // Active status filter
        if (query.isActive !== undefined) {
            filters.isActive = query.isActive;
        } else {
            filters.isActive = true; // Default: show only active students
        }

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
            filters.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { rollNumber: { $regex: query.search, $options: 'i' } },
                { registrationNumber: { $regex: query.search, $options: 'i' } },
            ];
        }

        return filters;
    }

    static getPaginationParams(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        return { skip, limit };
    }

    static sanitizeStudentData(student: any) {
        const { __v, ...sanitizedData } = student.toObject();
        return sanitizedData;
    }
}