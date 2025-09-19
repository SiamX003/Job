const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  company: { type: String, required: true },
  location: String,
  salary: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
