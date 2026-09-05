import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminSidebar from "../../components/Admin/AdminSideBar";
import "./AdminLayout.css";

function AdminLayout() {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
