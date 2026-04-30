import { Response } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../../../lib/apiResponse';
import { AuthRequest } from '../../../middlewares/rbac.middleware';
import { CreateUserDTO, UpdateUserDTO, UserQueryParams, AssignRolesDTO } from '../types/user.types';

export class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    createUser = async (req: AuthRequest, res: Response) => {
        const data: CreateUserDTO = req.body;
        const user = await this.service.createUser(data);
        return ApiResponse.success(res, user, 'User created successfully', 201);
    };

    getAllUsers = async (req: AuthRequest, res: Response) => {
        const queryParams: UserQueryParams = req.query;
        const result = await this.service.getAllUsers(queryParams);
        return ApiResponse.paginated(
            res,
            result.users,
            result.total,
            result.page,
            result.limit,
            'Users retrieved successfully'
        );
    };

    getUserById = async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const user = await this.service.getUserById(id);
        return ApiResponse.success(res, user, 'User retrieved successfully');
    };

    updateUser = async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const data: UpdateUserDTO = req.body;
        const user = await this.service.updateUser(id, data);
        return ApiResponse.success(res, user, 'User updated successfully');
    };

    deactivateUser = async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const user = await this.service.deactivateUser(id);
        return ApiResponse.success(res, user, 'User deactivated successfully');
    };

    assignRoles = async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const data: AssignRolesDTO = req.body;
        const user = await this.service.assignRoles(id, data);
        return ApiResponse.success(res, user, 'Roles assigned successfully');
    };

    bulkUpload = async (req: AuthRequest, res: Response) => {
        if (!req.file) {
            return ApiResponse.error(res, 'No file uploaded', 'File Required', 400);
        }

        const result = await this.service.bulkCreateUsers(req.file.buffer);
        return ApiResponse.success(res, result, 'Bulk upload completed');
    };

    getUserPermissions = async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const permissions = await this.service.getUserPermissions(id);
        return ApiResponse.success(res, { permissions }, 'Permissions retrieved successfully');
    };
}