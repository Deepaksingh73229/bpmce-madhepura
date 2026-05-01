import { User } from '../../../models/user.model.js';
import { Role } from '../../../models/role.model.js';

export class AuthRepository {
    async findUserByEmail(email) {
        return await User.findOne({ email })
            .select('+password +refreshToken')
            .populate('roles');
    }

    async createUser(data) {
        const user = await User.create(data);
        return await User.findById(user._id).populate('roles');
    }

    async updateRefreshToken(userId, refreshToken) {
        await User.findByIdAndUpdate(userId, {
            refreshToken,
            lastLogin: new Date(),
        });
    }

    async clearRefreshToken(userId) {
        await User.findByIdAndUpdate(userId, {
            refreshToken: null,
        });
    }

    async findUserById(userId) {
        return await User.findById(userId).populate('roles');
    }

    async findRolesByNames(names) {
        const lowerCaseNames = names.map((n) => n.toLowerCase());
        return await Role.find({ name: { $in: lowerCaseNames } });
    }

    async findUserByRefreshToken(refreshToken) {
        return await User.findOne({ refreshToken })
            .select('+refreshToken')
            .populate('roles');
    }
}