import React from "react";
import "./style.css"; // keep your existing CSS
import "boxicons/css/boxicons.min.css"; // for icons (if you need them)

// Import your images
import logo from "./images/logo.png";
import heroImg from "./images/hero1.PNG";

const Navbar = () => {
  return (
    <div>
      <header>
        <div id="navbar" className="obj-width">
          <a href="index.html">
            <img className="logo" src={logo} alt="logo" />
          </a>
          <ul id="menu">
            <li><a href="#">Home</a></li>
            <li><a href="#">Browse</a></li>
            <li><a href="#">Contact</a></li>
            <button id="w-btn">Join</button>
          </ul>
        </div>
      </header>

      <section className="hero">
        <div className="hero-box">
          <div className="h-left">
            <h2>Find the perfect freelance services for your business</h2>
            <p>
              Work with talented people at the most affordable price to get the
              most out of your time and cost
            </p>
            <div className="search">
              <input type="text" placeholder="Search your job here" />
              <a href="#">Search</a>
            </div>
          </div>

          <div className="h-right">
            <img src={heroImg} alt="hero" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Navbar;