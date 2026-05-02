export interface CartItem {
  id: number;
  variantId: number;
  variantName: string;
  colorName: string;
  imageUrl: string;
  motorcycleName: string;
  motorcycleSlug: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  estimatedTotal: number;
}

export interface AddCartItemRequest {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}