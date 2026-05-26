import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// ── Request interceptor ────────────────────────────────────
apiClient.interceptors.request.use(
    (config) => {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("accessToken")
                : null;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor ───────────────────────────────────
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken =
                typeof window !== "undefined"
                    ? localStorage.getItem("refreshToken")
                    : null;

            if (refreshToken) {
                try {
                    const { data } = await axios.post(
                        `${BASE_URL}/auth/refresh-token`,
                        {
                            refreshToken,
                        }
                    );

                    const {
                        accessToken,
                        refreshToken: newRefresh,
                    } = data.data;

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", newRefresh);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }

                    return apiClient(originalRequest);
                } 
                catch {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login";
                }
            } 
            else {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

// ── Generic API helpers ────────────────────────────────────
export async function get(url, params) {
    const { data } = await apiClient.get(url, { params });
    return data;
}

export async function post(url, body) {
    const { data } = await apiClient.post(url, body);
    return data;
}

export async function patch(url, body) {
    const { data } = await apiClient.patch(url, body);
    return data;
}

export async function del(url) {
    const { data } = await apiClient.delete(url);
    return data;
}

export function getErrorMessage(error) {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
}