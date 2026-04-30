import { Response } from 'express';
import { StudentService } from '../services/student.service';
import { ApiResponse } from '../../../lib/apiResponse';
import { AuthRequest } from '../../../middlewares/rbac.middleware';
import { CreateStudentDTO, UpdateStudentDTO, StudentQueryParams } from '../types/student.types';

export class StudentController {
    private service: StudentService;

    constructor() {
        this.service = new StudentService();
    }

    createStudent = async (req: AuthRequest, res: Response) => {
        const data: CreateStudentDTO = req.body;
        const student = await this.service.createStudent(data);
        return ApiResponse.success(res, student, 'Student created successfully', 201);
    };

    getAllStudents = async (req: AuthRequest, res: Response) => {
        const queryParams: StudentQueryParams = req.query;
        const result = await this.service.getAllStudents(queryParams);
        return ApiResponse.paginated(
            res,
            result.students,
            result.total,
            result.page,
            result.limit,
            'Students retrieved successfully'
        );
    };

    getStudentById = async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const student = await this.service.getStudentById(id);
        return ApiResponse.success(res, student, 'Student retrieved successfully');
    };

    updateStudent = async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const data: UpdateStudentDTO = req.body;
        const student = await this.service.updateStudent(id, data);
        return ApiResponse.success(res, student, 'Student updated successfully');
    };

    deleteStudent = async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const student = await this.service.softDeleteStudent(id);
        return ApiResponse.success(res, student, 'Student deleted successfully');
    };

    getFullProfile = async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const profile = await this.service.getFullProfile(id);
        return ApiResponse.success(res, profile, 'Full profile retrieved successfully');
    };
}