import { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

import "./ToolsSkills.css";

const initialSkills = [
  {
    id: 1,
    name: "React",
    description: "Xây dựng giao diện web bằng React.",
    image_url: "",
  },
  {
    id: 2,
    name: "NodeJS",
    description: "Phát triển Backend và REST API.",
    image_url: "",
  },
  {
    id: 3,
    name: "PostgreSQL",
    description: "Thiết kế và quản lý cơ sở dữ liệu.",
    image_url: "",
  },
];

function ToolsSkills() {
  const [skills, setSkills] = useState(initialSkills);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
  });

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();

    const newSkill = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      image_url: formData.image_url,
    };

    setSkills((prev) => [newSkill, ...prev]);

    setFormData({
      name: "",
      description: "",
      image_url: "",
    });

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa kỹ năng này?")) {
      return;
    }

    setSkills((prev) => prev.filter((skill) => skill.id !== id));
  };

  return (
    <div className="skill-page">
      {/* HEADER */}
      <div className="skill-header">
        <div>
          <h1>Kỹ năng</h1>

          <p>Quản lý các kỹ năng của bạn</p>
        </div>

        <button className="add-skill-btn" onClick={() => setShowModal(true)}>
          <FaPlus />
          Thêm kỹ năng
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
                          skill.name.charAt(0)
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

                  {/* IMAGE */}
                  <td>
                    {skill.image_url ? (
                      <span className="image-status">Có hình ảnh</span>
                    ) : (
                      <span className="no-image">Chưa có</span>
                    )}
                  </td>

                  {/* ACTION */}
                  <td>
                    <div className="skill-actions">
                      <button className="edit-btn">
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

      {/* ADD MODAL */}
      {showModal && (
        <div
          className="skill-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div className="skill-modal" onClick={(e) => e.stopPropagation()}>
            {/* MODAL HEADER */}
            <div className="modal-header">
              <div>
                <h2>Thêm kỹ năng</h2>

                <p>Thêm một kỹ năng mới cho portfolio</p>
              </div>

              <button
                className="modal-close"
                type="button"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddSkill}>
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
                <label>Hình ảnh</label>

                <input
                  type="url"
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
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>

                <button type="submit" className="save-skill-btn">
                  <FaPlus />
                  Thêm kỹ năng
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
