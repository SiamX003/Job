import React, { useState } from "react";
import "./home.css"; 
import logo from "./images/logo.png";
import heroImg from "./images/hero1.PNG";
import fe1 from "./images/fe 1.png";
import fe2 from "./images/fe 2.png";
import fe3 from "./images/fe 3.png";
import fe4 from "./images/fe 4.png";
import { Link } from "react-router-dom";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <header>
        <div id="navbar" className="obj-width">
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
          <ul id="menu" className={menuOpen ? "active" : ""}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/browse">Browse</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <button id="w-btn">Join</button>
          </ul>
          <i 
            id="bar" 
            className="bx bx-menu" 
            onClick={() => setMenuOpen(!menuOpen)}
          ></i>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-box">
          <div className="h-left">
            <h2>Find the perfect freelance services for your business</h2>
            <p>
              Work with talented people at the most affordable price to get the most 
              out of your time and cost
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

      {/* Features Section */}
      <section className="features">
        <h2>Need something done?</h2>
        <p>Most viewed and all-time top-selling services</p>

        <div className="fe-box">
          <div>
            <img src={fe1} alt="Post a job" />
            <h3>Post a job</h3>
            <p>It's free and easy to post a job. Simply fill in a title, description.</p> 
          </div>
        </div>

        <div className="fe-box">
          <div>
            <img src={fe2} alt="Choose freelancers" />
            <h3>Choose freelancers</h3>
            <p>It's free and easy to post a job. Simply fill in a title, description.</p> 
          </div>
        </div>

        <div className="fe-box">
          <div>
            <img src={fe3} alt="Pay safely" />
            <h3>Pay safely</h3>
            <p>It's free and easy to post a job. Simply fill in a title, description.</p> 
          </div>
        </div>

        <div className="fe-box">
          <div>
            <img src={fe4} alt="We are here to help" />
            <h3>We are here to help</h3>
            <p>It's free and easy to post a job. Simply fill in a title, description.</p> 
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;