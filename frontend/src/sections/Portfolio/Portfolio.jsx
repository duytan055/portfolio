import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import "./Portfolio.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

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
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;

    const parsed = new URL(fullUrl);
    return parsed.hostname.includes(".") || parsed.hostname === "localhost";
  } catch {
    return false;
  }
};

const formatUrl = (url) => {
  if (!url) return "#";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  return imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`;
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

  const updateSlider = useCallback(() => {
    const currentTab = tabRefs.current[selectedBox - 1];
    if (currentTab) {
      setSliderStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      });
    }
  }, [selectedBox]);

  useEffect(() => {
    updateSlider();
    window.addEventListener("resize", updateSlider);
    return () => window.removeEventListener("resize", updateSlider);
  }, [updateSlider]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
          }
        });
      },
      { threshold: 0.15 },
    );

    const animatedElements = document.querySelectorAll(".reveal-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selectedBox]);

  const isAnyModalOpen = Boolean(
    selectedProject || selectedCertificate || selectedExperience,
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
        setSelectedCertificate(null);
        setSelectedExperience(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnyModalOpen]);

  useEffect(() => {
    const fetchData = async (endpoint, setter, label) => {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) setter(data);
      } catch (error) {
        console.error(`Lỗi tải ${label}:`, error);
      }
    };

    fetchData("/api/projects", setProjects, "dự án");
    fetchData("/api/certificates", setCertificates, "chứng chỉ");
    fetchData("/api/experience", setExperiences, "kinh nghiệm");
    fetchData("/api/toolsskills", setSkills, "kỹ năng");
  }, []);

  const activeProject = projects.find(
    (p) => String(p.id) === String(selectedProject),
  );
  const activeCertificate = certificates.find(
    (c) => String(c.id) === String(selectedCertificate),
  );
  const activeExperience = experiences.find(
    (e) => String(e.id) === String(selectedExperience),
  );

  const parseTechnologies = (techData) => {
    if (!techData) return [];
    let list = techData;
    if (typeof list === "string") {
      try {
        const parsed = JSON.parse(list);
        list = Array.isArray(parsed) ? parsed : list.split(",");
      } catch {
        list = list.split(",");
      }
    }
    if (!Array.isArray(list)) return [];
    return list
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
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
        {/* TAB 1: DỰ ÁN */}
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
                  const imageUrl = resolveImageUrl(project.image_url);
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

        {/* TAB 2: CHỨNG CHỈ */}
        {selectedBox === 2 &&
          (certificates.length > 0 ? (
            <div className="certificates-grid">
              {certificates.map((certificate, index) => {
                const imageUrl = resolveImageUrl(certificate.image_url);
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

        {/* TAB 3: KINH NGHIỆM */}
        {selectedBox === 3 &&
          (experiences.length > 0 ? (
            <div className="experiences-grid">
              {experiences.map((experience, index) => {
                const imageUrl = resolveImageUrl(experience.image_url);
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

        {/* TAB 4: KỸ NĂNG */}
        {selectedBox === 4 &&
          (skills.length > 0 ? (
            <div className="skills-grid">
              {skills.map((skill, index) => {
                const imageUrl = resolveImageUrl(skill.image_url);
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
                      src={resolveImageUrl(activeProject.image_url)}
                      alt={activeProject.title}
                    />
                  ) : (
                    <div className="placeholder-image">Chưa có hình ảnh</div>
                  )}
                </div>
                <div className="detail-actions">
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
                    >
                      ↗ Live Demo
                    </button>
                  )}
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
                      const technologies = parseTechnologies(
                        activeProject.technologies,
                      );
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
                    src={resolveImageUrl(activeCertificate.image_url)}
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
                    src={resolveImageUrl(activeExperience.image_url)}
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
