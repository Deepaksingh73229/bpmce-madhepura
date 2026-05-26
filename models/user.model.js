import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const userSchema = new Schema(
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
            required: [true, 'Phone is reuired']
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },

        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Role',
            },
        ],

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLogin: {
            type: Date,
        },

        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
userSchema.index({ isActive: 1 });
userSchema.index({ roles: 1 });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (
    candidatePassword
) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User =
    mongoose.models.User || mongoose.model('User', userSchema);