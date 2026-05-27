import { HostelService } from '../services/hostel.service.js';
import { ApiResponse } from '../../../lib/apiResponse.js';

export class HostelController {
    constructor() {
        this.service = new HostelService();
    }

    // ─────────────────────────────────────────────
    // HOSTEL
    // ─────────────────────────────────────────────
    createHostel = async (req, res) => {
        const hostel = await this.service.createHostel(req.body);
        return ApiResponse.success(res, hostel, 'Hostel created successfully', 201);
    };

    getAllHostels = async (req, res) => {
        const result = await this.service.getAllHostels(req.query);

        return ApiResponse.paginated(
            res,
            result.hostels,
            result.total,
            result.page,
            result.limit,
            'Hostels retrieved successfully'
        );
    };

    getHostelById = async (req, res) => {
        const { id } = req.params;
        const hostel = await this.service.getHostelById(id);

        return ApiResponse.success(res, hostel, 'Hostel retrieved successfully');
    };

    updateHostel = async (req, res) => {
        const { id } = req.params;
        const hostel = await this.service.updateHostel(id, req.body);

        return ApiResponse.success(res, hostel, 'Hostel updated successfully');
    };

    deleteHostel = async (req, res) => {
        const { id } = req.params;
        const hostel = await this.service.deleteHostel(id);

        return ApiResponse.success(res, hostel, 'Hostel deactivated successfully');
    };

    // ─────────────────────────────────────────────
    // FLOOR
    // ─────────────────────────────────────────────
    createFloor = async (req, res) => {
        const floor = await this.service.createFloor(req.body);
        return ApiResponse.success(res, floor, 'Floor created successfully', 201);
    };

    getFloorByNumber = async (req, res) => {
        const { hostelId, floorNumber } = req.params;

        const floor =
            await this.service.getFloorByNumber(
                hostelId,
                floorNumber
            );

        return ApiResponse.success(
            res,
            floor,
            'Floor retrieved successfully'
        );
    };

    getFloorsByHostel = async (req, res) => {
        const { hostelId } = req.params;

        const floors = await this.service.getFloorsByHostel(
            hostelId,
            req.query
        );

        return ApiResponse.success(
            res,
            floors,
            'Floors retrieved successfully'
        );
    };

    updateFloor = async (req, res) => {
        const { id } = req.params;
        const floor = await this.service.updateFloor(id, req.body);

        return ApiResponse.success(res, floor, 'Floor updated successfully');
    };

    // ─────────────────────────────────────────────
    // ROOM
    // ─────────────────────────────────────────────
    createRoom = async (req, res) => {
        const room = await this.service.createRoom(req.body);
        return ApiResponse.success(res, room, 'Room created successfully', 201);
    };

    getRoomsByHostel = async (req, res) => {
        const { hostelId } = req.params;

        const rooms = await this.service.getRoomsByHostel(
            hostelId,
            req.query
        );

        return ApiResponse.success(
            res,
            rooms,
            'Rooms retrieved successfully'
        );
    };

    getRoomsByStatus = async (req, res) => {
        const { hostelId, status } = req.params;

        const rooms = await this.service.getRoomsByStatus(
            hostelId,
            status
        );

        return ApiResponse.success(
            res,
            rooms,
            'Rooms retrieved successfully'
        );
    };

    updateRoom = async (req, res) => {
        const { id } = req.params;
        const room = await this.service.updateRoom(id, req.body);

        return ApiResponse.success(res, room, 'Room updated successfully');
    };

    getAllRooms = async (req, res) => {
        const result = await this.service.getAllRooms(req.query);

        return ApiResponse.paginated(
            res,
            result.rooms,
            result.total,
            result.page,
            result.limit,
            'Rooms retrieved successfully'
        );
    };

    // ─────────────────────────────────────────────
    // BED
    // ─────────────────────────────────────────────
    createBed = async (req, res) => {
        const bed = await this.service.createBed(req.body);
        return ApiResponse.success(res, bed, 'Bed created successfully', 201);
    };

    updateBed = async (req, res) => {
        const { id } = req.params;
        const bed = await this.service.updateBed(id, req.body);

        return ApiResponse.success(res, bed, 'Bed updated successfully');
    };

    // ═══════════════════════════════════════════════
    // STAFF BY HOSTEL
    // ═══════════════════════════════════════════════
    createStaffByHostel = async (req, res) => {
        const { hostelId } = req.params;
        const staff = await this.service.createStaffByHostel(hostelId, req.body);
        
        return ApiResponse.success(res, staff, 'Staff created successfully', 201);
    }

    getStaffByHostel = async (req, res) => {
        const { hostelId } = req.params;

        const staff = await this.service.getStaffByHostel({
            hostelId,
            role: req.query.role,
        });

        return ApiResponse.success(
            res,
            staff,
            'Staff retrieved successfully'
        );
    };

    // ═══════════════════════════════════════════════
    // STUDENTS BY HOSTEL
    // ═══════════════════════════════════════════════
    getStudentsByHostel = async (req, res) => {
        const { hostelId } = req.params;

        const students = await this.service.getStudentsByHostel({
            hostelId,
            floorId: req.query.floorId,
            roomId: req.query.roomId,
            batch: req.query.batch
                ? parseInt(req.query.batch)
                : undefined,
        });

        return ApiResponse.success(
            res,
            students,
            'Students retrieved successfully'
        );
    };

    // ─────────────────────────────────────────────
    // 🔥 ROOM ALLOCATION
    // ─────────────────────────────────────────────
    allocateRoom = async (req, res) => {
        const allocation = await this.service.allocateRoom(req.body);
        return ApiResponse.success(res, allocation, 'Room allocated successfully');
    };

    getAllAllocations = async (req, res) => {
        const result = await this.service.getAllAllocations(req.query);

        return ApiResponse.paginated(
            res,
            result.allocations,
            result.total,
            result.page,
            result.limit,
            'Allocations retrieved successfully'
        );
    };

    vacateRoom = async (req, res) => {
        const { studentId } = req.body;
        const result = await this.service.vacateRoom(studentId);

        return ApiResponse.success(res, result, 'Room vacated successfully');
    };

    shiftRoom = async (req, res) => {
        const result = await this.service.shiftRoom(req.body);

        return ApiResponse.success(res, result, 'Room shifted successfully');
    };
}