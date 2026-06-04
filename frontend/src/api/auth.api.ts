import type { AuthFormData, AuthResponse } from "../types/auth.interface";
import { apiClient } from "./apiClient";

export const authApi = {
  login: async (data: AuthFormData) => {
    return apiClient.publicRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  register: async (data: AuthFormData) => {
    return apiClient.publicRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
