import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router";
import NotFoundPage from "../shared/ui/NotFoundPage";
import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import OAuthCallbackPage from "../modules/auth/pages/OAuthCallbackPage";
import PublicRoutes from "./PublicRoutes";
import { AppShell } from "@/shared/layout/AppShell";
import { useAuth } from "@/providers/auth/useAuth.hook";
import PlayersPage from "@/modules/players/pages/PlayersPage";
import PlayerProfilePage from "@/modules/player-profile/pages/PlayerProfilePage";
import AnalysisPage from "@/modules/ai-analysis/pages/AnalysisPage";
import ComparePage from "@/modules/player-compare/pages/ComparePage";
import HomePage from "@/modules/home/pages/HomePage";

const ProtectedRoutes = () => {
  const { accessToken } = useAuth();

  if (!accessToken) return <Navigate to="/login" replace />;

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
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
          <Route path="oauth/callback" element={<OAuthCallbackPage />} />
        </Route>

        <Route path="/players" element={<PublicRoutes />}>
          <Route index element={<PlayersPage />} />
        </Route>

        <Route path="/players/:nickname" element={<PublicRoutes />}>
          <Route index element={<PlayerProfilePage />} />
        </Route>

        <Route path="/analysis" element={<PublicRoutes />}>
          <Route index element={<AnalysisPage />} />
        </Route>

        <Route path="/compare" element={<PublicRoutes />}>
          <Route index element={<ComparePage />} />
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
