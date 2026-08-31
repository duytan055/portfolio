import { useEffect, useRef } from "react";
import images from "../../assets/avatar.jpg";
import "./About.css";

function About() {
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          aboutRef.current.classList.add("about--visible");
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      },
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about" id="about" ref={aboutRef}>
      <h1>About Me</h1>

      <div className="about-content">
        {/* CONTENT BÊN TRÁI */}
        <div className="about-info">
          <h2>
            <span>Hello, I'm</span>
            <strong>Nguyen Duy Tan</strong>
          </h2>

          <p>
            I am a third-year student at Quy Nhon University, pursuing my goal
            of becoming a Software Engineer.
          </p>

          <p>
            I am passionate about software development, especially building web
            applications and exploring both Frontend and Backend development.
          </p>

          <p>
            I am always eager to learn new technologies, gain hands-on
            experience through real-world projects, and continuously improve my
            problem-solving skills.
          </p>

          <p className="about-goal">
            <strong>My goal:</strong> To become a Software Engineer with a
            strong technical foundation and create software products that are
            useful, efficient, and valuable.
          </p>

          <div className="about-button">
            <button>Download CV</button>
            <button>View Projects</button>
          </div>
        </div>

        {/* AVATAR */}
        <div className="about-image">
          <img src={images} alt="Nguyen Duy Tan" />
        </div>
      </div>
    </div>
  );
}

export default About;
