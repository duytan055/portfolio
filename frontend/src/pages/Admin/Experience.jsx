import { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import "./Experience.css";
import { useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/*const initialExperiences = [
  {
    id: 1,
    company: "ABC Technology",
    position: "Backend Developer Intern",
    description: "Phát triển API và làm việc với cơ sở dữ liệu.",
    start_date: "2026-06-01",
    end_date: null,
    is_current: true,
    location: "Quy Nhơn, Việt Nam",
    image_url: "",
  },
  {
    id: 2,
    company: "XYZ Software",
    position: "Web Developer",
    description: "Xây dựng và bảo trì các ứng dụng web.",
    start_date: "2025-06-01",
    end_date: "2026-05-30",
    is_current: false,
    location: "Đà Nẵng, Việt Nam",
    image_url: "",
  },
]; */
const INITIAL_FROM_STATE = {
  company: "",
  position: "",
  description: "",
  start_date: "",
  end_date: "",
  is_current: false,
  location: "",
  image_url: "",
};

function Experience() {
  const [experiences, setExperiences] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState(INITIAL_FROM_STATE);

  const [editingId, setEditingId] = useState(null);

  const filteredExperiences = experiences.filter(
    (experience) =>
      experience.company.toLowerCase().includes(search.toLowerCase()) ||
      experience.position.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCurrentChange = (e) => {
    const checked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      is_current: checked,
      end_date: checked ? "" : prev.end_date,
    }));
  };

  useEffect(() => {
    fetchExperience();
  });

  //Lấy dữ liệu exp
  const fetchExperience = async () => {
    try {
      const respone = await fetch(`${API_BASE_URL}/api/experience`);
      const data = await respone.json();
      setExperiences(data);
    } catch (error) {
      console.error("Error fetching experience:", error);
    }
  };
  //Mở modal thêm mới
  const handleOpenModal = () => {
    setEditingId(null);
    setFormData(INITIAL_FROM_STATE);
    setShowModal(true);
  };

  //Mở modal edit
  const handleEdit = (experiences) => {
    setEditingId(experiences.id);

    setFormData({
      company: experiences.company,
      position: experiences.position,
      location: experiences.location,
      start_date: experiences.start_date || "",
      end_date: experiences.end_date || "",
      is_current: experiences.is_current,
      description: experiences.description || "",
      image_url: experiences.image_url,
    });

    setShowModal(true);
  };

  // Đóng modal và reset ô nhập
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(INITIAL_FROM_STATE);
  };

  //Thêm mới và cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
    };
    const isEdit = Boolean(editingId);
    const url = isEdit
      ? `${API_BASE_URL}/api/experience/${editingId}`
      : `${API_BASE_URL}/api/experience`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const respone = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!respone.ok) {
        throw new Error(`${isEdit ? "Cập nhật" : "Thêm"} kinh nghiệm thất bại`);
      }

      const savedExp = await respone.json();

      if (isEdit) {
        setExperiences((prev) =>
          prev.mao((item) => (item.id === editingId ? savedExp : item)),
        );
      } else {
        setExperiences((prev) => [savedExp, ...prev]);
      }
    } catch (error) {
      console.error("Error saving experience:", err);
      alert(`Lỗi khi ${isEdit ? "cập nhật" : "thêm"} kinh nghiệm !`);
    }
  };

  // Xóa exp
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa kinh nghiệm này?")) {
      return;
    }
    try {
      const respone = await fetch(`${API_BASE_URL}/api/experience/${id}`, {
        method: "DELETE",
      });

      if (respone.ok) {
        setExperiences((prev) =>
          prev.filter((experiences) => experiences.id !== id),
        );
      } else {
        alert("Xóa kinh nghiệm thất bại!");
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const [year, month] = date.split("-");

    return `${month}/${year}`;
  };

  return (
    <div className="experience-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="experience-header">
        <div>
          <h1>Kinh nghiệm</h1>
          <p>Quản lý quá trình học tập và làm việc</p>
        </div>

        <button
          className="add-experience-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus />
          Thêm kinh nghiệm
        </button>
      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div className="experience-toolbar">
        <div className="experience-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Tìm kiếm kinh nghiệm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="experience-table-container">
        <table className="experience-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Công ty / Tổ chức</th>
              <th>Vị trí</th>
              <th>Thời gian</th>
              <th>Địa điểm</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredExperiences.length > 0 ? (
              filteredExperiences.map((experience, index) => (
                <tr key={experience.id}>
                  {/* STT */}
                  <td>{index + 1}</td>

                  {/* COMPANY */}
                  <td>
                    <div className="experience-company">
                      <div className="company-image">
                        {experience.company.charAt(0)}
                      </div>

                      <div>
                        <h3>{experience.company}</h3>

                        <p>{experience.description}</p>
                      </div>
                    </div>
                  </td>

                  {/* POSITION */}
                  <td>
                    <span className="position">{experience.position}</span>
                  </td>

                  {/* DATE */}
                  <td>
                    <div className="experience-date">
                      <span>{formatDate(experience.start_date)}</span>

                      <span>→</span>

                      <span>
                        {experience.is_current
                          ? "Hiện tại"
                          : formatDate(experience.end_date)}
                      </span>
                    </div>
                  </td>

                  {/* LOCATION */}
                  <td>
                    <span className="location">{experience.location}</span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={
                        experience.is_current
                          ? "experience-status current"
                          : "experience-status ended"
                      }
                    >
                      {experience.is_current ? "Đang làm" : "Đã kết thúc"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="experience-actions">
                      <button className="edit-btn">
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(experience.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-experience">
                  Không tìm thấy kinh nghiệm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================
          ADD MODAL
      ========================= */}

      {showModal && (
        <div
          className="experience-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="experience-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="modal-header">
              <div>
                <h2>Thêm kinh nghiệm</h2>

                <p>Thêm một kinh nghiệm làm việc mới</p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleAddExperience}>
              {/* COMPANY */}

              <div className="form-group">
                <label>Công ty / Tổ chức</label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Nhập tên công ty..."
                  required
                />
              </div>

              {/* POSITION */}

              <div className="form-group">
                <label>Vị trí</label>

                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Ví dụ: Backend Developer Intern"
                  required
                />
              </div>

              {/* LOCATION */}

              <div className="form-group">
                <label>Địa điểm</label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ví dụ: Quy Nhơn, Việt Nam"
                />
              </div>

              {/* DATE */}

              <div className="form-group">
                <label>Thời gian</label>

                <div className="date-row">
                  <div>
                    <span className="date-label">Ngày bắt đầu</span>

                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <span className="date-label">Ngày kết thúc</span>

                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      disabled={formData.is_current}
                    />
                  </div>
                </div>
              </div>

              {/* CURRENT */}

              <label className="current-checkbox">
                <input
                  type="checkbox"
                  name="is_current"
                  checked={formData.is_current}
                  onChange={handleCurrentChange}
                />

                <span>Tôi đang làm việc tại đây</span>
              </label>

              {/* DESCRIPTION */}

              <div className="form-group">
                <label>Mô tả</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả công việc, trách nhiệm..."
                  rows="5"
                />
              </div>

              {/* IMAGE */}

              <div className="form-group">
                <label>Hình ảnh / Logo công ty</label>

                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              {/* FOOTER */}

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>

                <button type="submit" className="save-experience-btn">
                  {editingId ? <FaSave /> : <FaPlus />}
                  {editingId ? "Cập nhật" : "Thêm kinh nghiệm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Experience;
