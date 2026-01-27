"use client";

import { useActivities } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
};

export default function ActivitiesPage() {
    const { data: activities, isLoading } = useActivities();

    const getBadgeVariant = (type: string) => {
        switch (type) {
            case 'APPOINTMENT_CREATED': return 'default';
            case 'APPOINTMENT_CANCELLED': return 'destructive';
            case 'QUEUE_ASSIGNED': return 'secondary';
            case 'STAFF_CREATED': return 'outline';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
                <p className="text-muted-foreground">
                    A detailed history of system activities and updates.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Activities</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y">
                            {activities?.map((activity: any) => (
                                <div key={activity.id} className="py-4 flex items-center justify-between gap-4">
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={getBadgeVariant(activity.type)}>
                                                {activity.type.replace('_', ' ')}
                                            </Badge>
                                            <span className="text-sm font-medium">{activity.message}</span>
                                        </div>
                                        {activity.metadata && (
                                            <pre className="text-[10px] text-muted-foreground bg-muted p-2 rounded mt-2 overflow-auto max-h-[100px]">
                                                {JSON.stringify(activity.metadata, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                                        {formatDateTime(new Date(activity.createdAt))}
                                    </div>
                                </div>
                            ))}
                            {activities?.length === 0 && (
                                <div className="py-8 text-center text-muted-foreground">
                                    No activities found.
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
