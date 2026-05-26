import mongoose, { Schema } from 'mongoose';

const hostelSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, 'Hostel name is required'],
            trim: true,
        },

        hostelType: {
            type: String,
            enum: ['male', 'female'],
            required: [true, 'Hostel type is required'],
        },

        // staff mapping (warden, superintendent)
        // Only store reference to the user. Role information is stored on the User model.
        staff: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
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