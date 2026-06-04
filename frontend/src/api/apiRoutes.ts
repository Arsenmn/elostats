const BACKEND_ADDR =
  import.meta.env.VITE_BACKEND_ADDR || "http://localhost:3000";

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BACKEND_ADDR}/api/auth/login`,
    LOGOUT: `${BACKEND_ADDR}/api/auth/logout`,
    REGISTER: `${BACKEND_ADDR}/api/auth/register`,
    REFRESH: `${BACKEND_ADDR}/api/auth/refresh`,
  },
  USER: `${BACKEND_ADDR}/api/user`,
};
