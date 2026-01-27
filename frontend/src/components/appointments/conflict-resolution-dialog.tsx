import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConflictResolutionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onPickAnotherStaff: () => void;
    onChangeTime: () => void;
}

export function ConflictResolutionDialog({
    isOpen,
    onClose,
    onPickAnotherStaff,
    onChangeTime,
}: ConflictResolutionDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-destructive">Time Conflict Detected</DialogTitle>
                    <DialogDescription>
                        This staff member already has an appointment at this time.
                        You can either Pick another staff or Change time.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onPickAnotherStaff} className="w-full sm:w-auto">
                        Pick another staff
                    </Button>
                    <Button onClick={onChangeTime} className="w-full sm:w-auto">
                        Change time
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
