import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
    name: string;
    email: string;
    phone?: string;
    rollNumber: string;
    registrationNumber: string;
    course?: string;
    branch?: string;
    batchYear?: number;
    gender?: string;
    dateOfBirth?: Date;
    address?: string;
    role: 'student';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        phone: {
            type: String,
            trim: true,
        },
        rollNumber: {
            type: String,
            required: [true, 'Roll Number is required'],
            unique: true,
            trim: true,
        },
        registrationNumber: {
            type: String,
            required: [true, 'Registration Number is required'],
            unique: true,
            trim: true,
        },
        course: {
            type: String,
            trim: true,
        },
        branch: {
            type: String,
            trim: true,
        },
        batchYear: {
            type: Number,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
        },
        dateOfBirth: {
            type: Date,
        },
        address: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            default: 'student',
            immutable: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance
studentSchema.index({ isActive: 1 });
studentSchema.index({ batchYear: 1 });
studentSchema.index({ course: 1, branch: 1 });

export const Student = mongoose.model<IStudent>('Student', studentSchema);