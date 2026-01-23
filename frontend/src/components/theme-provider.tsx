"use client";

import { useThemeStore } from "@/store/use-theme-store";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        root.style.colorScheme = theme;
    }, [theme]);

    // Prevent flash by not rendering until hydrated? 
    // Actually, we can just render and let the effect run.
    return <>{children}</>;
}
