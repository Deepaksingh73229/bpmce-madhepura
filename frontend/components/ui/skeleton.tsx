import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("rounded-lg shimmer", className)}
            {...props}
        />
    );
}

function SkeletonCard() {
    return (
        <div className="rounded-2xl border bg-card p-6 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    );
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 py-3 px-4">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
    );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-1">
            {Array.from({ length: rows }).map((_, i) => (
                <SkeletonRow key={i} />
            ))}
        </div>
    );
}

export { Skeleton, SkeletonCard, SkeletonRow, SkeletonTable };