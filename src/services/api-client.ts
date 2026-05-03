import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import { API_BASE_URL, API_RESPONSE_CODES, STORAGE_KEYS } from "@/lib";

export interface ApiErrorResponse {
  code: number;
  message: string;
  result: null;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T | null;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private clearAuthAndRedirect() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) => {
        return response;
      },
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (!refreshToken) {
              this.clearAuthAndRedirect();
              return Promise.reject(error);
            }

            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
              refreshToken,
            });

            if (response.data.code === API_RESPONSE_CODES.SUCCESS) {
              const { accessToken, refreshToken: newRefreshToken } = response.data.result as {
                accessToken: string;
                refreshToken: string;
              };

              localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
              localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }

              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearAuthAndRedirect();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, config?: InternalAxiosRequestConfig) {
    return this.client.get<ApiResponse<T>>(url, config);
  }

  post<T>(url: string, data?: unknown, config?: InternalAxiosRequestConfig) {
    return this.client.post<ApiResponse<T>>(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: InternalAxiosRequestConfig) {
    return this.client.put<ApiResponse<T>>(url, data, config);
  }

  delete<T>(url: string, config?: InternalAxiosRequestConfig) {
    return this.client.delete<ApiResponse<T>>(url, config);
  }

  patch<T>(url: string, data?: unknown, config?: InternalAxiosRequestConfig) {
    return this.client.patch<ApiResponse<T>>(url, data, config);
  }

  uploadFile<T>(url: string, formData: FormData): Promise<T> {
    return this.client.post<ApiResponse<T>>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(res => {
      if (res.data.code !== API_RESPONSE_CODES.SUCCESS) {
        throw new Error(res.data.message || "Upload failed");
      }
      return res.data.result as T;
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;