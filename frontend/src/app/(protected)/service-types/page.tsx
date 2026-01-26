"use client";

import { useState } from "react";
import { useServiceTypes, useCreateServiceType, useUpdateServiceType } from "@/hooks/use-service-types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceTypeTable } from "@/components/service-types/service-type-table";
import { ServiceTypeForm } from "@/components/service-types/service-type-form";

export default function ServiceTypesPage() {
    const { data: serviceTypes, isLoading } = useServiceTypes();
    const createMutation = useCreateServiceType();
    const updateMutation = useUpdateServiceType();

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
                    <h1 className="text-3xl font-bold tracking-tight">Service Types</h1>
                    <p className="text-muted-foreground">
                        Manage the categories/types of services offered.
                    </p>
                </div>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" /> Add Service Type
                </Button>
            </div>

            <ServiceTypeTable
                data={serviceTypes}
                isLoading={isLoading}
                onEdit={handleEdit}
            />

            <ServiceTypeForm
                isOpen={isDialogOpen}
                onClose={setIsDialogOpen}
                initialData={editingItem}
                onSubmit={onSubmit}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
}
