import { Outlet } from "react-router";
import { AppShell } from "@/shared/layout/AppShell";

const PublicRoutes = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export default PublicRoutes;
