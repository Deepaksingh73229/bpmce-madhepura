import type { Metadata } from "next";
import { StudentsView } from "@/components/student/students-view";

export const metadata: Metadata = { title: "Students | BPMCE Madhepura" };

export default function StudentsPage() {
    return (
        <div className="p-1">
             <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage student records, academic details, and registrations.
                </p>
            </div>
            
            <StudentsView />
        </div>
    );
}