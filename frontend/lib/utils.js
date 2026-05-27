import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatDate(date, options) {
    const d = typeof date === "string"
        ? new Date(date)
        : date;

    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...options,
    });
}

export function formatDateTime(date) {
    const d = typeof date === "string"
        ? new Date(date)
        : date;

    return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function getInitials(name) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function capitalize(str) {
    return (
        str.charAt(0).toUpperCase() +
        str.slice(1).toLowerCase()
    );
}

export function truncate(str, length) {
    if (str.length <= length) return str;

    return str.slice(0, length) + "...";
}

export function getOccupancyPercent(occupied, capacity) {
    if (capacity === 0) return 0;

    return Math.round((occupied / capacity) * 100);
}

export function getOccupancyColor(percent) {
    if (percent >= 90) return "text-red-500";
    if (percent >= 70) return "text-orange-500";
    if (percent >= 40) return "text-yellow-500";

    return "text-green-500";
}

export function getOccupancyBg(percent) {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-orange-500";
    if (percent >= 40) return "bg-yellow-500";

    return "bg-green-500";
}

export function debounce(fn, delay) {
    let timer;

    return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

export function buildQueryString(params) {
    const query = new URLSearchParams();

    for (const [key, val] of Object.entries(params)) {
        if (
            val !== undefined &&
            val !== null &&
            val !== ""
        ){
            query.append(key, String(val));
        }
    }

    return query.toString();
}