import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";
import { authService } from "@/services/auth.service";
import { STORAGE_KEYS } from "@/lib";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          
          const user: User = {
            id: response.id,
            email: response.email,
            fullName: response.fullName,
            phone: response.phone,
            role: response.role,
            status: response.status,
            createdAt: response.createdAt,
          };

          const accessToken = response.accessToken || response.token || "";
          const refreshToken = response.refreshToken || "";

          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (email: string, password: string, fullName: string, phone: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register({ email, password, fullName, phone });
          
          const user: User = {
            id: response.id,
            email: response.email,
            fullName: response.fullName,
            phone: response.phone,
            role: response.role,
            status: response.status,
            createdAt: response.createdAt,
          };

          const accessToken = response.accessToken || response.token || "";
          const refreshToken = response.refreshToken || "";

          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch {
          // Ignore logout errors
        } finally {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const hasRole = (user: User | null, roles: UserRole | UserRole[]): boolean => {
  if (!user) return false;
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  return user.role === roles;
};