import mongoose, { Schema } from 'mongoose';

const floorSchema = new Schema(
    {
        hostel: {
            type: Schema.Types.ObjectId,
            ref: 'Hostel',
            required: true,
        },

        floorNumber: {
            type: Number,
            required: true,
        },

        name: {
            type: String, // optional like "Ground", "First"
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Prevent duplicate floor in same hostel
floorSchema.index({ hostel: 1, floorNumber: 1 }, { unique: true });

export const Floor = mongoose.model('Floor', floorSchema);