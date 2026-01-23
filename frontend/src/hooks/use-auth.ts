import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";
import { toast } from "react-hot-toast";

export const useLogin = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (credentials: any) => {
            const response = await apiClient.post("/credentials/login", credentials);
            return response.data.result;
        },
        onSuccess: (data) => {
            setAuth({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user: data.user,
            });
            toast.success("Login successful!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Login failed");
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async (userData: any) => {
            const response = await apiClient.post("/credentials", userData);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Registration successful! Please login.");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Registration failed");
        },
    });
};

export const useLogout = () => {
    const clearAuth = useAuthStore((state) => state.clearAuth);
    return () => {
        clearAuth();
        toast.success("Logged out");
    };
};
