import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../shared/ui/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PlayerProfilePage from "../pages/PlayerProfilePage";
import PublicRoutes from "./PublicRoutes";
import { useAuth } from "../hooks/useAuth.hook";

const ProtectedRoutes = () => {
  const { accessToken } = useAuth();

  if (!accessToken) return <Navigate to="/login" replace />;

  return <Outlet />;
};

const Routes = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<PublicRoutes />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route path="/login" element={<PublicRoutes />}>
          <Route index element={<LoginPage />} />
        </Route>

        <Route path="/register" element={<PublicRoutes />}>
          <Route index element={<RegisterPage />} />
        </Route>

        <Route path="/auth" element={<PublicRoutes />}>
          <Route index element={<Navigate to="/login" replace />} />
        </Route>

        <Route path="/players/:nickname" element={<PublicRoutes />}>
          <Route index element={<PlayerProfilePage />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/app" element={<HomePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />}></Route>
      </>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default Routes;
