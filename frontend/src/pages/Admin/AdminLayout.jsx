import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import AdminSidebar from "../../components/Admin/AdminSideBar";

import "./AdminLayout.css";

function AdminLayout() {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main-content">
        <div key={location.pathname} className="admin-page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
