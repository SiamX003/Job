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
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "recruiter") {
      alert("❌ Only recruiters can create jobs.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await API.post("/jobs", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Job created successfully!");
      setForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });
    } catch (err) {
      console.error("Job creation error:", err);
      alert(err.response?.data?.message || "❌ Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Create Job</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="salary"
          placeholder="Salary (optional)"
          value={form.salary}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
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
