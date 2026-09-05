import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login(data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Tài khoản hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Không thể kết nối đến máy chủ!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Đăng nhập Admin</h2>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin} autoComplete="off">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="login-submit-btn">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
