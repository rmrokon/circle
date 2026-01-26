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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { IStaff, StaffAvailablityStatus } from "@/types/staff";

const staffSchema = z.object({
    name: z.string().min(1, "Name is required"),
    dailyCapacity: z.coerce.number<number>().min(1, "Capacity must be at least 1"),
    available: z.enum(StaffAvailablityStatus),
    serviceTypeId: z.string().min(1, "Service type is required"),
});

interface StaffFormProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    initialData?: IStaff;
    onSubmit: (values: z.infer<typeof staffSchema>) => void;
    serviceTypes: any[];
    isSubmitting: boolean;
}

export function StaffForm({
    isOpen,
    onClose,
    initialData,
    onSubmit,
    serviceTypes,
    isSubmitting
}: StaffFormProps) {
    const form = useForm<z.infer<typeof staffSchema>>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            name: "",
            dailyCapacity: 5,
            available: StaffAvailablityStatus.available,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                console.log({ initialData });
                form.reset({
                    name: initialData.name,
                    dailyCapacity: initialData.dailyCapacity,
                    available: initialData.available,
                    serviceTypeId: initialData.serviceTypes[0]?.id,
                });
            } else {
                form.reset({
                    name: "",
                    dailyCapacity: 5,
                    available: StaffAvailablityStatus.available,
                });
            }
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = (values: z.infer<typeof staffSchema>) => {
        console.log({ values });
        onSubmit(values);
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Staff" : "Add Staff"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update your staff member details." : "Add a new staff member to the system."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
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
                            name="dailyCapacity"
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                            name="serviceTypeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} defaultValue="test">
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={initialData?.serviceTypes[0]?.name} color="text-muted-foreground" />
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
                            <Button type="submit" disabled={isSubmitting}>
                                {initialData ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
