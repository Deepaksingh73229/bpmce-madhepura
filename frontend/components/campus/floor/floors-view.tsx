"use client";

import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, User, Phone, Mail, ShieldCheck, Layers, ChevronRight, AlertCircle } from "lucide-react";
import { cn, getOccupancyPercent, getOccupancyColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useRoomsByHostel, useCreateFloor, useFloors, useDeleteFloor, useStaffByHostel, useDeleteStaff } from "@/services/hooks/use-hostel";
import { FloorFormDialog } from "./floor-form-dialog";
import { StaffFormDialog } from "@/components/campus/staff/staff-form-dialog";
import type { Hostel, Room, Floor } from "@/types";

interface FloorsViewProps {
    hostel: Hostel;
    onSelectFloor: (floor: Floor, rooms: Room[]) => void;
}

const HOSTEL_SUPERINTENDENT_ROLE = "hostel_superintendent";
const HOSTEL_STAFF_ROLE = "staff";

function getStaffRoleLabel(role: string) {
    if (role === HOSTEL_SUPERINTENDENT_ROLE) return "Hostel Superintendent";
    if (role === HOSTEL_STAFF_ROLE) return "Staff";

    return role;
}

export function FloorsView({ hostel, onSelectFloor }: FloorsViewProps) {
    const [search, setSearch] = useState("");
    const [floorDialogOpen, setFloorDialogOpen] = useState(false);
    const [editFloor, setEditFloor] = useState<Floor | null>(null);

    const [staffDialogOpen, setStaffDialogOpen] = useState(false);
    const [staffRole, setStaffRole] = useState<"hostel_superintendent" | "staff">(HOSTEL_SUPERINTENDENT_ROLE);
    const [editStaff, setEditStaff] = useState<any>(null);

    // Data fetching
    const { data: roomsData, isLoading: loadingRooms } = useRoomsByHostel(hostel._id);
    const rooms: Room[] = roomsData?.data || [];

    const { data: floorsData, isLoading: loadingFloors } = useFloors(hostel._id);
    const backendFloors: Floor[] = floorsData?.data || [];

    const { data: superintendentsData, isLoading: loadingSup } = useStaffByHostel(hostel._id, HOSTEL_SUPERINTENDENT_ROLE);
    const superintendents = hostel?.staff || [];
    // const superintendents = superintendentsData?.data || [];

    const { data: staffData, isLoading: loadingStaff } = useStaffByHostel(hostel._id, HOSTEL_STAFF_ROLE);
    const staffMembers = staffData?.data || [];

    const { mutateAsync: deleteFloor } = useDeleteFloor();
    const { mutateAsync: deleteStaff } = useDeleteStaff();

    // Processing floors
    let floors = backendFloors.map((floor) => ({
        floor,
        rooms: rooms.filter((r) => {
            const fid = typeof r.floor === "object" ? (r.floor as Floor)._id : r.floor;
            return fid === floor._id;
        })
    }));

    floors = floors.sort((a, b) => a.floor.floorNumber - b.floor.floorNumber);

    if (search) {
        const s = search.toLowerCase();
        floors = floors.filter((f) =>
            `floor ${f.floor.floorNumber}`.includes(s) ||
            (f.floor.name || "").toLowerCase().includes(s)
        );
    }

    const handleEditFloor = (e: React.MouseEvent, floor: Floor) => {
        e.stopPropagation();
        setEditFloor(floor);
        setFloorDialogOpen(true);
    };

    const handleDeleteFloor = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this floor? All rooms on this floor will lose their floor reference.")) {
            await deleteFloor(id);
        }
    };

    const handleAddStaff = (role: "hostel_superintendent" | "staff") => {
        setStaffRole(role);
        setEditStaff(null);
        setStaffDialogOpen(true);
    };

    const handleEditStaff = (staff: any, role: "hostel_superintendent" | "staff") => {
        setStaffRole(role);
        setEditStaff(staff);
        setStaffDialogOpen(true);
    };

    const handleDeleteStaff = async (id: string) => {
        if (confirm("Are you sure you want to remove this staff member?")) {
            await deleteStaff(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Hostel header summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-inner",
                        hostel.hostelType === "male" ? "bg-linear-to-br from-blue-500 to-blue-600" : "bg-linear-to-br from-pink-500 to-pink-600"
                    )}>
                        {hostel.hostelType === "male" ? "♂" : "♀"}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold tracking-tight">{hostel.name}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant={hostel.hostelType === "male" ? "male" : "female"} className="capitalize">{hostel.hostelType}</Badge>
                            <span className="text-xs text-muted-foreground">{hostel.totalFloors} floors · {hostel.capacity} capacity</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                            placeholder="Search floors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={() => { setEditFloor(null); setFloorDialogOpen(true); }}
                        leftIcon={<Plus className="h-4 w-4" />}
                    >
                        Add Floor
                    </Button>
                </div>
            </div>

            <div className="w-full flex justify-between">
                {/* Left Section: Staff Management */}
                <div className="pr-10 flex flex-1 flex-col gap-5">
                    <section className="space-y-1">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" /> Hostel Superintendent
                            </h3>

                            {superintendents.length === 0 && (
                                <Button variant="ghost" size="sm" onClick={() => handleAddStaff(HOSTEL_SUPERINTENDENT_ROLE)} className="h-8 px-2 text-xs">
                                    <Plus className="h-3 w-3 mr-1" /> Add
                                </Button>
                            )}
                        </div>

                        {loadingSup ? (
                            <div className="h-32 w-full rounded-2xl bg-muted animate-pulse" />
                        ) : superintendents.length > 0 ? (
                            superintendents.map((staff: any) => (
                                <StaffMemberCard
                                    key={staff._id}
                                    staff={staff}
                                    onEdit={() => handleEditStaff(staff, HOSTEL_SUPERINTENDENT_ROLE)}
                                    onDelete={() => handleDeleteStaff(staff._id)}
                                />
                            ))
                        ) : (
                            <div className="p-4 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center bg-muted/20">
                                <User className="h-8 w-8 text-muted-foreground/40 mb-2" />
                                <p className="text-xs text-muted-foreground">No hostel superintendent assigned</p>
                            </div>
                        )}
                    </section>

                    <section className="space-y-1">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <User className="h-4 w-4" /> Staff
                            </h3>

                            <Button variant="ghost" size="sm" onClick={() => handleAddStaff(HOSTEL_STAFF_ROLE)} className="h-8 px-2 text-xs">
                                <Plus className="h-3 w-3 mr-1" /> Add
                            </Button>
                        </div>

                        {loadingStaff ? (
                            <div className="h-32 w-full rounded-2xl bg-muted animate-pulse" />
                        ) : staffMembers.length > 0 ? (
                            <div className="space-y-3">
                                {staffMembers.map((staff: any) => (
                                    <StaffMemberCard
                                        key={staff._id}
                                        staff={staff}
                                        onEdit={() => handleEditStaff(staff, HOSTEL_STAFF_ROLE)}
                                        onDelete={() => handleDeleteStaff(staff._id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center bg-muted/20">
                                <User className="h-8 w-8 text-muted-foreground/40 mb-2" />
                                <p className="text-xs text-muted-foreground">No staff assigned</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Section: Floors List */}
                <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Layers className="h-4 w-4" /> Floors Management
                    </h3>

                    {(loadingRooms || loadingFloors) ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : floors.length === 0 ? (
                        <EmptyState
                            icon={Layers}
                            title="No floors found"
                            description="Add your first floor to start managing rooms and beds."
                            action={{ label: "Add Floor", onClick: () => { setEditFloor(null); setFloorDialogOpen(true); } }}
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {floors.map(({ floor, rooms: floorRooms }) => {
                                const capacity = floorRooms.reduce((a, r) => a + r.capacity, 0);
                                const occupied = floorRooms.reduce((a, r) => a + r.occupiedBeds, 0);
                                const pct = getOccupancyPercent(occupied, capacity);
                                const available = floorRooms.filter((r) => r.occupiedBeds < r.capacity).length;

                                return (
                                    <FloorRowCard
                                        key={floor._id}
                                        floor={floor}
                                        roomCount={floorRooms.length}
                                        capacity={capacity}
                                        occupied={occupied}
                                        pct={pct}
                                        available={available}
                                        onClick={() => onSelectFloor(floor, floorRooms)}
                                        onEdit={(e) => handleEditFloor(e, floor)}
                                        onDelete={(e) => handleDeleteFloor(e, floor._id)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <FloorFormDialog
                open={floorDialogOpen}
                onClose={() => { setFloorDialogOpen(false); setEditFloor(null); }}
                hostelId={hostel._id}
                floor={editFloor}
            />

            <StaffFormDialog
                open={staffDialogOpen}
                onClose={() => { setStaffDialogOpen(false); setEditStaff(null); }}
                hostelId={hostel._id}
                role={staffRole}
                staff={editStaff}
            />
        </div>
    );
}

// ── Staff Member Card ──────────────────────────────────────
function StaffMemberCard({ staff, onEdit, onDelete }: { staff: any, onEdit: () => void, onDelete: () => void }) {
    return (
        <Card className="overflow-hidden border-border/50 hover:border-primary/20 transition-colors shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <User className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="font-bold text-sm leading-none">{staff?.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                {getStaffRoleLabel(staff.role)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={onEdit} className="h-7 w-7">
                            <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={onDelete} className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    {staff.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" /> {staff.phone}
                        </div>
                    )}
                    {staff.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> {staff.email}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// ── Floor Row Card ──────────────────────────────────────────
interface FloorRowCardProps {
    floor: Floor;
    roomCount: number;
    capacity: number;
    occupied: number;
    pct: number;
    available: number;
    onClick: () => void;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

function FloorRowCard({ floor, roomCount, capacity, occupied, pct, available, onClick, onEdit, onDelete }: FloorRowCardProps) {
    const label = floor.name || `Floor ${floor.floorNumber}`;
    const isClosed = floor.isActive === false;

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={isClosed ? undefined : onClick}
            onKeyDown={(e) => e.key === "Enter" && !isClosed && onClick()}
            className={cn(
                "w-fit group relative overflow-hidden rounded-2xl border bg-card transition-all duration-200 shadow-sm",
                isClosed ? "opacity-75 grayscale-[0.5] border-dashed" : "cursor-pointer hover:shadow-md hover:border-primary/30 active:scale-[0.995]"
            )}
        >
            <div className="w-[200px] mx-auto px-5 py-4 flex flex-col items-center gap-3">
                {/* Floor Number Indicator */}
                <div className="flex items-center gap-5">
                    <div className={cn(
                        "h-12 w-12 shrink-0 rounded-lg flex items-center justify-center font-display font-bold text-3xl border-2",
                        isClosed ? "bg-muted text-muted-foreground border-muted-foreground/20" : "bg-primary/10 text-primary border-primary/20"
                    )}>
                        {floor.floorNumber === 0 ? "G" : floor.floorNumber}
                    </div>

                    <div className="flex flex-col items-center">
                        <h3 className="font-bold text-sm truncate">{label}</h3>

                        {
                            isClosed ? (
                                <Badge variant="destructive" className="text-xs px-2 py-0.5">Temporarily Closed</Badge>
                            ) : (
                                <Badge variant="outline" className="text-xs px-2 py-0.5 border-green-500/30 text-green-600 bg-green-50/50">In Service</Badge>
                            )
                        }
                    </div>
                </div>

                {/* Occupancy Stats */}
                {!isClosed && (
                    <div className="w-full">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Occupancy</span>

                            <span className={cn("font-semibold", getOccupancyColor(pct))}>
                                {occupied}/{capacity} ({pct}%)
                            </span>
                        </div>

                        <Progress value={pct} occupancy className="h-1.5" />
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2.5">
                    <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-1 h-7 px-2 rounded-md text-xs cursor-pointer">
                        <Edit2 className="h-3 w-3" />
                        <span>Update</span>
                    </Button>

                    <Button variant="outline" size="sm" onClick={onDelete} className="flex items-center gap-1 h-7 px-2 rounded-md text-xs text-destructive hover:bg-destructive/10 cursor-pointer">
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                    </Button>

                    {/* {
                        !isClosed && (
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform ml-2" />
                        )
                    } */}
                </div>
            </div>

            {isClosed && (
                <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <AlertCircle className="h-3 w-3" /> SERVICE SUSPENDED
                    </div>
                </div>
            )}
        </div>
    );
}
