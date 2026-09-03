import { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

import "./Experience.css";

const initialExperiences = [
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
];

function Experience() {
  const [experiences, setExperiences] = useState(initialExperiences);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    image_url: "",
  });

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

  const handleAddExperience = (e) => {
    e.preventDefault();

    const newExperience = {
      id: Date.now(),
      company: formData.company,
      position: formData.position,
      location: formData.location,
      start_date: formData.start_date,
      end_date: formData.is_current ? null : formData.end_date,
      is_current: formData.is_current,
      description: formData.description,
      image_url: formData.image_url,
    };

    setExperiences((prev) => [newExperience, ...prev]);

    setFormData({
      company: "",
      position: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      image_url: "",
    });

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa kinh nghiệm này?")) {
      return;
    }

    setExperiences((prev) => prev.filter((experience) => experience.id !== id));
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
                  <FaPlus />
                  Thêm kinh nghiệm
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
