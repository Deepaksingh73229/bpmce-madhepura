import mongoose from 'mongoose';
import { Role } from '../models/role.model.js';
import env from '../config/env.js';

const seedRoles = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // ⚠️ Optional safety: prevent accidental production wipe
        if (env.NODE_ENV === 'production') {
            console.warn('⚠️ Seeding in production environment');
        }

        // Clear existing roles
        await Role.deleteMany({});
        console.log('🗑️ Cleared existing roles');

        // Create base roles
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

        // Create hierarchical roles
        await Role.create({
            name: 'office_assistant',
            parentRole: staff._id,
            permissions: ['student.create', 'student.update'],
        });

        await Role.create({
            name: 'hostel_superintendent',
            parentRole: faculty._id,
            permissions: ['hostel.manage', 'student.read'],
        });

        console.log('\n✅ Roles seeded successfully');
        console.log('📋 Created roles:');
        console.log('   - admin');
        console.log('   - staff');
        console.log('   - faculty');
        console.log('   - student');
        console.log('   - office_assistant (child of staff)');
        console.log('   - hostel_superintendent (child of faculty)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding roles:', error);
        process.exit(1);
    }
};

seedRoles();