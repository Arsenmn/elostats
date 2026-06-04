import { Navigate, Outlet } from "react-router";
import Header from "../components/header/Header";
import { useAuth } from "../hooks/useAuth.hook";

const ProtectedRoutes = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header />
      <div className="flex-1 min-h-0 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoutes;
