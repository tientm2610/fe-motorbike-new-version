import { create } from "zustand";
import { cartService } from "@/services/cart.service";
import type { Cart, CartItem } from "@/types";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  
  fetchCart: () => Promise<void>;
  addItem: (variantId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.getCart();
      set({ cart, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch cart",
        isLoading: false,
        cart: { items: [], totalQuantity: 0, subtotal: 0, estimatedTotal: 0 },
      });
    }
  },

  addItem: async (variantId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.addItem({ variantId, quantity });
      set({ cart, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add item",
        isLoading: false,
      });
      throw error;
    }
  },

  updateItem: async (itemId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.updateItem(itemId, { quantity });
      set({ cart, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update item",
        isLoading: false,
      });
      throw error;
    }
  },

  removeItem: async (itemId: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.removeItem(itemId);
      set({ cart, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to remove item",
        isLoading: false,
      });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await cartService.clearCart();
      set({ 
        cart: { items: [], totalQuantity: 0, subtotal: 0, estimatedTotal: 0 }, 
        isLoading: false 
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to clear cart",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export const useCartItems = (): CartItem[] => {
  const cart = useCartStore.getState().cart;
  return cart?.items || [];
};

export const useCartTotal = (): number => {
  const cart = useCartStore.getState().cart;
  return cart?.estimatedTotal || 0;
};

export const useCartQuantity = (): number => {
  const cart = useCartStore.getState().cart;
  return cart?.totalQuantity || 0;
};