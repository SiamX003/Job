import React, { useEffect, useState } from "react";
import axios from "axios";

function JobCard({ job, onSelect }) {
  return (
    <div
      onClick={() => onSelect(job)}
      style={{
        border: "1px solid #eee",
        padding: "20px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        background: "#fff"
      }}
    >
      <div>
        <h2>{job.title}</h2>
        <p>{job.company} — {job.location}</p>
        <p>
          {job.salaryMin && job.salaryMax
            ? `$${job.salaryMin}–${job.salaryMax}/month`
            : "Salary negotiable"}
        </p>
      </div>
      <span
        style={{
          padding: "6px 12px",
          borderRadius: "20px",
          background: "#f6e9ff",
          fontWeight: "bold"
        }}
      >
        {job.type}
      </span>
    </div>
  );
}

function JobDetails({ job, onClose }) {
  if (!job) return null;

  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : (job.requirements || "").split(",").map(r => r.trim()).filter(Boolean);

  const qualifications = Array.isArray(job.qualifications)
    ? job.qualifications
    : (job.qualifications || "").split(",").map(q => q.trim()).filter(Boolean);

  const handleApply = () => {
    if (job.applyUrl) {
      window.open(job.applyUrl, "_blank");
    } else if (job.applyEmail) {
      window.location.href = `mailto:${job.applyEmail}?subject=Application for ${encodeURIComponent(job.title)}`;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "700px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto"
        }}
      >
        <button
          onClick={onClose}
          style={{ float: "right", border: "none", background: "transparent", fontSize: "18px", cursor: "pointer" }}
        >
          ✕
        </button>
        <h2>{job.title}</h2>
        <p><strong>{job.company}</strong> — {job.location}</p>
        <p><strong>Type:</strong> {job.type}</p>
        <p><strong>Salary:</strong> {job.salaryMin} - {job.salaryMax}</p>

        <h3>1. Requirements</h3>
        <ul>
          {requirements.length ? requirements.map((r, i) => <li key={i}>{r}</li>) : <li>No requirements listed.</li>}
        </ul>

        <h3>2. Qualification</h3>
        <ul>
          {qualifications.length ? qualifications.map((q, i) => <li key={i}>{q}</li>) : <li>No qualifications listed.</li>}
        </ul>

        <button
          onClick={handleApply}
          style={{
            marginTop: "20px",
            padding: "12px 18px",
            background: "#16a085",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          APPLY NOW
        </button>
      </div>
    </div>
  );
}

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:1000/api/jobs");
        setJobs(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    })();
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Recent Jobs</h1>
      <div style={{ display: "grid", gap: "16px" }}>
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onSelect={setSelectedJob} />
        ))}
      </div>

      {selectedJob && <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}
