import { Hostel } from '../models/hostel.model.js';
import { Floor } from '../models/floor.model.js';
import { Room } from '../models/room.model.js';
import { Bed } from '../models/bed.model.js';
import { RoomAllocation } from '../models/roomAllocation.model.js';
import mongoose from 'mongoose';
import { User } from '../../../models/user.model.js';
import { Role } from '../../../models/role.model.js';

export class HostelRepository {
    // ─────────────────────────────────────────────
    // HOSTEL
    // ─────────────────────────────────────────────
    async createHostel(data) {
        return await Hostel.create(data);
    }

    async findHostelById(id) {
        return await Hostel.findById(id)
            .populate('staff.user', 'name email phone');
    }

    async findAllHostels(filters, skip, limit) {
        return await Hostel.find(filters)
            .populate('staff', 'name email phone')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async countHostels(filters) {
        return await Hostel.countDocuments(filters);
    }

    async updateHostel(id, data) {
        return await Hostel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
            .populate('staff.user', 'name email phone');
    }

    async softDeleteHostel(id) {
        return await Hostel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );
    }

    // ─────────────────────────────────────────────
    // FLOOR
    // ─────────────────────────────────────────────
    async createFloor(data) {
        return await Floor.create(data);
    }

    async findFloorById(id) {
        return await Floor.findById(id).populate('hostel', 'name hostelType');
    }

    async findFloorByNumber(data) {
        return await Floor.findOne({
            hostel: data.hostel,
            floorNumber: data.floorNumber,
            isActive: true,
        }).populate('hostel', 'name hostelType');
    }

    async findFloorByName(hostelId, name) {
        return await Floor.findOne({
            hostel: hostelId,
            name,
            isActive: true,
        }).populate('hostel', 'name hostelType');
    }

    async findFloorsByHostel(hostelId, filters) {
        const query = { hostel: hostelId, ...filters };
        return await Floor.find(query).sort({ floorNumber: 1 });
    }

    async updateFloor(id, data) {
        return await Floor.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
    }

    async countFloorsByHostel(hostelId) {
        return await Floor.countDocuments({
            hostel: hostelId,
            isActive: true,
        });
    }

    // ─────────────────────────────────────────────
    // ROOM
    // ─────────────────────────────────────────────
    async createRoom(data) {
        return await Room.create(data);
    }

    async findRoomById(id) {
        return await Room.findById(id)
            .populate('hostel', 'name hostelType')
            .populate('floor', 'floorNumber name');
    }

    async findRooms(filters, skip, limit) {
        return await Room.find(filters)
            .populate('hostel', 'name hostelType')
            .populate('floor', 'floorNumber name')
            .skip(skip)
            .limit(limit)
            .sort({ roomNumber: 1 });
    }

    async findRoomsByHostel(hostelId, filters) {
        const query = { hostel: hostelId, ...filters };

        return await Room.find(query)
            .populate('floor', 'floorNumber name')
            .sort({ roomNumber: 1 });
    }

    async findRoomsByStatus(hostelId, status) {
        return await Room.find({ hostel: hostelId, status })
            .populate('floor', 'floorNumber name')
            .sort({ roomNumber: 1 });
    }

    async countRooms(filters) {
        return await Room.countDocuments(filters);
    }

    async countRoomsByHostel(hostelId) {
        return await Room.countDocuments({ hostel: hostelId, isActive: true });
    }

    async sumRoomCapacityByHostel(hostelId) {
        const result = await Room.aggregate([
            { $match: { hostel: new mongoose.Types.ObjectId(hostelId), isActive: true } },
            { $group: { _id: null, total: { $sum: '$capacity' } } },
        ]);

        return (result[0] && result[0].total) ? result[0].total : 0;
    }

    async updateRoom(id, data) {
        return await Room.findByIdAndUpdate(id, data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    // ─────────────────────────────────────────────
    // BED
    // ─────────────────────────────────────────────
    async createBed(data) {
        return await Bed.create(data);
    }

    async findBedById(id) {
        return await Bed.findById(id).populate('room');
    }

    async findBedsByRoom(roomId) {
        return await Bed.find({ room: roomId }).sort({ bedNumber: 1 });
    }

    async updateBed(id, data) {
        return await Bed.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
    }

    // ─────────────────────────────────────────────
    // ROOM ALLOCATION
    // ─────────────────────────────────────────────
    async createAllocation(data) {
        return await RoomAllocation.create(data);
    }

    async findActiveAllocationByStudent(studentId) {
        return await RoomAllocation.findOne({
            student: studentId,
            status: 'active',
        })
            .populate('hostel', 'name')
            .populate('room', 'roomNumber')
            .populate('bed', 'bedNumber');
    }

    async findAllocationsByHostel(hostelId) {
        return await RoomAllocation.find({
            hostel: hostelId,
            status: 'active',
        })
            .populate('student', 'name email rollNumber batchYear')
            .populate('room', 'roomNumber')
            .populate('bed', 'bedNumber');
    }

    async findAllocationsByFloor(floorId) {
        const rooms = await Room.find({ floor: floorId }).select('_id');
        const roomIds = rooms.map((r) => r._id);

        return await RoomAllocation.find({
            room: { $in: roomIds },
            status: 'active',
        })
            .populate('student', 'name email rollNumber batchYear')
            .populate('room', 'roomNumber');
    }

    async updateAllocation(id, data) {
        return await RoomAllocation.findByIdAndUpdate(id, data, {
            new: true,
        });
    }

    async findAllocationById(id) {
        return await RoomAllocation.findById(id);
    }

    async findAllocations(filters, skip, limit) {
        return await RoomAllocation.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async countAllocationsByHostel(hostelId) {
        return await RoomAllocation.countDocuments({
            hostel: hostelId,
            status: 'active',
        });
    }

    // Staff
    async createStaffByHostel(hostelId, data) {
        const staffRole = await Role.findOne({ name: data.role });

        const newStaff = await User.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            roles: [staffRole._id],
        });

        await Hostel.findByIdAndUpdate(hostelId, {
            $push: {
                staff: newStaff._id
            },
        });

        return newStaff;
    }
}

