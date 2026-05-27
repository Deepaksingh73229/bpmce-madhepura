"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";
import { HostelsGrid } from "./hostels-grid";
import { FloorsView } from "../floor/floors-view";
import { RoomsView } from "../room/rooms-view";
import { BedsView, BedWithStudent } from "../bed/beds-view";
import { BedDetailPanel } from "../bed/bed-detail-panel";

const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
};

const INITIAL = {
    level: "hostels",
    hostel: null,
    floor: null,
    floorRooms: [],
    room: null,
    bed: null,
};

export function HostelExplorer() {
    const [nav, setNav] = useState(INITIAL);
    const [direction, setDirection] = useState(1);

    // ── Drill-down helpers ────────────────────────────────────
    const goTo = (next) => {
        setDirection(1);
        setNav((prev) => ({ ...prev, ...next }));
    };

    const goBack = (level) => {
        setDirection(-1);
        setNav((prev) => ({
            ...prev,
            level,
            // Clear lower-level selections
            ...(level === "hostels" && { hostel: null, floor: null, floorRooms: [], room: null, bed: null }),
            ...(level === "floors" && { floor: null, floorRooms: [], room: null, bed: null }),
            ...(level === "rooms" && { room: null, bed: null }),
            ...(level === "beds" && { bed: null }),
        }));
    };

    // ── Breadcrumb items ──────────────────────────────────────
    const breadcrumbs = [
        {
            label: "Hostels",
            onClick: nav.level !== "hostels" ? () => goBack("hostels") : undefined,
        },
    ];

    if (nav.hostel) {
        breadcrumbs.push({
            label: nav.hostel.name,
            onClick: nav.level !== "floors" ? () => goBack("floors") : undefined,
        });
    }

    if (nav.floor) {
        breadcrumbs.push({
            label: nav.floor.name || `Floor ${nav.floor.floorNumber === 0 ? "Ground" : nav.floor.floorNumber}`,
            onClick: nav.level !== "rooms" ? () => goBack("rooms") : undefined,
        });
    }

    if (nav.room) {
        breadcrumbs.push({
            label: `Room ${nav.room.roomNumber}`,
            onClick: nav.level !== "beds" ? () => goBack("beds") : undefined,
        });
    }

    if (nav.bed) {
        breadcrumbs.push({ label: `Bed ${nav.bed.bedNumber}` });
    }

    // ── Render ────────────────────────────────────────────────
    return (
        <div className="space-y-4">
            {/* Breadcrumb nav */}
            <div className="flex items-center justify-between">
                <Breadcrumb items={breadcrumbs} />

                {/* Level indicator pill */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                    {(["Hostels", "Floors", "Rooms", "Beds"]).map((lbl, i) => {
                        const levelMap = ["hostels", "floors", "rooms", "beds"];
                        const isActive = nav.level === levelMap[i] || (nav.level === "bed-detail" && i === 3);
                        const isPast = levelMap.indexOf(nav.level) > i || (nav.level === "bed-detail" && i < 3);
                        return (
                            <React.Fragment key={lbl}>
                                {i > 0 && <span className="text-border">›</span>}
                                <span className={
                                    isActive
                                        ? "font-semibold text-primary"
                                        : isPast
                                            ? "text-foreground/60"
                                            : "text-muted-foreground/40"
                                }>
                                    {lbl}
                                </span>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Animated content */}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={nav.level + (nav.hostel?._id || "") + (nav.floor?._id || "") + (nav.room?._id || "") + (nav.bed?._id || "")}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                >
                    {/* Level: Hostels */}
                    {
                        nav.level === "hostels" && (
                            <HostelsGrid
                                onSelectHostel={(hostel) => goTo({ level: "floors", hostel })}
                            />
                        )
                    }

                    {/* Level: Floors */}
                    {
                        nav.level === "floors" && nav.hostel && (
                            <FloorsView
                                hostel={nav.hostel}
                                onSelectFloor={(floor, floorRooms) =>
                                    goTo({ level: "rooms", floor, floorRooms })
                                }
                            />
                        )
                    }

                    {/* Level: Rooms */}
                    {
                        nav.level === "rooms" && nav.hostel && nav.floor && (
                            <RoomsView
                                hostel={nav.hostel}
                                floor={nav.floor}
                                rooms={nav.floorRooms}
                                onSelectRoom={(room) => goTo({ level: "beds", room })}
                            />
                        )
                    }

                    {/* Level: Beds */}
                    {
                        nav.level === "beds" && nav.hostel && nav.floor && nav.room && (
                            <BedsView
                                hostel={nav.hostel}
                                floor={nav.floor}
                                room={nav.room}
                                onSelectBed={(bed) => goTo({ level: "bed-detail", bed })}
                            />
                        )
                    }

                    {/* Level: Bed detail */}
                    {
                        nav.level === "bed-detail" && nav.hostel && nav.floor && nav.room && nav.bed && (
                            <BedDetailPanel
                                bed={nav.bed}
                                room={nav.room}
                                floor={nav.floor}
                                hostel={nav.hostel}
                                onClose={() => goBack("beds")}
                                onVacated={() => goBack("beds")}
                            />
                        )
                    }
                </motion.div>
            </AnimatePresence>
        </div>
    );
}