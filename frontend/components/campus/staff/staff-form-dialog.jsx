"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateStaffByHostel, useUpdateStaff } from "@/services/hooks/use-hostel";

export function StaffFormDialog({ open, onClose, hostelId, role, staff }) {
    const isEdit = !!staff;
    const { mutateAsync: create, isPending: creating } = useCreateStaffByHostel();
    const { mutateAsync: update, isPending: updating } = useUpdateStaff();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { name: "", phone: "", email: "", password: "" },
    });

    useEffect(() => {
        if (staff) reset({ 
            name: staff.name, 
            phone: staff.phone || "", 
            email: staff.email || "",
            password: staff.password
        });
        else reset({ 
            name: "", 
            phone: "", 
            email: "",
            password: ""
        });
    }, [staff, reset, open]);

    const onSubmit = async (values) => {
        try {
            if (isEdit) {
                await update({
                    id: staff._id,
                    payload: {
                        ...values,
                    }
                });
            } else {
                await create({
                    hostelId,
                    role,
                    ...values,
                });
            }
            onClose();
        } catch { /* handled in hook */ }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Staff" : "Add Staff"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update staff details." : `Add a new ${role} to this hostel.`}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input
                        label="Full Name"
                        placeholder="Enter Name"
                        {...register("name", { required: "Name is required" })}
                        error={errors.name?.message}
                    />

                    <Input
                        label="Phone Number"
                        placeholder="Enter Phone No"
                        {...register("phone")}
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter Email Address"
                        {...register("email")}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter Password"
                        {...register("password")}
                    />

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" loading={creating || updating}>
                            {isEdit ? "Save Changes" : "Add Staff"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
