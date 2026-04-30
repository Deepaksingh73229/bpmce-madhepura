import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    phone?: string;
    password: string;
    roles: Types.ObjectId[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
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

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
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
    },
    {
        timestamps: true,
    }
);

// Indexes
userSchema.index({ isActive: 1 });
userSchema.index({ roles: 1 });

export const User = mongoose.model<IUser>('User', userSchema);