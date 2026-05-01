import { Hostel } from '../models/hostel.model.js';
import { Floor } from '../models/floor.model.js';
import { Room } from '../models/room.model.js';
import { Bed } from '../models/bed.model.js';
import { RoomAllocation } from '../models/allocation.model.js';

export class HostelRepository {
    // ─────────────────────────────────────────────
    // HOSTEL
    // ─────────────────────────────────────────────
    async createHostel(data) {
        return await Hostel.create(data);
    }

    async findHostelById(id) {
        return await Hostel.findById(id);
    }

    async findAllHostels(filters, skip, limit) {
        return await Hostel.find(filters)
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
        });
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
        return await Floor.findById(id);
    }

    async updateFloor(id, data) {
        return await Floor.findByIdAndUpdate(id, data, { new: true });
    }

    async findFloorsByHostel(hostelId) {
        return await Floor.find({ hostel: hostelId }).sort({ floorNumber: 1 });
    }

    // ─────────────────────────────────────────────
    // ROOM
    // ─────────────────────────────────────────────
    async createRoom(data) {
        return await Room.create(data);
    }

    async findRoomById(id) {
        return await Room.findById(id);
    }

    async findRooms(filters, skip, limit) {
        return await Room.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async countRooms(filters) {
        return await Room.countDocuments(filters);
    }

    async updateRoom(id, data) {
        return await Room.findByIdAndUpdate(id, data, { new: true });
    }

    // ─────────────────────────────────────────────
    // BED
    // ─────────────────────────────────────────────
    async createBed(data) {
        return await Bed.create(data);
    }

    async findBedById(id) {
        return await Bed.findById(id);
    }

    async findBedsByRoom(roomId) {
        return await Bed.find({ room: roomId });
    }

    async updateBed(id, data) {
        return await Bed.findByIdAndUpdate(id, data, { new: true });
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
        });
    }

    async findAllocationById(id) {
        return await RoomAllocation.findById(id);
    }

    async updateAllocation(id, data) {
        return await RoomAllocation.findByIdAndUpdate(id, data, {
            new: true,
        });
    }

    async findAllocations(filters, skip, limit) {
        return await RoomAllocation.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async countAllocations(filters) {
        return await RoomAllocation.countDocuments(filters);
    }
}