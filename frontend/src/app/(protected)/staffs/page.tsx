"use client";

import { useState } from "react";
import { useStaffs, useCreateStaff, useUpdateStaff } from "@/hooks/use-staffs";
import { useServiceTypes } from "@/hooks/use-service-types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StaffTable } from "@/components/staffs/staff-table";
import { StaffForm } from "@/components/staffs/staff-form";

export default function StaffsPage() {
    const { data: staffs, isLoading } = useStaffs();
    const createStaffMutation = useCreateStaff();
    const updateStaffMutation = useUpdateStaff();
    const { data: serviceTypes } = useServiceTypes();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any>(null);

    const onSubmit = (values: any) => {
        if (editingStaff) {
            updateStaffMutation.mutate(
                { id: editingStaff.id, data: values },
                {
                    onSuccess: () => {
                        setIsDialogOpen(false);
                        setEditingStaff(null);
                    },
                }
            );
        } else {
            createStaffMutation.mutate(values, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                },
            });
        }
    };

    const handleEdit = (staff: any) => {
        setEditingStaff(staff);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingStaff(null);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Staffs</h1>
                    <p className="text-muted-foreground">
                        Manage your staff members and their availability.
                    </p>
                </div>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" /> Add Staff
                </Button>
            </div>

            <StaffTable
                data={staffs || []}
                isLoading={isLoading}
                onEdit={handleEdit}
            />

            <StaffForm
                isOpen={isDialogOpen}
                onClose={setIsDialogOpen}
                initialData={editingStaff}
                onSubmit={onSubmit}
                serviceTypes={serviceTypes || []}
                isSubmitting={createStaffMutation.isPending || updateStaffMutation.isPending}
            />
        </div>
    );
}
