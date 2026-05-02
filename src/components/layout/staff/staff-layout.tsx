"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { IconButton, Avatar, ThemeToggle } from "@/components/ui";

const MenuIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LogoIcon = () => (
  <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const staffLinks = [
  { href: "/staff", label: "Dashboard" },
  { href: "/staff/orders", label: "Orders" },
  { href: "/staff/inventory", label: "Inventory" },
  { href: "/staff/customers", label: "Customers" },
];

interface StaffLayoutProps {
  children: ReactNode;
  className?: string;
}

export function StaffLayout({ children, className }: StaffLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Top Bar - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-950">
        {/* Left: Logo & Menu Toggle */}
        <div className="flex items-center gap-3">
          <IconButton variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Link href="/staff" className="flex items-center gap-2">
            <LogoIcon />
            <span className="text-sm font-semibold text-neutral-900 dark:text-white lg:text-base">
              Staff Panel
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="flex items-center gap-2 border-l border-neutral-200 pl-2 dark:border-neutral-800 lg:border-l-0 lg:pl-0">
            <Avatar fallback="S" size="sm" />
            <span className="hidden text-sm text-neutral-700 dark:text-neutral-300 lg:inline">
              Staff
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 pt-14 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute left-0 top-14 w-64 animate-in slide-in-from-top bg-white p-4 shadow-lg dark:bg-neutral-950">
            <ul className="space-y-1">
              {staffLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/staff" && pathname.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar - Fixed */}
      <aside className="fixed left-0 top-14 hidden h-[calc(100vh-3.5rem)] w-48 border-r border-neutral-200 bg-white pt-4 dark:border-neutral-800 dark:bg-neutral-950 lg:block">
        <nav className="px-2">
          <ul className="space-y-1">
            {staffLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/staff" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={cn("pt-14 lg:pl-48", className)}>
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}

export default StaffLayout;