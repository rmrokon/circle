import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AppointmentFiltersProps {
    filters: {
        staffId: string;
        startDate: string;
        endDate: string;
    };
    onFilterChange: (filters: any) => void;
    onClear: () => void;
    staffs: any[];
}

export function AppointmentFilters({ filters, onFilterChange, onClear, staffs }: AppointmentFiltersProps) {
    return (
        <div className="flex flex-wrap items-end gap-4 p-4 rounded-lg border bg-background shadow-sm">
            <div className="space-y-2">
                <label className="text-sm font-medium">Staff Member</label>
                <div className="w-[200px]">
                    <Select
                        value={filters.staffId}
                        onValueChange={(val) => onFilterChange({ ...filters, staffId: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Staff" />
                        </SelectTrigger>
                        <SelectContent>
                            {staffs?.map((s: any) => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">From Date</label>
                <input
                    type="date"
                    className="flex h-10 w-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={filters.startDate}
                    onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <input
                    type="date"
                    className="flex h-10 w-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={filters.endDate}
                    onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
                />
            </div>

            <Button variant="ghost" onClick={onClear} className="h-10">
                Clear Filters
            </Button>
        </div>
    );
}
