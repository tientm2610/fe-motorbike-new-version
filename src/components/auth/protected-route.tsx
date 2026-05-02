"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { PageLoader } from "@/components/ui";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`${redirectTo}?redirect=${pathname}`);
      return;
    }

    if (allowedRoles && user && !hasPermission(allowedRoles)) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, user, hasPermission, allowedRoles, redirectTo, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!isAuthenticated || (allowedRoles && user && !hasPermission(allowedRoles))) {
    return null;
  }

  return <>{children}</>;
}