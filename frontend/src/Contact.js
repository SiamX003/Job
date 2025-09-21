import React, { useState } from "react";
import API from "./api"; // ✅ axios instance
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await API.post("/contact", formData); // Calls backend

      if (response.data.success) {
        setSuccessMsg("✅ Thank you for your message! We’ll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setErrorMsg(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setErrorMsg(error.response?.data?.message || "❌ Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>Get in touch with us</p>

      {/* Contact info */}
      <div className="contact-info">
        <h2>Our Contact Information</h2>
        <p>Email: support@jobSolutions.com</p>
        <p>Phone: 01717278827</p>
        <p>AUST campus, Love Road, Tejgaon, Dhaka, Bangladesh</p>
      </div>

      {/* Contact form */}
      <div className="contact-form">
        <h2>Send us a Message</h2>

        {successMsg && <p className="success-msg">{successMsg}</p>}
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
