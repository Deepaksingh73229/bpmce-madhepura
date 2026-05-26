import mongoose, { Schema } from 'mongoose';

const roomSchema = new Schema(
    {
        hostel: {
            type: Schema.Types.ObjectId,
            ref: 'Hostel',
            required: [true, 'Hostel reference is required'],
        },

        floor: {
            type: Schema.Types.ObjectId,
            ref: 'Floor',
            required: [true, 'Floor reference is required'],
        },

        roomNumber: {
            type: String,
            required: [true, 'Room number is required'],
            trim: true,
        },

        type: {
            type: String,
            enum: ['single', 'triple'],
            required: [true, 'Room type is required'],
        },

        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: [1, 'Capacity must be at least 1'],
        },

        occupiedBeds: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: ['vacant', 'occupied', 'maintenance', 'full'],
            default: 'vacant',
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Unique room per hostel
roomSchema.index({ hostel: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ hostel: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ isActive: 1 });

// Auto-update room status based on occupancy
roomSchema.pre('save', function () {
    if (this.status === 'maintenance') {
        return;
    }

    if (this.occupiedBeds === 0) {
        this.status = 'vacant';
    }
    else if (this.occupiedBeds >= this.capacity) {
        this.status = 'full';
    }
    else {
        this.status = 'occupied';
    }
});

export const Room = mongoose.model('Room', roomSchema);