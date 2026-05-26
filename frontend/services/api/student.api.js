import { get, post, patch, del } from "@/lib/api-client";
import { buildQueryString } from "@/lib/utils";

export const studentApi = {
    getAll: (filters) => {
        const qs = buildQueryString(filters || {});
        return get(`/students${qs ? `?${qs}` : ""}`);
    },

    getById: (id) =>
        get(`/students/${id}`),

    getFullProfile: (id) =>
        get(`/students/${id}/full-profile`),

    create: (payload) =>
        post("/students", payload),

    update: (id, payload) =>
        patch(`/students/${id}`, payload),

    delete: (id) =>
        del(`/students/${id}`),
};