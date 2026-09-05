import { useState, useEffect, useContext } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaSave,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import "./ToolsSkills.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  image_url: "",
};

function ToolsSkills() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Lấy token
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchToolSkill();
  }, []);

  // 1 danh sách Kỹ năng
  const fetchToolSkill = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/toolsskills`);
      const data = await response.json();
      setSkills(data);
    } catch (err) {
      console.error("Error fetching tools & skills:", err);
    }
  };

  // 2 Lọc danh sách
  const filteredSkills = skills.filter((skill) => {
    const name = skill.name || "";
    const description = skill.description || "";
    const query = search.toLowerCase();

    return (
      name.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query)
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open Modal Add
  const handleOpenModal = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
    setShowModal(true);
  };

  // Open Modal Edit
  const handleEdit = (ts) => {
    setEditingId(ts.id);
    setFormData({
      name: ts.name || "",
      description: ts.description || "",
      image_url: ts.image_url || "",
    });
    setShowModal(true);
  };

  // Close Modal And Reset Form
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
  };

  // 3 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(editingId);
    const url = isEdit
      ? `${API_BASE_URL}/api/toolsskills/${editingId}`
      : `${API_BASE_URL}/api/toolsskills`;
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
        throw new Error(`${isEdit ? "Cập nhật" : "Thêm"} kỹ năng thất bại`);
      }

      const savedTs = await response.json();

      if (isEdit) {
        setSkills((prev) =>
          prev.map((item) => (item.id === editingId ? savedTs : item)),
        );
      } else {
        setSkills((prev) => [savedTs, ...prev]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving Tool Skill:", err);
      alert(`Lỗi khi ${isEdit ? "cập nhật" : "thêm"} kỹ năng !`);
    }
  };

  // 4 Xóa
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa kỹ năng này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/toolsskills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSkills((prev) => prev.filter((skill) => skill.id !== id));
      } else {
        if (response.status === 401 || response.status === 403) {
          alert("Phiên đăng nhập đã hết hạn hoặc bạn không có quyền!");
        } else {
          alert("Xóa kỹ năng thất bại!");
        }
      }
    } catch (err) {
      console.error("Error deleting Tool Skill:", err);
    }
  };

  return (
    <div className="skill-page">
      {/* HEADER */}
      <div className="skill-header">
        <div>
          <h1>Kỹ năng</h1>
          <p>Quản lý các kỹ năng của bạn</p>
        </div>

        <button className="add-skill-btn" onClick={handleOpenModal}>
          <FaPlus /> Thêm kỹ năng
        </button>
      </div>

      {/* SEARCH */}
      <div className="skill-toolbar">
        <div className="skill-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm kỹ năng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="skill-table-container">
        <table className="skill-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kỹ năng</th>
              <th>Mô tả</th>
              <th>Hình ảnh</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill, index) => (
                <tr key={skill.id}>
                  <td>{index + 1}</td>

                  {/* NAME */}
                  <td>
                    <div className="skill-info">
                      <div className="skill-image">
                        {skill.image_url ? (
                          <img src={skill.image_url} alt={skill.name} />
                        ) : (
                          skill.name?.charAt(0) || "?"
                        )}
                      </div>
                      <span>{skill.name}</span>
                    </div>
                  </td>

                  {/* DESCRIPTION */}
                  <td>
                    <span className="skill-description">
                      {skill.description || "—"}
                    </span>
                  </td>

                  {/* IMAGE STATUS */}
                  <td>
                    {skill.image_url ? (
                      <span className="image-status">Có hình ảnh</span>
                    ) : (
                      <span className="no-image">Chưa có</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="skill-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(skill)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(skill.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-skill">
                  Không tìm thấy kỹ năng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="skill-modal-overlay" onClick={handleCloseModal}>
          <div className="skill-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{editingId ? "Cập nhật kỹ năng" : "Thêm kỹ năng"}</h2>
                <p>
                  {editingId
                    ? "Chỉnh sửa thông tin kỹ năng"
                    : "Thêm một kỹ năng mới cho portfolio"}
                </p>
              </div>

              <button
                className="modal-close"
                type="button"
                onClick={handleCloseModal}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* NAME */}
              <div className="form-group">
                <label>Tên kỹ năng</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ví dụ: React"
                  required
                />
              </div>

              {/* IMAGE */}
              <div className="form-group">
                <label>Hình ảnh (URL)</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/react.png"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả về kỹ năng..."
                  rows="4"
                />
              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>

                <button type="submit" className="save-skill-btn">
                  {editingId ? <FaSave /> : <FaPlus />}
                  {editingId ? " Cập nhật" : " Thêm kỹ năng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolsSkills;
