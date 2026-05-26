import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import env from '../config/env.js';

import { Role } from '../models/role.model.js';
import { User } from '../models/user.model.js';

const connectDB = async () => {
    await mongoose.connect(env.MONGODB_URI);

    console.log('✅ Connected to MongoDB');
};

const clearDatabase = async () => {
    await Role.deleteMany({});
    await User.deleteMany({});

    console.log('🗑️ Existing data cleared');
};

const seedRoles = async () => {
    console.log('\n🌱 Seeding roles...');

    const admin = await Role.create({
        name: 'admin',
        permissions: [
            'user.create',
            'user.read',
            'user.update',
            'user.delete',

            'student.create',
            'student.read',
            'student.update',
            'student.delete',

            'student.manage',
            'hostel.manage',
            'academic.manage',
        ],
    });

    const staff = await Role.create({
        name: 'staff',
        permissions: ['user.read', 'student.read'],
    });

    const faculty = await Role.create({
        name: 'faculty',
        permissions: ['student.read', 'academic.manage'],
    });

    const student = await Role.create({
        name: 'student',
        permissions: ['student.read'],
    });

    const officeAssistant = await Role.create({
        name: 'office_assistant',
        parentRole: staff._id,
        permissions: ['student.create', 'student.update'],
    });

    const hostelSuperintendent = await Role.create({
        name: 'hostel_superintendent',
        parentRole: faculty._id,
        permissions: ['hostel.manage', 'student.read'],
    });

    console.log('✅ Roles seeded successfully');

    return {
        admin,
        staff,
        faculty,
        student,
        officeAssistant,
        hostelSuperintendent,
    };
};

const seedUsers = async (roles) => {
    console.log('\n🌱 Seeding users...');

    const adminUser = await User.create({
        name: 'Super Admin',
        email: 'admin@college.com',
        password: 'Admin@123',
        roles: [roles.admin._id],
    });

    const superintendentUser = await User.create({
        name: 'Hostel Superintendent',
        email: 'superintendent@college.com',
        password: 'Super@123',
        roles: [roles.hostelSuperintendent._id],
    });

    const studentUser = await User.create({
        name: 'Deepak Kumar',
        email: 'student@college.com',
        password: 'Student@123',
        roles: [roles.student._id],
    });

    console.log('✅ Users seeded successfully');

    console.log('\n👤 Sample Accounts');
    console.log('━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin');
    console.log('Email: admin@college.com');
    console.log('Password: Admin@123');

    console.log('\nSuperintendent');
    console.log('Email: superintendent@college.com');
    console.log('Password: Super@123');

    console.log('\nStudent');
    console.log('Email: student@college.com');
    console.log('Password: Student@123');

    return {
        adminUser,
        superintendentUser,
        studentUser,
    };
};

const seed = async () => {
    try {
        if (env.NODE_ENV === 'production') {
            console.warn(
                '⚠️ WARNING: You are running seed in production environment'
            );
        }

        await connectDB();

        await clearDatabase();

        const roles = await seedRoles();

        await seedUsers(roles);

        console.log('\n🎉 Database seeded successfully');

        await mongoose.disconnect();

        console.log('🔌 MongoDB disconnected');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed');
        console.error(error);

        await mongoose.disconnect();

        process.exit(1);
    }
};

seed();