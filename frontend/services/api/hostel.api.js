import { get, post, patch, del } from "@/lib/api-client";
import { buildQueryString } from "@/lib/utils";

export const hostelApi = {
    getAll: async (filters) => {
        const qs = buildQueryString(filters || {});
        const res = await get(`/hostels${qs ? `?${qs}` : ""}`);
        console.log("[hostelApi.getAll] response:", res);
        return res;
    },

    getById: (id) =>
        get(`/hostels/${id}`),

    create: (payload) =>
        post("/hostels", payload),

    update: (id, payload) =>
        patch(`/hostels/${id}`, payload),

    delete: (id) =>
        del(`/hostels/${id}`),
};

export const floorApi = {
    // Backend provides GET /hostels/:hostelId/floors
    getFloorsByHostel: (hostelId, filters) => {
        const qs = buildQueryString(filters || {});
        return get(`/hostels/${hostelId}/floors${qs ? `?${qs}` : ""}`);
    },

    create: (payload) => post("/hostels/floors", payload),
    update: (id, payload) => patch(`/hostels/floors/${id}`, payload),
};

export const roomApi = {
    getAll: (filters) => {
        const qs = buildQueryString(filters || {});
        return get(`/hostels/rooms${qs ? `?${qs}` : ""}`);
    },

    getByHostel: (hostelId, filters) => {
        const qs = buildQueryString(filters || {});
        return get(`/hostels/${hostelId}/rooms${qs ? `?${qs}` : ""}`);
    },

    getByStatus: (hostelId, status) => {
        return get(`/hostels/${hostelId}/rooms/status/${status}`);
    },

    create: (payload) =>
        post("/hostels/rooms", payload),

    update: (id, payload) =>
        patch(`/hostels/rooms/${id}`, payload),
};

export const bedApi = {
    create: (payload) =>
        post("/hostels/beds", payload),

    update: (id, payload) =>
        patch(`/hostels/beds/${id}`, payload),
};

export const staffApi = {
    getByHostel: (hostelId, role) => {
        const qs = role ? `?role=${role}` : "";
        return get(`/hostels/${hostelId}/staff${qs}`);
    },

    createStaffByHostel: (hostelId, payload) => {
        post(`/hostels/${hostelId}`, payload);
    },

    create: (payload) =>
        post("/hostels/staff", payload),

    update: (id, payload) =>
        patch(`/hostels/staff/${id}`, payload),

    delete: (id) =>
        del(`/hostels/staff/${id}`),
};

export const studentApi = {
    getByHostel: (hostelId, filters) => {
        const qs = buildQueryString(filters || {});
        return get(`/hostels/${hostelId}/students${qs ? `?${qs}` : ""}`);
    },
};

export const allocationApi = {
    allocate: (payload) =>
        post("/hostels/allocate", payload),

    vacate: (payload) =>
        post("/hostels/vacate", payload),

    shift: (payload) =>
        post("/hostels/shift", payload),
};