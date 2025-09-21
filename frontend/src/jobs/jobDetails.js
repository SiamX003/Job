// frontend/src/jobs/jobDetails.js
import React, { useEffect, useMemo, useState, useRef } from "react";
import "../home.css";
import "../Contact.css";
import { useParams } from "react-router-dom";
import jCategory from "./job-list";

// Images that exist in src/images (case-sensitive!)
import logo from "../images/logo.png";
import googleLogo from "../images/google.png";
import vacancyImg from "../images/vacancy.png";
import hourImg from "../images/hour.png";
import salaryImg from "../images/salary.png";
// No position.png in your folder — using linkedin.png as the "Position" icon
import positionImg from "../images/linkedin.png";

const Home = () => {
  const [activeJobFilter, setActiveJobFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const { id } = useParams();

  const modalOverlayRef = useRef(null);
  const loginEmailRef = useRef(null);

  // (kept in case you use it later)
  const filteredJobs = useMemo(() => {
    const byTab =
      activeJobFilter === "all"
        ? jCategory
        : jCategory.filter((j) => j.type === activeJobFilter);

    const q = searchQuery.trim().toLowerCase();
    if (!q) return byTab;

    return byTab.filter(
      (j) =>
        (j.title || "").toLowerCase().includes(q) ||
        (j.salary || "").toLowerCase().includes(q)
    );
  }, [activeJobFilter, searchQuery]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setModalOpen(false);
    if (modalOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  useEffect(() => {
    if (modalOpen && authTab === "login") {
      setTimeout(() => loginEmailRef.current?.focus(), 0);
    }
  }, [modalOpen, authTab]);

  const openModal = () => {
    setAuthTab("login");
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const onModalBackgroundClick = (e) => {
    if (e.target === modalOverlayRef.current) closeModal();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Logged in (demo)");
    closeModal();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Account created (demo)");
    closeModal();
  };

  return (
    <div>
      {/* Navbar */}
      <header>
        <div id="navbar" className="obj-width">
          <a href="/" className="brand">
            <img className="logo" src={logo} alt="Logo" />
          </a>

          <button
            id="bar"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((s) => !s)}
          >
            ☰
          </button>

          <ul
            id="menu"
            className={menuOpen ? "active" : ""}
            aria-label="Primary"
          >
            <li><a href="#browse">Browse</a></li>
            <li><a href="/">Home</a></li>
            <li><a href="/Contact">Contact</a></li>
            <li><button id="w-btn" onClick={openModal}>Join</button></li>
          </ul>
        </div>
      </header>

      <div id="jobsDetails" className="extra-space obj-width">
        <div className="job-header">
          <div className="job-img-row">
            <img src={googleLogo} alt="Google" />
          </div>
          <div>
            <h2>Google</h2>
            <span>USA</span>
          </div>
          <a id="g-btn" href="#" className="apply-btn">Apply Now</a>
        </div>

        <section className="features sec-space obj-width" id="browse">
          <div className="fe-box">
            <div>
              <img src={vacancyImg} alt="Vacancy" />
              <h3>Vacancy</h3>
              <p>01 Vacancy</p>
            </div>
            <div>
              <img src={hourImg} alt="Job Hours" />
              <h3>Job Hours</h3>
              <p>8 hr per day</p>
            </div>
            <div>
              <img src={salaryImg} alt="Salary" />
              <h3>Salary</h3>
              <p>$900–$1200</p>
            </div>
            <div>
              <img src={positionImg} alt="Position" />
              <h3>Position</h3>
              <p>Web Developer</p>
            </div>
          </div>
        </section>
      </div>

      <div class="job-description sec-space">
        <h3>Job Description</h3>
        <p>
          We’re seeking a Web Developer to turn Figma designs into pixel-perfect, responsive UIs, integrate REST APIs, 
          and ship performant, accessible features across modern browsers.
        </p>
      </div>

      {/* Footer */}
      <footer>
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

      {/* JOIN MODAL */}
      {modalOpen && (
        <div
          id="join-modal"
          className="modal-overlay show"
          aria-hidden={false}
          ref={modalOverlayRef}
          onClick={onModalBackgroundClick}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-title"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-head">
              <h3 id="join-title">Welcome</h3>
              <button className="close-x" aria-label="Close" onClick={closeModal}>
                &times;
              </button>
            </header>

            <nav className="tabs" aria-label="Auth tabs">
              <button
                className={`tab-btn ${authTab === "login" ? "active" : ""}`}
                onClick={() => setAuthTab("login")}
              >
                Log in
              </button>
              <button
                className={`tab-btn ${authTab === "register" ? "active" : ""}`}
                onClick={() => setAuthTab("register")}
              >
                Register
              </button>
            </nav>

            <div className="modal-body">
              {authTab === "login" && (
                <form id="login-pane" className="tab-pane active" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="login-email">Email</label>
                    <input
                      id="login-email"
                      ref={loginEmailRef}
                      className="input"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input
                      id="login-password"
                      className="input"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <button type="submit" className="btn primary full">
                    Log in
                  </button>
                </form>
              )}

              {authTab === "register" && (
                <form id="register-pane" className="tab-pane active" onSubmit={handleRegister}>
                  <div className="form-group">
                    <label htmlFor="reg-name">Full name</label>
                    <input id="reg-name" className="input" type="text" placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-email">Email</label>
                    <input id="reg-email" className="input" type="email" placeholder="you@example.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-password">Password</label>
                    <input
                      id="reg-password"
                      className="input"
                      type="password"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <button type="submit" className="btn primary full">
                    Create account
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
