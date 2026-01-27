"use client";

import { useState } from "react";
import { useAppointments, useCreateAppointment, useUpdateAppointment } from "@/hooks/use-appointments";
import { useServices } from "@/hooks/use-services";
import { useStaffs } from "@/hooks/use-staffs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppointmentTable } from "@/components/appointments/appointment-table";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { AppointmentFilters } from "@/components/appointments/appointment-filters";

export default function AppointmentsPage() {
    const [filters, setFilters] = useState({
        staffId: "",
        startDate: "",
        endDate: "",
    });

    const { data: appointments, isLoading: isLoadingAppointments } = useAppointments(filters);
    const { data: services } = useServices();
    const { data: staffs } = useStaffs();

    const createMutation = useCreateAppointment();
    const updateMutation = useUpdateAppointment();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const onSubmit = (values: any) => {
        if (editingItem) {
            updateMutation.mutate(
                { id: editingItem.id, data: values },
                {
                    onSuccess: () => {
                        setIsDialogOpen(false);
                        setEditingItem(null);
                    },
                }
            );
        } else {
            createMutation.mutate(values, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                },
            });
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    const clearFilters = () => {
        setFilters({
            staffId: "",
            startDate: "",
            endDate: "",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
                    <p className="text-muted-foreground">
                        Schedule and manage customer appointments.
                    </p>
                </div>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" /> Book Appointment
                </Button>
            </div>

            <AppointmentFilters
                filters={filters}
                onFilterChange={setFilters}
                onClear={clearFilters}
                staffs={staffs || []}
            />

            <AppointmentTable
                data={appointments}
                isLoading={isLoadingAppointments}
                services={services || []}
                staffs={staffs || []}
                onEdit={handleEdit}
            />

            <AppointmentForm
                isOpen={isDialogOpen}
                onClose={setIsDialogOpen}
                initialData={editingItem}
                onSubmit={onSubmit}
                services={services || []}
                staffs={staffs || []}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
}
