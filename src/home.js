import React from "react";
import "./home.css"; // make sure style.css is in src/

// Import images (place them inside src/images/)
import logo from "./images/logo.png";
import heroImg from "./images/hero1.PNG";
import "./toggle"; // Import the toggle functionality
const Home = () => {
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
          <i id="bar" className="bx bx-menu"></i>
        </div>
      </header>

      <section className="hero">
        <div className="hero-box">
          <div className="h-left">
            <h1>Find the perfect freelance services for your business</h1>
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

export default Home;
