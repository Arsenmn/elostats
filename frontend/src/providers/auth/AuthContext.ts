import { createContext } from "react";

export type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  setToken: (access_token: string, refresh_token: string) => void;
  clearToken: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
