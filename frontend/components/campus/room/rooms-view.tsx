"use client";

import React, { useState } from "react";
import { Plus, Search, ChevronRight, BedDouble, Edit2 } from "lucide-react";
import { cn, getOccupancyPercent, getOccupancyColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useCreateRoom, useUpdateRoom } from "@/services/hooks/use-hostel";
import { RoomFormDialog } from "./room-form-dialog";
import type { Hostel, Floor, Room } from "@/types";

interface RoomsViewProps {
  hostel: Hostel;
  floor: Floor;
  rooms: Room[];
  isLoading?: boolean;
  onSelectRoom: (room: Room) => void;
}

export function RoomsView({ hostel, floor, rooms, isLoading = false, onSelectRoom }: RoomsViewProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "single" | "triple">("all");
  const [availOnly, setAvailOnly]   = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRoom, setEditRoom]     = useState<Room | null>(null);

  const filtered = rooms.filter((r) => {
    const matchSearch = !search || r.roomNumber.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === "all" || r.type === typeFilter;
    const matchAvail  = !availOnly || r.occupiedBeds < r.capacity;
    return matchSearch && matchType && matchAvail;
  });

  const handleEdit = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    setEditRoom(room);
    setDialogOpen(true);
  };

  const floorLabel = floor.name || `Floor ${floor.floorNumber === 0 ? "Ground" : floor.floorNumber}`;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            placeholder="Search room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {(["all", "single", "triple"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                typeFilter === t
                  ? "bg-background shadow-sm text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={() => setAvailOnly(!availOnly)}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
            availOnly
              ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
              : "border-border text-muted-foreground hover:text-foreground bg-background"
          )}
        >
          {availOnly ? "✓ Available only" : "Available only"}
        </button>

        <Button
          size="default"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => { setEditRoom(null); setDialogOpen(true); }}
        >
          Add Room
        </Button>
      </div>

      {/* Floor summary pill */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="font-display font-bold text-primary text-sm">
            {floor.floorNumber === 0 ? "G" : floor.floorNumber}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{floorLabel}</p>
          <p className="text-xs text-muted-foreground">{hostel.name} · {rooms.length} rooms total</p>
        </div>
        <div className="text-right text-xs">
          <p className="font-medium">{rooms.filter((r) => r.occupiedBeds < r.capacity).length} available</p>
          <p className="text-muted-foreground">{rooms.filter((r) => r.occupiedBeds >= r.capacity).length} full</p>
        </div>
      </div>

      {/* Rooms grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BedDouble}
          title={search || typeFilter !== "all" || availOnly ? "No rooms match filters" : "No rooms on this floor"}
          description="Add rooms to start managing bed allocations."
          action={{ label: "Add Room", onClick: () => { setEditRoom(null); setDialogOpen(true); } }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((room) => {
            const pct = getOccupancyPercent(room.occupiedBeds, room.capacity);
            return (
              <RoomCard
                key={room._id}
                room={room}
                pct={pct}
                onClick={() => onSelectRoom(room)}
                onEdit={(e) => handleEdit(e, room)}
              />
            );
          })}
        </div>
      )}

      <RoomFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditRoom(null); }}
        room={editRoom}
        hostels={[hostel]}
        defaultFloorId={floor._id}
        defaultHostelId={hostel._id}
      />
    </div>
  );
}

// ── Room card ──────────────────────────────────────────────
interface RoomCardProps {
  room: Room;
  pct: number;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
}

function RoomCard({ room, pct, onClick, onEdit }: RoomCardProps) {
  const isFull  = room.occupiedBeds >= room.capacity;
  const isEmpty = room.occupiedBeds === 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card cursor-pointer",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 active:scale-[0.98]",
        !room.isActive && "opacity-60"
      )}
    >
      {/* Status indicator dot */}
      <div className={cn(
        "absolute top-3 right-3 h-2 w-2 rounded-full",
        isFull ? "bg-red-500" : isEmpty ? "bg-green-500" : "bg-orange-400"
      )} />

      <div className="p-4 space-y-3">
        <div className="pr-4">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base">Room {room.roomNumber}</h3>
            <button
              onClick={onEdit}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              aria-label="Edit room"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge variant={room.type === "single" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
              {room.type}
            </Badge>
            {!room.isActive && <Badge variant="inactive" className="text-[10px]">Inactive</Badge>}
          </div>
        </div>

        {/* Bed dots */}
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: room.capacity }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-5 w-5 rounded-md border text-[9px] font-bold flex items-center justify-center",
                i < room.occupiedBeds
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-muted/50 border-border text-muted-foreground"
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-muted-foreground">{room.occupiedBeds}/{room.capacity} beds</span>
            <span className={cn("font-semibold", getOccupancyColor(pct))}>{pct}%</span>
          </div>
          <Progress value={pct} occupancy className="h-1" />
        </div>

        <div className="flex items-center justify-between">
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-full font-medium",
            isFull ? "status-inactive" : "status-active"
          )}>
            {isFull ? "Full" : `${room.capacity - room.occupiedBeds} free`}
          </span>
          <span className="text-[10px] text-primary font-medium flex items-center gap-0.5 group-hover:underline">
            Beds <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
