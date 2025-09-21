import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./home.css";

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

import API from "./api";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [activeJobFilter, setActiveJobFilter] = useState("freelance");
  const [myJobs, setMyJobs] = useState([]);
  const [jobStats, setJobStats] = useState({ totalJobs: 0, totalApplications: 0 });

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      }
    };
    fetchJobs();
  }, []);

  // Fetch recruiter's jobs and stats
  useEffect(() => {
    if (user?.role === 'recruiter') {
      fetchRecruiterData();
    }
  }, [user]);

  const fetchRecruiterData = async () => {
    try {
      // Fetch recruiter's jobs
      const jobsRes = await API.get('/jobs');
      //const recruiterJobs = jobsRes.data.filter(job => job.postedBy._id === user.id);
      const recruiterJobs = jobsRes.data.filter(job => job.postedBy._id === user._id);
      //const recruiterJobs = jobsRes.data.filter(job => job.postedBy === user.id);
      setMyJobs(recruiterJobs);

      // Fetch application stats for recruiter's jobs
      let totalApplications = 0;
      for (let job of recruiterJobs) {
        try {
          const appRes = await API.get(`/applications/job/${job._id}`);
          totalApplications += appRes.data.totalApplications || appRes.data.applications?.length || 0;
        } catch (err) {
          // Skip if no applications or access denied
        }
      }

      setJobStats({
        totalJobs: recruiterJobs.length,
        totalApplications: totalApplications
      });
    } catch (err) {
      console.error("Failed to fetch recruiter data", err);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Map your jobType field to the filter values
      // const jobType = job.jobType || job.type;
      const jobType = job.type;
      // if (activeJobFilter === "freelance") return jobType === "freelance";
      // if (activeJobFilter === "fullTime") return jobType === "full-time";
      // if (activeJobFilter === "partTime") return jobType === "part-time";
      if (activeJobFilter === "freelance") return jobType === "freelance";
      if (activeJobFilter === "fullTime") return jobType === "fullTime";
      if (activeJobFilter === "partTime") return jobType === "partTime";
      return false;
    });
  }, [activeJobFilter, jobs]);

  const filteredMyJobs = useMemo(() => {
    return myJobs.filter((job) => {
      const jobType = job.jobType || job.type;
      if (activeJobFilter === "freelance") return jobType === "freelance";
      if (activeJobFilter === "fullTime") return jobType === "full-time";
      if (activeJobFilter === "partTime") return jobType === "part-time";
      return false;
    });
  }, [activeJobFilter, myJobs]);

  const handleJobClick = (job) => {
    // Navigate to jobs page with specific job highlighted
    navigate('/jobs', { state: { selectedJobId: job._id, searchQuery: job.title } });
  };

  const handleCreateJobClick = () => {
    navigate('/create-job');
  };

  const handleViewApplications = (jobId) => {
    navigate(`/applications/job/${jobId}`);
  };

  // Jobs Section for Candidates and Non-authenticated users
  const CandidateJobsSection = () => (
    <section className="jobs sec-space obj-width">
      <h2>Jobs in Demand</h2>
      <p>Click on any job to view details and apply</p>

      <ul className="job-id">
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
        {filteredJobs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            gridColumn: '1 / -1'
          }}>
            <p>No {activeJobFilter === "fullTime" ? "full-time" : activeJobFilter === "partTime" ? "part-time" : "freelance"} jobs available at the moment.</p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Check back later or try a different job type.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              data-item={job.jobType || job.type}
              className="jList clickable-job"
              onClick={() => handleJobClick(job)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: 'white'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <img src={job.companyLogo || "default-job.png"} alt={job.title} />
              <h3>{job.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{job.company}</p>
              <p style={{ color: '#007bff', fontWeight: '600' }}>
                {job.salaryMin && job.salaryMax
                  ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
                  : job.salary || "Salary not specified"
                }
              </p>
              <p style={{ color: '#888', fontSize: '0.8rem' }}>📍 {job.location || 'Location not specified'}</p>
              <span className="job-type">
                {job.jobType === "full-time"
                  ? "Full Time"
                  : job.jobType === "part-time"
                    ? "Part Time"
                    : "Freelance"}
              </span>
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.8rem',
                color: '#007bff',
                fontWeight: '500'
              }}>
                Click to view details & apply →
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );

  const RecruiterJobsSection = () => (
    <section className="jobs sec-space obj-width">
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h2>Your Recruitment Dashboard</h2>
        <p>Manage your job postings and track applications</p>

        {/* Stats Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginTop: '3rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #e9ecef',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#007bff' }}>
              {jobStats.totalJobs}
            </div>
            <h3 style={{ margin: '0', color: '#333', fontSize: '1.5rem' }}>
              Jobs Posted
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              Total active job listings
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #e9ecef',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#28a745' }}>
              {jobStats.totalApplications}
            </div>
            <h3 style={{ margin: '0', color: '#333', fontSize: '1.5rem' }}>
              Applications Received
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              Candidates interested in your jobs
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleCreateJobClick}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(0,123,255,0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            + Post New Job
          </button>

          <button
            onClick={() => navigate('/profile')}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(40,167,69,0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1e7e34';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#28a745';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Manage Jobs & Applications
          </button>
        </div>

        {/* Quick Tips */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#e3f2fd',
          borderRadius: '12px',
          border: '1px solid #bbdefb'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#1565c0' }}>
            Quick Tips for Recruiters
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div>
              <strong style={{ color: '#1565c0' }}>Write Clear Job Titles</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Use specific, searchable job titles that candidates will look for
              </p>
            </div>
            <div>
              <strong style={{ color: '#1565c0' }}>Include Salary Ranges</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Jobs with salary information get 3x more applications
              </p>
            </div>
            <div>
              <strong style={{ color: '#1565c0' }}>Respond Quickly</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Fast responses improve your reputation with candidates
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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
            <li><a href="/jobs">Browse</a></li>
            <li><a href="/contact">Contact</a></li>
            {!isAuthenticated && <li><button id="w-btn">Join</button></li>}
          </ul>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-box">
          <div className="h-left">
            <h2>
              {user?.role === 'recruiter'
                ? 'Find the perfect candidates for your business'
                : 'Find the perfect freelance services for your business'
              }
            </h2>
            <p>
              {user?.role === 'recruiter'
                ? 'Post jobs and connect with talented professionals to grow your team'
                : 'Work with talented people at the most affordable price to get the most out of your time and cost'
              }
            </p>
            <div className="search">
              <input
                type="text"
                placeholder={user?.role === 'recruiter' ? "Search candidates" : "Search your job here"}
              />
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

      {/* Role-based Jobs Section */}
      {user?.role === 'recruiter' ? <RecruiterJobsSection /> : <CandidateJobsSection />}

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
            <img src={fl3} alt="Michael Brown" />
            <h3>Michael Brown</h3>
            <div className="skill">
              <span id="key">HTML</span>
              <span id="key">CSS</span>
              <span id="key">JavaScript</span>
            </div>
            <button>View Profile</button>
          </div>

          <div className="fl-box">
            <img src={fl4} alt="Thesera Ray" />
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



