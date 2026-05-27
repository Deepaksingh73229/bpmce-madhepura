"use client";

import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateHostel, useUpdateHostel } from "@/services/hooks/use-hostel";

const schema = z.object({
    name: z.string().min(1, "Hostel name is required").trim(),
    hostelType: z.enum(["male", "female"]),
});

export function HostelFormDialog({ open, onClose, hostel }) {
    const isEdit = !!hostel;
    const { mutateAsync: create, isPending: creating } = useCreateHostel();
    const { mutateAsync: update, isPending: updating } = useUpdateHostel();

    const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            hostelType: "male"
        },
    });

    const hostelType = watch("hostelType");

    useEffect(() => {
        if (hostel) {
            reset({
                name: hostel.name,
                hostelType: hostel.hostelType
            });
        }
        else {
            reset({
                name: "",
                hostelType: "male",
            });
        }
    }, [hostel, reset]);

    const onSubmit = async (values) => {
        try {
            const payload = { ...values };

            if (isEdit) await update({ id: hostel?._id, payload });
            else await create(payload);

            onClose();
        } catch { /* handled in hook */ }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Hostel" : "Create New Hostel"}</DialogTitle>
                    <DialogDescription>{isEdit ? "Update hostel details." : "Fill in the details to add a new hostel."}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Hostel Name" placeholder="e.g. Boys Hostel Block A" required error={errors.name?.message} {...register("name")} />

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground/80">
                            Hostel Type <span className="text-primary">*</span>
                        </label>

                        <Select value={hostelType} onValueChange={(v) => setValue("hostelType", v)}>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>

                        {errors.hostelType && <p className="text-xs text-destructive">{errors.hostelType.message}</p>}
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            loading={creating || updating}
                        >
                            {isEdit ? "Save Changes" : "Create Hostel"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}