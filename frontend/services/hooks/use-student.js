import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentApi } from "../api/student.api";
import { getErrorMessage } from "@/lib/api-client";

export const STUDENT_KEYS = {
    all: ["students"],
    list: (filters) => ["students", "list", filters],
    detail: (id) => ["students", "detail", id],
    profile: (id) => ["students", "profile", id],
};

export function useStudents(filters) {
    return useQuery({
        queryKey: STUDENT_KEYS.list(filters),
        queryFn: () => studentApi.getAll(filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function useStudent(id) {
    return useQuery({
        queryKey: STUDENT_KEYS.detail(id),
        queryFn: () => studentApi.getById(id),
        enabled: !!id,
    });
}

export function useStudentProfile(id) {
    return useQuery({
        queryKey: STUDENT_KEYS.profile(id),
        queryFn: () => studentApi.getFullProfile(id),
        enabled: !!id,
    });
}

export function useCreateStudent() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload) =>
            studentApi.create(payload),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: STUDENT_KEYS.all,
            });

            toast.success("Student created successfully!");
        },

        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}

export function useUpdateStudent() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) =>
            studentApi.update(id, payload),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: STUDENT_KEYS.all,
            });

            toast.success("Student updated successfully!");
        },

        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}

export function useDeleteStudent() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id) =>
            studentApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: STUDENT_KEYS.all,
            });

            toast.success("Student deactivated!");
        },

        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}