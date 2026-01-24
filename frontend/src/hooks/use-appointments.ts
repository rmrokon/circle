import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

export const useAppointments = () => {
    return useQuery({
        queryKey: ["appointments"],
        queryFn: async () => {
            const response = await apiClient.get("/appointments");
            return response.data.result;
        },
    });
};

export const useCreateAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await apiClient.post("/appointments", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            toast.success("Appointment booked successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to book appointment");
        },
    });
};

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await apiClient.patch(`/appointments/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            toast.success("Appointment updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update appointment");
        },
    });
};
