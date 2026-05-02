"use client";

import Image from "next/image";
import { cn } from "@/lib";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, alt, fallback, size = "md", className }: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700",
        sizes[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt || ""} fill className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-700 font-medium dark:bg-primary-900 dark:text-primary-300">
          {fallback?.charAt(0).toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}