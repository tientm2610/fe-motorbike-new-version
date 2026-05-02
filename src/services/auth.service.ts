import { apiClient } from "./api-client";
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from "@/types";

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/api/v1/auth/login", credentials);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Login failed");
    }
    return response.data.result as AuthResponse;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/api/v1/auth/register", data);
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Registration failed");
    }
    return response.data.result as AuthResponse;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/api/v1/auth/refresh", { refreshToken });
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Token refresh failed");
    }
    return response.data.result as AuthResponse;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/v1/auth/logout");
    } catch {
      // Ignore logout errors
    }
  }
}

export const authService = new AuthService();
export default authService;