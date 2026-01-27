"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";
import { useDashboardStats, useRecentActivities } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutDashboard, Users, Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
};

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
    const { data: recentActivities, isLoading: isLoadingActivities } = useRecentActivities(5);

    const statCards = [
        {
            title: "Total Today",
            value: stats?.totalToday || 0,
            icon: Calendar,
            color: "text-blue-600",
            description: "Total appointments scheduled today"
        },
        {
            title: "Completed",
            value: stats?.completedToday || 0,
            icon: CheckCircle2,
            color: "text-green-600",
            description: "Appointments finished today"
        },
        {
            title: "Pending",
            value: stats?.pendingToday || 0,
            icon: Clock,
            color: "text-orange-600",
            description: "Remaining tasks for today"
        },
        {
            title: "Waiting Queue",
            value: stats?.waitingQueueCount || 0,
            icon: AlertCircle,
            color: "text-red-600",
            description: "Appointments needing assignment"
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.email}. Here&apos;s what&apos;s happening today.
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Staff Load Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Staff Load Summary</CardTitle>
                        <CardDescription>Daily capacity utilization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {stats?.staffLoad?.map((staff: any) => (
                                <div key={staff.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="font-medium">{staff.name}</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">{staff.current} / {staff.limit}</span>
                                            <Badge variant={staff.status === 'Booked' ? 'destructive' : 'secondary'} className="text-[10px] px-1 h-4">
                                                {staff.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all",
                                                staff.current >= staff.limit ? "bg-red-500" : "bg-blue-600"
                                            )}
                                            style={{ width: `${Math.min((staff.current / staff.limit) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {(!stats?.staffLoad || stats?.staffLoad.length === 0) && (
                                <div className="text-sm text-muted-foreground text-center py-4">
                                    No staff data available.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>Latest system updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities?.map((activity: any) => (
                                <div key={activity.id} className="flex gap-4 text-sm border-l-2 pl-4 border-muted">
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium leading-none">{activity.message}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatTime(new Date(activity.createdAt))} • {activity.type.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(!recentActivities || recentActivities.length === 0) && (
                                <div className="text-sm text-muted-foreground text-center py-4">
                                    No recent activities.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}