import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ServiceTableProps {
    data: any[];
    isLoading: boolean;
    serviceTypes: any[];
    onEdit: (item: any) => void;
}

export function ServiceTable({ data, isLoading, serviceTypes, onEdit }: ServiceTableProps) {
    return (
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
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                                Loading services...
                            </TableCell>
                        </TableRow>
                    ) : data?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                                No services found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data?.map((item: any, index: number) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.duration}</TableCell>
                                <TableCell>
                                    {serviceTypes?.find((t: any) => t.id === item.serviceTypeId)?.name || item.serviceTypeId}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
