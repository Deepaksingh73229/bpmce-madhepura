"use client";

import React, { useState } from "react";
import { Plus, BedDouble, User, UserCheck, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { BedFormDialog } from "./bed-form-dialog";
import type { Hostel, Floor, Room, Bed, Student } from "@/types";

// Since the backend has no GET /beds endpoint, we use locally managed bed state
// (beds returned after creation are stored). In a real scenario the backend
// would expose GET /hostels/rooms/:id/beds — we stub with the data we have.

interface BedsViewProps {
  hostel: Hostel;
  floor: Floor;
  room: Room;
  // Beds passed in — parent should pass beds from room allocation data
  beds?: BedWithStudent[];
  isLoading?: boolean;
  onSelectBed: (bed: BedWithStudent) => void;
}

export interface BedWithStudent extends Bed {
  student?: Student | null;
}

export function BedsView({ hostel, floor, room, beds = [], isLoading = false, onSelectBed }: BedsViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBed, setEditBed] = useState<BedWithStudent | null>(null);

  const floorLabel = floor.name || `Floor ${floor.floorNumber === 0 ? "Ground" : floor.floorNumber}`;

  // Generate placeholder beds based on room capacity if none passed
  const displayBeds: BedWithStudent[] = beds.length > 0
    ? beds
    : Array.from({ length: room.capacity }, (_, i) => ({
        _id: `placeholder-${i}`,
        room: room._id,
        bedNumber: `B${i + 1}`,
        isOccupied: i < room.occupiedBeds,
        createdAt: "",
        updatedAt: "",
        student: null,
      }));

  return (
    <div className="space-y-4">
      {/* Room summary pill */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <BedDouble className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Room {room.roomNumber}</p>
          <p className="text-xs text-muted-foreground">
            {hostel.name} · {floorLabel} · <span className="capitalize">{room.type}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{room.occupiedBeds}/{room.capacity} occupied</span>
          <Button
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => { setEditBed(null); setDialogOpen(true); }}
          >
            Add Bed
          </Button>
        </div>
      </div>

      {/* Beds */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: room.capacity }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl shimmer" />
          ))}
        </div>
      ) : displayBeds.length === 0 ? (
        <EmptyState
          icon={BedDouble}
          title="No beds in this room"
          description="Add beds to start allocating students."
          action={{ label: "Add Bed", onClick: () => { setEditBed(null); setDialogOpen(true); } }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayBeds.map((bed) => (
            <BedCard
              key={bed._id}
              bed={bed}
              onClick={() => onSelectBed(bed)}
              onEdit={(e) => {
                e.stopPropagation();
                if (bed._id.startsWith("placeholder-")) return;
                setEditBed(bed);
                setDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <BedFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditBed(null); }}
        roomId={room._id}
        existingCount={displayBeds.length}
        bed={editBed}
      />
    </div>
  );
}

// ── Bed card ───────────────────────────────────────────────
interface BedCardProps {
  bed: BedWithStudent;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
}

function BedCard({ bed, onClick, onEdit }: BedCardProps) {
  const isPlaceholder = bed._id.startsWith("placeholder-");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={cn(
        "group relative rounded-2xl border bg-card cursor-pointer overflow-hidden",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]",
        bed.isOccupied
          ? "hover:border-primary/30"
          : "hover:border-green-500/30"
      )}
    >
      {/* Top strip */}
      <div className={cn(
        "h-1 w-full",
        bed.isOccupied
          ? "bg-linear-to-r from-primary to-orange-400"
          : "bg-linear-to-r from-green-500 to-emerald-400"
      )} />

      <div className="p-4 space-y-3">
        {/* Bed header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center",
              bed.isOccupied ? "bg-primary/10" : "bg-green-500/10"
            )}>
              <BedDouble className={cn("h-4 w-4", bed.isOccupied ? "text-primary" : "text-green-500")} />
            </div>
            <div>
              <p className="font-display font-bold text-sm">Bed {bed.bedNumber}</p>
              <p className="text-[10px] text-muted-foreground">{isPlaceholder ? "Not created yet" : `ID: ${bed._id.slice(-6)}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={bed.isOccupied ? "inactive" : "active"}>
              {bed.isOccupied ? "Occupied" : "Free"}
            </Badge>
            {!isPlaceholder && (
              <button
                onClick={onEdit}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
                aria-label="Edit bed"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Student info or empty state */}
        {bed.isOccupied ? (
          bed.student ? (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
              <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                {bed.student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{bed.student.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{bed.student.rollNumber}</p>
              </div>
              <UserCheck className="h-3.5 w-3.5 text-primary shrink-0 ml-auto" />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 border border-border">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Student allocated</p>
            </div>
          )
        ) : (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-green-500/5 border border-green-500/10">
            <div className="h-7 w-7 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <Plus className="h-3.5 w-3.5" />
            </div>
            <p className="text-xs text-muted-foreground">Available for allocation</p>
          </div>
        )}

        <p className="text-[10px] text-primary font-medium text-right group-hover:underline">
          {bed.isOccupied ? "View details →" : "Allocate student →"}
        </p>
      </div>
    </div>
  );
}
