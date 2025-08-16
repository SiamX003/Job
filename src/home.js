import React from "react";
import "./style.css"; // keep your styles in the same CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-box">J</span>
        <span className="logo-text">Stack</span>
      </div>
      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">Browse Jobs</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <a href="#" className="join-btn">Join</a>
    </nav>
  );
};

export default Navbar;
