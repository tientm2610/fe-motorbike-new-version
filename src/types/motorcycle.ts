export type MotorcycleStatus = "ACTIVE" | "INACTIVE";
export type VariantStatus = "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";

export interface Motorcycle {
  id: number;
  name: string;
  code: string;
  slug: string;
  description: string;
  specsJson: string;
  brandId: number;
  categoryId: number;
  brandName: string;
  categoryName: string;
  status: MotorcycleStatus;
  minPrice: number;
  maxPrice: number;
  thumbnailUrl: string;
  totalStock: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MotorcycleListItem {
  id: number;
  name: string;
  slug: string;
  minPrice: number;
  thumbnailUrl: string;
  totalStock: number;
  brandName: string;
  categoryName: string;
}

export interface MotorcycleFilters {
  page?: number;
  size?: number;
  sort?: string;
  brandId?: number;
  categoryId?: number;
  status?: MotorcycleStatus;
  keyword?: string;
}

export interface Brand {
  id: number;
  name: string;
  logoUrl?: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
}

export interface Variant {
  id: number;
  motorcycleId: number;
  sku: string;
  variantName: string;
  colorName: string;
  colorCode?: string;
  price: number;
  stockQuantity: number;
  status: VariantStatus;
  images?: VariantImage[];
  createdAt: string;
}

export interface VariantImage {
  id: number;
  variantId: number;
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
}

export interface CreateMotorcycleRequest {
  name: string;
  code: string;
  slug: string;
  description?: string;
  specsJson?: string;
  brandId: number;
  categoryId: number;
  status: MotorcycleStatus;
}

export interface CreateVariantRequest {
  motorcycleId: number;
  sku: string;
  variantName: string;
  colorName: string;
  colorCode?: string;
  price: number;
  stockQuantity: number;
  status: VariantStatus;
}