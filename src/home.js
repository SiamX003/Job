import React, { useState } from "react";
//import React from 'react';
import './home.css'; // Assuming the styles are in style.css
import './script.js';
import './Contact.css';
import './Contact.js';
import logo from './images/logo.png';
import heroImg from './images/hero1.PNG';
import fe1 from './images/fe 1.png';
import fe2 from './images/fe 2.png';
import fe3 from './images/fe 3.png';
import fe4 from './images/fe 4.png';
import t1 from './images/t1.png'; // Assuming t1.png, t2.png, etc., exist
import t2 from './images/t2.png';
import t3 from './images/t3.png';
import t4 from './images/t4.png';
import t5 from './images/t5.png';
import t6 from './images/t6.png';
import fl1 from './images/fl-1.png';
import fl2 from './images/fl-2.png';
import fl3 from './images/fl-3.png';
import fl4 from './images/fl-4.png';
import google from './images/google.png';
import uber from './images/uber.png';
import yahoo from './images/yahoo.png';
import linkedin from './images/linkedin.png';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Navbar */}
      <header>
        <div id="navbar" className="obj-width">
          <a href="index.html">
            <img className="logo" src={logo} alt="Logo" />
          </a>
          <ul id="menu">
            <li><a href="">Home</a></li>
            <li><a href="">Browse</a></li>
            <li><a href="">Contact</a></li>
            <button id="w-btn">Join</button>
          </ul>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-box">
          <div className="h-left">
            <h2>Find the perfect freelance services for your business</h2>
            <p>Work with talented people at the most affordable price to get the most out of your time and cost</p>
            <div className="search">
              <input type="text" placeholder="Search your job here" />
              <a href="#">Search</a>
            </div>
          </div>

          <div className="h-right">
            <img src={heroImg} alt="Hero" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features sec-space obj-width">
        <h2>Need something done?</h2>
        <p className="sub-text">Most viewed and all-time top-selling services</p>

        <div className="fe-box">
          <div>
            <img src={fe1} alt="Post a job" />
            <h3>Post a job</h3>
            <p>It's free and easy to post a job. Simply fill in a title, description.</p>
          </div>
          <div>
            <img src={fe2} alt="Choose freelancers" />
            <h3>Choose freelancers</h3>
            <p>It's free and easy to post a job. Simply fill in a title, description.</p>
          </div>
          <div>
            <img src={fe3} alt="Pay safely" />
            <h3>Pay safely</h3>
            <p>It's free and easy to post a job. Simply fill in a title, description.</p>
          </div>
          <div>
            <img src={fe4} alt="We are here to help" />
            <h3>We are here to help</h3>
            <p>It's free and easy to post a job. Simply fill in a title, description.</p>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs sec-space obj-width">
        <h2>Jobs in Demand</h2>
        <p>Most viewed and all-time top-selling services</p>

        <ul className="job-id">
          <li data-target="all">Recent Jobs</li>
          <li data-target="freelancer">Freelancer</li>
          <li data-target="fullTime">Full Time</li>
          <li data-target="partTime">Part Time</li>
        </ul>

        <div className="jobs-container">
          <div data-item="fullTime" className="jList">
            <img src={google} alt="Google" />
            <h3>Web Developer</h3>
            <p>$750-1000/month</p>
            <span id="key">Full Time</span>
          </div>

          <div data-item="freelance" className="jList">
            <img src={uber} alt="Uber" />
            <h3>Freelancer</h3>
            <p>$750-1000/month</p>
            <span id="key">Freelancer</span>
          </div>

          <div data-item="partTime" className="jList">
            <img src={yahoo} alt="Yahoo" />
            <h3>Web Developer</h3>
            <p>$750-1000/month</p>
            <span id="key">Full Time</span>
          </div>

          <div data-item="partTime" className="jList">
            <img src={linkedin} alt="LinkedIn" />
            <h3>Business Associate</h3>
            <p>$750-1000/month</p>
            <span id="key">Part Time</span>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust sec-space obj-width">
        <h2>Trusted by the world's best</h2>
        <p>Most viewed all time</p>
        <div className="t-box">
          <img src={t1} alt="Trusted 1" />
          <img src={t2} alt="Trusted 2" />
          <img src={t3} alt="Trusted 3" />
          <img src={t4} alt="Trusted 4" />
          <img src={t5} alt="Trusted 5" />
          <img src={t6} alt="Trusted 6" />
        </div>
      </section>

      {/* Team Section */}
  <section className="highest sec-space obj-width">
  <h2>Highest Rated Freelancers</h2>
  <p>Most viewed and all-time top-selling services</p>

  <div className="team-container">
    <div className="fl-box">
      <img src={fl1} alt="John Smith" />
      <h3>John Smith</h3>
      <div className="skill">
        <span id="key">HTML</span>
        <span id="key">CSS</span>
        <span id="key">JavaScript</span>
      </div>
      <button>View Profile</button>
    </div>

    <div className="fl-box">
      <img src={fl2} alt="Jane Doe" />
      <h3>Jane Doe</h3>
      <div className="skill">
        <span id="key">HTML</span>
        <span id="key">CSS</span>
        <span id="key">JavaScript</span>
      </div>
      <button>View Profile</button>
    </div>

    <div className="fl-box">
      <img src={fl3} alt="" />
      <h3>Michael Brown</h3>
      <div className="skill">
        <span id="key">HTML</span>
        <span id="key">CSS</span>
        <span id="key">JavaScript</span>
      </div>
      <button>View Profile</button>
    </div>

    <div className="fl-box">
      <img src={fl4} alt="" />
      <h3>Thesera Ray</h3>
      <div className="skill">
        <span id="key">HTML</span>
        <span id="key">CSS</span>
        <span id="key">JavaScript</span>
      </div>
      <button>View Profile</button>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="footer">
        <div className="obj-width">
          <div className="top">
            <img className="logo" src={logo} alt="Logo" />
           <div>
            <a href="https://www.facebook.com/profile.php?id=61579876076360">
              <i className='bx bxl-facebook-square'></i>
            </a>
            <a href="https://x.com/i/lists/1959288678146294126">
              <i className='bx bxl-twitter'></i>
            </a>
            <a href="https://www.instagram.com/jobhunter749?igsh=dThtb3ozdzVpZHlv">
              <i className='bx bxl-instagram'></i>
            </a>
            <a href="https://www.linkedin.com/in/ahnaf-hossain-3b4b2521b/">
              <i className='bx bxl-linkedin-square'></i>
            </a>
          </div>
        </div>
         <div>
            <p>JobHunt is a global online platform for freelance services</p>
          </div>
          <div className="bottom">
            <div>
              <h3>Project</h3>
              <a href="#">Change log</a>
              <a href="#">Status</a>
              <a href="#">License</a>
              <a href="#">All versions</a>
            </div>
            <div>
              <h3>Community</h3>
              <a href="#">Github</a>
              <a href="#">Your Problems</a>
              <a href="#">Twitter</a>
               <a href="#">LinkedIn</a>
            </div>
            <div>
              <h3>Help</h3>
              <a href="#">Support</a>
              <a href="#">Troubleshooting</a>
              <a href="#">Contact us</a>
              <a href="#">FAQ</a>
            </div>
            <div>
              <h3>Others</h3>
              <a href="#">Terms and services</a>
              <a href="#">Privacy</a>
              <a href="#">Licence</a>
              <a href="#">Cookie policy</a>
            </div>
          </div>
        </div>
      </footer>

      <script src="script.js"></script>
      <script src='toggle.js'></script>
    </div>
  );
};

export default Home;
