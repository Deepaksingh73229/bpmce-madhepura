"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import logo from "@/public/logo.png"
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/services/hooks/use-auth";
import { navItems, bottomItems } from "@/data/layout/sidebarItems";

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { user, hasPermission } = useAuthStore();
    const { mutate: logout, isPending } = useLogout();

    const visibleNavItems = navItems.filter(
        (item) => !item.permission || hasPermission(item.permission)
    );

    return (
        <aside
            className={cn(
                "relative flex flex-col h-screen border-r border-border bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Toggle button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:border-primary/30 hover:text-primary transition-colors"
                aria-label="Toggle sidebar"
            >
                {collapsed ? (
                    <ChevronRight className="h-3 w-3" />
                ) : (
                    <ChevronLeft className="h-3 w-3" />
                )}
            </button>

            {/* Logo */}
            <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-border", collapsed && "justify-center px-3")}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                    <Image
                        src={logo}
                        alt="logo"
                        loading="lazy"
                    />
                </div>

                {!collapsed && (
                    <div>
                        <p className="font-display font-bold text-sm leading-tight">BPMCE Campus</p>
                        <p className="text-[10px] text-muted-foreground tracking-wide uppercase">Hostel Management</p>
                    </div>
                )}
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
                {visibleNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                                isActive
                                    ? "sidebar-item-active text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                                collapsed && "justify-center px-2"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon
                                className={cn(
                                    "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />

                            {
                                !collapsed && (
                                    <span className="truncate">{item.label}</span>
                                )
                            }

                            {
                                !collapsed && item.badge && (
                                    <span className="ml-auto text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )
                            }
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="border-t border-border p-2 space-y-0.5">
                {bottomItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                                isActive
                                    ? "sidebar-item-active text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                                collapsed && "justify-center px-2"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                            {!collapsed && item.label}
                        </Link>
                    );
                })}

                {/* User profile */}
                <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl", collapsed && "justify-center px-2")}>
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold font-display">
                        {user ? getInitials(user.name) : "?"}
                    </div>

                    {
                        !collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        )
                    }

                    {
                        !collapsed && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => logout()}
                                loading={isPending}
                                title="Logout"
                                className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        )
                    }
                </div>

                {collapsed && (
                    <button
                        onClick={() => logout()}
                        className="flex w-full items-center justify-center px-2 py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-accent/50 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="h-[18px] w-[18px]" />
                    </button>
                )}
            </div>
        </aside>
    );
}