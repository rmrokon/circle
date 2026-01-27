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
import { Badge } from "@/components/ui/badge";
import { IStaff } from "@/types/staff";

interface StaffTableProps {
    data: IStaff[];
    isLoading: boolean;
    onEdit: (item: IStaff) => void;
}

export function StaffTable({ data, isLoading, onEdit }: StaffTableProps) {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Daily Capacity</TableHead>
                        <TableHead>Today&apos;s Appointments</TableHead>
                        <TableHead>Status</TableHead>
                        {!!data?.length && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                                Loading staffs...
                            </TableCell>
                        </TableRow>
                    ) : data?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                                No staffs found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data?.map((staff: any, index: number) => (
                            <TableRow key={staff.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{staff.name}</TableCell>
                                <TableCell>{staff.dailyCapacity}</TableCell>
                                <TableCell>{staff.appointments?.length || 0}</TableCell>
                                <TableCell>
                                    <Badge variant={staff.available === "available" ? "default" : "destructive"}>
                                        {staff.available === "available" ? "Available" : "On Leave"}
                                    </Badge>
                                </TableCell>
                                {!!data?.length && (
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => onEdit(staff)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
