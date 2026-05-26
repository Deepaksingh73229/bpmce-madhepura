import { Readable } from 'stream';
import csv from 'csv-parser';

export class UserUtils {
    static buildFilters(query, roleId) {
        const filters = {};

        if (query.isActive !== undefined) {
            filters.isActive = query.isActive;
        } else {
            filters.isActive = true;
        }

        if (roleId) {
            filters.roles = roleId;
        }

        if (query.search) {
            filters.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
            ];
        }

        return filters;
    }

    static getPaginationParams(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return { skip, limit };
    }

    static sanitizeUserData(user) {
        const data = user?.toObject ? user.toObject() : user;

        if (!data) return null;

        const { password, refreshToken, __v, ...sanitizedData } = data;
        return sanitizedData;
    }

    static async parseCSV(buffer) {
        return new Promise((resolve, reject) => {
            const results = [];

            const stream = Readable.from(buffer.toString());

            stream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    static validateCSVRow(row, index) {
        if (!row.name || !row.email || !row.password) {
            return {
                valid: false,
                error: `Row ${index + 1}: Missing required fields (name, email, password)`,
            };
        }

        const emailRegex = /^\S+@\S+\.\S+$/;

        if (!emailRegex.test(row.email)) {
            return {
                valid: false,
                error: `Row ${index + 1}: Invalid email format`,
            };
        }

        if (row.password.length < 6) {
            return {
                valid: false,
                error: `Row ${index + 1}: Password must be at least 6 characters`,
            };
        }

        return { valid: true };
    }
}