import React, { useEffect, useMemo, useState } from "react";
import "./home.css";
import API from "./api";

import logo from "./images/logo.png";
import heroImg from "./images/hero1.PNG";
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

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [activeJobFilter, setActiveJobFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter + search
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesCategory =
        activeJobFilter === "all" || job.type === activeJobFilter;

      const search = searchText.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(search) ||
        (job.company || "").toLowerCase().includes(search) ||
        (job.location || "").toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [activeJobFilter, searchText, jobs]);

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
            <li><button id="w-btn" onClick={() => setShowModal(true)}>Join</button></li>
          </ul>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-box">
          <div className="h-left">
            <h2>Find the perfect freelance services for your business</h2>
            <p>
              Work with talented people at the most affordable price to get the most
              out of your time and cost
            </p>
            <div className="search">
              <input
                type="text"
                placeholder="Search your job here"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <a href="#jobs">Search</a>
            </div>
          </div>
          <div className="h-right">
            <img src={heroImg} alt="Hero" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features sec-space obj-width" id="browse">
        <h2>Need something done?</h2>
        <p className="sub-text">Most viewed and all-time top-selling services</p>
        <div className="fe-box">
          <div><img src={fe1} alt="" /><h3>Post a job</h3><p>It's free and easy to post a job. Simply fill in a title, description.</p></div>
          <div><img src={fe2} alt="" /><h3>Choose freelancers</h3><p>Pick the best fit for your project from available freelancers.</p></div>
          <div><img src={fe3} alt="" /><h3>Pay safely</h3><p>Payments are safe and protected for both parties.</p></div>
          <div><img src={fe4} alt="" /><h3>We are here to help</h3><p>24/7 support available for your projects.</p></div>
        </div>
      </section>

      {/* Jobs */}
      <section className="jobs sec-space obj-width" id="jobs">
        <h2>Jobs in Demand</h2>
        <p>Most viewed and all time top selling services</p>

        <ul className="job-id">
          <li className={activeJobFilter === "all" ? "active" : ""} onClick={() => setActiveJobFilter("all")}>Recent Jobs</li>
          <li className={activeJobFilter === "freelance" ? "active" : ""} onClick={() => setActiveJobFilter("freelance")}>Freelancer</li>
          <li className={activeJobFilter === "fullTime" ? "active" : ""} onClick={() => setActiveJobFilter("fullTime")}>Full Time</li>
          <li className={activeJobFilter === "partTime" ? "active" : ""} onClick={() => setActiveJobFilter("partTime")}>Part Time</li>
        </ul>

        <div className="jobs-container">
          {loading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            filteredJobs.map((job) => (
              <div key={job._id} data-item={job.type} className="jList">
                <h3>{job.title}</h3>
                <p>{job.company} - {job.location}</p>
                <p>{job.salary || "Negotiable"}</p>
                <span className="job-type">{job.type}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Trust */}
      <section className="trust sec-space obj-width">
        <h2>Trusted by the world's best</h2>
        <p>Most viewed all time</p>
        <div className="t-box">
          <img src={t1} alt="" /><img src={t2} alt="" /><img src={t3} alt="" />
          <img src={t4} alt="" /><img src={t5} alt="" /><img src={t6} alt="" />
        </div>
      </section>

      {/* Highest Rated Freelancers */}
      <section className="highest sec-space obj-width">
        <h2>Highest Rated Freelancers</h2>
        <p>Most viewed and all-time top-selling services</p>
        <div className="team-container">
          <div className="fl-box"><img src={fl1} alt="" /><h3>John Smith</h3><div className="skill"><span id="key">HTML</span><span id="key">CSS</span><span id="key">JS</span></div><button>View Profile</button></div>
          <div className="fl-box"><img src={fl2} alt="" /><h3>Jane Doe</h3><div className="skill"><span id="key">React</span><span id="key">Node</span></div><button>View Profile</button></div>
          <div className="fl-box"><img src={fl3} alt="" /><h3>Michael Brown</h3><div className="skill"><span id="key">Python</span><span id="key">Django</span></div><button>View Profile</button></div>
          <div className="fl-box"><img src={fl4} alt="" /><h3>Thesera Ray</h3><div className="skill"><span id="key">Java</span><span id="key">Spring</span></div><button>View Profile</button></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="obj-width">
          <div className="top">
            <img className="logo" src={logo} alt="Logo" />
            <div>
              <a href="https://www.facebook.com/profile.php?id=61579876076360"><i className="bx bxl-facebook-square" /></a>
              <a href="https://x.com/i/lists/1959288678146294126"><i className="bx bxl-twitter" /></a>
              <a href="https://www.instagram.com/jobhunter749?igsh=dThtb3ozdzVpZHlv"><i className="bx bxl-instagram" /></a>
              <a href="https://www.linkedin.com/in/ahnaf-hossain-3b4b2521b/"><i className="bx bxl-linkedin-square" /></a>
            </div>
          </div>
          <div><p>JobHunt is a global online platform for freelance services</p></div>
          <div className="bottom">
            <div><h3>Project</h3><a href="#changelog">Change log</a><a href="#status">Status</a><a href="#license">License</a><a href="#versions">All versions</a></div>
            <div><h3>Community</h3><a href="https://github.com">Github</a><a href="#problems">Your Problems</a><a href="https://twitter.com">Twitter</a><a href="https://linkedin.com">LinkedIn</a></div>
            <div><h3>Help</h3><a href="#support">Support</a><a href="#troubleshooting">Troubleshooting</a><a href="#contact">Contact us</a><a href="#faq">FAQ</a></div>
            <div><h3>Others</h3><a href="#terms">Terms</a><a href="#privacy">Privacy</a><a href="#licence">Licence</a><a href="#cookies">Cookie policy</a></div>
          </div>
        </div>
      </footer>

      {/* Join Modal */}
      {showModal && (
        <div
          className="modal"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
              maxWidth: "400px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <span
              className="close"
              onClick={() => setShowModal(false)}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "10px",
                right: "20px",
                fontSize: "20px",
              }}
            >
              &times;
            </span>
            <h2>Join Us</h2>
            <p>Sign up to access more job opportunities!</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
