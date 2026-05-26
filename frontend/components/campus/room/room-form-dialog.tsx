"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateRoom, useUpdateRoom } from "@/services/hooks/use-hostel";
import type { Room, Hostel, Floor } from "@/types";

interface FormValues {
  hostel: string;
  floor: string;
  roomNumber: string;
  type: "single" | "triple";
  capacity: number;
}

interface RoomFormDialogProps {
  open: boolean;
  onClose: () => void;
  room?: Room | null;
  hostels: Hostel[];
  defaultFloorId?: string;
  defaultHostelId?: string;
}

export function RoomFormDialog({ open, onClose, room, hostels, defaultFloorId, defaultHostelId }: RoomFormDialogProps) {
  const isEdit = !!room;
  const { mutateAsync: create, isPending: creating } = useCreateRoom();
  const { mutateAsync: update, isPending: updating } = useUpdateRoom();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { hostel: defaultHostelId || "", floor: defaultFloorId || "", roomNumber: "", type: "single", capacity: 1 },
  });

  const type = watch("type");
  const hostelId = watch("hostel");

  useEffect(() => {
    if (room) {
      reset({
        hostel: typeof room.hostel === "string" ? room.hostel : room.hostel._id,
        floor: typeof room.floor === "string" ? room.floor : (room.floor as Floor)._id,
        roomNumber: room.roomNumber,
        type: room.type,
        capacity: room.capacity,
      });
    } else {
      reset({ hostel: defaultHostelId || "", floor: defaultFloorId || "", roomNumber: "", type: "single", capacity: 1 });
    }
  }, [room, reset, defaultHostelId, defaultFloorId]);

  useEffect(() => {
    if (type === "single") setValue("capacity", 1);
    else if (type === "triple") setValue("capacity", 3);
  }, [type, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      if (isEdit) await update({ id: room!._id, payload: values });
      else await create(values);
      onClose();
    } catch { /* handled in hook */ }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Room" : "Add Room"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update room details." : "Add a new room to this floor."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Only show hostel selector when not locked */}
          {!defaultHostelId && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">Hostel <span className="text-primary">*</span></label>
              <Select value={hostelId} onValueChange={(v) => setValue("hostel", v)}>
                <SelectTrigger><SelectValue placeholder="Select hostel" /></SelectTrigger>
                <SelectContent>
                  {hostels.map((h) => <SelectItem key={h._id} value={h._id}>{h.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.hostel && <p className="text-xs text-destructive">{errors.hostel.message}</p>}
            </div>
          )}

          {!defaultFloorId && (
            <Input label="Floor ID" placeholder="Paste Floor ObjectId here" required error={errors.floor?.message}
              {...register("floor", { required: "Floor ID is required" })} />
          )}

          <Input label="Room Number" placeholder="e.g. 101, A-204" required error={errors.roomNumber?.message}
            {...register("roomNumber", { required: "Room number is required" })} />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80">Room Type <span className="text-primary">*</span></label>
            <Select value={type} onValueChange={(v) => setValue("type", v as "single" | "triple")}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single (1 bed)</SelectItem>
                <SelectItem value="triple">Triple (3 beds)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80">Capacity</label>
            <input type="number" min={1}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              {...register("capacity", { valueAsNumber: true })} />
            <p className="text-xs text-muted-foreground">Auto-set from room type</p>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={creating || updating}>{isEdit ? "Save Changes" : "Add Room"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
