"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { SiteConfigProvider } from "./site-config-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { ToastContainer } from "@/components/toast-container";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="theme"
      >
        <SiteConfigProvider>
          <QueryProvider>
            {children}
            <ToastContainer />
          </QueryProvider>
        </SiteConfigProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}