"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { IconButton, Avatar, ThemeToggle } from "@/components/ui";

const ChevronLeftIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const LogoIcon = () => (
  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const MotorcycleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const OrdersIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const sidebarLinks = [
  { href: "/admin", label: "Tổng quan", icon: DashboardIcon },
  { href: "/admin/orders", label: "Đơn hàng", icon: OrdersIcon },
  { href: "/admin/motorcycles", label: "Sản phẩm", icon: MotorcycleIcon },
  // { href: "/admin/customers", label: "Khách hàng", icon: UsersIcon },
  { href: "/admin/settings", label: "Cài đặt", icon: SettingsIcon },
];

const bottomLinks = [
  { href: "/admin/brands", label: "Thương hiệu", icon: MotorcycleIcon },
  { href: "/admin/categories", label: "Danh mục", icon: MotorcycleIcon },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-neutral-200 bg-white transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-950",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-16 items-center border-b border-neutral-200 px-4 dark:border-neutral-800", collapsed ? "justify-center" : "justify-between")}>
        <Link href="/admin" className="flex items-center gap-2">
          <LogoIcon />
          {!collapsed && (
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              Admin
            </span>
          )}
        </Link>
        {onToggle && (
          <IconButton variant="ghost" size="sm" onClick={onToggle} className={collapsed ? "hidden" : ""}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? link.label : undefined}
                >
                  <link.icon />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* Bottom section - Brands & Categories */}
        {!collapsed && (
          <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <p className="px-3 mb-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Quản lý
            </p>
            <ul className="space-y-1">
              {bottomLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                      )}
                    >
                      <link.icon />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className={cn("border-t border-neutral-200 p-2 dark:border-neutral-800", collapsed ? "flex flex-col items-center" : "")}>
        {collapsed && onToggle && (
          <IconButton variant="ghost" size="sm" onClick={onToggle} className="w-full justify-center">
            <ChevronRightIcon />
          </IconButton>
        )}
        <div className={cn("flex items-center gap-2", collapsed ? "flex-col" : "")}>
          {/* <ThemeToggle className={collapsed ? "" : "mr-auto"} /> */}
          <div className={cn("flex items-center gap-2", collapsed ? "mt-2" : "")}>
            <Avatar fallback="A" size="sm" />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-900 dark:text-white">Admin</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">admin@honda.com</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;