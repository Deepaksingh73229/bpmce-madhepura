"use client";

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { cn, getOccupancyPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { HostelCard } from "@/components/campus/hostel/hostel-card"
import { useHostels, useRooms } from "@/services/hooks/use-hostel";
import { HostelFormDialog } from "./hostel-form-dialog";
import { Building2 } from "lucide-react";

export function HostelsGrid({ onSelectHostel }) {
    const [filters, setFilters] = useState({ page: 1, limit: 50 });
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editHostel, setEditHostel] = useState(null);

    const { data, isLoading } = useHostels(filters);
    const { data: roomsData } = useRooms({ limit: 500 });

    const hostels = data?.data || [];
    const rooms = roomsData?.data || [];

    const filtered = hostels.filter((h) => {
        const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "all" || h.hostelType === typeFilter;
        return matchSearch && matchType;
    });

    const getStats = (hostelId) => {
        const hr = rooms.filter((r) => (typeof r.hostel === "string" ? r.hostel : r.hostel._id) === hostelId);
        const capacity = hr.reduce((a, r) => a + r.capacity, 0);
        const occupied = hr.reduce((a, r) => a + r.occupiedBeds, 0);
        const pct = getOccupancyPercent(occupied, capacity);

        return {
            capacity,
            occupied,
            pct,
            roomCount: hr.length
        };
    };

    const handleEdit = (e, hostel) => {
        e.stopPropagation();
        setEditHostel(hostel);
        setDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <input
                        className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        placeholder="Search hostels by name or address..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Type filter pills */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
                    {(["all", "male", "female"]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                typeFilter === t
                                    ? "bg-background shadow-sm text-foreground border border-border"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {t === "all" ? "All" : t === "male" ? "🔵 Male" : "🩷 Female"}
                        </button>
                    ))}
                </div>

                <Button
                    size="default"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => { setEditHostel(null); setDialogOpen(true); }}
                >
                    Add Hostel
                </Button>
            </div>

            {/* Summary row */}
            {!isLoading && filtered.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filtered.length}</span> hostel{filtered.length !== 1 ? "s" : ""}
                    {typeFilter !== "all" && ` · ${typeFilter}`}
                </p>
            )}

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={Building2}
                    title={search ? "No hostels match your search" : "No hostels yet"}
                    description={search ? "Try a different search term." : "Create your first hostel to get started."}
                    action={{ label: "Create Hostel", onClick: () => { setEditHostel(null); setDialogOpen(true); } }}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {
                        filtered.map((hostel) => {
                            const stats = getStats(hostel._id);

                            return (
                                <HostelCard
                                    key={hostel._id}
                                    hostel={hostel}
                                    stats={stats}
                                    onClick={() => onSelectHostel(hostel)}
                                    onEdit={(e) => handleEdit(e, hostel)}
                                />
                            );
                        })
                    }
                </div>
            )}

            <HostelFormDialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditHostel(null); }}
                hostel={editHostel}
            />
        </div>
    );
}