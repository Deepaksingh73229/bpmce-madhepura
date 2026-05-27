import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Layers, Edit2, Building2 } from "lucide-react";

import { cn, getOccupancyColor, formatDate } from "@/lib/utils";

export function HostelCard({ hostel, stats, onClick, onEdit }) {
    const isMale = hostel.hostelType === "male";

    const statsData = [
        {
            icon: Layers,
            label: "Floors",
            value: hostel.totalFloors
        },

        {
            icon: Building2,
            label: "Rooms",
            value: hostel.totalRooms
        },

        {
            icon: Users,
            label: "Capacity",
            value: hostel.totalCapacity
        },
    ]

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            className={cn(
                "group relative overflow-hidden rounded-2xl border bg-card cursor-pointer",
                "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
                "hover:border-primary/30 active:scale-[0.99]",
                !hostel.isActive && "opacity-60"
            )}
        >
            {/* Colour stripe */}
            <div className={cn(
                "h-1.5",
                isMale
                    ? "bg-linear-to-r from-blue-500 via-blue-400 to-sky-400"
                    : "bg-linear-to-r from-pink-500 via-pink-400 to-rose-400"
            )} />

            {/* Glow blob */}
            <div className={cn(
                "absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                isMale ? "bg-blue-500/10" : "bg-pink-500/10"
            )} />

            <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h3 className="font-display font-bold text-base truncate">{hostel.name}</h3>

                            {
                                !hostel.isActive && (
                                    <Badge variant="inactive">Inactive</Badge>
                                )
                            }
                        </div>

                        <Badge variant={isMale ? "male" : "female"} className="mt-1.5">
                            {isMale ? "🔵 Male" : "🩷 Female"}
                        </Badge>
                    </div>

                    {/* Edit button - visible on hover */}
                    <button
                        onClick={onEdit}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground flex-shrink-0"
                        aria-label="Edit hostel"
                    >
                        <Edit2 className="h-3.5 w-3.5" />
                    </button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                    {
                        statsData?.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex flex-col items-center rounded-xl bg-muted/50 p-2.5 gap-0.5">
                                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-display font-bold text-sm">{value}</span>
                                <span className="text-[10px] text-muted-foreground">{label}</span>
                            </div>
                        ))
                    }
                </div>

                {/* Occupancy */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Occupancy</span>
                        <span className={cn("font-semibold", getOccupancyColor(stats.pct))}>
                            {stats.occupied} / {stats.capacity} beds ({stats.pct}%)
                        </span>
                    </div>

                    <Progress value={stats.pct} occupancy className="h-1.5" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Added {formatDate(hostel.createdAt)}</span>
                    <span className="text-[10px] text-primary font-medium group-hover:underline">
                        View floors →
                    </span>
                </div>
            </div>
        </div>
    );
}