"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "outline" | "solid";
  size?: "sm" | "md" | "lg";
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "ghost", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";

    const variants = {
      ghost: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-300 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
      outline: "border border-neutral-300 text-neutral-600 hover:bg-neutral-50 focus:ring-neutral-300 dark:border-neutral-600 dark:text-neutral-400",
      solid: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-300",
    };

    const sizes = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton, type IconButtonProps };
export default IconButton;