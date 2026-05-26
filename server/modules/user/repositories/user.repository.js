import { User } from '../../../models/user.model.js';
import { Role } from '../../../models/role.model.js';

export class UserRepository {
    async create(data) {
        const user = await User.create(data);
        return await User.findById(user._id).populate('roles');
    }

    async findById(id) {
        return await User.findById(id).populate('roles');
    }

    async findAll(filters, skip, limit) {
        return await User.find(filters)
            .populate('roles')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async count(filters) {
        return await User.countDocuments(filters);
    }

    async update(id, data) {
        return await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate('roles');
    }

    async softDelete(id) {
        return await User.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async assignRoles(userId, roleIds) {
        return await User.findByIdAndUpdate(
            userId,
            { roles: roleIds },
            { new: true }
        ).populate('roles');
    }

    async findRoleByName(name) {
        return await Role.findOne({ name: name.toLowerCase() });
    }

    async findRolesByNames(names) {
        const lowerCaseNames = names.map((n) => n.toLowerCase());
        return await Role.find({ name: { $in: lowerCaseNames } });
    }

    async bulkCreate(users) {
        return await User.insertMany(users, { ordered: false });
    }
}