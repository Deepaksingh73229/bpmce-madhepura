import { UserQueryParams, UserFilters, CSVUserRow } from '../types/user.types';
import { Types } from 'mongoose';
import { Role } from '../../../models/role.model';
import { Readable } from 'stream';
import csv from 'csv-parser';

export class UserUtils {
    static buildFilters(query: UserQueryParams, roleId?: Types.ObjectId): UserFilters {
        const filters: UserFilters = {};

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

    static getPaginationParams(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        return { skip, limit };
    }

    static sanitizeUserData(user: any) {
        const { password, __v, ...sanitizedData } = user.toObject();
        return sanitizedData;
    }

    static async resolveRoleHierarchy(roleIds: Types.ObjectId[]): Promise<Set<string>> {
        const allPermissions = new Set<string>();

        const resolveRole = async (roleId: Types.ObjectId, visited: Set<string> = new Set()): Promise<void> => {
            const roleIdStr = roleId.toString();
            if (visited.has(roleIdStr)) return;
            visited.add(roleIdStr);

            const role = await Role.findById(roleId);
            if (!role) return;

            role.permissions.forEach((perm) => allPermissions.add(perm));

            if (role.parentRole) {
                await resolveRole(role.parentRole, visited);
            }
        };

        for (const roleId of roleIds) {
            await resolveRole(roleId);
        }

        return allPermissions;
    }

    static async parseCSV(buffer: Buffer): Promise<CSVUserRow[]> {
        return new Promise((resolve, reject) => {
            const results: CSVUserRow[] = [];
            const stream = Readable.from(buffer.toString());

            stream
                .pipe(csv())
                .on('data', (data: CSVUserRow) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error: Error) => reject(error));
        });
    }

    static validateCSVRow(row: any, _index: number): { valid: boolean; error?: string } {
        if (!row.name || !row.email || !row.password) {
            return {
                valid: false,
                error: `Missing required fields (name, email, password)`,
            };
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(row.email)) {
            return {
                valid: false,
                error: `Invalid email format`,
            };
        }

        if (row.password.length < 6) {
            return {
                valid: false,
                error: `Password must be at least 6 characters`,
            };
        }

        return { valid: true };
    }

    static hashPasswordPlaceholder(password: string): string {
        // Placeholder for bcrypt hashing
        // In production: return await bcrypt.hash(password, 10);
        return `hashed_${password}`;
    }
}
