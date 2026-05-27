import type { Metadata } from "next";
import { HostelExplorer } from "@/components/campus/hostel/hostel-explorer";

export const metadata: Metadata = { title: "Hostels" };

export default function HostelsPage() {
    return <HostelExplorer />;
}