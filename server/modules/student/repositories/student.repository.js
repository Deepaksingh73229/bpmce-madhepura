import { Student } from '../../../models/student.model.js';

export class StudentRepository {
    async create(data) {
        const student = await Student.create(data);
        return student;
    }

    async findById(id) {
        return await Student.findById(id);
    }

    async findAll(filters, skip, limit) {
        return await Student.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async count(filters) {
        return await Student.countDocuments(filters);
    }

    async update(id, data) {
        return await Student.findByIdAndUpdate(id, data, {
            returnDocument: 'after',
            runValidators: true,
        });
    }

    async softDelete(id) {
        return await Student.findByIdAndUpdate(
            id,
            { isActive: false },
            { returnDocument: 'after' }
        );
    }

    async findByEmail(email) {
        return await Student.findOne({ email });
    }

    async findByRollNumber(rollNumber) {
        return await Student.findOne({ rollNumber });
    }

    async findByRegistrationNumber(registrationNumber) {
        return await Student.findOne({ registrationNumber });
    }
}