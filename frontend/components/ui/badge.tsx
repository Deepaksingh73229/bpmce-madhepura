import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-primary/10 text-primary border border-primary/20",
                secondary: "bg-secondary text-secondary-foreground",
                destructive: "bg-destructive/10 text-destructive border border-destructive/20",
                outline: "border border-border text-foreground",
                active: "status-active",
                inactive: "status-inactive",
                pending: "status-pending",
                completed: "status-completed",
                cancelled: "status-cancelled",
                male: "bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400",
                female: "bg-pink-500/10 text-pink-600 border border-pink-500/20 dark:text-pink-400",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };