"use client";

import React, { useState } from "react";
import {
  User, Mail, Phone, GraduationCap, Calendar, MapPin,
  Hash, BedDouble, LogOut, ArrowLeftRight, CheckCircle2,
} from "lucide-react";
import { cn, formatDate, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useVacateRoom } from "@/services/hooks/use-hostel";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import type { Hostel, Floor, Room, Student } from "@/types";
import type { BedWithStudent } from "./beds-view";

interface BedDetailPanelProps {
  bed: BedWithStudent;
  room: Room;
  floor: Floor;
  hostel: Hostel;
  onClose: () => void;
  onVacated: () => void;
}

export function BedDetailPanel({ bed, room, floor, hostel, onClose, onVacated }: BedDetailPanelProps) {
  const [vacateOpen, setVacateOpen] = useState(false);
  const { mutateAsync: vacate, isPending: vacating } = useVacateRoom();

  const student = bed.student;
  const floorLabel = floor.name || `Floor ${floor.floorNumber === 0 ? "Ground" : floor.floorNumber}`;

  const handleVacate = async () => {
    if (!student) return;
    try {
      await vacate({ studentId: student._id });
      setVacateOpen(false);
      onVacated();
    } catch { /* handled in hook */ }
  };

  return (
    <>
      <div className="space-y-5">
        {/* Location trail */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{hostel.name}</span>
          <span>›</span>
          <span>{floorLabel}</span>
          <span>›</span>
          <span>Room {room.roomNumber}</span>
          <span>›</span>
          <span className="font-semibold text-primary">Bed {bed.bedNumber}</span>
        </div>

        {/* Bed status card */}
        <div className={cn(
          "rounded-2xl border p-4 flex items-center gap-4",
          bed.isOccupied ? "bg-primary/5 border-primary/20" : "bg-green-500/5 border-green-500/20"
        )}>
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0",
            bed.isOccupied ? "bg-primary/15" : "bg-green-500/15"
          )}>
            <BedDouble className={cn("h-6 w-6", bed.isOccupied ? "text-primary" : "text-green-500")} />
          </div>
          <div>
            <p className="font-display font-bold text-lg">Bed {bed.bedNumber}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={bed.isOccupied ? "inactive" : "active"}>
                {bed.isOccupied ? "Occupied" : "Available"}
              </Badge>
              <span className="text-xs text-muted-foreground capitalize">{room.type} room</span>
            </div>
          </div>
        </div>

        {/* Student section */}
        {bed.isOccupied && student ? (
          <div className="space-y-4">
            {/* Student avatar + name */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold font-display flex-shrink-0">
                {getInitials(student.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-lg">{student.name}</h3>
                <p className="text-sm text-muted-foreground">{student.course} · {student.branch}</p>
                <Badge variant={student.isActive ? "active" : "inactive"} className="mt-1">
                  {student.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { icon: Hash,           label: "Roll Number",    value: student.rollNumber },
                { icon: Hash,           label: "Reg. Number",    value: student.registrationNumber },
                { icon: Mail,           label: "Email",          value: student.email },
                { icon: Phone,          label: "Phone",          value: student.phone || "—" },
                { icon: GraduationCap,  label: "Batch Year",     value: student.batchYear ? String(student.batchYear) : "—" },
                { icon: User,           label: "Gender",         value: student.gender || "—" },
                { icon: Calendar,       label: "Date of Birth",  value: student.dateOfBirth ? formatDate(student.dateOfBirth) : "—" },
                { icon: MapPin,         label: "Address",        value: student.address || "—" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-medium truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                leftIcon={<LogOut className="h-3.5 w-3.5" />}
                onClick={() => setVacateOpen(true)}
              >
                Vacate Room
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                leftIcon={<ArrowLeftRight className="h-3.5 w-3.5" />}
              >
                Shift Room
              </Button>
            </div>
          </div>
        ) : bed.isOccupied ? (
          // Occupied but no student data loaded
          <Card>
            <CardContent className="flex flex-col items-center py-8 gap-3">
              <User className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">Student allocated</p>
              <p className="text-xs text-muted-foreground text-center">
                Student details not available. This bed is marked occupied.
              </p>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<LogOut className="h-3.5 w-3.5" />}
                onClick={() => setVacateOpen(true)}
              >
                Vacate Room
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Empty bed
          <Card>
            <CardContent className="flex flex-col items-center py-8 gap-3">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
              <p className="text-sm font-semibold">Bed is available</p>
              <p className="text-xs text-muted-foreground text-center">
                No student is currently allocated to this bed.
              </p>
              <Button size="sm">
                Allocate Student
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Vacate confirm dialog */}
      <Dialog open={vacateOpen} onOpenChange={setVacateOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Vacate</DialogTitle>
            <DialogDescription>
              This will free Bed <strong>{bed.bedNumber}</strong> in Room <strong>{room.roomNumber}</strong> and mark the allocation as completed.
            </DialogDescription>
          </DialogHeader>
          {student && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                {getInitials(student.name)}
              </div>
              <div>
                <p className="text-sm font-semibold">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setVacateOpen(false)}>Cancel</Button>
            <Button variant="destructive" loading={vacating} onClick={handleVacate}>
              Confirm Vacate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
