import mongoose, { Schema } from 'mongoose';

const bedSchema = new Schema(
    {
        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            required: [true, 'Room reference is required'],
        },

        bedNumber: {
            type: String,
            required: [true, 'Bed number is required'],
        },

        isOccupied: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Unique bed inside a room
bedSchema.index({ room: 1, bedNumber: 1 }, { unique: true });

export const Bed = mongoose.model('Bed', bedSchema);