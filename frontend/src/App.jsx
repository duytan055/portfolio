import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Intro from "./components/Intro/intro";
import Navbar from "./components/Navbar/Navbar";
import Home from "./sections/Home/Home";
import About from "./sections/About/About";
import Portfolio from "./sections/Portfolio/Portfolio";
import Contact from "./sections/Contact/Contact";
import Footer from "./components/Footer/Footer";

import AdminProjects from "./components/Admin/Admin";

import "./App.css";

function MainPortfolio() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  const handleIntroFinish = () => {
    setShowIntro(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {showIntro && <Intro onFinish={handleIntroFinish} />}

      <Navbar />

      <main>
        <Home />
        <About />
        <Portfolio />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

// App quản lý việc chuyển trang qua URL
function App() {
  return (
    <Router>
      <Routes>
        {/* Route trang chủ hiển thị toàn bộ Portfolio */}
        <Route path="/" element={<MainPortfolio />} />

        {/* Route trang Admin quản lý dự án */}
        <Route path="/admin" element={<AdminProjects />} />
      </Routes>
    </Router>
  );
}

export default App;
