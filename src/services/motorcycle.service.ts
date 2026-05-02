import { apiClient } from "./api-client";
import type { Motorcycle, MotorcycleListItem, MotorcycleFilters, PaginatedResponse, Brand, Category, Variant } from "@/types";

class MotorcycleService {
  async getMotorcycles(filters?: MotorcycleFilters): Promise<PaginatedResponse<MotorcycleListItem>> {
    const params = new URLSearchParams();
    if (filters?.page !== undefined) params.set("page", String(filters.page));
    if (filters?.size !== undefined) params.set("size", String(filters.size));
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.brandId) params.set("brandId", String(filters.brandId));
    if (filters?.categoryId) params.set("categoryId", String(filters.categoryId));
    if (filters?.status) params.set("status", filters.status);
    if (filters?.keyword) params.set("keyword", filters.keyword);

    const response = await apiClient.get<PaginatedResponse<MotorcycleListItem>>(
      `/api/v1/motorcycles?${params.toString()}`
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch motorcycles");
    }
    return response.data.result as PaginatedResponse<MotorcycleListItem>;
  }

  async getMotorcycleById(id: number): Promise<Motorcycle> {
    const response = await apiClient.get<Motorcycle>(`/api/v1/motorcycles/${id}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch motorcycle");
    }
    return response.data.result as Motorcycle;
  }

  async getMotorcycleBySlug(slug: string): Promise<Motorcycle> {
    const response = await apiClient.get<Motorcycle>(`/api/v1/motorcycles/slug/${slug}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch motorcycle");
    }
    return response.data.result as Motorcycle;
  }

  async searchMotorcycles(keyword: string, page = 0, size = 20): Promise<PaginatedResponse<MotorcycleListItem>> {
    const response = await apiClient.get<PaginatedResponse<MotorcycleListItem>>(
      `/api/v1/motorcycles/search?keyword=${keyword}&page=${page}&size=${size}`
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to search motorcycles");
    }
    return response.data.result as PaginatedResponse<MotorcycleListItem>;
  }

  async getVariants(motorcycleId: number): Promise<Variant[]> {
    const response = await apiClient.get<Variant[]>(`/api/v1/motorcycles/${motorcycleId}/variants`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch variants");
    }
    return response.data.result as Variant[];
  }

  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get<Brand[]>("/api/v1/brands");
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch brands");
    }
    return response.data.result as Brand[];
  }

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/api/v1/categories");
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch categories");
    }
    return response.data.result as Category[];
  }
}

export const motorcycleService = new MotorcycleService();
export default motorcycleService;