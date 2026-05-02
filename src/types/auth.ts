export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}