const Application = require("../models/Application");
const Job = require("../models/Job");

exports.apply = async (req, res) => {
  try {
    const { jobId, resumeLink } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // prevent duplicate application by same candidate for same job
    const already = await Application.findOne({ jobId, candidateId: req.user.id });
    if (already) return res.status(400).json({ message: "Already applied" });

    const application = new Application({ jobId, candidateId: req.user.id, resumeLink });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId }).populate("candidateId", "name email resumeLink");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getApplicationsForUser = async (req, res) => {
  try {
    const apps = await Application.find({ candidateId: req.params.userId }).populate("jobId");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};







// const Application = require("../models/Application");
// const Job = require("../models/Job");

// exports.apply = async (req, res) => {
//   try {
//     const { jobId, resumeLink } = req.body;

//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     // prevent duplicate application by same candidate for same job
//     const already = await Application.findOne({ jobId, candidateId: req.user.id });
//     if (already) return res.status(400).json({ message: "Already applied" });

//     const application = new Application({ jobId, candidateId: req.user.id, resumeLink });
//     await application.save();
//     res.status(201).json(application);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// exports.getApplicationsForJob = async (req, res) => {
//   try {
//     const apps = await Application.find({ jobId: req.params.jobId }).populate("candidateId", "name email resumeLink");
//     res.json(apps);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getApplicationsForUser = async (req, res) => {
//   try {
//     const apps = await Application.find({ candidateId: req.params.userId }).populate("jobId");
//     res.json(apps);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
