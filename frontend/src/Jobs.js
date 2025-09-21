// Jobs.js
import React, { useEffect, useState } from "react";
import API from "./api";
import { useAuth } from "./AuthContext";

function Jobs() {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    }
  };

  const applyToJob = async (jobId) => {
    if (!isAuthenticated || user?.role !== "candidate") {
      alert("Only job seekers can apply.");
      return;
    }

    try {
      setApplying(true);
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/applications",
        {
          jobId,
          resumeLink: user.resumeLink || "", // use resume link from profile
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Application submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply for job");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1>Available Jobs</h1>

      {jobs.length === 0 ? (
        <p>No jobs available at the moment.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {jobs.map((job) => (
            <li
              key={job._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3>{job.title}</h3>
              <p>
                <strong>Company:</strong> {job.company}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              {job.salary && (
                <p>
                  <strong>Salary:</strong> {job.salary}
                </p>
              )}
              <p>{job.description}</p>
              <p>
                <em>Posted by: {job.postedBy?.name || "Unknown"}</em>
              </p>

              {/* Recruiter-only delete option */}
              {isAuthenticated && user?.role === "recruiter" && user.id === job.postedBy?._id && (
                <button
                  onClick={() => deleteJob(job._id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                  }}
                >
                  Delete Job
                </button>
              )}

              {/* Candidate-only Apply button */}
              {isAuthenticated && user?.role === "candidate" && (
                <button
                  onClick={() => applyToJob(job._id)}
                  disabled={applying}
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: applying ? "not-allowed" : "pointer",
                  }}
                >
                  {applying ? "Applying..." : "Apply"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Jobs;
