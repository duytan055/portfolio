import { useEffect, useState, useContext } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaSave,
  FaTrash,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import "./Certificate.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  image_url: "",
  issued_by: "",
  issue_date: "",
  expiration_date: "",
  credential_id: "",
  credential_url: "",
};

function Certificate() {
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);

  // Lấy token
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchCertificate();
  }, []);

  // Lấy danh sách chứng chỉ
  const fetchCertificate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certificates`);
      const data = await response.json();
      setCertificates(data);
    } catch (err) {
      console.error("Error fetching certificate:", err);
    }
  };

  // Safe filter
  const filteredCertificates = certificates.filter((cer) => {
    const title = cer.title || "";
    const issuedBy = cer.issued_by || "";
    const query = search.toLowerCase();

    return (
      title.toLowerCase().includes(query) ||
      issuedBy.toLowerCase().includes(query)
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
  const handleEdit = (cer) => {
    setEditingId(cer.id);
    setFormData({
      title: cer.title || "",
      description: cer.description || "",
      image_url: cer.image_url || "",
      issued_by: cer.issued_by || "",
      issue_date: cer.issue_date || "",
      expiration_date: cer.expiration_date || "",
      credential_id: cer.credential_id || "",
      credential_url: cer.credential_url || "",
    });

    setShowModal(true);
  };

  // Close Modal And Reset Form
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
  };

  // Thêm mới và cập nhật chứng chỉ
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(editingId);
    const url = isEdit
      ? `${API_BASE_URL}/api/certificates/${editingId}`
      : `${API_BASE_URL}/api/certificates`;
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
        throw new Error(`${isEdit ? "Cập nhật" : "Thêm"} chứng chỉ thất bại`);
      }

      const savedCer = await response.json();

      if (isEdit) {
        setCertificates((prev) =>
          prev.map((item) => (item.id === editingId ? savedCer : item)),
        );
      } else {
        setCertificates((prev) => [savedCer, ...prev]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving certificate:", err);
      alert(`Lỗi khi ${isEdit ? "cập nhật" : "thêm"} chứng chỉ !`);
    }
  };

  // Xóa chứng chỉ
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chứng chỉ này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/certificates/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCertificates((prev) => prev.filter((item) => item.id !== id));
      } else {
        if (response.status === 401 || response.status === 403) {
          alert("Phiên đăng nhập đã hết hạn hoặc bạn không có quyền!");
        } else {
          alert("Xóa chứng chỉ thất bại!");
        }
      }
    } catch (err) {
      console.error("Error deleting certificate:", err);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Không giới hạn";
    const cleanDate = dateStr.split("T")[0];
    const parts = cleanDate.split("-");

    if (parts.length < 3) return dateStr;
    const [year, month, day] = parts;

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="certificate-page">
      {/* HEADER */}
      <div className="certificate-header">
        <div>
          <h1>Chứng chỉ</h1>
          <p>Quản lý các chứng chỉ của bạn</p>
        </div>

        <button className="add-certificate-btn" onClick={handleOpenModal}>
          <FaPlus /> Thêm chứng chỉ
        </button>
      </div>

      {/* SEARCH */}
      <div className="certificate-toolbar">
        <div className="certificate-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm chứng chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="certificate-table-container">
        <table className="certificate-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Chứng chỉ</th>
              <th>Đơn vị cấp</th>
              <th>Ngày cấp</th>
              <th>Ngày hết hạn</th>
              <th>Mã chứng chỉ</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((certificate, index) => (
                <tr key={certificate.id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="certificate-info">
                      <div className="certificate-image">
                        {certificate.image_url ? (
                          <img
                            src={certificate.image_url}
                            alt={certificate.title}
                          />
                        ) : (
                          certificate.title?.charAt(0) || "?"
                        )}
                      </div>

                      <div>
                        <h3>{certificate.title}</h3>
                        <p>{certificate.description}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="issued-by">{certificate.issued_by}</span>
                  </td>

                  <td>
                    <span className="certificate-date">
                      {formatDate(certificate.issue_date)}
                    </span>
                  </td>

                  <td>
                    <span className="certificate-date">
                      {formatDate(certificate.expiration_date)}
                    </span>
                  </td>

                  <td>
                    <span className="credential-id">
                      {certificate.credential_url ? (
                        <a
                          href={certificate.credential_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {certificate.credential_id || "Xem link"}{" "}
                          <FaExternalLinkAlt size={12} />
                        </a>
                      ) : (
                        certificate.credential_id || "—"
                      )}
                    </span>
                  </td>

                  <td>
                    <div className="certificate-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(certificate)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(certificate.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-certificate">
                  Không tìm thấy chứng chỉ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="certificate-modal-overlay" onClick={handleCloseModal}>
          <div
            className="certificate-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="modal-header">
              <div>
                <h2>{editingId ? "Cập nhật chứng chỉ" : "Thêm chứng chỉ"}</h2>
                <p>
                  {editingId
                    ? "Chỉnh sửa thông tin chứng chỉ"
                    : "Thêm một chứng chỉ mới"}
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
              {/* TITLE */}
              <div className="form-group">
                <label>Tên chứng chỉ</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tên chứng chỉ..."
                  required
                />
              </div>

              {/* ISSUED BY */}
              <div className="form-group">
                <label>Đơn vị cấp</label>
                <input
                  type="text"
                  name="issued_by"
                  value={formData.issued_by}
                  onChange={handleChange}
                  placeholder="Ví dụ: freeCodeCamp"
                  required
                />
              </div>

              {/* DATE */}
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày cấp</label>
                  <input
                    type="date"
                    name="issue_date"
                    value={formData.issue_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ngày hết hạn</label>
                  <input
                    type="date"
                    name="expiration_date"
                    value={formData.expiration_date}
                    onChange={handleChange}
                  />
                  <small>Để trống nếu chứng chỉ không hết hạn.</small>
                </div>
              </div>

              {/* CREDENTIAL ID */}
              <div className="form-group">
                <label>Mã chứng chỉ</label>
                <input
                  type="text"
                  name="credential_id"
                  value={formData.credential_id}
                  onChange={handleChange}
                  placeholder="Nhập Credential ID..."
                />
              </div>

              {/* CREDENTIAL URL */}
              <div className="form-group">
                <label>Link chứng chỉ</label>
                <input
                  type="text"
                  name="credential_url"
                  value={formData.credential_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              {/* IMAGE */}
              <div className="form-group">
                <label>Hình ảnh</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/certificate.jpg"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả về chứng chỉ..."
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

                <button type="submit" className="save-certificate-btn">
                  {editingId ? <FaSave /> : <FaPlus />}
                  {editingId ? " Cập nhật" : " Thêm chứng chỉ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificate;
