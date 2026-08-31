import "./Navbar.css";
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#home" className="navbar-logo">
          My Portfolio
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
