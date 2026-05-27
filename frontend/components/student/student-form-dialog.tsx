"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateStudent, useUpdateStudent } from "@/services/hooks/use-student";
import type { Student } from "@/types";

const schema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.string().email("Invalid email address").trim(),
    rollNumber: z.string().min(1, "Roll number is required").trim(),
    registrationNumber: z.string().optional().or(z.literal("")),
    course: z.string().min(1, "Course is required").trim(),
    branch: z.string().min(1, "Branch is required").trim(),
    batchYear: z.coerce.number().min(2000, "Invalid batch year").max(2100, "Invalid batch year"),
});

type StudentFormValues = z.infer<typeof schema>;

export function StudentFormDialog({ open, onClose, student }: { open: boolean, onClose: () => void, student: Student | null }) {
    const isEdit = !!student;
    const { mutateAsync: create, isPending: creating } = useCreateStudent();
    const { mutateAsync: update, isPending: updating } = useUpdateStudent();

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            rollNumber: "",
            registrationNumber: "",
            course: "B.Tech",
            branch: "",
            batchYear: new Date().getFullYear(),
        },
    });

    const course = watch("course");

    useEffect(() => {
        if (student) {
            reset({
                name: student.name,
                email: student.email,
                rollNumber: student.rollNumber,
                registrationNumber: student.registrationNumber || "",
                course: student.course,
                branch: student.branch,
                batchYear: student.batchYear,
            });
        } else {
            reset({
                name: "",
                email: "",
                rollNumber: "",
                registrationNumber: "",
                course: "B.Tech",
                branch: "",
                batchYear: new Date().getFullYear(),
            });
        }
    }, [student, reset]);

    const onSubmit = async (values: any) => {
        try {
            if (isEdit) {
                await update({ id: student?._id, payload: values });
            } else {
                await create(values);
            }
            onClose();
        } catch (err) {
            // Error is handled in the hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Student" : "Register New Student"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update student information." : "Enter student details to add them to the system."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="Full Name" 
                            placeholder="John Doe" 
                            required 
                            error={errors.name?.message} 
                            {...register("name")} 
                        />
                        <Input 
                            label="Email Address" 
                            placeholder="john@example.com" 
                            required 
                            error={errors.email?.message} 
                            {...register("email")} 
                        />
                        <Input 
                            label="Roll Number" 
                            placeholder="e.g. CSE123" 
                            required 
                            error={errors.rollNumber?.message} 
                            {...register("rollNumber")} 
                        />
                        <Input 
                            label="Registration Number" 
                            placeholder="e.g. REG2024001" 
                            error={errors.registrationNumber?.message} 
                            {...register("registrationNumber")} 
                        />
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground/80">
                                Course <span className="text-primary">*</span>
                            </label>
                            <Select value={course} onValueChange={(v) => setValue("course", v)}>
                                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="B.Tech">B.Tech</SelectItem>
                                    <SelectItem value="M.Tech">M.Tech</SelectItem>
                                    <SelectItem value="Diploma">Diploma</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.course && <p className="text-xs text-destructive">{errors.course.message}</p>}
                        </div>

                        <Input 
                            label="Branch" 
                            placeholder="e.g. CSE" 
                            required 
                            error={errors.branch?.message} 
                            {...register("branch")} 
                        />
                        <Input 
                            label="Batch Year" 
                            type="number" 
                            placeholder="2024" 
                            required 
                            error={errors.batchYear?.message} 
                            {...register("batchYear")} 
                        />
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
                            {isEdit ? "Save Changes" : "Register Student"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}