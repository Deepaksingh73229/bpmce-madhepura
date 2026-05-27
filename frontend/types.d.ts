declare module "@/types" {
  export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    roles: Role[] | string[];
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface Role {
    _id: string;
    name: string;
    permissions: string[];
    parentRole?: string;
  }

  export interface Hostel {
    _id: string;
    name: string;
    hostelType: "male" | "female";
    address?: string;
    totalFloors?: number;
    capacity?: number;
    isActive: boolean;
    staff?: any[];
    createdAt?: string;
    updatedAt?: string;
  }

  export interface Floor {
    _id: string;
    hostel: string | Hostel;
    floorNumber: number;
    name?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface Room {
    _id: string;
    hostel: string | Hostel;
    floor: string | Floor;
    roomNumber: string;
    type: "single" | "triple";
    capacity: number;
    occupiedBeds: number;
    status?: "available" | "maintenance" | "full";
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface Bed {
    _id: string;
    room: string | Room;
    bedNumber: string;
    isOccupied: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface Student {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    rollNumber: string;
    registrationNumber: string;
    course?: string;
    branch?: string;
    batchYear?: number;
    gender: "Male" | "Female" | "Other";
    dateOfBirth?: string;
    address?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface RoomAllocation {
    _id: string;
    student: string | Student;
    hostel: string | Hostel;
    room: string | Room;
    bed: string | Bed;
    fromDate: string;
    toDate?: string;
    status: "active" | "completed" | "cancelled";
    createdAt?: string;
    updatedAt?: string;
  }

  export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }

  export interface RoomFilters {
    page?: number;
    limit?: number;
    hostelId?: string;
    floorId?: string;
    type?: "single" | "triple";
    availableOnly?: boolean;
  }

  export interface HostelFilters {
    page?: number;
    limit?: number;
    search?: string;
    hostelType?: "male" | "female";
    isActive?: boolean;
  }

  export interface StudentFilters {
    page?: number;
    limit?: number;
    search?: string;
    gender?: string;
    course?: string;
    branch?: string;
    batchYear?: number;
    hostelId?: string;
  }

  export interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }
}
