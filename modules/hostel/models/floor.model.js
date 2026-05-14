import mongoose, { Schema } from 'mongoose';

const floorSchema = new Schema(
    {
        hostel: {
            type: Schema.Types.ObjectId,
            ref: 'Hostel',
            required: [true, 'Hostel reference is required'],
        },

        floorNumber: {
            type: Number,
            required: [true, 'Floor number is required'],
        },

        name: {
            type: String,  // Ground, First, ....
            trim: true,
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