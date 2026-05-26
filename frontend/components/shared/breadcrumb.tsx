"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav className={cn("flex items-center gap-1 text-sm", className)}>
            {
                items.map((item, i) => {
                    const isLast = i === items.length - 1;

                    return (
                        <React.Fragment key={i}>
                            {
                                i > 0 && (
                                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                                )
                            }

                            <button
                                onClick={item.onClick}
                                disabled={isLast || !item.onClick}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors max-w-40 truncate",
                                    isLast
                                        ? "font-semibold text-foreground cursor-default"
                                        : item.onClick
                                            ? "text-muted-foreground hover:text-foreground hover:bg-accent/60 cursor-pointer"
                                            : "text-muted-foreground cursor-default"
                                )}
                            >
                                {
                                    i === 0 && (
                                        <Home className="h-3 w-3 shrink-0" />
                                    )
                                }

                                <span className="truncate">{item.label}</span>
                            </button>
                        </React.Fragment>
                    );
                }
                )}
        </nav>
    );
}