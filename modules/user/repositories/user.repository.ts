import { User, IUser } from '../../../models/user.model';
import { Role } from '../../../models/role.model';
import { CreateUserDTO, UpdateUserDTO, UserFilters } from '../types/user.types';
import { Types } from 'mongoose';

export class UserRepository {
    async create(data: CreateUserDTO & { password: string }): Promise<IUser> {
        const user = await User.create(data);
        return user;
    }

    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id).populate('roles');
    }

    async findAll(filters: UserFilters, skip: number, limit: number): Promise<IUser[]> {
        return await User.find(filters).populate('roles').skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async count(filters: UserFilters): Promise<number> {
        return await User.countDocuments(filters);
    }

    async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
        return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('roles');
    }

    async softDelete(id: string): Promise<IUser | null> {
        return await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async assignRoles(userId: string, roleIds: Types.ObjectId[]): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, { roles: roleIds }, { new: true }).populate('roles');
    }

    async findRoleByName(name: string): Promise<any> {
        return await Role.findOne({ name: name.toLowerCase() });
    }

    async findRolesByNames(names: string[]): Promise<any[]> {
        const lowerCaseNames = names.map((n) => n.toLowerCase());
        return await Role.find({ name: { $in: lowerCaseNames } });
    }

    async bulkCreate(users: Array<CreateUserDTO & { password: string }>): Promise<IUser[]> {
        return await User.insertMany(users, { ordered: false });
    }
}