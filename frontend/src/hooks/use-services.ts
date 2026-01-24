import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

export const useServices = () => {
    return useQuery({
        queryKey: ["services"],
        queryFn: async () => {
            const response = await apiClient.get("/services");
            return response.data.result;
        },
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await apiClient.post("/services", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            toast.success("Service created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create service");
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await apiClient.patch(`/services/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            toast.success("Service updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update service");
        },
    });
};
