"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";

    const variants = {
      primary: "bg-site-primary text-white hover:opacity-90 focus:ring-site-primary",
      secondary: "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-500 dark:bg-neutral-100 dark:text-neutral-900",
      ghost: "text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-300 dark:text-neutral-300 dark:hover:bg-neutral-800",
      outline: "border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-300 dark:border-neutral-600 dark:text-neutral-300",
      danger: "bg-error text-white hover:bg-red-600 focus:ring-red-500",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps };
export default Button;