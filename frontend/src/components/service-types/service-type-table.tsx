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

interface ServiceTypeTableProps {
    data: any[];
    isLoading: boolean;
    onEdit: (item: any) => void;
}

export function ServiceTypeTable({ data, isLoading, onEdit }: ServiceTypeTableProps) {
    return (
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
                    ) : data?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-8">
                                No service types found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data?.map((item: any, index: number) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
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
