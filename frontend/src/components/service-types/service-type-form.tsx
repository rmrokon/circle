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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";

const serviceTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

interface ServiceTypeFormProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    initialData?: any;
    onSubmit: (values: z.infer<typeof serviceTypeSchema>) => void;
    isSubmitting: boolean;
}

export function ServiceTypeForm({
    isOpen,
    onClose,
    initialData,
    onSubmit,
    isSubmitting
}: ServiceTypeFormProps) {
    const form = useForm<z.infer<typeof serviceTypeSchema>>({
        resolver: zodResolver(serviceTypeSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                });
            } else {
                form.reset({
                    name: "",
                });
            }
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = (values: z.infer<typeof serviceTypeSchema>) => {
        onSubmit(values);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Service Type" : "Add Service Type"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update the service type name." : "Create a new category for services."}
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
                                        <Input placeholder="General" {...field} />
                                    </FormControl>
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
