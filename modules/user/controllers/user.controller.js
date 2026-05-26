import { UserService } from '../services/user.service.js';
import { ApiResponse } from '../../../lib/apiResponse.js';

export class UserController {
    constructor() {
        this.service = new UserService();
    }

    createUser = async (req, res) => {
        const data = req.body;
        const user = await this.service.createUser(data);
        return ApiResponse.success(res, user, 'User created successfully', 201);
    };

    getAllUsers = async (req, res) => {
        const queryParams = req.query;
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

    getUserById = async (req, res) => {
        const { id } = req.params;
        const user = await this.service.getUserById(id);

        return ApiResponse.success(res, user, 'User retrieved successfully');
    };

    updateUser = async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        const user = await this.service.updateUser(id, data);
        return ApiResponse.success(res, user, 'User updated successfully');
    };

    deactivateUser = async (req, res) => {
        const { id } = req.params;

        const user = await this.service.deactivateUser(id);
        return ApiResponse.success(res, user, 'User deactivated successfully');
    };

    assignRoles = async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        const user = await this.service.assignRoles(id, data);
        return ApiResponse.success(res, user, 'Roles assigned successfully');
    };

    bulkUpload = async (req, res) => {
        if (!req.file) {
            ApiResponse.error(res, 'No file uploaded', 'File Required', 400);
            return;
        }

        const result = await this.service.bulkCreateUsers(req.file.buffer);

        return ApiResponse.success(res, result, 'Bulk upload completed');
    };
}