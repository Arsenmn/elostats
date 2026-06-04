import { Outlet } from "react-router";
import Header from "../components/header/Header";

const PublicRoutes = () => {
  return (
    <div>
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default PublicRoutes;
