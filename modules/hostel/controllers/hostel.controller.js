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

    updateRoom = async (req, res) => {
        const { id } = req.params;
        const room = await this.service.updateRoom(id, req.body);

        return ApiResponse.success(res, room, 'Room updated successfully');
    };

    // ─────────────────────────────────────────────
    // BED
    // ─────────────────────────────────────────────
    createBed = async (req, res) => {
        const bed = await this.service.createBed(req.body);
        return ApiResponse.success(res, bed, 'Bed created successfully', 201);
    };

    // ─────────────────────────────────────────────
    // 🔥 ROOM ALLOCATION
    // ─────────────────────────────────────────────
    allocateRoom = async (req, res) => {
        const allocation = await this.service.allocateRoom(req.body);
        return ApiResponse.success(res, allocation, 'Room allocated successfully');
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