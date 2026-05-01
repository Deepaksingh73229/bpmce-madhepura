import mongoose, { Schema } from 'mongoose';

const roomSchema = new Schema(
    {
        hostel: {
            type: Schema.Types.ObjectId,
            ref: 'Hostel',
            required: true,
        },

        floor: {
            type: Schema.Types.ObjectId,
            ref: 'Floor',
            required: true,
        },

        roomNumber: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ['single', 'triple'],
            required: true,
        },

        capacity: {
            type: Number,
            required: true, // 1 or 3
        },

        occupiedBeds: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Unique room per floor
roomSchema.index({ floor: 1, roomNumber: 1 }, { unique: true });

export const Room = mongoose.model('Room', roomSchema);