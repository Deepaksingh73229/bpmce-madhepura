import {
    LayoutDashboard,
    Building2,
    Users,
    BedDouble,
    LogOut,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Settings,
    ArrowLeftRight,
    Layers,
} from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    permission?: string;
    badge?: string;
}

export const navItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
    },

    {
        label: "Hostels",
        href: "/hostels",
        icon: Building2,
        permission: "hostel.manage"
    },

    {
        label: "Rooms",
        href: "/rooms",
        icon: BedDouble,
        permission: "hostel.manage"
    },

    {
        label: "Allocations",
        href: "/allocations",
        icon: ArrowLeftRight,
        permission: "hostel.manage"
    },

    {
        label: "Students",
        href: "/students",
        icon: GraduationCap,
        permission: "student.read"
    },

    {
        label: "Users",
        href: "/users",
        icon: Users,
        permission: "user.read"
    },
];

export const bottomItems: NavItem[] = [
    { label: "Settings", href: "/settings", icon: Settings },
];