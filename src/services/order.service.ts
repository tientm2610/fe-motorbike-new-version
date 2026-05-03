import { apiClient } from "./api-client";
import type { Order, CheckoutRequest, OrderFilters, PaginatedResponse, DashboardSummary, RevenueData, TopProduct, OrderStatusCount } from "@/types";

class OrderService {
  async checkout(request: CheckoutRequest): Promise<Order> {
    const response = await apiClient.post<Order>("/api/v1/orders/checkout", request);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Checkout failed");
    }
    return response.data.result as Order;
  }

  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    if (filters?.page !== undefined) params.set("page", String(filters.page));
    if (filters?.size !== undefined) params.set("size", String(filters.size));
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.status) params.set("status", filters.status);

    const response = await apiClient.get<PaginatedResponse<Order>>(
      `/api/v1/orders/my-orders?${params.toString()}`
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch orders");
    }
    return response.data.result as PaginatedResponse<Order>;
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await apiClient.get<Order>(`/api/v1/orders/${id}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch order");
    }
    return response.data.result as Order;
  }

  async getAdminOrderById(id: number): Promise<Order> {
    const response = await apiClient.get<Order>(`/api/v1/admin/orders/${id}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch order");
    }
    return response.data.result as Order;
  }

  async getOrderByCode(orderCode: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/api/v1/orders/${orderCode}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch order");
    }
    return response.data.result as Order;
  }

  async cancelOrder(id: number): Promise<Order> {
    const response = await apiClient.put<Order>(`/api/v1/orders/${id}/cancel`, {});
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to cancel order");
    }
    return response.data.result as Order;
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await apiClient.get<DashboardSummary>("/api/v1/admin/dashboard/summary");
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch dashboard summary");
    }
    return response.data.result as DashboardSummary;
  }

  async getRevenueData(days: number = 30): Promise<RevenueData[]> {
    const response = await apiClient.get<RevenueData[]>(`/api/v1/admin/dashboard/revenue?range=${days}days`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch revenue data");
    }
    return response.data.result as RevenueData[];
  }

  async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    const response = await apiClient.get<TopProduct[]>(`/api/v1/admin/dashboard/top-products?limit=${limit}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch top products");
    }
    return response.data.result as TopProduct[];
  }

  async getOrderStatusCounts(): Promise<OrderStatusCount[]> {
    const response = await apiClient.get<OrderStatusCount[]>("/api/v1/admin/dashboard/order-status");
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch order status counts");
    }
    return response.data.result as OrderStatusCount[];
  }

  // Admin orders
  async getAllOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    if (filters?.page !== undefined) params.set("page", String(filters.page));
    if (filters?.size !== undefined) params.set("size", String(filters.size));
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.status) params.set("status", filters.status);

    const response = await apiClient.get<PaginatedResponse<Order>>(
      `/api/v1/admin/orders?${params.toString()}`
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch orders");
    }
    return response.data.result as PaginatedResponse<Order>;
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const response = await apiClient.put<Order>(`/api/v1/admin/orders/${orderId}/status`, { status });
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to update order status");
    }
    return response.data.result as Order;
  }
}

export const orderService = new OrderService();
export default orderService;