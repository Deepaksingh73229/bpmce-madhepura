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

// Prevent duplicate floor number per hostel
floorSchema.index({ hostel: 1, floorNumber: 1 }, { unique: true });

// Prevent duplicate floor name per hostel when name is provided
floorSchema.index(
    { hostel: 1, name: 1 },
    { unique: true, partialFilterExpression: { name: { $type: 'string' } } }
);

export const Floor = mongoose.model('Floor', floorSchema);