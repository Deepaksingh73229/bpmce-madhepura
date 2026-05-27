"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useLogin } from "@/services/hooks/use-auth";

const schema = z.object({
    email: z.string().email("Enter a valid email").toLowerCase(),
    password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    const {
        mutateAsync: login,
        isPending,
    } = useLogin();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values) => {
        try {
            await login(values);
            router.push("/dashboard");
        } catch {
            // handled in hook
        }
    };

    const handleDemoLogin = async (email, password) => {
        try {
            setValue("email", email);
            setValue("password", password);

            await login({
                email,
                password,
            });

            router.push("/dashboard");
        } catch {
            // handled in hook
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {/* Background blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
            </div>

            <div className="relative w-full max-w-sm space-y-8">
                {/* Card */}
                <div className="glass-card rounded-3xl p-8 space-y-5">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="admin@college.com"
                            leftIcon={<Mail className="h-4 w-4" />}
                            required
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            leftIcon={<Lock className="h-4 w-4" />}
                            required
                            autoComplete="current-password"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <Button
                            type="submit"
                            className="w-full cursor-pointer"
                            size="lg"
                            loading={isPending}
                            rightIcon={<ArrowRight className="h-4 w-4" />}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Demo credentials */}
                    <div className="border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground text-center mb-3 font-medium uppercase tracking-wide">
                            Demo Credentials
                        </p>

                        <div className="space-y-2">
                            {[
                                {
                                    role: "Admin",
                                    email: "admin@college.com",
                                    pass: "Admin@123",
                                },
                                {
                                    role: "Superintendent",
                                    email: "superintendent@college.com",
                                    pass: "Super@123",
                                },
                            ].map(({ role, email, pass }) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() =>
                                        handleDemoLogin(email, pass)
                                    }
                                    className="w-full flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2 text-xs hover:bg-muted transition-colors text-left group"
                                >
                                    <span className="font-medium">
                                        {role}
                                    </span>

                                    <span className="text-muted-foreground font-mono group-hover:text-foreground transition-colors">
                                        {email}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}