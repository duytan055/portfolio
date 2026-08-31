function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>Copyright © {currentYear} Duy Tan Dev. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
