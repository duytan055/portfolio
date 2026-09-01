import { useState } from "react";
import "./Admin.css"; // (Tùy chọn) file css trang trí bên dưới

function Admin() {
  /*const [formData, setFormData] = useState({
    title: "",
    shortDesc: "",
    fullDesc: "",
    image: "",
    githubLink: "",
    demoLink: "",
    technologies: "", // Nhập dạng: React, NodeJS, PostgreSQL
    isFeatured: false,
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // Xử lý khi thay đổi ô input / textarea
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Xử lý Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Chuyển chuỗi technologies (phân cách bằng dấu phẩy) thành Array
    const techArray = formData.technologies
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const payload = {
      ...formData,
      technologies: techArray,
    };

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "✅ Thêm dự án mới thành công!" });
        // Reset form sau khi thêm thành công
        setFormData({
          title: "",
          shortDesc: "",
          fullDesc: "",
          image: "",
          githubLink: "",
          demoLink: "",
          technologies: "",
          isFeatured: false,
        });
      } else {
        setMessage({ type: "error", text: `❌ Lỗi: ${data.message}` });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Không thể kết nối tới Server!" });
    } finally {
      setLoading(false);
    }
  };*/

  return (
    <div className="admin-container">
      <h2>Thêm Dự Án Mới (Admin)</h2>

      {message.text && (
        <div className={`alert-message ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Tên dự án (*):</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ví dụ: E-commerce Website"
            required
          />
        </div>

        <div className="form-group">
          <label>Mô tả ngắn (Hiển thị ngoài Card):</label>
          <input
            type="text"
            name="shortDesc"
            value={formData.shortDesc}
            onChange={handleChange}
            placeholder="Mô tả tóm tắt 1-2 câu"
          />
        </div>

        <div className="form-group">
          <label>Mô tả chi tiết (Hiển thị trong Modal Popup) (*):</label>
          <textarea
            name="fullDesc"
            rows="5"
            value={formData.fullDesc}
            onChange={handleChange}
            placeholder="Chi tiết về dự án, bài toán giải quyết..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>URL Hình ảnh:</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Công nghệ sử dụng (phân cách bằng dấu phẩy):</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, PostgreSQL"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Link Github:</label>
            <input
              type="text"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="form-group">
            <label>Link Live Demo:</label>
            <input
              type="text"
              name="demoLink"
              value={formData.demoLink}
              onChange={handleChange}
              placeholder="https://mydemo.com"
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            Đánh dấu là Dự án nổi bật (Featured)
          </label>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Đang lưu..." : "Thêm Dự Án"}
        </button>
      </form>
    </div>
  );
}

export default Admin;
