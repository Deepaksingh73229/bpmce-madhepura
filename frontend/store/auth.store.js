"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken, refreshToken) => {
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                });
            },

            updateTokens: (accessToken, refreshToken) => {
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                set({
                    accessToken,
                    refreshToken,
                });
            },

            clearAuth: () => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            hasPermission: (permission) => {
                const { user } = get();

                if (!user) return false;

                return user.roles.some((role) =>
                    role.permissions?.includes(permission)
                );
            },

            hasRole: (roleName) => {
                const { user } = get();

                if (!user) return false;

                return user.roles.some(
                    (role) => role.name === roleName
                );
            },
        }),
        
        {
            name: "bpmceHostel-auth-v2",
            storage: createJSONStorage(() => localStorage),

            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);