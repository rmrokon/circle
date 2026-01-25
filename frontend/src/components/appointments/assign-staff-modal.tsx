import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search } from "lucide-react";

interface AssignStaffModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    staffs: any[];
    onAssign: (staffId: string) => void;
    isAssigning: boolean;
}

export function AssignStaffModal({
    isOpen,
    onClose,
    staffs,
    onAssign,
    isAssigning
}: AssignStaffModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

    const filteredStaffs = staffs?.filter(staff =>
        (staff.available === "available") &&
        staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssign = () => {
        if (selectedStaffId) {
            onAssign(selectedStaffId);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Staff</DialogTitle>
                    <DialogDescription>
                        Select a staff member to assign to this appointment.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search staff..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>

                    <div className="h-[300px] overflow-y-auto border rounded-md p-2 space-y-2">
                        {filteredStaffs?.length === 0 ? (
                            <p className="text-sm text-center text-muted-foreground py-4">No available staff found.</p>
                        ) : (
                            filteredStaffs?.map((staff) => (
                                <div
                                    key={staff.id}
                                    className={`p-3 rounded-md border cursor-pointer transition-colors flex items-center justify-between ${selectedStaffId === staff.id
                                        ? "border-primary bg-primary/5"
                                        : "hover:bg-muted"
                                        }`}
                                    onClick={() => setSelectedStaffId(staff.id)}
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">{staff.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {staff.appointments?.length || 0} / {staff.dailyCapacity} appointments
                                        </span>
                                    </div>
                                    <Badge variant={(staff.appointments?.length || 0) >= staff.dailyCapacity ? "destructive" : "secondary"}>
                                        {(staff.appointments?.length || 0) >= staff.dailyCapacity ? "Full" : "Available"}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onClose(false)}>Cancel</Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedStaffId || isAssigning}
                    >
                        {isAssigning ? "Assigning..." : "Assign Staff"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
