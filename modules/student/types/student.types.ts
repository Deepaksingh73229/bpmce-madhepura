export interface CreateStudentDTO {
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
}

export interface UpdateStudentDTO {
    name?: string;
    email?: string;
    phone?: string;
    course?: string;
    branch?: string;
    batchYear?: number;
    gender?: string;
    dateOfBirth?: Date;
    address?: string;
}

export interface StudentQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    course?: string;
    branch?: string;
    batchYear?: number;
    isActive?: boolean;
}

export interface StudentFilters {
    isActive?: boolean;
    course?: string;
    branch?: string;
    batchYear?: number;
    $or?: Array<{ [key: string]: any }>;
}

export interface FullProfileResponse {
    student: any;
    academic: null;
    hostel: null;
    sports: null;
}