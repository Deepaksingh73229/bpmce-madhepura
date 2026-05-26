// import { Hostel } from '../models/hostel.model.js';
// import { Floor } from '../models/floor.model.js';
// import { Room } from '../models/room.model.js';
// import { Bed } from '../models/bed.model.js';
// import { RoomAllocation } from '../models/roomAllocation.model.js';

import { User } from '../../../models/user.model.js';
import { Student } from '../../../models/student.model.js';

import { HostelUtils } from '../utils/hostel.utils.js';
import { AppError } from '../../../middlewares/error.middleware.js';
import { HostelRepository } from '../repositories/hostel.repository.js';

export class HostelService {
    constructor() {
        this.repository = new HostelRepository();
    }

    // ─────────────────────────────────────────────
    // HOSTEL
    // ─────────────────────────────────────────────
    async createHostel(data) {
        return await this.repository.createHostel(data);
    }

    async getAllHostels(query) {
        const filters = HostelUtils.buildHostelFilters(query);

        const { skip, limit } = HostelUtils.getPaginationParams(
            query.page,
            query.limit
        );

        const [hostels, total] = await Promise.all([
            this.repository.findAllHostels(filters, skip, limit),
            this.repository.countHostels(filters),
        ]);

        const hostelsWithTotals = await Promise.all(
            hostels.map(async (hostel) => {
                const [totalFloors, totalRooms, totalCapacity] = await Promise.all([
                    this.repository.countFloorsByHostel(hostel._id),
                    this.repository.countRoomsByHostel(hostel._id),
                    this.repository.sumRoomCapacityByHostel(hostel._id),
                ]);

                return {
                    ...hostel.toObject(),
                    totalFloors,
                    totalRooms,
                    totalCapacity,
                };
            })
        );

        return {
            hostels: hostelsWithTotals,
            total,
            page: query.page || 1,
            limit
        };
    }

    async getHostelById(id) {
        const hostel = await this.repository.findHostelById(id);

        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        return hostel;
        // Check duplicate by floor number
        if (typeof data.floorNumber !== 'undefined' && data.floorNumber !== null) {
            const floorByNumber = await this.repository.findFloorByNumber(data);
            if (floorByNumber) {
                throw new AppError('Floor number already exists for this hostel', 400);
            }
        }

        // Check duplicate by name (if provided)
        if (data.name) {
            const floorByName = await this.repository.findFloorByName(data.hostel, data.name);
            if (floorByName) {
                throw new AppError('Floor name already exists for this hostel', 400);
            }
        }

        return await this.repository.createFloor(data);
        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        return hostel;
    }

    async deleteHostel(id) {
        const hostel = await this.repository.softDeleteHostel(id);

        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        return hostel;
    }

    // ─────────────────────────────────────────────
    // FLOOR
    // ─────────────────────────────────────────────
    async createFloor(data) {
        const hostel = await this.repository.findHostelById(
            data.hostel
        );

        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        const floor = await this.repository.findFloorByNumber(data);

        if (floor) {
            throw new AppError('Floor already exist!', 404)
        }

        return await this.repository.createFloor(data);
    }

    async getFloorByNumber(hostelId, floorNumber) {
        const hostel = await this.repository.findHostelById(
            hostelId
        );

        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        const floor = await this.repository.findFloorByNumber(hostelId, floorNumber);

        if (!floor) {
            throw new AppError('Floor not found', 404);
        }

        return floor;
    }

    async getFloorsByHostel(hostelId, query) {
        const hostel = await this.repository.findHostelById(hostelId);

        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        const filters = {};

        if (query.batchAllocation) {
            filters.batchAllocation = query.batchAllocation;
        }

        if (query.batch) {
            return await this.repository.findFloorsByBatch(
                hostelId,
                query.batch
            );
        }

        // If floorNumber query is provided, return that specific floor
        if (typeof query.floorNumber !== 'undefined') {
            return await this.repository.findFloorByNumber({ hostel: hostelId, floorNumber: Number(query.floorNumber) });
        }

        // If name query is provided, return that specific floor
        if (query.name) {
            return await this.repository.findFloorByName(hostelId, query.name);
        }

        return await this.repository.findFloorsByHostel(
            hostelId,
            filters
        );
    }

    async updateFloor(id, data) {
        const floor = await this.repository.updateFloor(id, data);

        if (!floor) {
            throw new AppError('Floor not found', 404);
        }

        return floor;
    }

    // ─────────────────────────────────────────────
    // ROOM
    // ─────────────────────────────────────────────
    async createRoom(data) {
        const [hostel, floor] = await Promise.all([
            this.repository.findHostelById(data.hostel),
            this.repository.findFloorById(data.floor),
        ]);

        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        if (!floor) {
            throw new AppError('Floor not found', 404);
        }

        const capacity = HostelUtils.getRoomCapacity(data.type);

        return await this.repository.createRoom({
            ...data,
            capacity,
        });
    }

    async getRoomsByHostel(hostelId, query) {
        const hostel = await this.repository.findHostelById(hostelId);

        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        const filters = {};

        if (query.status) {
            filters.status = query.status;
        }

        if (query.type) {
            filters.type = query.type;
        }

        if (query.floorId) {
            filters.floor = query.floorId;
        }

        if (query.availableOnly) {
            filters.$expr = {
                $lt: ['$occupiedBeds', '$capacity'],
            };
        }

        return await this.repository.findRoomsByHostel(
            hostelId,
            filters
        );
    }

    async updateRoom(id, data) {
        const room = await this.repository.updateRoom(id, data);

        if (!room) {
            throw new AppError('Room not found', 404);
        }

        return room;
    }

    async getRoomsByStatus(hostelId, status) {
        const hostel = await this.repository.findHostelById(
            hostelId
        );

        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        return await this.repository.findRoomsByStatus(
            hostelId,
            status
        );
    }

    // ─────────────────────────────────────────────
    // BED
    // ─────────────────────────────────────────────
    async createBed(data) {
        const room = await this.repository.findRoomById(data.room);

        if (!room) {
            throw new AppError('Room not found', 404);
        }

        return await this.repository.createBed(data);
    }

    async updateBed(id, data) {
        const bed = await this.repository.updateBed(id, data);

        if (!bed) {
            throw new AppError('Bed not found', 404);
        }

        return bed;
    }

    // ═══════════════════════════════════════════════
    // STAFF DETAILS
    // ═══════════════════════════════════════════════
    async createStaffByHostel(hostelId, data){
        const hostel = await this.repository.findHostelById(hostelId);

        if(!hostel){
            throw new AppError('Hostel not found', 404)
        }

        return await this.repository.createStaffByHostel(hostelId, data);
    }

    async getStaffByHostel(query) {
        const hostel = await this.repository.findHostelById(
            query.hostelId
        );

        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        let staff = hostel.staff;

        if (query.role) {
            staff = staff.filter(
                (s) => s.role === query.role
            );
        }

        const staffDetails = await Promise.all(
            staff.map(async (s) => {
                const user = await User.findById(
                    s.user
                ).populate('roles');

                return {
                    ...s.toObject(),
                    user: user
                        ? HostelUtils.sanitizeUserData(user)
                        : null,
                };
            })
        );

        return staffDetails.filter((s) => s.user !== null);
    }

    // ═══════════════════════════════════════════════
    // STUDENTS BY HOSTEL
    // ═══════════════════════════════════════════════
    async getStudentsByHostel(query) {
        const hostel = await this.repository.findHostelById(
            query.hostelId
        );

        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        let allocations =
            await this.repository.findAllocationsByHostel(
                query.hostelId
            );

        // Filter by floor
        if (query.floorId) {
            allocations =
                await this.repository.findAllocationsByFloor(
                    query.floorId
                );
        }

        // Filter by batch
        if (query.batch) {
            allocations = allocations.filter((alloc) => {
                return (
                    alloc.student?.batchYear === query.batch
                );
            });
        }

        // Filter by room
        if (query.roomId) {
            allocations = allocations.filter((alloc) => {
                return (
                    alloc.room?._id.toString() ===
                    query.roomId
                );
            });
        }

        return allocations.map((alloc) => ({
            student: alloc.student,
            room: alloc.room,
            bed: alloc.bed,
            fromDate: alloc.fromDate,
            allocationId: alloc._id,
        }));
    }


    // ─────────────────────────────────────────────
    // 🔥 ROOM ALLOCATION (CORE)
    // ─────────────────────────────────────────────
    async allocateRoom(data) {
        const [student, hostel, room, bed] =
            await Promise.all([
                Student.findById(data.studentId),
                this.repository.findHostelById(data.hostelId),
                this.repository.findRoomById(data.roomId),
                this.repository.findBedById(data.bedId),
            ]);

        if (!student) {
            throw new AppError('Student not found', 404);
        }

        if (!hostel) {
            throw new AppError('Hostel not found', 404);
        }

        if (!room) {
            throw new AppError('Room not found', 404);
        }

        if (!bed) {
            throw new AppError('Bed not found', 404);
        }

        // Validate gender
        if (
            !HostelUtils.canAllocateStudent(
                student,
                hostel
            )
        ) {
            throw new AppError(
                'Student gender does not match hostel type',
                400
            );
        }

        // Existing allocation
        const existing =
            await this.repository.findActiveAllocationByStudent(
                data.studentId
            );

        if (existing) {
            throw new AppError(
                'Student already has an active room allocation',
                400
            );
        }

        // Room capacity
        if (!HostelUtils.hasRoomCapacity(room)) {
            throw new AppError('Room is full', 400);
        }

        // Bed availability
        if (!HostelUtils.isBedAvailable(bed)) {
            throw new AppError(
                'Bed is already occupied',
                400
            );
        }

        // Room maintenance
        if (room.status === 'maintenance') {
            throw new AppError(
                'Room is under maintenance',
                400
            );
        }

        // Prepare allocation
        const allocationData =
            HostelUtils.prepareAllocationData({
                student,
                hostel,
                room,
                bed,
            });

        const allocation =
            await this.repository.createAllocation(
                allocationData
            );

        // Update bed
        await this.repository.updateBed(
            bed._id.toString(),
            {
                isOccupied: true,
            }
        );

        // Update room occupancy
        await this.repository.updateRoom(
            room._id.toString(),
            {
                occupiedBeds: room.occupiedBeds + 1,
            }
        );

        return allocation;
    }

    // ─────────────────────────────────────────────
    // VACATE ROOM
    // ─────────────────────────────────────────────
    async vacateRoom(studentId) {
        const allocation =
            await this.repository.findActiveAllocationByStudent(
                studentId
            );

        if (!allocation) {
            throw new AppError(
                'No active allocation found',
                404
            );
        }

        const [bed, room] = await Promise.all([
            this.repository.findBedById(
                allocation.bed.toString()
            ),

            this.repository.findRoomById(
                allocation.room.toString()
            ),
        ]);

        // Update allocation
        await this.repository.updateAllocation(
            allocation._id.toString(),
            {
                status: 'completed',
                toDate: new Date(),
            }
        );

        // Free bed
        if (bed) {
            await this.repository.updateBed(
                bed._id.toString(),
                {
                    isOccupied: false,
                }
            );
        }

        // Decrease occupancy
        if (room && room.occupiedBeds > 0) {
            await this.repository.updateRoom(
                room._id.toString(),
                {
                    occupiedBeds:
                        room.occupiedBeds - 1,
                }
            );
        }

        return allocation;
    }

    // ═══════════════════════════════════════════════
    // ROOM SHIFT
    // ═══════════════════════════════════════════════

    async shiftRoom(data) {
        const {
            studentId,
            newRoomId,
            newBedId,
            newHostelId,
        } = data;

        // Check existing allocation
        const existingAllocation =
            await this.repository.findActiveAllocationByStudent(
                studentId
            );

        if (!existingAllocation) {
            throw new AppError(
                'Student does not have any active room allocation',
                404
            );
        }

        // Vacate current room
        await this.vacateRoom(studentId);

        // Allocate new room
        return await this.allocateRoom({
            studentId,
            hostelId: newHostelId,
            roomId: newRoomId,
            bedId: newBedId,
        });
    }
}