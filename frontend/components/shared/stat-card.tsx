import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    iconColor?: string;
    trend?: { value: number; label: string; positive?: boolean };
    loading?: boolean;
    className?: string;
}

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = "text-primary",
    trend,
    loading = false,
    className,
}: StatCardProps) {
    if (loading) {
        return (
            <div className={cn("rounded-2xl border bg-card p-5 space-y-3", className)}>
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "stat-card rounded-2xl border bg-card/80 backdrop-blur-sm p-5 space-y-3",
                className
            )}
        >
            <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className={cn("p-2 rounded-xl", "bg-primary/10")}>
                    <Icon className={cn("h-4 w-4", iconColor)} />
                </div>
            </div>

            <div>
                <p className="font-display text-3xl font-bold tracking-tight">{value}</p>
                {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>

            {trend && (
                <div className="flex items-center gap-1.5">
                    <span
                        className={cn(
                            "text-xs font-medium",
                            trend.positive !== false ? "text-green-600 dark:text-green-400" : "text-red-500"
                        )}
                    >
                        {trend.positive !== false ? "↑" : "↓"} {Math.abs(trend.value)}%
                    </span>
                    <span className="text-xs text-muted-foreground">{trend.label}</span>
                </div>
            )}
        </div>
    );
}