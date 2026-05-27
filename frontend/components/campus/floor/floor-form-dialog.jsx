"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateFloor, useUpdateFloor } from "@/services/hooks/use-hostel";

export function FloorFormDialog({ open, onClose, hostelId, floor }) {
    const isEdit = !!floor;
    const { mutateAsync: create, isPending: creating } = useCreateFloor();
    const { mutateAsync: update, isPending: updating } = useUpdateFloor();

    const { register, handleSubmit, reset, formState: { errors } } = useForm ({
        defaultValues: { floorNumber: 0, name: "" },
    });

    useEffect(() => {
        if (floor) reset({ floorNumber: floor.floorNumber, name: floor.name || "", isActive: floor.isActive !== false });
        else reset({ floorNumber: 0, name: "", isActive: true });
    }, [floor, reset]);

    const onSubmit = async (values) => {
        try {
            if (isEdit) {
                await update({
                    id: floor._id,
                    payload: {
                        floorNumber: values.floorNumber,
                        name: values.name || undefined,
                        isActive: values.isActive
                    }
                });
            }
            else {
                await create({
                    hostel: hostelId,
                    floorNumber: values.floorNumber,
                    name: values.name,
                    isActive: values.isActive
                });
            }

            onClose();
        } catch { /* handled in hook */ }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Floor" : "Add Floor"}</DialogTitle>

                    <DialogDescription>
                        {isEdit ? "Update floor details." : "Add a new floor to this hostel."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-0.5">
                        <label className="text-sm font-medium text-foreground/80">
                            Floor Number <span className="text-primary">*</span>
                        </label>

                        <input
                            type="number"
                            min={0}
                            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                            placeholder="0 = Ground, 1 = First..."
                            {...register("floorNumber", { required: "Floor number is required", valueAsNumber: true })}
                        />

                        <p className="text-xs text-muted-foreground">0 = Ground Floor</p>

                        {
                            errors.floorNumber && (
                                <p className="text-xs text-destructive">{errors.floorNumber.message}</p>
                            )
                        }
                    </div>

                    <Input
                        label="Floor Name"
                        placeholder="e.g. Ground Floor, First Floor"
                        hint="Leave blank to use floor number"
                        {...register("name")}
                    />

                    <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium">In Service</label>
                            <p className="text-xs text-muted-foreground">Is this floor currently operational?</p>
                        </div>
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            {...register("isActive")}
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" loading={creating || updating}>
                            {isEdit ? "Save Changes" : "Add Floor"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
