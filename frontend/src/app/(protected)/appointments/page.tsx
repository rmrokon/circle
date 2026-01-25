"use client";

import { useState } from "react";
import { useAppointments, useCreateAppointment, useUpdateAppointment } from "@/hooks/use-appointments";
import { useServices } from "@/hooks/use-services";
import { useStaffs } from "@/hooks/use-staffs";
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
import { Edit, Plus, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const appointmentSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    serviceId: z.string().min(1, "Service is required"),
    staffId: z.string().optional(),
    appointmentDateTime: z.string().min(1, "Date and time is required"),
    status: z.enum(["Scheduled", "Completed", "Cancelled", "No-Show"]),
});

export default function AppointmentsPage() {
    const { data: appointments, isLoading: isLoadingAppointments } = useAppointments();
    const { data: services } = useServices();
    const { data: staffs } = useStaffs();

    const createMutation = useCreateAppointment();
    const updateMutation = useUpdateAppointment();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const form = useForm<z.infer<typeof appointmentSchema>>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            customerName: "",
            serviceId: "",
            staffId: "",
            appointmentDateTime: "",
            status: "Scheduled",
        },
    });

    const onSubmit = (values: z.infer<typeof appointmentSchema>) => {
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
            customerName: item.customerName,
            serviceId: item.serviceId,
            staffId: item.staffId,
            appointmentDateTime: new Date(item.appointmentDateTime).toISOString().slice(0, 16),
            status: item.status,
        });
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        form.reset({
            customerName: "",
            serviceId: "",
            staffId: "",
            appointmentDateTime: "",
            status: "Scheduled",
        });
        setIsDialogOpen(true);
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

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Staff</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingAppointments ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    Loading appointments...
                                </TableCell>
                            </TableRow>
                        ) : appointments?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    No appointments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            appointments?.map((item: any, index: number) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{item.customerName}</TableCell>
                                    <TableCell>
                                        {services?.find((s: any) => s.id === item.serviceId)?.name || item.serviceId}
                                    </TableCell>
                                    <TableCell>
                                        {staffs?.find((s: any) => s.id === item.staffId)?.name || item.staffId}
                                    </TableCell>
                                    <TableCell>{new Date(item.appointmentDateTime).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === "Scheduled"
                                                ? "bg-blue-100 text-blue-700"
                                                : item.status === "Completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
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
                        <DialogTitle>{editingItem ? "Edit Appointment" : "Book Appointment"}</DialogTitle>
                        <DialogDescription>
                            {editingItem ? "Update appointment details." : "Schedule a new appointment for a customer."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="customerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Customer Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jane Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="serviceId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select service" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {services?.map((s: any) => (
                                                    <SelectItem key={s.id} value={s.id}>
                                                        {s.name} ({s.duration} min)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="staffId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Staff</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select staff" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {staffs?.filter((s: any) => s.available === "available")?.map((s: any) => (
                                                    <SelectItem key={s.id} value={s.id} disabled={s.appointments?.length >= s.dailyCapacity}>
                                                        <div className="flex flex-col gap-2">
                                                            <span>{s.name} ({s.appointments?.length} / {s.dailyCapacity} appointments today)</span>
                                                            <Badge variant={s.appointments?.length >= s.dailyCapacity ? "destructive" : "default"}>
                                                                {s.appointments?.length >= s.dailyCapacity ? `${s.name} already has ${s.appointments?.length} appointments today.` : "Available"}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="appointmentDateTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date & Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                <SelectItem value="No-Show">No-Show</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                    {editingItem ? "Update" : "Book"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
