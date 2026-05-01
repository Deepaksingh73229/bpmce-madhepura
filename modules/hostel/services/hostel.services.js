import { Hostel } from '../models/hostel.model.js';
import { Floor } from '../models/floor.model.js';
import { Room } from '../models/room.model.js';
import { Bed } from '../models/bed.model.js';
import { RoomAllocation } from '../models/allocation.model.js';
import { Student } from '../../student/models/student.model.js';

import { HostelUtils } from '../utils/hostel.utils.js';
import { AppError } from '../../../middlewares/error.middleware.js';

export class HostelService {
    // ─────────────────────────────────────────────
    // HOSTEL
    // ─────────────────────────────────────────────
    async createHostel(data) {
        return await Hostel.create(data);
    }

    async getAllHostels(query) {
        const filters = HostelUtils.buildHostelFilters(query);
        const { skip, limit } = HostelUtils.getPaginationParams(
            query.page,
            query.limit
        );

        const [hostels, total] = await Promise.all([
            Hostel.find(filters).skip(skip).limit(limit),
            Hostel.countDocuments(filters),
        ]);

        return { hostels, total, page: query.page, limit };
    }

    async getHostelById(id) {
        const hostel = await Hostel.findById(id);
        if (!hostel) throw new AppError('Hostel not found', 404);
        return hostel;
    }

    async updateHostel(id, data) {
        const hostel = await Hostel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!hostel) throw new AppError('Hostel not found', 404);
        return hostel;
    }

    async deleteHostel(id) {
        const hostel = await Hostel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!hostel) throw new AppError('Hostel not found', 404);
        return hostel;
    }

    // ─────────────────────────────────────────────
    // FLOOR
    // ─────────────────────────────────────────────
    async createFloor(data) {
        return await Floor.create(data);
    }

    async updateFloor(id, data) {
        const floor = await Floor.findByIdAndUpdate(id, data, { new: true });
        if (!floor) throw new AppError('Floor not found', 404);
        return floor;
    }

    // ─────────────────────────────────────────────
    // ROOM
    // ─────────────────────────────────────────────
    async createRoom(data) {
        // auto set capacity from type
        data.capacity = HostelUtils.getRoomCapacity(data.type);

        return await Room.create(data);
    }

    async updateRoom(id, data) {
        const room = await Room.findByIdAndUpdate(id, data, { new: true });
        if (!room) throw new AppError('Room not found', 404);
        return room;
    }

    // ─────────────────────────────────────────────
    // BED
    // ─────────────────────────────────────────────
    async createBed(data) {
        return await Bed.create(data);
    }

    // ─────────────────────────────────────────────
    // 🔥 ROOM ALLOCATION (CORE)
    // ─────────────────────────────────────────────
    async allocateRoom({ studentId, hostelId, roomId, bedId }) {
        const [student, hostel, room, bed] = await Promise.all([
            Student.findById(studentId),
            Hostel.findById(hostelId),
            Room.findById(roomId),
            Bed.findById(bedId),
        ]);

        if (!student) throw new AppError('Student not found', 404);
        if (!hostel) throw new AppError('Hostel not found', 404);
        if (!room) throw new AppError('Room not found', 404);
        if (!bed) throw new AppError('Bed not found', 404);

        // 🚫 Gender validation
        if (!HostelUtils.canAllocateStudent(student, hostel)) {
            throw new AppError('Student not allowed in this hostel', 400);
        }

        // 🚫 Already allocated
        const existing = await RoomAllocation.findOne({
            student: studentId,
            status: 'active',
        });

        if (existing) {
            throw new AppError('Student already has an active room', 400);
        }

        // 🚫 Room capacity check
        if (!HostelUtils.hasRoomCapacity(room)) {
            throw new AppError('Room is full', 400);
        }

        // 🚫 Bed availability
        if (!HostelUtils.isBedAvailable(bed)) {
            throw new AppError('Bed is already occupied', 400);
        }

        // ✅ Create allocation
        const allocationData = HostelUtils.prepareAllocationData({
            student,
            hostel,
            room,
            bed,
        });

        const allocation = await RoomAllocation.create(allocationData);

        // ✅ Update bed + room
        bed.isOccupied = true;
        await bed.save();

        room.occupiedBeds += 1;
        await room.save();

        return allocation;
    }

    // ─────────────────────────────────────────────
    // VACATE ROOM
    // ─────────────────────────────────────────────
    async vacateRoom(studentId) {
        const allocation = await RoomAllocation.findOne({
            student: studentId,
            status: 'active',
        });

        if (!allocation) {
            throw new AppError('No active allocation found', 404);
        }

        const [bed, room] = await Promise.all([
            Bed.findById(allocation.bed),
            Room.findById(allocation.room),
        ]);

        // update allocation
        allocation.status = 'completed';
        allocation.toDate = new Date();
        await allocation.save();

        // free bed
        if (bed) {
            bed.isOccupied = false;
            await bed.save();
        }

        // decrease room occupancy
        if (room && room.occupiedBeds > 0) {
            room.occupiedBeds -= 1;
            await room.save();
        }

        return allocation;
    }

    // ─────────────────────────────────────────────
    // SHIFT ROOM (ADVANCED 🔥)
    // ─────────────────────────────────────────────
    async shiftRoom({ studentId, newRoomId, newBedId, newHostelId }) {
        // Step 1: vacate current
        await this.vacateRoom(studentId);

        // Step 2: allocate new
        return await this.allocateRoom({
            studentId,
            hostelId: newHostelId,
            roomId: newRoomId,
            bedId: newBedId,
        });
    }
}