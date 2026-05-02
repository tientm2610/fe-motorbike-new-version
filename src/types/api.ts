export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiError {
  code: number;
  message: string;
  result: null;
}

export const API_RESPONSE_CODES = {
  SUCCESS: 1000,
  INTERNAL_ERROR: 9999,
  BAD_REQUEST: 1001,
  UNAUTHORIZED: 1003,
  FORBIDDEN: 1004,
  NOT_FOUND: 1005,
} as const;

export type ApiResponseCode = typeof API_RESPONSE_CODES[keyof typeof API_RESPONSE_CODES];