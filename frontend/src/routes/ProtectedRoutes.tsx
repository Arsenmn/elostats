import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/providers/auth/useAuth.hook";
import { AppShell } from "@/shared/layout/AppShell";

const ProtectedRoutes = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return (
    <AppShell>
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
    </AppShell>
  );
};

export default ProtectedRoutes;
