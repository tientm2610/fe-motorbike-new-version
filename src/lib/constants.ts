export const APP_NAME = "Honda Dealership";
export const APP_DESCRIPTION = "Premium Motorcycle Ecommerce";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const STORAGE_KEYS = {
  THEME: "theme",
  PREFERENCES: "ui-preferences",
  AUTH_TOKEN: "auth-token",
  REFRESH_TOKEN: "refresh-token",
} as const;

export const API_RESPONSE_CODES = {
  SUCCESS: 1000,
  INTERNAL_ERROR: 9999,
  BAD_REQUEST: 1001,
  UNAUTHORIZED: 1003,
  FORBIDDEN: 1004,
  NOT_FOUND: 1005,
} as const;

export const QUERY_KEYS = {
  MOTORCYCLES: ["motorcycles"],
  MOTORCYCLE: (id: string | number) => ["motorcycles", id],
  BRANDS: ["brands"],
  CATEGORIES: ["categories"],
  VARIANTS: ["variants"],
  VARIANT: (id: string | number) => ["variants", id],
  CART: ["cart"],
  ORDERS: ["orders"],
  ORDER: (id: string | number) => ["orders", id],
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 0,
  SIZE: 20,
  SORT: "createdAt,DESC",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;