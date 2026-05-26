import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { getErrorMessage } from "@/lib/api-client";

export const AUTH_KEYS = {
    me: ["auth", "me"],
};

export function useMe() {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: AUTH_KEYS.me,
        queryFn: () => authApi.me(),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
}

export function useLogin() {
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: (payload) => authApi.login(payload),

        onSuccess: (res) => {
            const { user, accessToken, refreshToken } = res.data;

            setAuth(user, accessToken, refreshToken);
            toast.success(`Welcome back, ${user.name}!`);
        },

        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}

export function useRegister() {
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: (payload) => authApi.register(payload),

        onSuccess: (res) => {
            const { user, accessToken, refreshToken } = res.data;

            setAuth(user, accessToken, refreshToken);
            toast.success("Registration successful!");
        },

        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}

export function useLogout() {
    const { clearAuth } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authApi.logout(),

        onSettled: () => {
            clearAuth();
            queryClient.clear();

            toast.success("Logged out successfully");
        },
    });
}