"use client";

import { useAuthStore, hasRole } from "@/stores/auth.store";
import type { UserRole } from "@/types";

export function useAuth() {
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  } = useAuthStore();

  const isAdmin = hasRole(user, "ADMIN");
  const isStaff = hasRole(user, "STAFF");
  const isCustomer = hasRole(user, "CUSTOMER");

  const hasPermission = (roles: UserRole | UserRole[]) => {
    return hasRole(user, roles);
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    isStaff,
    isCustomer,
    login,
    register,
    logout,
    clearError,
    hasPermission,
  };
}