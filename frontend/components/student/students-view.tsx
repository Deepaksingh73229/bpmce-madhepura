"use client";

import React, { useState } from "react";
import { Search, Plus, GraduationCap, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { StudentCard } from "./student-card";
import { StudentFormDialog } from "./student-form-dialog";
import { useStudents, useDeleteStudent } from "@/services/hooks/use-student";
import { Pagination } from "@/components/shared/pagination";
import type { Student } from "@/types";

export function StudentsView() {
    const [filters, setFilters] = useState({ page: 1, limit: 12, search: "", branch: "", course: "", batchYear: "" });
    const [searchInput, setSearchInput] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editStudent, setEditStudent] = useState<Student | null>(null);

    const { data, isLoading } = useStudents(filters);
    const { mutateAsync: deleteStudent } = useDeleteStudent();

    const students = data?.data || [];
    const pagination = data?.pagination || { total: 0, totalPages: 0, page: 1, limit: 12, hasNextPage: false, hasPrevPage: false };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const clearFilters = () => {
        setSearchInput("");
        setFilters({ page: 1, limit: 12, search: "", branch: "", course: "", batchYear: "" });
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to deactivate this student?")) {
            await deleteStudent(id);
        }
    };

    const handleEdit = (student: Student) => {
        setEditStudent(student);
        setDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                            placeholder="Search by name, roll number, or registration..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>

                    <div className="flex items-center gap-2">
                        <Button
                            size="default"
                            leftIcon={<Plus className="h-4 w-4" />}
                            onClick={() => { setEditStudent(null); setDialogOpen(true); }}
                        >
                            Add Student
                        </Button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2 pb-1">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/40 border border-border/50 text-xs text-muted-foreground">
                        <Filter className="h-3 w-3" />
                        <span>Filters:</span>
                    </div>

                    <select 
                        className="h-8 pl-2 pr-8 rounded-lg border border-border/50 bg-background text-[11px] focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                        value={filters.course}
                        onChange={(e) => handleFilterChange("course", e.target.value)}
                    >
                        <option value="">All Courses</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="Diploma">Diploma</option>
                    </select>

                    <input 
                        className="h-8 px-2 rounded-lg border border-border/50 bg-background text-[11px] w-24 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="Branch (e.g. CSE)"
                        value={filters.branch}
                        onChange={(e) => handleFilterChange("branch", e.target.value)}
                    />

                    <input 
                        className="h-8 px-2 rounded-lg border border-border/50 bg-background text-[11px] w-24 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="Batch (Year)"
                        type="number"
                        value={filters.batchYear}
                        onChange={(e) => handleFilterChange("batchYear", e.target.value)}
                    />

                    {(filters.search || filters.course || filters.branch || filters.batchYear) && (
                        <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={clearFilters}
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            leftIcon={<X className="h-3 w-3" />}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : students.length === 0 ? (
                <EmptyState
                    icon={GraduationCap}
                    title={filters.search || filters.branch || filters.course || filters.batchYear ? "No students match your filters" : "No students registered"}
                    description={filters.search || filters.branch || filters.course || filters.batchYear ? "Try adjusting your search or filters." : "Start by adding your first student to the system."}
                    action={{ label: "Add Student", onClick: () => { setEditStudent(null); setDialogOpen(true); } }}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {students.map((student: Student) => (
                            <StudentCard
                                key={student._id}
                                student={student}
                                onEdit={() => handleEdit(student)}
                                onDelete={() => handleDelete(student._id)}
                            />
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="pt-6 pb-2">
                            <Pagination
                                meta={pagination}
                                onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                            />
                        </div>
                    )}
                </>
            )}

            <StudentFormDialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditStudent(null); }}
                student={editStudent}
            />
        </div>
    );
}