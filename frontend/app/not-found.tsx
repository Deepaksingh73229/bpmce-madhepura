import Link from "next/link";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <div className="space-y-6 max-w-md w-full animate-in fade-in zoom-in duration-500">
                {/* Visual element */}
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-12" />
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl -rotate-6" />
                    <div className="relative flex items-center justify-center w-full h-full bg-background border-2 border-primary/20 rounded-3xl shadow-xl">
                        <FileQuestion className="w-10 h-10 text-primary" />
                    </div>
                </div>

                {/* Text content */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-display font-bold tracking-tight">404</h1>
                    <h2 className="text-xl font-semibold">Page not found</h2>
                    <p className="text-muted-foreground">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    {/* <Button variant="outline" asChild>
                        <Link href="javascript:history.back()">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Link>
                    </Button> */}

                    <Button asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            </div>
        </div>
    );
}
