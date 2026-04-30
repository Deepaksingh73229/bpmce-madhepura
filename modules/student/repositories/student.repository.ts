import { Student, IStudent } from '../../../models/student.model';
import { CreateStudentDTO, UpdateStudentDTO, StudentFilters } from '../types/student.types';

export class StudentRepository {
    async create(data: CreateStudentDTO): Promise<IStudent> {
        const student = await Student.create(data);
        return student;
    }

    async findById(id: string): Promise<IStudent | null> {
        return await Student.findById(id);
    }

    async findAll(filters: StudentFilters, skip: number, limit: number): Promise<IStudent[]> {
        return await Student.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async count(filters: StudentFilters): Promise<number> {
        return await Student.countDocuments(filters);
    }

    async update(id: string, data: UpdateStudentDTO): Promise<IStudent | null> {
        return await Student.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async softDelete(id: string): Promise<IStudent | null> {
        return await Student.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }

    async findByEmail(email: string): Promise<IStudent | null> {
        return await Student.findOne({ email });
    }

    async findByRollNumber(rollNumber: string): Promise<IStudent | null> {
        return await Student.findOne({ rollNumber });
    }

    async findByRegistrationNumber(registrationNumber: string): Promise<IStudent | null> {
        return await Student.findOne({ registrationNumber });
    }
}