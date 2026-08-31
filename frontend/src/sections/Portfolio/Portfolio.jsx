import { useState } from "react";
import images from "../../assets/project1.jpg";
import images2 from "../../assets/project2.jpg";
import "./Portfolio.css";

const projectsData = [
  {
    id: 1,
    title: "Website Portfolio",
    shortDesc: "Website portfolio cá nhân giới thiệu kỹ năng và dự án.",
    fullDesc:
      "Website portfolio cá nhân được thiết kế giao diện tối giản, tối ưu trải nghiệm người dùng, giúp giới thiệu chi tiết kỹ năng, kinh nghiệm và các sản phẩm đã hoàn thành.",
    image: images,
    languages: ["JavaScript", "HTML", "CSS"],
    technologies: ["ReactJS", "Tailwind CSS", "Vite"],
    tools: ["VS Code", "Git", "GitHub"],
    features: [
      "Giao diện Responsive linh hoạt trên mọi thiết bị.",
      "Tích hợp Modal xem chi tiết dự án trực quan.",
      "Tối ưu tốc độ tải trang và trải nghiệm người dùng.",
      "Dễ dàng mở rộng và bảo trì cấu trúc dữ liệu.",
    ],
    demoLink: "#",
    githubLink: "#",
  },
  {
    id: 2,
    title: "WebBooking Cinema",
    shortDesc: "Website đặt vé xem phim trực tuyến tiện lợi.",
    fullDesc:
      "Hệ thống đặt vé xem phim trực tuyến cho phép chọn suất chiếu, đặt vị trí ghế ngồi theo thời gian thực và quản lý đơn đặt vé hiệu quả.",
    image: images2,
    languages: ["PHP", "JavaScript", "HTML", "CSS", "SQL"],
    technologies: ["Bootstrap", "MySQL"],
    tools: ["VS Code", "Git", "phpMyAdmin"],
    features: [
      "Chọn vị trí ghế và phòng chiếu linh hoạt.",
      "Quản lý lịch chiếu và danh sách phim cập nhật liên tục.",
      "Tích hợp thanh toán và xác nhận vé.",
      "Hệ thống quản trị Admin dành cho quản lý.",
    ],
    demoLink: "#",
    githubLink: "#",
  },
];

function Projects() {
  const [selectedBox, setSelectedBox] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);

  const activeProject = projectsData.find((p) => p.id === selectedProject);

  return (
    <div className="portfolio" id="portfolio">
      <h1>Portfolio</h1>

      {/* TABS SELECT */}
      <div className="portfolio-select">
        <div
          className={`box ${selectedBox === 1 ? "active" : ""}`}
          onClick={() => setSelectedBox(1)}
        >
          Projects
        </div>
        <div
          className={`box ${selectedBox === 2 ? "active" : ""}`}
          onClick={() => setSelectedBox(2)}
        >
          Certificate
        </div>
        <div
          className={`box ${selectedBox === 3 ? "active" : ""}`}
          onClick={() => setSelectedBox(3)}
        >
          Experience
        </div>
        <div
          className={`box ${selectedBox === 4 ? "active" : ""}`}
          onClick={() => setSelectedBox(4)}
        >
          Tools And Skills
        </div>
      </div>

      {/* GRID PROJECTS */}
      <div className="portfolio-content">
        {selectedBox === 1 && (
          <div className="projects-grid">
            {projectsData.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-info">
                  <h2>{project.title}</h2>
                  <p>{project.shortDesc}</p>
                  <div className="project-actions">
                    <a
                      href={project.demoLink}
                      className="live-demo"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live Demo ↗
                    </a>
                    <button
                      className="details-button"
                      onClick={() => setSelectedProject(project.id)}
                    >
                      Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL CẤU TRÚC THEO ẢNH MẪU */}
      {activeProject && (
        <div className="project-modal" onClick={() => setSelectedProject(null)}>
          <div className="project-detail" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setSelectedProject(null)}
            >
              ×
            </button>

            {/* CỘT TRÁI (TITLE, DESC, STATS, BUTTONS, TAGS) */}
            <div className="modal-left">
              <h2 className="modal-title">{activeProject.title}</h2>
              <p className="modal-desc">{activeProject.fullDesc}</p>

              {/* KHUNG THỐNG KÊ (STATS) */}
              <div className="modal-stats">
                <div className="stat-card">
                  <span className="stat-icon">&lt;/&gt;</span>
                  <div className="stat-info">
                    <strong>
                      {activeProject.languages.length +
                        activeProject.technologies.length +
                        activeProject.tools.length}
                    </strong>
                    <span>Total Công nghệ</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">◇</span>
                  <div className="stat-info">
                    <strong>{activeProject.features.length}</strong>
                    <span>Fitur Utama</span>
                  </div>
                </div>
              </div>

              {/* 2 NÚT ACTION */}
              <div className="modal-actions">
                <a
                  href={activeProject.demoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-action btn-demo"
                >
                  <span>↗</span> Live Demo
                </a>
                <a
                  href={activeProject.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-action btn-github"
                >
                  <span>⑂</span> Github
                </a>
              </div>

              {/* DANH SÁCH TAGS CÔNG NGHỆ & TOOLS */}
              <div className="modal-tech">
                <h3>&lt;/&gt; Technologies Used</h3>
                <div className="tech-tags">
                  {[
                    ...activeProject.languages,
                    ...activeProject.technologies,
                    ...activeProject.tools,
                  ].map((item, idx) => (
                    <span key={idx} className="tag-chip">
                      <span className="chip-icon">⬡</span> {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (HÌNH ÁNH + KEY FEATURES) */}
            <div className="modal-right">
              <div className="modal-image-card">
                <img src={activeProject.image} alt={activeProject.title} />
              </div>

              <div className="modal-features">
                <h3>☆ Key Features</h3>
                <ul>
                  {activeProject.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
