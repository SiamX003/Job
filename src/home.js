import React, { useMemo, useState } from "react";
import "./home.css";

import logo from "./images/logo.png";
import heroImg from "./images/hero1.PNG"; // matches disk name exactly

// These imports match your current filenames with spaces.
// If you rename the files to fe1.png, fe2.png, etc., update these imports accordingly.
import fe1 from "./images/fe 1.png";
import fe2 from "./images/fe 2.png";
import fe3 from "./images/fe 3.png";
import fe4 from "./images/fe 4.png";

import t1 from "./images/t1.png";
import t2 from "./images/t2.png";
import t3 from "./images/t3.png";
import t4 from "./images/t4.png";
import t5 from "./images/t5.png";
import t6 from "./images/t6.png";

import fl1 from "./images/fl-1.png";
import fl2 from "./images/fl-2.png";
import fl3 from "./images/fl-3.png";
import fl4 from "./images/fl-4.png";

import google from "./images/google.png";
import uber from "./images/uber.png";
import yahoo from "./images/yahoo.png";
import linkedin from "./images/linkedin.png";

const jobsData = [
  { id: 1, type: "fullTime", img: google, title: "Web Developer", salary: "$750-1000/month", jobType: "Full Time" },
  { id: 2, type: "freelance", img: uber, title: "Freelancer", salary: "$750-1000/month", jobType: "Freelancer" },
  { id: 3, type: "partTime", img: yahoo, title: "Web Developer", salary: "$750-1000/month", jobType: "Full Time" },
  { id: 4, type: "partTime", img: linkedin, title: "Business Associate", salary: "$750-1000/month", jobType: "Part Time" },
];

const Home = () => {
  const [activeJobFilter, setActiveJobFilter] = useState("all");

  const filteredJobs = useMemo(() => {
    return activeJobFilter === "all"
      ? jobsData
      : jobsData.filter((job) => job.type === activeJobFilter);
  }, [activeJobFilter]);

  return (
    <div>
      {/* Navbar */}
      <header>
        <div id="navbar" className="obj-width">
          <a href="/">
            <img className="logo" src={logo} alt="Logo" />
          </a>
          <ul id="menu">
            <li><a href="/">Home</a></li>
            <li><a href="#browse">Browse</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><button id="w-btn">Join</button></li>
          </ul>
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
              <a href="#search">Search</a>
            </div>
          </div>

          <div className="h-right">
            <img src={heroImg} alt="Hero" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features sec-space obj-width" id="browse">
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
        <p>Most viewed and all time top selling services</p>

        <ul className="job-id">
          <li
            className={activeJobFilter === "all" ? "active" : ""}
            onClick={() => setActiveJobFilter("all")}
          >
            Recent Jobs
          </li>
          <li
            className={activeJobFilter === "freelance" ? "active" : ""}
            onClick={() => setActiveJobFilter("freelance")}
          >
            Freelancer
          </li>
          <li
            className={activeJobFilter === "fullTime" ? "active" : ""}
            onClick={() => setActiveJobFilter("fullTime")}
          >
            Full Time
          </li>
          <li
            className={activeJobFilter === "partTime" ? "active" : ""}
            onClick={() => setActiveJobFilter("partTime")}
          >
            Part Time
          </li>
        </ul>

        <div className="jobs-container">
          {filteredJobs.map((job) => (
            <div key={job.id} data-item={job.type} className="jList">
              <img src={job.img} alt={job.title} />
              <h3>{job.title}</h3>
              <p>{job.salary}</p>
              <span className="job-type">{job.jobType}</span>
            </div>
          ))}
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
              <span className="key">HTML</span>
              <span className="key">CSS</span>
              <span className="key">JavaScript</span>
            </div>
            <button>View Profile</button>
          </div>

          <div className="fl-box">
            <img src={fl2} alt="Jane Doe" />
            <h3>Jane Doe</h3>
            <div className="skill">
              <span className="key">HTML</span>
              <span className="key">CSS</span>
              <span className="key">JavaScript</span>
            </div>
            <button>View Profile</button>
          </div>

          <div className="fl-box">
            <img src={fl3} alt="Michael Brown" />
            <h3>Michael Brown</h3>
            <div className="skill">
              <span className="key">HTML</span>
              <span className="key">CSS</span>
              <span className="key">JavaScript</span>
            </div>
            <button>View Profile</button>
          </div>

          <div className="fl-box">
            <img src={fl4} alt="Thesera Ray" />
            <h3>Thesera Ray</h3>
            <div className="skill">
              <span className="key">HTML</span>
              <span className="key">CSS</span>
              <span className="key">JavaScript</span>
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
                <i className="bx bxl-facebook-square" />
              </a>
              <a href="https://x.com/i/lists/1959288678146294126">
                <i className="bx bxl-twitter" />
              </a>
              <a href="https://www.instagram.com/jobhunter749?igsh=dThtb3ozdzVpZHlv">
                <i className="bx bxl-instagram" />
              </a>
              <a href="https://www.linkedin.com/in/ahnaf-hossain-3b4b2521b/">
                <i className="bx bxl-linkedin-square" />
              </a>
            </div>
          </div>

          <div>
            <p>JobHunt is a global online platform for freelance services</p>
          </div>

          <div className="bottom">
            <div>
              <h3>Project</h3>
              <a href="#changelog">Change log</a>
              <a href="#status">Status</a>
              <a href="#license">License</a>
              <a href="#versions">All versions</a>
            </div>
            <div>
              <h3>Community</h3>
              <a href="https://github.com">Github</a>
              <a href="#problems">Your Problems</a>
              <a href="https://twitter.com">Twitter</a>
              <a href="https://linkedin.com">LinkedIn</a>
            </div>
            <div>
              <h3>Help</h3>
              <a href="#support">Support</a>
              <a href="#troubleshooting">Troubleshooting</a>
              <a href="#contact">Contact us</a>
              <a href="#faq">FAQ</a>
            </div>
            <div>
              <h3>Others</h3>
              <a href="#terms">Terms and services</a>
              <a href="#privacy">Privacy</a>
              <a href="#licence">Licence</a>
              <a href="#cookies">Cookie policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
