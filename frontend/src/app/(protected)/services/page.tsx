"use client";

import { useState } from "react";
import { useServices, useCreateService, useUpdateService } from "@/hooks/use-services";
import { useServiceTypes } from "@/hooks/use-service-types";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Plus } from "lucide-react";

const serviceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
    serviceTypeId: z.string().min(1, "Service Type is required"),
});

export default function ServicesPage() {
    const { data: services, isLoading: isLoadingServices } = useServices();
    const { data: serviceTypes, isLoading: isLoadingTypes } = useServiceTypes();
    const createMutation = useCreateService();
    const updateMutation = useUpdateService();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const form = useForm<z.infer<typeof serviceSchema>>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: "",
            duration: 30,
            serviceTypeId: "",
        },
    });

    const onSubmit = (values: z.infer<typeof serviceSchema>) => {
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
            duration: item.duration,
            serviceTypeId: item.serviceTypeId,
        });
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        form.reset({
            name: "",
            duration: 30,
            serviceTypeId: "",
        });
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

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Duration (min)</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingServices ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Loading services...
                                </TableCell>
                            </TableRow>
                        ) : services?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    No services found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            services?.map((item: any, index: number) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.duration}</TableCell>
                                    <TableCell>
                                        {serviceTypes?.find((t: any) => t.id === item.serviceTypeId)?.name || item.serviceTypeId}
                                    </TableCell>
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
                        <DialogTitle>{editingItem ? "Edit Service" : "Add Service"}</DialogTitle>
                        <DialogDescription>
                            {editingItem ? "Update service details." : "Create a new service offering."}
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
                                            <Input placeholder="Massage therapy" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration (minutes)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="serviceTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {serviceTypes?.map((t: any) => (
                                                    <SelectItem key={t.id} value={t.id}>
                                                        {t.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
