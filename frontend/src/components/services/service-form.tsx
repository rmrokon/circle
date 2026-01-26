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

const serviceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    duration: z.coerce.number<number>().min(30, "Duration must be at least 30 minutes"),
    serviceTypeId: z.string().min(1, "Service Type is required"),
});

interface ServiceFormProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    initialData?: any;
    onSubmit: (values: z.infer<typeof serviceSchema>) => void;
    serviceTypes: any[];
    isSubmitting: boolean;
}

export function ServiceForm({
    isOpen,
    onClose,
    initialData,
    onSubmit,
    serviceTypes,
    isSubmitting
}: ServiceFormProps) {
    const form = useForm<z.infer<typeof serviceSchema>>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: "",
            duration: 30,
            serviceTypeId: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    duration: initialData.duration,
                    serviceTypeId: initialData.serviceTypeId || (initialData as any).service_type_id || "",
                });
            } else {
                form.reset({
                    name: "",
                    duration: 30,
                    serviceTypeId: "",
                });
            }
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = (values: z.infer<typeof serviceSchema>) => {
        onSubmit(values);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Service" : "Add Service"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update service details." : "Create a new service offering."}
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
