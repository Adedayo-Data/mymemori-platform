import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import BottomNav from "./BottomNav";
import { useAuth } from "../context/authContext";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Routes where Navigation (top bar) should be hidden even if authenticated
  const shouldHideNavigation = () => {
    const path = location.pathname;
    if (path === "/" || path === "/auth" || path === "/verify" || path === "/gallery") return true;
    if (path.startsWith("/visit/")) return true;
    return false;
  };

  // Routes where BottomNav should be hidden
  const shouldHideBottomNav = () => {
    const path = location.pathname;
    if (path === "/" || path === "/auth" || path === "/verify") return true;
    if (path.startsWith("/visit/")) return true;
    return false;
  };

  const showNavigation = isAuthenticated && !shouldHideNavigation();
  const showBottomNav = isAuthenticated && !shouldHideBottomNav();

  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && <Navigation />}
      
      <div className="flex-1">
        <Outlet />
      </div>

      {showBottomNav && (
        <div className="pb-20 md:pb-0">
          <BottomNav />
        </div>
      )}
    </div>
  );
};

export default Layout;
