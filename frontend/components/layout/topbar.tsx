"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Bell, Moon, Sun, Search } from "lucide-react";

import { capitalize } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pageTitles } from "@/data/layout/topbarItems";

export function Topbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    const pageKey = Object.keys(pageTitles).find(
        (key) => pathname === key || pathname.startsWith(`${key}/`)
    );
    
    const page = pageKey ? pageTitles[pageKey] : {
        title: capitalize(pathname.split("/").pop() || ""),
        subtitle: "",
    };

    return (
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card/40 backdrop-blur-sm px-6">
            {/* Page title */}
            <div className="flex-1">
                <h1 className="font-display font-bold text-lg leading-tight">{page.title}</h1>
                {page.subtitle && (
                    <p className="text-xs text-muted-foreground">{page.subtitle}</p>
                )}
            </div>

            {/* Search */}
            <div className="hidden md:flex w-56">
                <Input
                    placeholder="Quick search..."
                    leftIcon={<Search className="h-3.5 w-3.5" />}
                    className="h-8 text-xs rounded-xl bg-muted/50 border-0 focus-visible:ring-1"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle theme"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                <Button variant="ghost" size="icon-sm" className="relative" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                </Button>
            </div>
        </header>
    );
}