"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, UserCog, Briefcase, Calendar } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuthStore();

    const stats = [
        { title: "Total Staffs", value: "0", icon: UserCog, color: "text-blue-600" },
        { title: "Service Types", value: "0", icon: Briefcase, color: "text-green-600" },
        { title: "All Services", value: "0", icon: LayoutDashboard, color: "text-purple-600" },
        { title: "Appointments", value: "0", icon: Calendar, color: "text-orange-600" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user?.email}. Here&apos;s an overview of your activity.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
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
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}