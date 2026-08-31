import { useEffect, useState } from "react";

import Intro from "./components/Intro/intro";
import Navbar from "./components/Navbar/Navbar";
import Home from "./sections/Home/Home";
import About from "./sections/About/About";
import Portfolio from "./sections/Portfolio/Portfolio";
import Contact from "./sections/Contact/Contact";
import Footer from "./components/Footer/Footer";

import "./App.css";

function App() {
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

export default App;
