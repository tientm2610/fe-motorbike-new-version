"use client";

import { type ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { cn } from "@/lib";

interface StorefrontLayoutProps {
  children: ReactNode;
  className?: string;
  hideFooter?: boolean;
}

export function StorefrontLayout({ children, className, hideFooter = false }: StorefrontLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={cn("flex-1", className)}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default StorefrontLayout;