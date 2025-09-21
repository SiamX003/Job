import React, { useState } from "react";
import "../style.css";
import "boxicons/css/boxicons.min.css";

const JobsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Handle join form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <header>
        <div id="navbar" className="obj-width">
          <a href="/">
            <img className="logo" src="/images/logo.png" alt="JobHunt" />
          </a>
          <ul id="menu">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="#">Browse</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <button id="w-btn" onClick={() => setIsModalOpen(true)}>
              Join
            </button>
          </ul>
        </div>
      </header>

      {/* Jobs Section */}
      <section className="jobs sec-space obj-width">
        <h2>Jobs in Demand</h2>
        <p>Most viewed and all time top selling services</p>

        <form>
          <i className="bx bx-search-alt-2"></i>
          <input
            type="text"
            placeholder="Search Jobs"
            id="searchBar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="jobs-container" id="root">
          {/* You can render jobs dynamically here later */}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="obj-width">
          <div className="top">
            <img className="logo" src="/images/logo.png" alt="Logo" />
            <div>
              <a
                href="https://www.facebook.com/profile.php?id=61579876076360"
                aria-label="Facebook"
              >
                <i className="bx bxl-facebook-square"></i>
              </a>
              <a href="https://x.com/i/lists/1959288678146294126" aria-label="Twitter">
                <i className="bx bxl-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com/jobhunter749?igsh=dThtb3ozdzVpZHlv"
                aria-label="Instagram"
              >
                <i className="bx bxl-instagram"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/ahnaf-hossain-3b4b2521b/"
                aria-label="LinkedIn"
              >
                <i className="bx bxl-linkedin-square"></i>
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
              <a href="https://github.com">Github</a>
              <a href="#">Your Problems</a>
              <a href="https://twitter.com">Twitter</a>
              <a href="https://linkedin.com">LinkedIn</a>
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

      {/* Join Modal */}
      {isModalOpen && (
        <div id="joinModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h2>Join JobHunt</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
