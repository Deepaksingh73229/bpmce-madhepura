import mongoose from 'mongoose';

export class HostelUtils {
    // ─────────────────────────────────────────────
    // FILTER BUILDER (for listing hostels/rooms)
    // ─────────────────────────────────────────────
    static buildHostelFilters(query) {
        const filters = {};

        // Active filter (default true)
        filters.isActive =
            query.isActive !== undefined ? query.isActive : true;

        if (query.hostelType) {
            filters.hostelType = query.hostelType;
        }

        if (query.search) {
            const safe = escapeRegex(query.search);
            filters.$or = [
                { name: { $regex: safe, $options: 'i' } },
                { address: { $regex: safe, $options: 'i' } },
            ];
        }

        return filters;
    }

    static buildRoomFilters(query) {
        const filters = {};

        if (query.hostelId && mongoose.Types.ObjectId.isValid(query.hostelId)) {
            filters.hostel = query.hostelId;
        }

        if (query.floorId && mongoose.Types.ObjectId.isValid(query.floorId)) {
            filters.floor = query.floorId;
        }

        if (query.type) {
            filters.type = query.type; // single / triple
        }

        if (query.availableOnly === true) {
            filters.$expr = { $lt: ['$occupiedBeds', '$capacity'] };
        }

        return filters;
    }

    // ─────────────────────────────────────────────
    // PAGINATION
    // ─────────────────────────────────────────────
    static getPaginationParams(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return { skip, limit };
    }

    // ─────────────────────────────────────────────
    // SANITIZATION
    // ─────────────────────────────────────────────
    static sanitize(data) {
        const obj = data?.toObject ? data.toObject() : data;
        if (!obj) return null;

        const { __v, ...clean } = obj;
        return clean;
    }

    // ─────────────────────────────────────────────
    // VALIDATION HELPERS
    // ─────────────────────────────────────────────

    static validateObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    static canAllocateStudent(student, hostel) {
        if (!student || !hostel) return false;

        return student.gender?.toLowerCase() === hostel.hostelType;
    }

    static hasRoomCapacity(room) {
        return room.occupiedBeds < room.capacity;
    }

    static isBedAvailable(bed) {
        return !bed.isOccupied;
    }

    // ─────────────────────────────────────────────
    // ALLOCATION HELPERS
    // ─────────────────────────────────────────────

    static prepareAllocationData({ student, hostel, room, bed }) {
        return {
            student: student._id,
            hostel: hostel._id,
            room: room._id,
            bed: bed._id,
            fromDate: new Date(),
            status: 'active',
        };
    }

    // ─────────────────────────────────────────────
    // ROOM TYPE → CAPACITY
    // ─────────────────────────────────────────────
    static getRoomCapacity(type) {
        switch (type) {
            case 'single':
                return 1;
            case 'triple':
                return 3;
            default:
                return 1;
        }
    }
}

// ─────────────────────────────────────────────
// SAFE REGEX
// ─────────────────────────────────────────────
function escapeRegex(str = '') {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}