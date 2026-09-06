import { useEffect, useState, useContext } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaGithub,
  FaExternalLinkAlt,
  FaSave,
} from "react-icons/fa";
import { createPortal } from "react-dom";
import { AuthContext } from "../../context/AuthContext";

import "./Projects.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const INITIAL_FORM_STATE = {
  title: "",
  short_description: "",
  description: "",
  image_url: "",
  technologies: "",
  github_url: "",
  demo_url: "",
  status: true,
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const { token } = useContext(AuthContext);

  // Form State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Load danh sách dự án
  useEffect(() => {
    fetchProjects();
  }, []);

  // Lấy dữ liệu dự án từ API
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      if (!response.ok) throw new Error("Lỗi tải danh sách dự án");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Xử lý thay đổi các ô nhập liệu chữ & checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Xử lý khi chọn file ảnh từ máy
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Mở Modal Thêm mới
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
    setImageFile(null);
    setPreviewUrl("");
    setShowModal(true);
  };

  // Mở Modal Chỉnh sửa
  const handleEdit = (project) => {
    setEditingId(project.id);

    const techString = Array.isArray(project.technologies)
      ? project.technologies.join(", ")
      : project.technologies || "";

    setFormData({
      title: project.title || "",
      short_description: project.short_description || "",
      description: project.description || "",
      image_url: project.image_url || "",
      technologies: techString,
      github_url: project.github_url || "",
      demo_url: project.demo_url || "",
      status: project.status ?? true,
    });

    setImageFile(null);
    if (project.image_url) {
      const fullImgUrl = project.image_url.startsWith("http")
        ? project.image_url
        : `${API_BASE_URL}${project.image_url}`;
      setPreviewUrl(fullImgUrl);
    } else {
      setPreviewUrl("");
    }

    setShowModal(true);
  };

  // Đóng Modal và Reset Form
  const handleCloseModal = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
    setImageFile(null);
    setPreviewUrl("");
  };

  // Form Xử lý Thêm mới & Cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("short_description", formData.short_description || "");
    data.append("description", formData.description || "");
    data.append("technologies", formData.technologies || "");
    data.append("github_url", formData.github_url || "");
    data.append("demo_url", formData.demo_url || "");
    data.append("status", formData.status);

    if (imageFile) {
      data.append("image", imageFile);
    } else {
      data.append("image_url", formData.image_url || "");
    }

    const isEdit = Boolean(editingId);
    const url = isEdit
      ? `${API_BASE_URL}/api/projects/${editingId}`
      : `${API_BASE_URL}/api/projects`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          return;
        }
        throw new Error(`${isEdit ? "Cập nhật" : "Thêm"} dự án thất bại`);
      }

      const savedProject = await response.json();

      if (isEdit) {
        setProjects((prev) =>
          prev.map((item) => (item.id === editingId ? savedProject : item)),
        );
      } else {
        setProjects((prev) => [savedProject, ...prev]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving project:", err);
      alert(`Lỗi khi ${isEdit ? "cập nhật" : "thêm"} dự án!`);
    }
  };

  // Xóa dự án
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProjects((prev) => prev.filter((project) => project.id !== id));
      } else {
        alert("Xóa dự án thất bại hoặc bạn không có quyền thực hiện!");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Lọc dự án theo từ khóa
  const filteredProjects = projects.filter((project) =>
    project.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="projects-page">
      {/* HEADER */}
      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p>Quản lý danh sách dự án</p>
        </div>

        <button className="add-project-btn" onClick={handleOpenAddModal}>
          <FaPlus /> Thêm dự án
        </button>
      </div>

      {/* SEARCH */}
      <div className="projects-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm dự án..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="projects-table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Dự án</th>
              <th>Công nghệ</th>
              <th>Trạng thái</th>
              <th>Link</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <tr key={project.id || index}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="project-info">
                      <div className="project-image">
                        {project.image_url ? (
                          <img
                            src={
                              project.image_url.startsWith("http")
                                ? project.image_url
                                : `${API_BASE_URL}${project.image_url}`
                            }
                            alt={project.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : project.title ? (
                          project.title.charAt(0).toUpperCase()
                        ) : (
                          "P"
                        )}
                      </div>
                      <div>
                        <h3>{project.title}</h3>
                        <p>
                          {project.short_description || project.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="technology-list">
                      {(Array.isArray(project.technologies)
                        ? project.technologies
                        : (project.technologies || "").split(",")
                      )
                        .map((tech) => tech.trim())
                        .filter(Boolean)
                        .map((tech, idx) => (
                          <span key={idx}>{tech}</span>
                        ))}
                    </div>
                  </td>

                  <td>
                    <span
                      className={
                        project.status !== false
                          ? "status active"
                          : "status hidden"
                      }
                    >
                      {project.status !== false ? "Active" : "Hidden"}
                    </span>
                  </td>

                  <td>
                    <div className="project-links">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaGithub />
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaExternalLinkAlt />
                        </a>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="project-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(project)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(project.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-projects">
                  Không tìm thấy dự án
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT PROJECT MODAL */}
      {showModal &&
        createPortal(
          <div className="project-modal-overlay" onClick={handleCloseModal}>
            <div className="project-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>{editingId ? "Sửa dự án" : "Thêm dự án"}</h2>
                  <p>
                    {editingId
                      ? "Cập nhật thông tin dự án"
                      : "Tạo một dự án mới cho portfolio"}
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={handleCloseModal}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên dự án</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Nhập tên dự án"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Short Description</label>
                  <textarea
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả ngắn dự án"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả chi tiết</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả dự án"
                    rows="4"
                  />
                </div>

                {/* Chọn ảnh từ máy tính */}
                <div className="form-group">
                  <label>Hình ảnh dự án</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {previewUrl && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                          width: "120px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #334155",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Công nghệ</label>
                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    placeholder="React, NodeJS, PostgreSQL"
                  />
                  <small>Ngăn cách các công nghệ bằng dấu phẩy</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>GitHub</label>
                    <input
                      type="text"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Demo</label>
                    <input
                      type="text"
                      name="demo_url"
                      value={formData.demo_url}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <label className="status-checkbox">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />
                  <span>Hiển thị dự án</span>
                </label>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCloseModal}
                  >
                    Hủy
                  </button>

                  <button type="submit" className="save-project-btn">
                    {editingId ? <FaSave /> : <FaPlus />}
                    {editingId ? " Cập nhật" : " Thêm dự án"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default Projects;
