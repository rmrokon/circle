import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";
import { IStaff } from "../types/staff";

export const useStaffs = () => {
    return useQuery({
        queryKey: ["staffs"],
        queryFn: async () => {
            const response: { data: { result: IStaff[] } } = await apiClient.get("/staffs");
            return response.data.result;
        },
    });
};

export const useCreateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (staffData: Partial<IStaff>) => {
            const response: { data: { result: IStaff } } = await apiClient.post("/staffs", staffData);
            return response.data.result;
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
        mutationFn: async ({ id, data }: { id: string; data: Partial<IStaff> }) => {
            const response: { data: { result: IStaff } } = await apiClient.patch(`/staffs/${id}`, data);
            return response.data.result;
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
