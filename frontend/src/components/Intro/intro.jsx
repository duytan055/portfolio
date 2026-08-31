import { useEffect } from "react";
import { FaCode, FaLinkedin, FaGithub } from "react-icons/fa";

import "./intro.css";

function Intro({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro">
      <div className="intro-content">
        <div className="intro-icons">
          <span className="intro-icon icon-1">
            <FaCode />
          </span>

          <span className="intro-icon icon-2">
            <FaLinkedin />
          </span>

          <span className="intro-icon icon-3">
            <FaGithub />
          </span>
        </div>

        <div className="intro-title">
          <h1>
            <span className="title-top">Welcome To My</span>
            <span className="title-bottom">Portfolio Website</span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Intro;
