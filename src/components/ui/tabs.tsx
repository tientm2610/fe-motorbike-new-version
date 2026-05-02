"use client";

import { useState, createContext, useContext, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib";

type TabsVariant = "default" | "pills" | "underline";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used within Tabs provider");
  return context;
}

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  className?: string;
  onChange?: (value: string) => void;
}

export function Tabs({ children, defaultValue, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange, variant: "default" }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
  variant?: TabsVariant;
}

export function TabsList({ children, className, variant = "default" }: TabsListProps) {
  const baseStyles = "flex gap-1";
  
  const variantStyles: Record<TabsVariant, string> = {
    default: "bg-neutral-100 p-1 rounded-lg dark:bg-neutral-800",
    pills: "",
    underline: "border-b border-neutral-200 dark:border-neutral-800",
  };

  return (
    <TabsContext.Provider value={useContext(TabsContext)!}>
      <div className={cn(baseStyles, variantStyles[variant], className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TabsTrigger({ value, children, className, disabled }: TabsTriggerProps) {
  const { activeTab, setActiveTab, variant = "default" } = useTabsContext();
  const isActive = activeTab === value;

  const baseStyles = "relative flex-1 px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles: Record<TabsVariant, string> = {
    default: isActive
      ? "text-neutral-900 dark:text-white"
      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
    pills: isActive
      ? "bg-primary-600 text-white"
      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
    underline: isActive
      ? "text-primary-600 border-b-2 border-primary-600"
      : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200",
  };

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      className={cn(baseStyles, variantStyles[variant], className)}
      disabled={disabled}
    >
      {variant === "default" && isActive && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 bg-white shadow-sm rounded-md dark:bg-neutral-700"
          transition={{ type: "spring", duration: 0.3 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (value !== activeTab) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("mt-4", className)}
    >
      {children}
    </motion.div>
  );
}