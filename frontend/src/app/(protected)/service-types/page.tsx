"use client";

import { useState } from "react";
import { useServiceTypes, useCreateServiceType, useUpdateServiceType } from "@/hooks/use-service-types";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Plus } from "lucide-react";

const serviceTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

export default function ServiceTypesPage() {
    const { data: serviceTypes, isLoading } = useServiceTypes();
    const createMutation = useCreateServiceType();
    const updateMutation = useUpdateServiceType();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const form = useForm<z.infer<typeof serviceTypeSchema>>({
        resolver: zodResolver(serviceTypeSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = (values: z.infer<typeof serviceTypeSchema>) => {
        if (editingItem) {
            updateMutation.mutate(
                { id: editingItem.id, data: values },
                {
                    onSuccess: () => {
                        setIsDialogOpen(false);
                        setEditingItem(null);
                        form.reset();
                    },
                }
            );
        } else {
            createMutation.mutate(values, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        form.reset({
            name: item.name,
        });
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        form.reset({
            name: "",
        });
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

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8">
                                    Loading service types...
                                </TableCell>
                            </TableRow>
                        ) : serviceTypes?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8">
                                    No service types found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            serviceTypes?.map((item: any, index: number) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Service Type" : "Add Service Type"}</DialogTitle>
                        <DialogDescription>
                            {editingItem ? "Update the service type name." : "Create a new category for services."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="General" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                    {editingItem ? "Update" : "Create"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
