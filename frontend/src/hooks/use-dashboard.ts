import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const response = await apiClient.get("/stats/dashboard");
            return response.data.result;
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });
};

export const useActivities = (params?: any) => {
    return useQuery({
        queryKey: ["activities", params],
        queryFn: async () => {
            const response = await apiClient.get("/activities", { params });
            return response.data.result;
        },
    });
};

export const useRecentActivities = (limit: number = 10) => {
    return useQuery({
        queryKey: ["recent-activities", limit],
        queryFn: async () => {
            const response = await apiClient.get("/activities/recent", { params: { limit } });
            return response.data.result;
        },
        refetchInterval: 10000, // Refresh every 10 seconds for real-time feel
    });
};
