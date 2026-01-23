import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

export const useStaffs = () => {
    return useQuery({
        queryKey: ["staffs"],
        queryFn: async () => {
            const response = await apiClient.get("/staffs");
            return response.data.data;
        },
    });
};

export const useCreateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (staffData: any) => {
            const response = await apiClient.post("/staffs", staffData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staffs"] });
            toast.success("Staff created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create staff");
        },
    });
};

export const useUpdateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await apiClient.patch(`/staffs/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staffs"] });
            toast.success("Staff updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update staff");
        },
    });
};
