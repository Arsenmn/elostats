import type { User } from "./user.interface";

export interface AuthFormData extends Pick<User, "email" | "password"> {}

export interface AuthResponse {
  user: Pick<User, "id" | "email">;
  accessToken: string;
  refreshToken: string;
}
