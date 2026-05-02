import { create } from "zustand";
import { cartService } from "@/services/cart.service";
import type { Cart, CartItem } from "@/types";
import { useAuthStore } from "./auth.store";

const getCartItemCount = (cart: Cart | null | undefined): number => {
  if (!cart) return 0;
  // Handle both totalQuantity and calculate from items
  return cart.totalQuantity ?? cart.items?.length ?? 0;
};

const updateCartItemCount = (cart: Cart | null | undefined) => {
  const count = getCartItemCount(cart);
  useAuthStore.getState().setCartItemCount(count);
};

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
      set({ cart: cart || { items: [], totalQuantity: 0, subtotal: 0, estimatedTotal: 0 }, isLoading: false });
      updateCartItemCount(cart);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch cart",
        isLoading: false,
        cart: { items: [], totalQuantity: 0, subtotal: 0, estimatedTotal: 0 },
      });
      updateCartItemCount(null);
    }
  },

  addItem: async (variantId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.addItem({ variantId, quantity });
      const safeCart = cart || { items: [], totalQuantity: 0, subtotal: 0, estimatedTotal: 0 };
      set({ cart: safeCart, isLoading: false });
      updateCartItemCount(safeCart);
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
      const safeCart = cart || { items: [], totalQuantity: 0, subtotal: 0, estimatedTotal: 0 };
      set({ cart: safeCart, isLoading: false });
      updateCartItemCount(safeCart);
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
      const safeCart = cart || { items: [], totalQuantity: 0, subtotal: 0, estimatedTotal: 0 };
      set({ cart: safeCart, isLoading: false });
      updateCartItemCount(safeCart);
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
    } catch (error) {
      // Continue even if clear fails
    }
    const emptyCart = { items: [], totalQuantity: 0, subtotal: 0, estimatedTotal: 0 };
    set({ cart: emptyCart, isLoading: false });
    updateCartItemCount(emptyCart);
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