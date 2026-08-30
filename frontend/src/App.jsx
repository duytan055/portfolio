import { useState } from "react";
import Intro from "./components/Intro/intro";
import Navbar from "./components/Navbar/Navbar";
import Home from "./sections/Home/Home";
import About from "./sections/About/About";
import Projects from "./sections/Projects/Projects";
import Skills from "./sections/Skills/Skills";
import Contact from "./sections/Contact/Contact";
import Footer from "./components/Footer/Footer";

import "./App.css";

function App() {
  return (
    <>
      <Intro />
      <Navbar />
      <main>
        <Home />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
