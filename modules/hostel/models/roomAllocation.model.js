import mongoose, { Schema } from 'mongoose';

const allocationSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },

        hostel: {
            type: Schema.Types.ObjectId,
            ref: 'Hostel',
            required: true,
        },

        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
        },

        bed: {
            type: Schema.Types.ObjectId,
            ref: 'Bed',
            required: true,
        },

        fromDate: {
            type: Date,
            default: Date.now,
        },

        toDate: {
            type: Date,
        },

        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active',
        },
    },
    { timestamps: true }
);

// Only one active allocation per student
allocationSchema.index(
    { student: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: 'active' } }
);

export const RoomAllocation = mongoose.model('RoomAllocation', allocationSchema);