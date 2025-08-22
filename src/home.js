import React, { useState } from "react";
import "./home.css";
import "./script.js";
import logo from "./images/logo.png";
import heroImg from "./images/hero1.PNG";
import fe1 from "./images/fe 1.png";
import fe2 from "./images/fe 2.png";
import fe3 from "./images/fe 3.png";
import fe4 from "./images/fe 4.png";
import google from "./images/google.png";
import uber from "./images/uber.png";
import yahoo from "./images/yahoo.png";
import linkedin from "./images/linkedin.png";
import { Link } from "react-router-dom";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeJobFilter, setActiveJobFilter] = useState("all");

  // Jobs data
  const jobsData = [
    {
      id: 1,
      type: "fullTime",
      img: google,
      title: "Web Developer",
      salary: "$750-1000/month",
      jobType: "Full Time",
    },
    {
      id: 2,
      type: "freelance",
      img: uber,
      title: "Freelancer",
      salary: "$750-1000/month",
      jobType: "Freelancer",
    },
    {
      id: 3,
      type: "partTime",
      img: yahoo,
      title: "Web Developer",
      salary: "$750-1000/month",
      jobType: "Full Time",
    },
    {
      id: 4,
      type: "partTime",
      img: linkedin,
      title: "Business Associate",
      salary: "$750-1000/month",
      jobType: "Part Time",
    },
  ];

  // Filter jobs
  const filteredJobs =
    activeJobFilter === "all"
      ? jobsData
      : jobsData.filter((job) => job.type === activeJobFilter);

  return (
    <div>
      {/* Navbar */}
      <header>
        <div id="navbar" className="obj-width">
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
          <ul id="menu" className={menuOpen ? "active" : ""}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/browse">Browse</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
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
              Work with talented people at the most affordable price to get the
              most out of your time and cost
            </p>
            <div className="search">
              <input type="text" placeholder="Search your job here" />
              <Link to="/search">Search</Link>
            </div>
          </div>

          <div className="h-right">
            <img src={heroImg} alt="hero" />
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
            <p>
              It's free and easy to post a job. Simply fill in a title,
              description.
            </p>
          </div>
          <div>
            <img src={fe2} alt="Choose freelancers" />
            <h3>Choose freelancers</h3>
            <p>
              It's free and easy to post a job. Simply fill in a title,
              description.
            </p>
          </div>
          <div>
            <img src={fe3} alt="Pay safely" />
            <h3>Pay safely</h3>
            <p>
              It's free and easy to post a job. Simply fill in a title,
              description.
            </p>
          </div>
          <div>
            <img src={fe4} alt="We are here to help" />
            <h3>We are here to help</h3>
            <p>
              It's free and easy to post a job. Simply fill in a title,
              description.
            </p>
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
    </div>
  );
};

export default Home;