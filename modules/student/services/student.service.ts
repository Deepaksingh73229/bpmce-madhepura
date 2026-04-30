import { StudentRepository } from '../repositories/student.repository';
import { CreateStudentDTO, UpdateStudentDTO, StudentQueryParams, FullProfileResponse } from '../types/student.types';
import { StudentUtils } from '../utils/student.utils';
import { AppError } from '../../../middlewares/error.middleware';
import { IStudent } from '../../../models/student.model';

export class StudentService {
    private repository: StudentRepository;

    constructor() {
        this.repository = new StudentRepository();
    }

    async createStudent(data: CreateStudentDTO): Promise<IStudent> {
        try {
            // Check if email already exists
            const existingEmail = await this.repository.findByEmail(data.email);
            if (existingEmail) {
                throw new AppError('Email already exists', 409);
            }

            // Check if roll number already exists
            const existingRollNumber = await this.repository.findByRollNumber(data.rollNumber);
            if (existingRollNumber) {
                throw new AppError('Roll Number already exists', 409);
            }

            // Check if registration number already exists
            const existingRegNumber = await this.repository.findByRegistrationNumber(data.registrationNumber);
            if (existingRegNumber) {
                throw new AppError('Registration Number already exists', 409);
            }

            const student = await this.repository.create(data);
            return student;
        } catch (error) {
            throw error;
        }
    }

    async getAllStudents(queryParams: StudentQueryParams) {
        try {
            const { page = 1, limit = 10 } = queryParams;

            const filters = StudentUtils.buildFilters(queryParams);
            const { skip, limit: pageLimit } = StudentUtils.getPaginationParams(page, limit);

            const [students, total] = await Promise.all([
                this.repository.findAll(filters, skip, pageLimit),
                this.repository.count(filters),
            ]);

            return {
                students,
                total,
                page,
                limit: pageLimit,
            };
        } catch (error) {
            throw error;
        }
    }

    async getStudentById(id: string): Promise<IStudent> {
        try {
            const student = await this.repository.findById(id);
            if (!student) {
                throw new AppError('Student not found', 404);
            }
            return student;
        } catch (error) {
            throw error;
        }
    }

    async updateStudent(id: string, data: UpdateStudentDTO): Promise<IStudent> {
        try {
            // Check if student exists
            const existingStudent = await this.repository.findById(id);
            if (!existingStudent) {
                throw new AppError('Student not found', 404);
            }

            // If email is being updated, check uniqueness
            if (data.email && data.email !== existingStudent.email) {
                const emailExists = await this.repository.findByEmail(data.email);
                if (emailExists) {
                    throw new AppError('Email already exists', 409);
                }
            }

            const updatedStudent = await this.repository.update(id, data);
            if (!updatedStudent) {
                throw new AppError('Failed to update student', 500);
            }

            return updatedStudent;
        } catch (error) {
            throw error;
        }
    }

    async softDeleteStudent(id: string): Promise<IStudent> {
        try {
            const student = await this.repository.findById(id);
            if (!student) {
                throw new AppError('Student not found', 404);
            }

            if (!student.isActive) {
                throw new AppError('Student already deactivated', 400);
            }

            const deletedStudent = await this.repository.softDelete(id);
            if (!deletedStudent) {
                throw new AppError('Failed to delete student', 500);
            }

            return deletedStudent;
        } catch (error) {
            throw error;
        }
    }

    async getFullProfile(id: string): Promise<FullProfileResponse> {
        try {
            const student = await this.getStudentById(id);

            // Future: Fetch related data from other modules
            // const academic = await academicService.getByStudentId(id);
            // const hostel = await hostelService.getByStudentId(id);
            // const sports = await sportsService.getByStudentId(id);

            return {
                student: StudentUtils.sanitizeStudentData(student),
                academic: null, // Placeholder for future integration
                hostel: null, // Placeholder for future integration
                sports: null, // Placeholder for future integration
            };
        } catch (error) {
            throw error;
        }
    }
}