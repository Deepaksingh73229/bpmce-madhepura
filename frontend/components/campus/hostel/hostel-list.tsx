"use client";

import React, { useState } from "react";
import { Plus, Search, Building2, Users, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useHostels, useRooms } from "@/services/hooks/use-hostel";
import { getOccupancyPercent, getOccupancyColor, cn, formatDate } from "@/lib/utils";
import { HostelFormDialog } from "./hostel-form-dialog";
import type { Hostel, HostelFilters, Room } from "@/types";

export function HostelList() {
  const [filters, setFilters] = useState<HostelFilters>({ page: 1, limit: 9 });
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editHostel, setEditHostel] = useState<Hostel | null>(null);

  const { data, isLoading } = useHostels(filters);
  const { data: roomsData } = useRooms({ limit: 500 });
  const hostels: Hostel[] = data?.data || [];
  const rooms: Room[] = roomsData?.data || [];
  const pagination = data?.pagination;

  const handleSearch = (val: string) => {
    setSearch(val);
    setFilters((f) => ({ ...f, search: val || undefined, page: 1 }));
  };

  const getHostelStats = (hostelId: string) => {
    const hr = rooms.filter((r) => (typeof r.hostel === "string" ? r.hostel : r.hostel._id) === hostelId);
    const capacity = hr.reduce((a, r) => a + r.capacity, 0);
    const occupied = hr.reduce((a, r) => a + r.occupiedBeds, 0);
    return { capacity, occupied, roomCount: hr.length, pct: getOccupancyPercent(occupied, capacity) };
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search hostels..." leftIcon={<Search className="h-4 w-4" />} value={search} onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(["all", "male", "female"] as const).map((t) => (
            <Button key={t} variant={filters.hostelType === (t === "all" ? undefined : t) ? "default" : "outline"} size="sm"
              onClick={() => setFilters((f) => ({ ...f, hostelType: t === "all" ? undefined : t, page: 1 }))}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setEditHostel(null); setDialogOpen(true); }}>
            Add Hostel
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : hostels.length === 0 ? (
        <EmptyState icon={Building2} title="No hostels found" description="Create your first hostel to get started." action={{ label: "Create Hostel", onClick: () => { setEditHostel(null); setDialogOpen(true); } }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostels.map((hostel) => {
            const stats = getHostelStats(hostel._id);
            return <HostelCard key={hostel._id} hostel={hostel} stats={stats} onEdit={() => { setEditHostel(hostel); setDialogOpen(true); }} />;
          })}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination meta={pagination} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
      )}

      <HostelFormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditHostel(null); }} hostel={editHostel} />
    </div>
  );
}

interface HostelCardProps {
  hostel: Hostel;
  stats: { capacity: number; occupied: number; roomCount: number; pct: number };
  onEdit: () => void;
}

function HostelCard({ hostel, stats, onEdit }: HostelCardProps) {
  return (
    <Card className="group overflow-hidden hover:border-primary/30 transition-all duration-200 hover:shadow-lg">
      <div className={cn("h-1.5 w-full", hostel.hostelType === "male" ? "bg-gradient-to-r from-blue-500 to-blue-400" : "bg-gradient-to-r from-pink-500 to-pink-400")} />
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-base truncate">{hostel.name}</h3>
              <Badge variant={hostel.hostelType === "male" ? "male" : "female"}>{hostel.hostelType}</Badge>
              {!hostel.isActive && <Badge variant="inactive">Inactive</Badge>}
            </div>
            {hostel.address && <p className="text-xs text-muted-foreground mt-0.5 truncate">{hostel.address}</p>}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onEdit} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[{ icon: Layers, label: "Floors", value: hostel.totalFloors }, { icon: Building2, label: "Rooms", value: stats.roomCount }, { icon: Users, label: "Capacity", value: hostel.capacity }].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-muted/50 p-2.5 space-y-0.5">
              <Icon className="h-4 w-4 mx-auto text-muted-foreground" />
              <p className="font-display font-bold text-base">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Occupancy</span>
            <span className={cn("font-semibold", getOccupancyColor(stats.pct))}>{stats.occupied}/{stats.capacity} ({stats.pct}%)</span>
          </div>
          <Progress value={stats.pct} occupancy />
        </div>
        <p className="text-[10px] text-muted-foreground">Created {formatDate(hostel.createdAt)}</p>
      </CardContent>
    </Card>
  );
}
