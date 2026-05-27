"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateBed, useUpdateBed } from "@/services/hooks/use-hostel";
import type { Bed } from "@/types";

interface FormValues {
  bedNumber: string;
}

interface BedFormDialogProps {
  open: boolean;
  onClose: () => void;
  roomId: string;
  existingCount: number;
  bed?: Bed | null;
}

export function BedFormDialog({ open, onClose, roomId, existingCount, bed }: BedFormDialogProps) {
  const isEdit = !!bed;
  const { mutateAsync: create, isPending: creating } = useCreateBed();
  const { mutateAsync: update, isPending: updating } = useUpdateBed();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { bedNumber: `B${existingCount + 1}` },
  });

  useEffect(() => {
    if (bed) {
      reset({ bedNumber: bed.bedNumber });
    } else {
      reset({ bedNumber: `B${existingCount + 1}` });
    }
  }, [bed, existingCount, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      if (isEdit) {
        await update({ id: bed!._id, payload: { bedNumber: values.bedNumber } });
      } else {
        await create({ room: roomId, bedNumber: values.bedNumber });
      }
      reset();
      onClose();
    } catch { /* handled in hook */ }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Bed" : "Add Bed"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update bed details." : "Add a new bed to this room."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Bed Number"
            placeholder="e.g. B1, B2, Upper, Lower"
            required
            hint={`Next suggested: B${existingCount + 1}`}
            error={errors.bedNumber?.message}
            {...register("bedNumber", { required: "Bed number is required" })}
          />
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={creating || updating}>{isEdit ? "Save Changes" : "Add Bed"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
