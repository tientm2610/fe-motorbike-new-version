export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "COD" | "ONLINE";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: number;
  variantId: number;
  variantName: string;
  colorName: string;
  imageUrl: string;
  motorcycleName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderCode: string;
  status: OrderStatus;
  totalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  items: OrderItem[];
  totalItems: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CheckoutRequest {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface OrderFilters {
  page?: number;
  size?: number;
  sort?: string;
  status?: OrderStatus;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: number;
  name: string;
  thumbnailUrl: string;
  totalSold: number;
  revenue: number;
}

export interface OrderStatusCount {
  status: OrderStatus;
  count: number;
}