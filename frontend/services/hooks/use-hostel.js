import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    hostelApi,
    floorApi,
    roomApi,
    bedApi,
    allocationApi,
    staffApi,
    studentApi,
} from "../api/hostel.api";

import { getErrorMessage } from "@/lib/api-client";

export const HOSTEL_KEYS = {
    all: ["hostels"],
    list: (f) => ["hostels", "list", f],
    detail: (id) => ["hostels", "detail", id],
    rooms: (f) => ["rooms", f],
    floors: (hostelId) => ["floors", hostelId],
};

// ── Hostels ───────────────────────────────────────────────
export function useHostels(filters) {
    return useQuery({
        queryKey: HOSTEL_KEYS.list(filters),

        queryFn: () => hostelApi.getAll(filters),

        staleTime: 2 * 60 * 1000,
    });
}

export function useHostel(id) {
    return useQuery({
        queryKey: HOSTEL_KEYS.detail(id),

        queryFn: () => hostelApi.getById(id),

        enabled: !!id,
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, any>} */
export function useCreateHostel() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (p) => hostelApi.create(p),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: HOSTEL_KEYS.all,
            });

            toast.success("Hostel created!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, { id: string, payload: any }>} */
export function useUpdateHostel() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) =>
            hostelApi.update(id, payload),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: HOSTEL_KEYS.all,
            });

            toast.success("Hostel updated!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, string>} */
export function useDeleteHostel() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id) => hostelApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: HOSTEL_KEYS.all,
            });

            toast.success("Hostel deactivated!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

// ── Floors ────────────────────────────────────────────────
/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, any>} */
export function useCreateFloor() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (p) => floorApi.create(p),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["rooms"],
            });
            qc.invalidateQueries({
                queryKey: ["floors"],
            });

            toast.success("Floor created!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, { id: string, payload: any }>} */
export function useUpdateFloor() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) =>
            floorApi.update(id, payload),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["rooms"],
            });
            qc.invalidateQueries({
                queryKey: ["floors"],
            });

            toast.success("Floor updated!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, string>} */
export function useDeleteFloor() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id) => floorApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["rooms"],
            });
            qc.invalidateQueries({
                queryKey: ["floors"],
            });

            toast.success("Floor deleted!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

export function useFloors(hostelId, filters) {
    return useQuery({
        queryKey: HOSTEL_KEYS.floors(hostelId),

        queryFn: () =>
            floorApi.getFloorsByHostel(hostelId || "", filters),

        staleTime: 60 * 1000,

        enabled: !!hostelId,
    });
}

// ── Rooms ─────────────────────────────────────────────────
export function useRoomsByHostel(hostelId, filters) {
    return useQuery({
        queryKey: ["rooms", "byHostel", hostelId, filters],

        queryFn: () =>
            roomApi.getByHostel(hostelId || "", filters),

        staleTime: 60 * 1000,

        enabled: !!hostelId,
    });
}

export function useRoomsByStatus(hostelId, status) {
    return useQuery({
        queryKey: ["rooms", "byStatus", hostelId, status],

        queryFn: () =>
            roomApi.getByStatus(hostelId || "", status || ""),

        staleTime: 60 * 1000,

        enabled: !!hostelId && !!status,
    });
}

export function useRooms(filters) {
    return useQuery({
        queryKey: HOSTEL_KEYS.rooms(filters),

        queryFn: () => roomApi.getAll(filters),

        staleTime: 60 * 1000,

        enabled:
            filters?.hostelId !== "" &&
            filters?.hostelId !== undefined
                ? true
                : filters?.hostelId === undefined,
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, any>} */
export function useCreateRoom() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (p) => roomApi.create(p),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["rooms"],
            });

            toast.success("Room created!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, { id: string, payload: any }>} */
export function useUpdateRoom() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) =>
            roomApi.update(id, payload),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["rooms"],
            });

            toast.success("Room updated!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

// ── Beds ──────────────────────────────────────────────────
/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, any>} */
export function useCreateBed() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (p) => bedApi.create(p),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["rooms"],
            });

            toast.success("Bed created!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, { id: string, payload: any }>} */
export function useUpdateBed() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) =>
            bedApi.update(id, payload),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["rooms"],
            });

            toast.success("Bed updated!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

// ── Allocations ───────────────────────────────────────────
export function useAllocations(filters) {
    return useQuery({
        queryKey: ["allocations", filters],
        queryFn: () => allocationApi.getAll(filters),
        staleTime: 60 * 1000,
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, any>} */
export function useAllocateRoom() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (p) => allocationApi.allocate(p),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["rooms"],
            });

            qc.invalidateQueries({
                queryKey: ["students"],
            });

            toast.success("Room allocated!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

/**
 * @returns {import('@tanstack/react-query').UseMutationResult<any, any, { studentId: string }>}
 */
export function useVacateRoom() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (p) => allocationApi.vacate(p),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["rooms"],
            });

            qc.invalidateQueries({
                queryKey: ["students"],
            });

            toast.success("Room vacated!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, any>} */
export function useShiftRoom() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (p) => allocationApi.shift(p),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["rooms"],
            });

            qc.invalidateQueries({
                queryKey: ["students"],
            });

            toast.success("Room shifted!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

// ── Staff ─────────────────────────────────────────────────
export function useStaffByHostel(hostelId, role) {
    return useQuery({
        queryKey: ["staff", "byHostel", hostelId, role],

        queryFn: () =>
            staffApi.getByHostel(hostelId || "", role),

        staleTime: 5 * 60 * 1000,

        enabled: !!hostelId,
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, any>} */
export function useCreateStaff() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (p) => staffApi.create(p),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["staff"],
            });

            toast.success("Staff added!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, { hostelId: string } & any>} */
export function useCreateStaffByHostel() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ hostelId, ...payload }) =>
            staffApi.createStaffByHostel(hostelId, payload),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["staff", "newStaff"],
            });

            toast.success("Staff added!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, { id: string, payload: any }>} */
export function useUpdateStaff() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) =>
            staffApi.update(id, payload),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["staff"],
            });

            toast.success("Staff updated!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

/** @returns {import('@tanstack/react-query').UseMutationResult<any, any, string>} */
export function useDeleteStaff() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id) => staffApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["staff"],
            });

            toast.success("Staff removed!");
        },

        onError: (e) => {
            toast.error(getErrorMessage(e));
        },
    });
}

// ── Students ─────────────────────────────────────────────
export function useStudentsByHostel(hostelId, filters) {
    return useQuery({
        queryKey: ["students", "byHostel", hostelId, filters],

        queryFn: () =>
            studentApi.getByHostel(hostelId || "", filters),

        staleTime: 2 * 60 * 1000,

        enabled: !!hostelId,
    });
}