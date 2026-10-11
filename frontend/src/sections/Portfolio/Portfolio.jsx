import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import "./Portfolio.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Kiểm tra URL thực sự hợp lệ (loại bỏ hoàn toàn các chuỗi rác từ DB/API)
const isValidUrl = (url) => {
  if (!url || typeof url !== "string") return false;

  const trimmed = url.trim().toLowerCase();
  const invalidValues = [
    "",
    "#",
    "null",
    "undefined",
    "none",
    "n/a",
    "no",
    "http://",
    "https://",
    "chưa có",
    "chuaco",
  ];

  if (invalidValues.includes(trimmed)) return false;

  try {
    const fullUrl =
      url.trim().startsWith("http://") || url.trim().startsWith("https://")
        ? url.trim()
        : `https://${url.trim()}`;

    const parsed = new URL(fullUrl);
    // Yêu cầu tên miền phải chứa dấu chấm (VD: demo.com, github.com) hoặc localhost
    return parsed.hostname.includes(".") || parsed.hostname === "localhost";
  } catch {
    return false;
  }
};

// Chuẩn hóa đường dẫn để thẻ <a> luôn điều hướng đúng ra trang ngoài
const formatUrl = (url) => {
  if (!url) return "#";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedBox, setSelectedBox] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);

  const tabRefs = useRef([]);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("appear");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".reveal-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selectedBox]);

  useEffect(() => {
    const currentTab = tabRefs.current[selectedBox - 1];
    if (currentTab) {
      setSliderStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      });
    }
  }, [selectedBox]);

  useEffect(() => {
    const handleResize = () => {
      const currentTab = tabRefs.current[selectedBox - 1];
      if (currentTab) {
        setSliderStyle({
          left: currentTab.offsetLeft,
          width: currentTab.offsetWidth,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedBox]);

  useEffect(() => {
    fetchProjects();
    fetchCertificates();
    fetchExperiences();
    fetchSkills();
  }, []);

  const activeProject = projects.find(
    (project) => String(project.id) === String(selectedProject),
  );
  const activeCertificate = certificates.find(
    (certificate) => String(certificate.id) === String(selectedCertificate),
  );
  const activeExperience = experiences.find(
    (experience) => String(experience.id) === String(selectedExperience),
  );

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      const data = await response.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (error) {
      console.error("Lỗi tải dự án:", error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certificates`);
      const data = await response.json();
      if (Array.isArray(data)) setCertificates(data);
    } catch (error) {
      console.error("Lỗi tải chứng chỉ:", error);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/experience`);
      const data = await response.json();
      if (Array.isArray(data)) setExperiences(data);
    } catch (error) {
      console.error("Lỗi tải kinh nghiệm:", error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/toolsskills`);
      const data = await response.json();
      if (Array.isArray(data)) setSkills(data);
    } catch (error) {
      console.error("Lỗi tải kỹ năng:", error);
    }
  };

  return (
    <div className="portfolio" id="portfolio">
      <h1 className="reveal-on-scroll">Portfolio Showcase</h1>

      <div className="portfolio-select reveal-on-scroll delay-1">
        <div
          className="portfolio-slider"
          style={{
            left: `${sliderStyle.left}px`,
            width: `${sliderStyle.width}px`,
          }}
        />
        <div
          ref={(el) => (tabRefs.current[0] = el)}
          className={`box ${selectedBox === 1 ? "active" : ""}`}
          onClick={() => setSelectedBox(1)}
        >
          Projects
        </div>
        <div
          ref={(el) => (tabRefs.current[1] = el)}
          className={`box ${selectedBox === 2 ? "active" : ""}`}
          onClick={() => setSelectedBox(2)}
        >
          Certificate
        </div>
        <div
          ref={(el) => (tabRefs.current[2] = el)}
          className={`box ${selectedBox === 3 ? "active" : ""}`}
          onClick={() => setSelectedBox(3)}
        >
          Experience
        </div>
        <div
          ref={(el) => (tabRefs.current[3] = el)}
          className={`box ${selectedBox === 4 ? "active" : ""}`}
          onClick={() => setSelectedBox(4)}
        >
          Tools And Skills
        </div>
      </div>

      <div className="portfolio-content reveal-on-scroll delay-2">
        {/* TAB 1: PROJECTS */}
        {selectedBox === 1 &&
          (() => {
            const visibleProjects = projects.filter(
              (p) =>
                p.is_featured !== false &&
                p.is_featured !== "false" &&
                p.is_featured !== 0,
            );
            if (visibleProjects.length === 0) {
              return (
                <div className="empty-message">
                  <p>Hiện chưa có dự án nào.</p>
                </div>
              );
            }
            return (
              <div className="projects-grid">
                {visibleProjects.map((project, index) => {
                  const imageUrl = project.image_url
                    ? project.image_url.startsWith("http")
                      ? project.image_url
                      : `${API_BASE_URL}${project.image_url}`
                    : null;

                  const hasDemo = isValidUrl(project.demo_url);

                  return (
                    <div
                      key={project.id}
                      className="project-card"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="project-image">
                        {imageUrl ? (
                          <img src={imageUrl} alt={project.title} />
                        ) : (
                          <div className="placeholder-image">
                            {project.title
                              ? project.title.charAt(0).toUpperCase()
                              : "P"}
                          </div>
                        )}
                      </div>
                      <div className="project-info">
                        <h2>{project.title}</h2>
                        <p>
                          {project.short_description || project.description}
                        </p>
                        <div className="project-actions">
                          {hasDemo ? (
                            <a
                              href={formatUrl(project.demo_url)}
                              className="live-demo"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Live Demo ↗
                            </a>
                          ) : (
                            <button
                              type="button"
                              className="live-demo disabled"
                              disabled
                              onClick={(e) => e.preventDefault()}
                            >
                              Live Demo
                            </button>
                          )}
                          <button
                            type="button"
                            className="details-button"
                            onClick={() => setSelectedProject(project.id)}
                          >
                            Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

        {/* TAB 2: CERTIFICATES */}
        {selectedBox === 2 &&
          (certificates && certificates.length > 0 ? (
            <div className="certificates-grid">
              {certificates.map((certificate, index) => {
                const imageUrl = certificate.image_url
                  ? certificate.image_url.startsWith("http")
                    ? certificate.image_url
                    : `${API_BASE_URL}${certificate.image_url}`
                  : null;

                return (
                  <div
                    key={certificate.id}
                    className="certificate-card"
                    style={{
                      cursor: "pointer",
                      animationDelay: `${index * 0.05}s`,
                    }}
                    onClick={() => setSelectedCertificate(certificate.id)}
                  >
                    <div className="certificate-image">
                      {imageUrl ? (
                        <img src={imageUrl} alt={certificate.title} />
                      ) : (
                        <div className="placeholder-image">
                          Chưa có hình ảnh
                        </div>
                      )}
                    </div>
                    <div className="certificate-info">
                      <h2>{certificate.title}</h2>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-message">
              <p>Hiện chưa có chứng chỉ nào.</p>
            </div>
          ))}

        {/* TAB 3: EXPERIENCES */}
        {selectedBox === 3 &&
          (experiences && experiences.length > 0 ? (
            <div className="experiences-grid">
              {experiences.map((experience, index) => {
                const imageUrl = experience.image_url
                  ? experience.image_url.startsWith("http")
                    ? experience.image_url
                    : `${API_BASE_URL}${experience.image_url}`
                  : null;

                return (
                  <div
                    key={experience.id}
                    className="experience-card"
                    style={{
                      cursor: "pointer",
                      animationDelay: `${index * 0.05}s`,
                    }}
                    onClick={() => setSelectedExperience(experience.id)}
                  >
                    <div className="experience-image">
                      {imageUrl ? (
                        <img src={imageUrl} alt={experience.company} />
                      ) : (
                        <div className="placeholder-image">
                          {experience.company
                            ? experience.company.charAt(0).toUpperCase()
                            : "E"}
                        </div>
                      )}
                    </div>
                    <div className="experience-info">
                      <h2>{experience.company}</h2>
                      {experience.position && (
                        <h3 className="experience-position">
                          {experience.position}
                        </h3>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-message">
              <p>Hiện chưa có kinh nghiệm nào.</p>
            </div>
          ))}

        {/* TAB 4: SKILLS */}
        {selectedBox === 4 &&
          (skills && skills.length > 0 ? (
            <div className="skills-grid">
              {skills.map((skill, index) => {
                const imageUrl = skill.image_url
                  ? skill.image_url.startsWith("http")
                    ? skill.image_url
                    : `${API_BASE_URL}${skill.image_url}`
                  : null;

                return (
                  <div
                    key={skill.id}
                    className="skill-card"
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    <div className="skill-image">
                      {imageUrl ? (
                        <img src={imageUrl} alt={skill.name} />
                      ) : (
                        <div
                          className="placeholder-image"
                          style={{ fontSize: "14px" }}
                        >
                          {skill.name
                            ? skill.name.charAt(0).toUpperCase()
                            : "S"}
                        </div>
                      )}
                    </div>
                    <div className="skill-info">
                      <h2>{skill.name}</h2>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-message">
              <p>Hiện chưa có kỹ năng nào.</p>
            </div>
          ))}
      </div>

      {/* MODAL DỰ ÁN */}
      {activeProject &&
        createPortal(
          <div
            className="project-modal"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="project-detail"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="close-button"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
              <div className="detail-right">
                <div className="detail-image">
                  {activeProject.image_url ? (
                    <img
                      src={
                        activeProject.image_url.startsWith("http")
                          ? activeProject.image_url
                          : `${API_BASE_URL}${activeProject.image_url}`
                      }
                      alt={activeProject.title}
                    />
                  ) : (
                    <div className="placeholder-image">Chưa có hình ảnh</div>
                  )}
                </div>
                <div className="detail-actions">
                  {/* Live Demo Button */}
                  {isValidUrl(activeProject.demo_url) ? (
                    <a
                      href={formatUrl(activeProject.demo_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="action-btn demo-btn"
                    >
                      ↗ Live Demo
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="action-btn demo-btn disabled"
                      disabled
                      onClick={(e) => e.preventDefault()}
                    >
                      ↗ Live Demo
                    </button>
                  )}

                  {/* GitHub Button */}
                  {isValidUrl(activeProject.github_url) ? (
                    <a
                      href={formatUrl(activeProject.github_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="action-btn github-btn"
                    >
                      GitHub ↗
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="action-btn github-btn disabled"
                      disabled
                      onClick={(e) => e.preventDefault()}
                    >
                      GitHub ↗
                    </button>
                  )}
                </div>
              </div>

              <div className="detail-left">
                <h2 className="detail-title">{activeProject.title}</h2>
                <p className="detail-description">
                  {activeProject.description ||
                    activeProject.short_description ||
                    "Chưa có mô tả."}
                </p>
                <div className="detail-tech">
                  <h3>&lt;/&gt; Technologies Used</h3>
                  <div className="tech-tags">
                    {(() => {
                      let technologies = activeProject.technologies;
                      if (typeof technologies === "string") {
                        try {
                          const parsed = JSON.parse(technologies);
                          technologies = Array.isArray(parsed)
                            ? parsed
                            : technologies.split(",");
                        } catch {
                          technologies = technologies.split(",");
                        }
                      }
                      if (!Array.isArray(technologies)) technologies = [];
                      technologies = technologies
                        .filter((item) => typeof item === "string")
                        .map((item) => item.trim())
                        .filter(Boolean);

                      return technologies.length > 0 ? (
                        technologies.map((item, index) => (
                          <span key={`${item}-${index}`} className="tech-tag">
                            <span className="tag-icon">⬡</span>
                            {item}
                          </span>
                        ))
                      ) : (
                        <p>Chưa cập nhật công nghệ.</p>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* MODAL CHỨNG CHỈ */}
      {activeCertificate &&
        createPortal(
          <div
            className="certificate-modal"
            onClick={() => setSelectedCertificate(null)}
          >
            <div
              className="certificate-detail"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="close-button"
                onClick={() => setSelectedCertificate(null)}
              >
                ×
              </button>
              <div className="modal-certificate-image">
                {activeCertificate.image_url ? (
                  <img
                    src={
                      activeCertificate.image_url.startsWith("http")
                        ? activeCertificate.image_url
                        : `${API_BASE_URL}${activeCertificate.image_url}`
                    }
                    alt={activeCertificate.title}
                  />
                ) : (
                  <div className="placeholder-image">Chưa có hình ảnh</div>
                )}
              </div>
              <h2 className="modal-certificate-title">
                {activeCertificate.title}
              </h2>
            </div>
          </div>,
          document.body,
        )}

      {/* MODAL KINH NGHIỆM */}
      {activeExperience &&
        createPortal(
          <div
            className="experience-modal-overlay"
            onClick={() => setSelectedExperience(null)}
          >
            <div
              className="experience-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedExperience(null)}
              >
                ×
              </button>
              <div className="experience-modal-image">
                {activeExperience.image_url ? (
                  <img
                    src={
                      activeExperience.image_url.startsWith("http")
                        ? activeExperience.image_url
                        : `${API_BASE_URL}${activeExperience.image_url}`
                    }
                    alt={activeExperience.company}
                  />
                ) : (
                  <div className="placeholder-image">
                    {activeExperience.company
                      ? activeExperience.company.charAt(0).toUpperCase()
                      : "E"}
                  </div>
                )}
              </div>

              <div className="experience-modal-body">
                <h2 className="experience-modal-title">
                  {activeExperience.company}
                </h2>
                {activeExperience.position && (
                  <h3 className="experience-modal-position">
                    {activeExperience.position}
                  </h3>
                )}
                <div className="experience-modal-meta">
                  {activeExperience.location && (
                    <p>
                      <strong>📍 Địa điểm:</strong> {activeExperience.location}
                    </p>
                  )}
                  {(activeExperience.start_date ||
                    activeExperience.end_date) && (
                    <p>
                      <strong>📅 Thời gian:</strong>{" "}
                      {formatDate(activeExperience.start_date) || "..."} -{" "}
                      {activeExperience.is_current
                        ? "Hiện tại"
                        : formatDate(activeExperience.end_date) || "..."}
                    </p>
                  )}
                </div>
                <div className="experience-modal-description">
                  <strong>Mô tả chi tiết:</strong>
                  <p>
                    {activeExperience.description || "Chưa có mô tả chi tiết."}
                  </p>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default Portfolio;
