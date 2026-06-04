import { jwtDecode } from "jwt-decode";
import type { AuthResponse } from "../types/auth.interface";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

class ApiClient {
  private baseURL: string;

  constructor() {
    const backendURL = (
      import.meta.env.VITE_BACKEND_ADDR || "http://localhost:3000/api"
    ).replace(/\/$/, "");
    this.baseURL = backendURL.endsWith("/api")
      ? backendURL
      : `${backendURL}/api`;
  }

  private getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp! * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken || this.isTokenExpired(refreshToken)) {
      this.clearTokens();
      throw new Error("Refresh token expired. Please login again.");
    }

    const response = await fetch(`${this.baseURL}/auth/login/access-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error("Failed to refresh token. Please login again.");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      (await response.json()) as AuthResponse;
    this.setTokens(accessToken, newRefreshToken);

    return accessToken;
  }

  private async getValidAccessToken(): Promise<string> {
    let accessToken = this.getAccessToken();

    if (!accessToken) {
      throw new Error("No access token found. Please login.");
    }

    if (this.isTokenExpired(accessToken)) {
      accessToken = await this.refreshAccessToken();
    }

    return accessToken;
  }

  private getUrl(endpoint: string): string {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint}`;

    return url;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const message = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message || `HTTP ${response.status}`;
      throw new Error(message);
    }

    return data as T;
  }

  async publicRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(this.getUrl(endpoint), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    return this.parseResponse<T>(response);
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getValidAccessToken();

    const response = await fetch(this.getUrl(endpoint), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return this.parseResponse<T>(response);
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
