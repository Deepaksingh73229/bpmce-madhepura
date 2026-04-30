import { UserRepository } from '../repositories/user.repository';
import {
    CreateUserDTO,
    UpdateUserDTO,
    UserQueryParams,
    AssignRolesDTO,
    BulkUserResult,
} from '../types/user.types';
import { UserUtils } from '../utils/user.utils';
import { AppError } from '../../../middlewares/error.middleware';
import { IUser } from '../../../models/user.model';
import { Types } from 'mongoose';

export class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    async createUser(data: CreateUserDTO): Promise<IUser> {
        try {
            const existingUser = await this.repository.findByEmail(data.email);
            if (existingUser) {
                throw new AppError('Email already exists', 409);
            }

            const roles = await this.repository.findRolesByNames(data.roles);
            if (roles.length !== data.roles.length) {
                throw new AppError('One or more roles not found', 404);
            }

            const roleIds = roles.map((r) => r._id);
            const hashedPassword = UserUtils.hashPasswordPlaceholder(data.password);

            const user = await this.repository.create({
                ...data,
                password: hashedPassword,
                roles: roleIds,
            });

            return user;
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers(queryParams: UserQueryParams) {
        try {
            const { page = 1, limit = 10, role } = queryParams;

            let roleId: Types.ObjectId | undefined;
            if (role) {
                const roleDoc = await this.repository.findRoleByName(role);
                if (!roleDoc) {
                    throw new AppError('Role not found', 404);
                }
                roleId = roleDoc._id;
            }

            const filters = UserUtils.buildFilters(queryParams, roleId);
            const { skip, limit: pageLimit } = UserUtils.getPaginationParams(page, limit);

            const [users, total] = await Promise.all([
                this.repository.findAll(filters, skip, pageLimit),
                this.repository.count(filters),
            ]);

            return {
                users,
                total,
                page,
                limit: pageLimit,
            };
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: string): Promise<IUser> {
        try {
            const user = await this.repository.findById(id);
            if (!user) {
                throw new AppError('User not found', 404);
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id: string, data: UpdateUserDTO): Promise<IUser> {
        try {
            const existingUser = await this.repository.findById(id);
            if (!existingUser) {
                throw new AppError('User not found', 404);
            }

            if (data.email && data.email !== existingUser.email) {
                const emailExists = await this.repository.findByEmail(data.email);
                if (emailExists) {
                    throw new AppError('Email already exists', 409);
                }
            }

            if (data.password) {
                data.password = UserUtils.hashPasswordPlaceholder(data.password);
            }

            const updatedUser = await this.repository.update(id, data);
            if (!updatedUser) {
                throw new AppError('Failed to update user', 500);
            }

            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async deactivateUser(id: string): Promise<IUser> {
        try {
            const user = await this.repository.findById(id);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            if (!user.isActive) {
                throw new AppError('User already deactivated', 400);
            }

            const deactivatedUser = await this.repository.softDelete(id);
            if (!deactivatedUser) {
                throw new AppError('Failed to deactivate user', 500);
            }

            return deactivatedUser;
        } catch (error) {
            throw error;
        }
    }

    async assignRoles(userId: string, data: AssignRolesDTO): Promise<IUser> {
        try {
            const user = await this.repository.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const roles = await this.repository.findRolesByNames(data.roles);
            if (roles.length !== data.roles.length) {
                throw new AppError('One or more roles not found', 404);
            }

            const roleIds = roles.map((r) => r._id);
            const updatedUser = await this.repository.assignRoles(userId, roleIds);

            if (!updatedUser) {
                throw new AppError('Failed to assign roles', 500);
            }

            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async bulkCreateUsers(csvBuffer: Buffer): Promise<BulkUserResult> {
        try {
            const rows = await UserUtils.parseCSV(csvBuffer);
            const result: BulkUserResult = {
                success: 0,
                failed: 0,
                errors: [],
                created: [],
            };

            const validUsers: Array<CreateUserDTO & { password: string }> = [];

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const validation = UserUtils.validateCSVRow(row, i + 1);

                if (!validation.valid) {
                    result.failed++;
                    result.errors.push({
                        row: i + 1,
                        email: row.email || 'N/A',
                        error: validation.error || 'Unknown error',
                    });
                    continue;
                }

                const existingUser = await this.repository.findByEmail(row.email);
                if (existingUser) {
                    result.failed++;
                    result.errors.push({
                        row: i + 1,
                        email: row.email,
                        error: 'Email already exists',
                    });
                    continue;
                }

                const roleNames = row.roles ? row.roles.split(',').map((r) => r.trim()) : [];
                const roles = await this.repository.findRolesByNames(roleNames);

                if (roles.length !== roleNames.length) {
                    result.failed++;
                    result.errors.push({
                        row: i + 1,
                        email: row.email,
                        error: 'One or more roles not found',
                    });
                    continue;
                }

                const roleIds = roles.map((r) => r._id);
                const hashedPassword = UserUtils.hashPasswordPlaceholder(row.password);

                validUsers.push({
                    name: row.name,
                    email: row.email,
                    phone: row.phone,
                    password: hashedPassword,
                    roles: roleIds,
                });
            }

            if (validUsers.length > 0) {
                try {
                    const created = await this.repository.bulkCreate(validUsers);
                    result.success = created.length;
                    result.created = created.map((u) => UserUtils.sanitizeUserData(u));
                } catch (error: any) {
                    result.failed += validUsers.length;
                    result.errors.push({
                        row: 0,
                        email: 'BULK',
                        error: error.message || 'Bulk insert failed',
                    });
                }
            }

            return result;
        } catch (error) {
            throw error;
        }
    }

    async getUserPermissions(userId: string): Promise<string[]> {
        try {
            const user = await this.repository.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const permissions = await UserUtils.resolveRoleHierarchy(user.roles as Types.ObjectId[]);
            return Array.from(permissions);
        } catch (error) {
            throw error;
        }
    }
}
