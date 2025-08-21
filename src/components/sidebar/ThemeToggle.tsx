"use client";

import { useState, useEffect } from "react";
import { SunMedium, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Button
            className="bg-transparent h-10 w-10 shadow-none hover:bg-secondary text-foreground hover:text-white"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {
                theme === "dark"
                ? <SunMedium className="w-5! h-5!" />
                : <Moon className="w-5! h-5!" />
            }
        </Button>
    )
}
