"use client";

import React, { useState } from "react";
import { Plus, Search, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { SkeletonTable } from "@/components/ui/skeleton";
import { useRooms, useHostels } from "@/services/hooks/use-hostel";
import { getOccupancyPercent, getOccupancyColor, cn } from "@/lib/utils";
import { RoomFormDialog } from "./room-form-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Room, RoomFilters, Hostel } from "@/types";

export function RoomList() {
  const [filters, setFilters] = useState<RoomFilters>({ page: 1, limit: 15 });
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  const { data, isLoading } = useRooms(filters);
  const { data: hostelsData } = useHostels({ limit: 100 });

  const rooms = data?.data || [];
  const hostels = hostelsData?.data || [];
  const pagination = data?.pagination;

  const handleEdit = (room: Room) => {
    setEditRoom(room);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditRoom(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search rooms..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={filters.hostelId || "all"}
          onValueChange={(v) => setFilters((f) => ({ ...f, hostelId: v === "all" ? undefined : v, page: 1 }))}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Hostels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hostels</SelectItem>
            {hostels.map((h: Hostel) => (
              <SelectItem key={h._id} value={h._id}>{h.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.type || "all"}
          onValueChange={(v) => setFilters((f) => ({ ...f, type: v === "all" ? undefined : v as "single" | "triple", page: 1 }))}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="triple">Triple</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={filters.availableOnly ? "default" : "outline"}
          size="default"
          onClick={() => setFilters((f) => ({ ...f, availableOnly: !f.availableOnly, page: 1 }))}
        >
          Available Only
        </Button>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
          Add Room
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left font-semibold text-muted-foreground px-4 py-3 text-xs uppercase tracking-wide">Room</th>
                <th className="text-left font-semibold text-muted-foreground px-4 py-3 text-xs uppercase tracking-wide">Type</th>
                <th className="text-left font-semibold text-muted-foreground px-4 py-3 text-xs uppercase tracking-wide">Occupancy</th>
                <th className="text-left font-semibold text-muted-foreground px-4 py-3 text-xs uppercase tracking-wide hidden md:table-cell">Status</th>
                <th className="px-4 py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-2">
                    <SkeletonTable rows={8} />
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={BedDouble}
                      title="No rooms found"
                      description="Add rooms to your hostels to manage bed allocation."
                      action={{ label: "Add Room", onClick: handleCreate }}
                    />
                  </td>
                </tr>
              ) : (
                rooms.map((room: Room) => {
                  const pct = getOccupancyPercent(room.occupiedBeds, room.capacity);
                  const hostel = typeof room.hostel === "object" ? room.hostel : null;
                  const floor = typeof room.floor === "object" ? room.floor : null;
                  const isFull = room.occupiedBeds >= room.capacity;

                  return (
                    <tr key={room._id} className="table-row-hover border-b last:border-0">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">Room {room.roomNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {hostel?.name || "—"}
                            {floor ? ` · Floor ${(floor as { floorNumber: number }).floorNumber}` : ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={room.type === "single" ? "default" : "secondary"}>
                          {room.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 min-w-[140px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{room.occupiedBeds}/{room.capacity} beds</span>
                            <span className={cn("font-semibold", getOccupancyColor(pct))}>
                              {pct}%
                            </span>
                          </div>
                          <Progress value={pct} occupancy className="h-1.5" />
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge variant={!room.isActive ? "inactive" : isFull ? "inactive" : "active"}>
                          {!room.isActive ? "Inactive" : isFull ? "Full" : "Available"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(room)}>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          meta={pagination}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
        />
      )}

      <RoomFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditRoom(null); }}
        room={editRoom}
        hostels={hostels}
      />
    </div>
  );
}
