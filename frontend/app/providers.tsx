"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000, // 1 minute default
        },
        
        mutations: {
            retry: 0,
        },
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster
                    position="top-right"
                    richColors
                    toastOptions={{
                        style: {
                            borderRadius: "12px",
                            fontFamily: "DM Sans, sans-serif",
                        },
                    }}
                />
            </ThemeProvider>
        </QueryClientProvider>
    );
}