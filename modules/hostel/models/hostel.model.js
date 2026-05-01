import mongoose, { Schema } from 'mongoose';

const hostelSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        hostelType: {
            type: String,
            enum: ['male', 'female'],
            required: true,
        },

        address: {
            type: String,
            trim: true,
        },

        totalFloors: {
            type: Number,
            required: true,
            min: 1,
        },

        capacity: {
            type: Number,
            required: true,
            min: 1,
        },

        // staff mapping (warden, superintendent)
        staff: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                role: {
                    type: String, // warden, superintendent
                },
            },
        ],

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Hostel = mongoose.model('Hostel', hostelSchema);