import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("adminToken");
    }

    navigate("/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <span className="brand-dot"></span>
        <h2>Admin Console</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">📊</span> Tổng quan
        </NavLink>

        <NavLink
          to="/admin/projects"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">🚀</span> Dự án
        </NavLink>

        <NavLink
          to="/admin/experience"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">💼</span> Kinh nghiệm
        </NavLink>

        <NavLink
          to="/admin/certificates"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">📜</span> Chứng chỉ
        </NavLink>

        <NavLink
          to="/admin/toolsskills"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">⚡</span> Kỹ năng
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <a href="/" target="_blank" rel="noreferrer" className="view-site-btn">
          🌐 Xem Portfolio
        </a>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
