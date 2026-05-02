import { create } from "zustand";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  toasts: Toast[];
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

let toastId = 0;

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  isMobileMenuOpen: false,
  isSearchOpen: false,

  addToast: (toast) => {
    const id = `toast-${++toastId}`;
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    const duration = toast.duration || 5000;
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  setMobileMenuOpen: (open) => {
    set({ isMobileMenuOpen: open });
  },

  setSearchOpen: (open) => {
    set({ isSearchOpen: open });
  },
}));

export const toast = {
  success: (title: string, message?: string) => 
    useUIStore.getState().addToast({ type: "success", title, message }),
  error: (title: string, message?: string) => 
    useUIStore.getState().addToast({ type: "error", title, message }),
  warning: (title: string, message?: string) => 
    useUIStore.getState().addToast({ type: "warning", title, message }),
  info: (title: string, message?: string) => 
    useUIStore.getState().addToast({ type: "info", title, message }),
};