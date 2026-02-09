"use client";

import { useState } from "react";
import { useAppointments, useUpdateAppointment } from "@/hooks/use-appointments";
import { useServices } from "@/hooks/use-services";
import { useStaffs } from "@/hooks/use-staffs";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { AppointmentTable } from "@/components/appointments/appointment-table";
import { AssignStaffModal } from "@/components/appointments/assign-staff-modal";

export default function WaitingQueuePage() {
    const { data: appointments, isLoading: isLoadingAppointments } = useAppointments({ unassigned: true });
    const { data: services } = useServices();
    const { data: staffs } = useStaffs();

    const updateMutation = useUpdateAppointment();

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [selectedServiceTypeId, setSelectedServiceTypeId] = useState<string | null>(null);

    const handleAssignClick = (item: any) => {
        setSelectedAppointmentId(item.id);
        const service = services?.find((s: any) => s.id === item.serviceId);
        setSelectedServiceTypeId(service?.serviceTypeId || null);
        setIsAssignModalOpen(true);
    };

    const handleAssignStaff = (staffId: string) => {
        if (selectedAppointmentId) {
            updateMutation.mutate(
                {
                    id: selectedAppointmentId,
                    data: { staffId }
                },
                {
                    onSuccess: () => {
                        setIsAssignModalOpen(false);
                        setSelectedAppointmentId(null);
                    },
                }
            );
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Waiting Queue</h1>
                <p className="text-muted-foreground">
                    Appointments waiting for staff assignment.
                </p>
            </div>

            <AppointmentTable
                data={appointments}
                isLoading={isLoadingAppointments}
                services={services || []}
                staffs={staffs || []}
                onEdit={() => { }} // No edit functionality in this view
                isWaitingQueue={true}
                actionRenderer={(item: any) => (
                    <Button size="sm" onClick={() => handleAssignClick(item)}>
                        <UserPlus className="mr-2 h-4 w-4" /> Assign Staff
                    </Button>
                )}
            />

            <AssignStaffModal
                isOpen={isAssignModalOpen}
                onClose={setIsAssignModalOpen}
                staffs={staffs || []}
                onAssign={handleAssignStaff}
                isAssigning={updateMutation.isPending}
                serviceTypeId={selectedServiceTypeId || undefined}
            />
        </div>
    );
}
