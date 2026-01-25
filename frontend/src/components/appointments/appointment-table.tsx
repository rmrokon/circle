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
import toOrdinal from "@/utils/toOrdinal";

interface AppointmentTableProps {
    data: any[];
    isLoading: boolean;
    services: any[];
    staffs: any[];
    onEdit: (item: any) => void;
    actionRenderer?: (item: any) => React.ReactNode;
    isWaitingQueue?: boolean;
}

export function AppointmentTable({
    data,
    isLoading,
    services,
    staffs,
    onEdit,
    actionRenderer,
    isWaitingQueue = false
}: AppointmentTableProps) {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{isWaitingQueue ? "Queue position" : "No."}</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Staff</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                                Loading appointments...
                            </TableCell>
                        </TableRow>
                    ) : data?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                                No appointments found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data?.map((item: any, index: number) => (
                            <TableRow key={item.id}>
                                <TableCell>{isWaitingQueue ? toOrdinal(index + 1) : index + 1}</TableCell>
                                <TableCell className="font-medium">{item.customerName}</TableCell>
                                <TableCell>
                                    {services?.find((s: any) => s.id === item.serviceId)?.name || item.serviceId}
                                </TableCell>
                                <TableCell>
                                    {staffs?.find((s: any) => s.id === item.staffId)?.name || <span className="text-muted-foreground italic">Unassigned</span>}
                                </TableCell>
                                <TableCell>{new Date(item.appointmentDateTime).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            item.status === "Scheduled"
                                                ? "secondary" // Changed to secondary for blue-ish feel or stick to custom logic
                                                : item.status === "Completed"
                                                    ? "default" // Green-ish usually but default is black/primary. Let's keep custom logic if possible or use Badges.
                                                    : "destructive"
                                        }
                                        className={
                                            item.status === "Scheduled" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" :
                                                item.status === "Completed" ? "bg-green-100 text-green-700 hover:bg-green-200" :
                                                    undefined
                                        }
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {actionRenderer ? actionRenderer(item) : (
                                        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
