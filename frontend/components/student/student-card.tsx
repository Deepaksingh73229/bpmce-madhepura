"use client";

import React from "react";
import { User, Mail, Phone, GraduationCap, Edit2, Trash2, Calendar, BookOpen, Fingerprint } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Student } from "@/types";

interface StudentCardProps {
    student: Student;
    onEdit: () => void;
    onDelete: () => void;
}

export function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
    return (
        <Card className="overflow-hidden border-border/50 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md group">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                            <GraduationCap className="h-6 w-6" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-sm leading-none">{student.name}</p>
                                <Badge variant={student.isActive ? "active" : "inactive"} className="text-[9px] px-1.5 py-0 h-4">
                                    {student.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                                <Fingerprint className="h-3 w-3" /> {student.rollNumber}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm" onClick={onEdit} className="h-8 w-8">
                            <Edit2 className="h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="icon-sm" onClick={onDelete} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-2">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/30 p-1.5 rounded-lg">
                        <BookOpen className="h-3 w-3 text-primary/70" /> 
                        <span className="truncate">{student.branch} ({student.course})</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/30 p-1.5 rounded-lg">
                        <Calendar className="h-3 w-3 text-primary/70" /> 
                        <span>Batch {student.batchYear}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground col-span-2 hover:text-primary transition-colors cursor-pointer">
                        <Mail className="h-3 w-3" /> 
                        <span className="truncate">{student.email}</span>
                    </div>

                    {student.registrationNumber && (
                         <div className="flex items-center gap-2 text-[11px] text-muted-foreground col-span-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Reg No:</span>
                            <span>{student.registrationNumber}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}