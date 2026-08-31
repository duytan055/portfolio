import { useEffect, useState } from "react";
import { Lottie } from "lottie-react";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";

import codeAnimation from "../../assets/code-animation.json";

import "./Home.css";

function Home() {
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const titleText = "Software Engineer";

  const descriptionText =
    "I am a passionate software engineer with experience in developing web applications and a strong interest in learning new technologies. I enjoy solving complex problems and creating efficient solutions.";

  const [canType, setCanType] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanType(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!canType) return;

    let timeout;

    if (!isDeleting) {
      // Đang nhập
      if (titleIndex < titleText.length) {
        timeout = setTimeout(() => {
          setDisplayedTitle(titleText.slice(0, titleIndex + 1));
          setTitleIndex((prev) => prev + 1);
        }, 250);
      } else {
        // Nhập xong → giữ 2 giây
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      // Đang xóa
      if (titleIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayedTitle(titleText.slice(0, titleIndex - 1));
          setTitleIndex((prev) => prev - 1);
        }, 120);
      } else {
        // Xóa hết → nghỉ 0.5 giây
        timeout = setTimeout(() => {
          setIsDeleting(false);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [canType, titleIndex, isDeleting]);

  // Tách description thành từng chữ với animation delay
  const descriptionLetters = descriptionText.split("").map((char, index) => (
    <span
      key={index}
      className="letter letter--description"
      style={{ "--index": index }}
    >
      {char}
    </span>
  ));

  return (
    <div className="home" id="home">
      <div className="home__content">
        <h1 className="home__title">
          {displayedTitle.startsWith("Software") && (
            <>
              <span className="title-software">Software</span>
              {displayedTitle.length > 8 && " "}
              {displayedTitle.length > 9 && (
                <span className="title-engineer">
                  {displayedTitle.slice(9)}
                </span>
              )}
            </>
          )}

          {!displayedTitle.startsWith("Software") && displayedTitle}

          <span className="typing-cursor">|</span>
        </h1>

        <p className="home__description">{descriptionLetters}</p>

        <div className="home__icons">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="home__icon"
          >
            <FaGithub />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="home__icon"
          >
            <FaLinkedin />
          </a>

          <a href="#contact" className="home__icon">
            <FaCode />
          </a>
        </div>
      </div>

      <div className="home__animation">
        <Lottie
          className="code-animation"
          src={codeAnimation}
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
}

export default Home;
