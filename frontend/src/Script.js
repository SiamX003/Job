import { useState } from "react";

function JobScript({ jobs }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Filtering logic
  const filteredJobs = jobs.filter((job) => {
    const matchesCategory =
      activeFilter === "all" || job.type === activeFilter;

    const jobTitle = job.title.toLowerCase();
    const jobType = job.type.toLowerCase();
    const company = (job.company || "").toLowerCase();

    const matchesSearch =
      jobTitle.includes(searchText.toLowerCase()) ||
      jobType.includes(searchText.toLowerCase()) ||
      company.includes(searchText.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search bar */}
      <input
        id="searchBar"
        type="text"
        placeholder="Search jobs..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
      />

      {/* Filters */}
      <ul className="job-id">
        <li
          className={activeFilter === "all" ? "active" : ""}
          onClick={() => setActiveFilter("all")}
        >
          Recent Jobs
        </li>
        <li
          className={activeFilter === "freelance" ? "active" : ""}
          onClick={() => setActiveFilter("freelance")}
        >
          Freelancer
        </li>
        <li
          className={activeFilter === "fullTime" ? "active" : ""}
          onClick={() => setActiveFilter("fullTime")}
        >
          Full Time
        </li>
        <li
          className={activeFilter === "partTime" ? "active" : ""}
          onClick={() => setActiveFilter("partTime")}
        >
          Part Time
        </li>
      </ul>

      {/* Jobs list */}
      <div className="jobs-container">
        {filteredJobs.length === 0 ? (
          <p>No matching jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="jList">
              <img src={job.img} alt={job.company || "Company"} />
              <h3>{job.title}</h3>
              <p>{job.salary}</p>
              <span id="key">{job.type}</span>
            </div>
          ))
        )}
      </div>

      {/* Modal Example */}
      <button id="w-btn" onClick={() => setShowModal(true)}>
        Join
      </button>

      {showModal && (
        <div
          id="joinModal"
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
}

export default JobScript;
