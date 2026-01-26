"use client";

import { useState } from "react";
import { useServices, useCreateService, useUpdateService } from "@/hooks/use-services";
import { useServiceTypes } from "@/hooks/use-service-types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceTable } from "@/components/services/service-table";
import { ServiceForm } from "@/components/services/service-form";

export default function ServicesPage() {
    const { data: services, isLoading: isLoadingServices } = useServices();
    const { data: serviceTypes } = useServiceTypes();
    const createMutation = useCreateService();
    const updateMutation = useUpdateService();

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                    <p className="text-muted-foreground">
                        Manage the services provided by your business.
                    </p>
                </div>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </div>

            <ServiceTable
                data={services}
                isLoading={isLoadingServices}
                serviceTypes={serviceTypes || []}
                onEdit={handleEdit}
            />

            <ServiceForm
                isOpen={isDialogOpen}
                onClose={setIsDialogOpen}
                initialData={editingItem}
                onSubmit={onSubmit}
                serviceTypes={serviceTypes || []}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
}
