import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

export const useServiceTypes = () => {
    return useQuery({
        queryKey: ["service-types"],
        queryFn: async () => {
            const response = await apiClient.get("/service-types");
            return response.data.data;
        },
    });
};

export const useCreateServiceType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await apiClient.post("/service-types", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service-types"] });
            toast.success("Service type created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create service type");
        },
    });
};

export const useUpdateServiceType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await apiClient.patch(`/service-types/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service-types"] });
            toast.success("Service type updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update service type");
        },
    });
};
