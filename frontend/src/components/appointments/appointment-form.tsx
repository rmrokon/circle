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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";

const appointmentSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    serviceId: z.string().min(1, "Service is required"),
    staffId: z.string().optional(),
    appointmentDateTime: z.string().min(1, "Date and time is required"),
    status: z.enum(["Scheduled", "Completed", "Cancelled", "No-Show"]),
});

interface AppointmentFormProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    initialData?: any;
    onSubmit: (values: z.infer<typeof appointmentSchema>) => void;
    services: any[];
    staffs: any[];
    isSubmitting: boolean;
}

export function AppointmentForm({
    isOpen,
    onClose,
    initialData,
    onSubmit,
    services,
    staffs,
    isSubmitting
}: AppointmentFormProps) {
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

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.reset({
                    customerName: initialData.customerName || (initialData as any).customer_name || "",
                    serviceId: initialData.serviceId || (initialData as any).service_id || "",
                    staffId: initialData.staffId || (initialData as any).staff_id || "",
                    appointmentDateTime: initialData.appointmentDateTime
                        ? new Date(initialData.appointmentDateTime).toISOString().slice(0, 16)
                        : "",
                    status: initialData.status || "Scheduled",
                });
            } else {
                form.reset({
                    customerName: "",
                    serviceId: "",
                    staffId: "",
                    appointmentDateTime: "",
                    status: "Scheduled",
                });
            }
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = (values: z.infer<typeof appointmentSchema>) => {
        onSubmit(values);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Appointment" : "Book Appointment"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update appointment details." : "Schedule a new appointment for a customer."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
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
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select staff" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Staffs</SelectLabel>
                                                {staffs?.filter((s: any) => s.available === "available")?.map((s: any) => (
                                                    <SelectItem key={s.id} value={s.id}>
                                                        <div className="flex flex-col gap-[4px] p-[4px]">
                                                            <span className="text-[12px]">{s.name} ({s.appointments?.length || 0} / {s.dailyCapacity} appointments today)</span>
                                                            <Badge variant={(s.appointments?.length || 0) >= s.dailyCapacity ? "destructive" : "default"} className="text-[9px]">
                                                                {(s.appointments?.length || 0) >= s.dailyCapacity ? `${s.name} already has ${s.appointments?.length || 0} appointments today.` : "Available"}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                            <Button type="submit" disabled={isSubmitting}>
                                {initialData ? "Update" : "Book"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
