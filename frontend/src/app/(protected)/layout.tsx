"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useLogout } from "@/hooks/use-auth";
import { LayoutDashboard, Users, UserCog, Briefcase, Calendar, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Staffs", href: "/staffs", icon: UserCog },
    { name: "Service Types", href: "/service-types", icon: Briefcase },
    { name: "Services", href: "/services", icon: Users },
    { name: "Appointments", href: "/appointments", icon: Calendar },
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { accessToken, isHydrated, user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const logout = useLogout();

    useEffect(() => {
        if (isHydrated && !accessToken) {
            router.replace("/login");
        }
    }, [accessToken, isHydrated, router]);

    if (!isHydrated || !accessToken) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-16 border-b">
                        <span className="text-xl font-bold">Circle App</span>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                        pathname === item.href
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-4 border-t">
                        <div className="flex items-center mb-4">
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
