import { apiClient } from "./api-client";
import type { Cart, AddCartItemRequest, UpdateCartItemRequest } from "@/types";

class CartService {
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>("/api/v1/cart");
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to get cart");
    }
    return response.data.result as Cart;
  }

  async addItem(data: AddCartItemRequest): Promise<Cart> {
    const response = await apiClient.post<Cart>("/api/v1/cart/items", data);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to add item");
    }
    return response.data.result as Cart;
  }

  async updateItem(itemId: number, data: UpdateCartItemRequest): Promise<Cart> {
    const response = await apiClient.put<Cart>(`/api/v1/cart/items/${itemId}`, data);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to update item");
    }
    return response.data.result as Cart;
  }

  async removeItem(itemId: number): Promise<Cart> {
    const response = await apiClient.delete<Cart>(`/api/v1/cart/items/${itemId}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to remove item");
    }
    return response.data.result as Cart;
  }

  async clearCart(): Promise<void> {
    const response = await apiClient.delete("/api/v1/cart/clear");
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to clear cart");
    }
  }
}

export const cartService = new CartService();
export default cartService;