import { Outlet } from "react-router-dom";


const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
