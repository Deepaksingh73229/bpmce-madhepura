import mongoose, { Schema } from 'mongoose';

const allocationSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student reference is required'],
        },

        hostel: {
            type: Schema.Types.ObjectId,
            ref: 'Hostel',
            required: [true, 'Hostel reference is required'],
        },

        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            required: [true, 'Room reference is required'],
        },

        bed: {
            type: Schema.Types.ObjectId,
            ref: 'Bed',
            required: [true, 'Bed reference is required'],
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