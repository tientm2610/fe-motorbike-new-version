"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "w-4 h-4 rounded border-neutral-300 text-primary-600",
            "focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            "dark:border-neutral-600 dark:bg-neutral-800",
            className
          )}
          {...props}
        />
        {label && (
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox, type CheckboxProps };
export default Checkbox;