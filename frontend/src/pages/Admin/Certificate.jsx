import { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

import "./Certificate.css";

const initialCertificates = [
  {
    id: 1,
    title: "Responsive Web Design",
    description: "Chứng chỉ thiết kế web responsive.",
    image_url: "",
    issued_by: "freeCodeCamp",
    issue_date: "2026-08-15",
    expiration_date: null,
    credential_id: "ABC123456",
    credential_url: "https://example.com",
  },
];

function Certificate() {
  const [certificates, setCertificates] = useState(initialCertificates);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    issued_by: "",
    issue_date: "",
    expiration_date: "",
    credential_id: "",
    credential_url: "",
  });

  const filteredCertificates = certificates.filter(
    (certificate) =>
      certificate.title.toLowerCase().includes(search.toLowerCase()) ||
      certificate.issued_by.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCertificate = (e) => {
    e.preventDefault();

    const newCertificate = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url,
      issued_by: formData.issued_by,
      issue_date: formData.issue_date,
      expiration_date: formData.expiration_date || null,
      credential_id: formData.credential_id,
      credential_url: formData.credential_url,
    };

    setCertificates((prev) => [newCertificate, ...prev]);

    setFormData({
      title: "",
      description: "",
      image_url: "",
      issued_by: "",
      issue_date: "",
      expiration_date: "",
      credential_id: "",
      credential_url: "",
    });

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chứng chỉ này?")) {
      return;
    }

    setCertificates((prev) =>
      prev.filter((certificate) => certificate.id !== id),
    );
  };

  const formatDate = (date) => {
    if (!date) return "Không giới hạn";

    const [year, month, day] = date.split("-");

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

        <button
          className="add-certificate-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus />
          Thêm chứng chỉ
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
                          certificate.title.charAt(0)
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
                      {certificate.credential_id || "—"}
                    </span>
                  </td>

                  <td>
                    <div className="certificate-actions">
                      <button className="edit-btn">
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
        <div
          className="certificate-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="certificate-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="modal-header">
              <div>
                <h2>Thêm chứng chỉ</h2>

                <p>Thêm một chứng chỉ mới cho portfolio</p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddCertificate}>
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
                  type="url"
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
                  type="url"
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
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>

                <button type="submit" className="save-certificate-btn">
                  <FaPlus />
                  Thêm chứng chỉ
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
