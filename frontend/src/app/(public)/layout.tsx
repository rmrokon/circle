"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { accessToken, isHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isHydrated && accessToken) {
            router.replace("/dashboard");
        }
    }, [accessToken, isHydrated, router]);

    if (!isHydrated || accessToken) {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
}
