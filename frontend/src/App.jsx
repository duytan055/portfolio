import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Intro from "./components/Intro/intro";
import Navbar from "./components/Navbar/Navbar";
import Home from "./sections/Home/Home";
import About from "./sections/About/About";
import Portfolio from "./sections/Portfolio/Portfolio";
import Contact from "./sections/Contact/Contact";
import Footer from "./components/Footer/Footer";

import Login from "./pages/Login";
import AdminLayout from "./pages/Admin/AdminLayout";
import Projects from "./pages/Admin/Projects";
import Experience from "./pages/Admin/Experience";
import Certificates from "./pages/Admin/Certificate";
import ToolsSkills from "./pages/Admin/ToolsSkills";

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
        {/* Portfolio */}
        <Route path="/" element={<MainPortfolio />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="projects" element={<Projects />} />
          <Route path="experience" element={<Experience />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="toolsskills" element={<ToolsSkills />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
