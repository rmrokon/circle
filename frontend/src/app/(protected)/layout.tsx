"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { accessToken, isHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isHydrated && !accessToken) {
            router.replace("/login");
        }
    }, [accessToken, isHydrated, router]);

    if (!isHydrated || !accessToken) {
        return null;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-screen">
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-background sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />

                        </div>
                        <ThemeSwitcher />
                    </header>
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
