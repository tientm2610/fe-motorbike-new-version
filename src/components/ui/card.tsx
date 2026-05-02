"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib";

type CardVariant = "default" | "glass" | "interactive";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  padding?: CardPadding;
  border?: boolean;
  onClick?: () => void;
}

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  children,
  className,
  variant = "default",
  padding = "md",
  border = true,
  onClick,
}: CardProps) {
  const baseStyles = "rounded-2xl transition-all duration-300";
  
  const variantStyles = {
    default: cn(
      "bg-white dark:bg-neutral-900",
      border && "border border-neutral-200 dark:border-neutral-800"
    ),
    glass: cn(
      "bg-white/80 dark:bg-neutral-900/80",
      "backdrop-blur-xl",
      border && "border border-white/20 dark:border-neutral-700/50"
    ),
    interactive: cn(
      "bg-white dark:bg-neutral-900 cursor-pointer",
      border && "border border-neutral-200 dark:border-neutral-800",
      "hover:border-primary-300 dark:hover:border-primary-700",
      "hover:shadow-lg hover:shadow-primary-500/10",
      "hover:-translate-y-1"
    ),
  };

  const Component = variant === "interactive" ? motion.div : "div";
  const motionProps = variant === "interactive"
    ? {
        whileHover: { y: -4, transition: { duration: 0.2 } },
        whileTap: onClick ? { scale: 0.99 } : undefined,
      }
    : {};

  return (
    <Component
      className={cn(baseStyles, variantStyles[variant], paddingStyles[padding], className)}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn("text-lg font-semibold text-neutral-900 dark:text-white", className)}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("mt-1 text-sm text-neutral-500 dark:text-neutral-400", className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn(className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("mt-4 flex items-center gap-3", className)}>
      {children}
    </div>
  );
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
}

export function GlassCard({ children, className, padding = "md" }: GlassCardProps) {
  return (
    <Card variant="glass" padding={padding} className={className}>
      {children}
    </Card>
  );
}

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
  onClick?: () => void;
}

export function InteractiveCard({ children, className, padding = "md", onClick }: InteractiveCardProps) {
  return (
    <Card variant="interactive" padding={padding} className={className} onClick={onClick}>
      {children}
    </Card>
  );
}