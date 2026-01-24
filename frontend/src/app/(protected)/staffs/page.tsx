"use client";

import { useState } from "react";
import { useStaffs, useCreateStaff, useUpdateStaff } from "@/hooks/use-staffs";
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
import { Edit, Plus, UserPlus } from "lucide-react";
import { StaffAvailablityStatus } from "../../../../types/staff";
import { useServiceTypes } from "@/hooks/use-service-types";

const staffSchema = z.object({
    name: z.string().min(1, "Name is required"),
    daily_capacity: z.coerce.number<number>().min(1, "Capacity must be at least 1"),
    available: z.enum(StaffAvailablityStatus),
    service_type_id: z.string().min(1, "Service type is required"),
});

export default function StaffsPage() {
    const { data: staffs, isLoading } = useStaffs();
    const createStaffMutation = useCreateStaff();
    const updateStaffMutation = useUpdateStaff();
    const { data: serviceTypes, isLoading: isLoadingTypes } = useServiceTypes();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any>(null);

    const form = useForm<z.infer<typeof staffSchema>>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            name: "",
            daily_capacity: 5,
            available: StaffAvailablityStatus.available,
            service_type_id: "",
        },
    });

    const onSubmit = (values: z.infer<typeof staffSchema>) => {
        console.log({ values });
        // return;
        if (editingStaff) {
            updateStaffMutation.mutate(
                { id: editingStaff.id, data: values },
                {
                    onSuccess: () => {
                        setIsDialogOpen(false);
                        setEditingStaff(null);
                        form.reset();
                    },
                }
            );
        } else {
            createStaffMutation.mutate(values, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleEdit = (staff: any) => {
        setEditingStaff(staff);
        form.reset({
            name: staff.name,
            daily_capacity: staff.daily_capacity,
            available: staff.available,
        });
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingStaff(null);
        form.reset({
            name: "",
            daily_capacity: 5,
            available: StaffAvailablityStatus.available,
        });
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

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Daily Capacity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Loading staffs...
                                </TableCell>
                            </TableRow>
                        ) : staffs?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    No staffs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            staffs?.map((staff: any, index: number) => (
                                <TableRow key={staff.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{staff.name}</TableCell>
                                    <TableCell>{staff.daily_capacity}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${staff.available === "available"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {staff.available === "available" ? "Available" : "On Leave"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(staff)}>
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
                        <DialogTitle>{editingStaff ? "Edit Staff" : "Add Staff"}</DialogTitle>
                        <DialogDescription>
                            {editingStaff ? "Update your staff member details." : "Add a new staff member to the system."}
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
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="daily_capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Daily Capacity</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="available"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Availability</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="available">Available</SelectItem>
                                                <SelectItem value="onLeave">On Leave</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="service_type_id"
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
                                <Button type="submit" disabled={createStaffMutation.isPending || updateStaffMutation.isPending}>
                                    {editingStaff ? "Update" : "Create"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
