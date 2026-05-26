import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: { 
        default: "BPMCE Campus", 
        template: "%s | BPMCE Campus" 
    },

    description: "Centralized Campus Management System — Hostel, Student & Academic Operations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}