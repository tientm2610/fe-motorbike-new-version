"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm",
          "placeholder:text-neutral-400",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500",
          error && "border-error focus:ring-error",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
export default Input;