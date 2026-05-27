import { get, post } from "@/lib/api-client";

export const authApi = {
    login: (payload) => post("/auth/login", payload),
    register: (payload) => post("/auth/register", payload),
    logout: () => post("/auth/logout"),
    me: () => get("/auth/me"),
    refreshToken: (refreshToken) => post("/auth/refresh-token", { refreshToken }),
};