import { Types } from 'mongoose';

export interface CreateUserDTO {
    name: string;
    email: string;
    phone?: string;
    password: string;
    roles: string[];
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
}

export interface AssignRolesDTO {
    roles: string[];
}

export interface UserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
}

export interface UserFilters {
    isActive?: boolean;
    roles?: Types.ObjectId;
    $or?: Array<{ [key: string]: any }>;
}

export interface BulkUserResult {
    success: number;
    failed: number;
    errors: Array<{
        row: number;
        email: string;
        error: string;
    }>;
    created: any[];
}

export interface CSVUserRow {
    name: string;
    email: string;
    phone?: string;
    password: string;
    roles: string;
}

export interface ResolvedPermissions {
    permissions: Set<string>;
    roles: string[];
}