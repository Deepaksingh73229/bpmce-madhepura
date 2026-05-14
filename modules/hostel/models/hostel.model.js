import mongoose, { Schema } from 'mongoose';

const hostelSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Hostel name is required'],
            trim: true,
        },

        hostelType: {
            type: String,
            enum: ['male', 'female'],
            required: [true, 'Hostel type is required'],
        },

        totalFloors: {
            type: Number,
            required: [true, 'Total floors is required'],
            min: [1, 'Total floors must be at least 1'],
        },

        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: [1, 'Capacity must be at least 1'],
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

hostelSchema.index({ hostelType: 1 });
hostelSchema.index({ isActive: 1 });
hostelSchema.index({ 'staff.user': 1 });

export const Hostel = mongoose.model('Hostel', hostelSchema);