import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: string;
    label?: string;
    hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, leftIcon, rightIcon, error, label, hint, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-foreground/80"
                    >
                        {label}
                        {props.required && <span className="ml-1 text-primary">*</span>}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm",
                            "ring-offset-background transition-all duration-200",
                            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                            "placeholder:text-muted-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "hover:border-border/80",
                            leftIcon && "pl-9",
                            rightIcon && "pr-9",
                            error && "border-destructive focus-visible:ring-destructive/40",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
                {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };