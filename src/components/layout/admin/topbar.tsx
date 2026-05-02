"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconButton, Input } from "@/components/ui";

const IconSearch = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BellIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const MenuIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopbarProps {
  breadcrumbs?: BreadcrumbItem[];
  onMenuClick?: () => void;
}

export function Topbar({ breadcrumbs, onMenuClick }: TopbarProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: "Home", href: "/admin" }];

    let currentPath = "/admin";
    paths.slice(1).forEach((path) => {
      currentPath += `/${path}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
      items.push({ label, href: currentPath });
    });

    return items;
  };

  const breadcrumbItems = breadcrumbs || generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <IconButton variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
            <MenuIcon />
          </IconButton>
        )}

        {/* Breadcrumbs */}
        <nav className="hidden items-center gap-2 sm:flex">
          {breadcrumbItems.map((item, index) => (
            <div key={item.href || index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-neutral-400 dark:text-neutral-600">/</span>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-sm text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Search - Desktop */}
        <div className="hidden w-64 md:block">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <IconSearch />
            </div>
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Notifications */}
        <IconButton variant="ghost" size="sm" className="relative">
          <BellIcon />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
        </IconButton>
      </div>
    </header>
  );
}

export default Topbar;