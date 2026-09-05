import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css";
import {
  FolderKanban,
  Wrench,
  Award,
  Briefcase,
  PlusCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalSkills: 0,
    totalCertificates: 0,
    totalExperiences: 0,
  });
  const [loading, setLoading] = useState(true);

  // 4. Lấy token
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Dự án", count: stats.totalProjects, color: "#8b5cf6" },
    { name: "Kỹ năng", count: stats.totalSkills, color: "#3b82f6" },
    { name: "Kinh nghiệm", count: stats.totalExperiences, color: "#06b6d4" },
    { name: "Chứng chỉ", count: stats.totalCertificates, color: "#4ade80" },
  ];

  if (loading)
    return <div className="dashboard-loading">Đang tải dữ liệu...</div>;

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Chào mừng trở lại! Dưới đây là tổng quan hệ thống của bạn.</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <FolderKanban size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-title">Tổng dự án</span>
            <h2 className="stat-value">{stats.totalProjects}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Wrench size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-title">Kỹ năng</span>
            <h2 className="stat-value">{stats.totalSkills}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cyan">
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-title">Kinh nghiệm</span>
            <h2 className="stat-value">{stats.totalExperiences}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-title">Chứng chỉ</span>
            <h2 className="stat-value">{stats.totalCertificates}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card main-card">
          <div className="card-header">
            <h3>Thống kê dữ liệu Portfolio</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={chartData}
                margin={{ top: 25, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#23232b"
                  vertical={false}
                />
                <XAxis dataKey="name" stroke="#888" tickLine={false} />
                <YAxis stroke="#888" tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1b1b22",
                    borderColor: "#2d2d35",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "13px",
                  }}
                  formatter={(value) => [`${value} mục`, "Số lượng"]}
                  cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={45}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="count"
                    position="top"
                    fill="#aaa"
                    fontSize={13}
                    offset={8}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card side-card">
          <div className="card-header">
            <h3>Thao tác nhanh</h3>
          </div>
          <div className="quick-actions">
            <Link to="/admin/projects" className="action-item">
              <PlusCircle size={18} />
              <span>Thêm dự án mới</span>
            </Link>
            <Link to="/admin/skills" className="action-item">
              <PlusCircle size={18} />
              <span>Thêm kỹ năng mới</span>
            </Link>
            <Link to="/admin/experiences" className="action-item">
              <PlusCircle size={18} />
              <span>Thêm kinh nghiệm mới</span>
            </Link>
            <Link to="/admin/certificates" className="action-item">
              <PlusCircle size={18} />
              <span>Thêm chứng chỉ mới</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
