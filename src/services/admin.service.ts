import apiClient from "./api-client";
import type { Motorcycle, MotorcycleListItem, MotorcycleFilters, PaginatedResponse, Brand, Category, Variant } from "@/types";

class AdminService {
  // Motorcycles - Admin endpoints
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
      `/api/v1/admin/motorcycles?${params.toString()}`
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch motorcycles");
    }
    return response.data.result as PaginatedResponse<MotorcycleListItem>;
  }

  async getMotorcycleById(id: number): Promise<Motorcycle> {
    const response = await apiClient.get<Motorcycle>(`/api/v1/admin/motorcycles/${id}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch motorcycle");
    }
    return response.data.result as Motorcycle;
  }

  async createMotorcycle(data: Partial<Motorcycle>): Promise<Motorcycle> {
    const response = await apiClient.post<Motorcycle>("/api/v1/admin/motorcycles", data);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to create motorcycle");
    }
    return response.data.result as Motorcycle;
  }

  async updateMotorcycle(id: number, data: Partial<Motorcycle>): Promise<Motorcycle> {
    const response = await apiClient.put<Motorcycle>(`/api/v1/admin/motorcycles/${id}`, data);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to update motorcycle");
    }
    return response.data.result as Motorcycle;
  }

  async deleteMotorcycle(id: number): Promise<void> {
    const response = await apiClient.delete(`/api/v1/admin/motorcycles/${id}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to delete motorcycle");
    }
  }

  // Variants
  async createVariant(motorcycleId: number, data: Partial<Variant>): Promise<Variant> {
    const response = await apiClient.post<Variant>("/api/v1/admin/variants", {
      ...data,
      motorcycleId,
    });
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to create variant");
    }
    return response.data.result as Variant;
  }

  async updateVariant(id: number, data: Partial<Variant>): Promise<Variant> {
    const response = await apiClient.put<Variant>(`/api/v1/admin/variants/${id}`, data);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to update variant");
    }
    return response.data.result as Variant;
  }

  async deleteVariant(id: number): Promise<void> {
    const response = await apiClient.delete(`/api/v1/admin/variants/${id}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to delete variant");
    }
  }

  // Variant Images
  async addVariantImage(variantId: number, imageUrl: string): Promise<void> {
    const response = await apiClient.post("/api/v1/admin/variant-images", {
      variantId,
      imageUrl,
    });
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to add image");
    }
  }

  async uploadVariantImage(variantId: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    await apiClient.uploadFile(`/api/admin/variants/${variantId}/images`, formData);
  }

  async setThumbnail(imageId: number): Promise<void> {
    const response = await apiClient.put(`/api/admin/images/${imageId}/thumbnail`, {});
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to set thumbnail");
    }
  }

  async deleteImage(imageId: number): Promise<void> {
    const response = await apiClient.delete(`/api/admin/images/${imageId}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to delete image");
    }
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get<Brand[]>("/api/v1/brands");
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch brands");
    }
    return response.data.result as Brand[];
  }

  async createBrand(name: string): Promise<Brand> {
    const response = await apiClient.post<Brand>("/api/v1/admin/brands", { name });
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to create brand");
    }
    return response.data.result as Brand;
  }

  async updateBrand(id: number, name: string): Promise<Brand> {
    const response = await apiClient.put<Brand>(`/api/v1/admin/brands/${id}`, { name });
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to update brand");
    }
    return response.data.result as Brand;
  }

  async deleteBrand(id: number): Promise<void> {
    const response = await apiClient.delete(`/api/v1/admin/brands/${id}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to delete brand");
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/api/v1/categories");
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch categories");
    }
    return response.data.result as Category[];
  }

  async createCategory(name: string): Promise<Category> {
    const response = await apiClient.post<Category>("/api/v1/admin/categories", { name });
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to create category");
    }
    return response.data.result as Category;
  }

  async updateCategory(id: number, name: string): Promise<Category> {
    const response = await apiClient.put<Category>(`/api/v1/admin/categories/${id}`, { name });
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to update category");
    }
    return response.data.result as Category;
  }

  async deleteCategory(id: number): Promise<void> {
    const response = await apiClient.delete(`/api/v1/admin/categories/${id}`);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to delete category");
    }
  }
}

export const adminService = new AdminService();
export default adminService;