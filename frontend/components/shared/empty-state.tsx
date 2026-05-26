import { cn } from "@/lib/utils";
import { LucideIcon, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({
    icon: Icon = PackageOpen,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>

            <h3 className="font-display font-semibold text-lg mb-1">{title}</h3>

            {
                description && (
                    <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
                )
            }

            {
                action && (
                    <Button onClick={action.onClick} size="sm">
                        {action.label}
                    </Button>
                )
            }
        </div>
    );
}