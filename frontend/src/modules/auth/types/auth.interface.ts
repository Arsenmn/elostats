import type { User } from "../../../types/user.interface";

export type AuthFormData = {
  email: string;
  password: string;
};

export interface AuthResponse {
  user: Pick<User, "id" | "email">;
  accessToken: string;
  refreshToken: string;
}

export interface AuthVerificationResponse {
  verificationId: string;
  expiresAt: string;
  message: string;
}

export interface ConfirmAuthCodeData {
  verificationId: string;
  code: string;
}

export type OAuthProvider = "google" | "steam";
