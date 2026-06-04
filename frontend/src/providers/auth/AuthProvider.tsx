import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import Loader from "../../shared/ui/Loader";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem(REFRESH_TOKEN_KEY),
  );

  const [mounted, setMounted] = useState(false);

  const setToken = (newAccessToken: string, newRefreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
  };

  const clearToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccessToken(null);
    setRefreshToken(null);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loader />;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        setToken,
        clearToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
