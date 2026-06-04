import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { API_ROUTES } from "../api/apiRoutes";
import { useAuth } from "./useAuth.hook";

export const useLogout = () => {
  const navigate = useNavigate();
  const { accessToken, clearToken } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(API_ROUTES.AUTH.LOGOUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message || "An unexpected error occured");
      }

      return response.json();
    },
    onSuccess: () => {
      clearToken();
      navigate("/");
    },
    onError: () => {
      clearToken();
      navigate("/");
      throw new Error("An error");
    },
  });

  return {
    logout: logoutMutation.mutate,
    isLoading: logoutMutation.isPending,
  };
};
