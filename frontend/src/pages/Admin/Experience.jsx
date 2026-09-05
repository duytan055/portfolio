import { useState, useEffect, useContext } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import "./Experience.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const INITIAL_FORM_STATE = {
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
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);

  //  Lấy token xác
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchExperience();
  }, []);

  // Lấy dữ liệu kinh nghiệm
  const fetchExperience = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/experience`);
      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error("Error fetching experience:", error);
    }
  };

  // Filter an toàn
  const filteredExperiences = experiences.filter((exp) => {
    const companyName = exp.company || "";
    const positionName = exp.position || "";
    const query = search.toLowerCase();

    return (
      companyName.toLowerCase().includes(query) ||
      positionName.toLowerCase().includes(query)
    );
  });

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

  // Mở modal thêm mới
  const handleOpenModal = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
    setShowModal(true);
  };

  // Mở modal edit
  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company || "",
      position: exp.position || "",
      location: exp.location || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      is_current: exp.is_current || false,
      description: exp.description || "",
      image_url: exp.image_url || "",
    });
    setShowModal(true);
  };

  // Đóng modal và reset form
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
  };

  // Thêm mới và cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(editingId);
    const url = isEdit
      ? `${API_BASE_URL}/api/experience/${editingId}`
      : `${API_BASE_URL}/api/experience`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          return;
        }
        throw new Error(`${isEdit ? "Cập nhật" : "Thêm"} kinh nghiệm thất bại`);
      }

      const savedExp = await response.json();

      if (isEdit) {
        setExperiences((prev) =>
          prev.map((item) => (item.id === editingId ? savedExp : item)),
        );
      } else {
        setExperiences((prev) => [savedExp, ...prev]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving experience:", err);
      alert(`Lỗi khi ${isEdit ? "cập nhật" : "thêm"} kinh nghiệm !`);
    }
  };

  // Xóa kinh nghiệm
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa kinh nghiệm này?")) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/experience/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setExperiences((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Xóa kinh nghiệm thất bại hoặc bạn không có quyền!");
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
      <div className="experience-header">
        <div>
          <h1>Kinh nghiệm</h1>
          <p>Quản lý quá trình học tập và làm việc</p>
        </div>

        <button className="add-experience-btn" onClick={handleOpenModal}>
          <FaPlus /> Thêm kinh nghiệm
        </button>
      </div>

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
                  <td>{index + 1}</td>
                  <td>
                    <div className="experience-company">
                      <div className="company-image">
                        {experience.company
                          ? experience.company.charAt(0)
                          : "?"}
                      </div>
                      <div>
                        <h3>{experience.company}</h3>
                        <p>{experience.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="position">{experience.position}</span>
                  </td>
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
                  <td>
                    <span className="location">{experience.location}</span>
                  </td>
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
                  <td>
                    <div className="experience-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(experience)}
                      >
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

      {showModal && (
        <div className="experience-modal-overlay" onClick={handleCloseModal}>
          <div
            className="experience-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingId ? "Cập nhật kinh nghiệm" : "Thêm kinh nghiệm"}
                </h2>
                <p>
                  {editingId
                    ? "Chỉnh sửa thông tin quá trình làm việc"
                    : "Thêm một kinh nghiệm làm việc mới"}
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

              <label className="current-checkbox">
                <input
                  type="checkbox"
                  name="is_current"
                  checked={formData.is_current}
                  onChange={handleCurrentChange}
                />
                <span>Tôi đang làm việc tại đây</span>
              </label>

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

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button type="submit" className="save-experience-btn">
                  {editingId ? <FaSave /> : <FaPlus />}
                  {editingId ? " Cập nhật" : " Thêm kinh nghiệm"}
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
