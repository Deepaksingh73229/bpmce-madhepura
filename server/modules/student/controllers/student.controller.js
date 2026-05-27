import { StudentService } from '../services/student.service.js';
import { ApiResponse } from '../../../lib/apiResponse.js';

export class StudentController {
    constructor() {
        this.service = new StudentService();
    }

    createStudent = async (req, res) => {
        const data = req.body;
        const student = await this.service.createStudent(data);
        return ApiResponse.success(res, student, 'Student created successfully', 201);
    };

    getAllStudents = async (req, res) => {
        const queryParams = req.query;
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

    getStudentById = async (req, res) => {
        const { id } = req.params;
        const student = await this.service.getStudentById(id);

        return ApiResponse.success(res, student, 'Student retrieved successfully');
    };

    updateStudent = async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        const student = await this.service.updateStudent(id, data);
        return ApiResponse.success(res, student, 'Student updated successfully');
    };

    deleteStudent = async (req, res) => {
        const { id } = req.params;

        const student = await this.service.softDeleteStudent(id);
        return ApiResponse.success(res, student, 'Student deleted successfully');
    };

    getFullProfile = async (req, res) => {
        const { id } = req.params;

        const profile = await this.service.getFullProfile(id);
        return ApiResponse.success(res, profile, 'Full profile retrieved successfully');
    };
}