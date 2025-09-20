const Job = require("../models/Job");

exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;
    const job = new Job({ title, description, company, location, salary, postedBy: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.postedBy.toString() !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.postedBy.toString() !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    await job.remove();
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// MODIFIED / ADDED: new function for recruiter to get their own jobs
exports.getRecruiterJobs = async (req, res) => {  // <<< ADDED
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
