import { get, post, patch, del } from "@/lib/api-client";
import { buildQueryString } from "@/lib/utils";

export const userApi = {
    getAll: (filters) => {
        const qs = buildQueryString(filters || {});
        return get(`/users${qs ? `?${qs}` : ""}`);
    },

    getById: (id) => get(`/users/${id}`),

    create: (payload) => post("/users", payload),

    update: (id, payload) => patch(`/users/${id}`, payload),

    delete: (id) => del(`/users/${id}`),

    assignRoles: (id, roles) => post(`/users/${id}/roles`, { roles }),
};
