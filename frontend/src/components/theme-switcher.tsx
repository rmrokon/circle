"use client";

import { useThemeStore } from "@/store/use-theme-store";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle Theme">
            {theme === "dark" ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
