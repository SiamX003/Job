// CreateJob.js
import React, { useState } from "react";
import API from "./api";
import { useAuth } from "./AuthContext";

function CreateJob() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "recruiter") {
      alert("Only recruiters can create jobs.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.post("/jobs", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Job created successfully!");
      setForm({ title: "", company: "", location: "", salary: "", description: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Create Job</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Salary (optional)"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
        />
        <textarea
          placeholder="Job Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}

export default CreateJob;
