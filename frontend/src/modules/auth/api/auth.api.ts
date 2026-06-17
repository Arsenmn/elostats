import { apiClient } from "@/api/apiClient";
import type {
  AuthFormData,
  AuthResponse,
  AuthVerificationResponse,
  ConfirmAuthCodeData,
  OAuthProvider,
} from "../types/auth.interface";

export const authApi = {
  login: async (data: AuthFormData) => {
    return apiClient.publicRequest<AuthVerificationResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  register: async (data: AuthFormData) => {
    return apiClient.publicRequest<AuthVerificationResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  confirmLogin: async (data: ConfirmAuthCodeData) => {
    return apiClient.publicRequest<AuthResponse>("/auth/login/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  confirmRegister: async (data: ConfirmAuthCodeData) => {
    return apiClient.publicRequest<AuthResponse>("/auth/register/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getOAuthUrl: (provider: OAuthProvider) => {
    return apiClient.getPublicUrl(`/auth/${provider}`);
  },
};
