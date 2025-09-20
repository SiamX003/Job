// const User = require("../models/User");
// const Job = require("../models/Job");
// const Application = require("../models/Application");

// exports.getDashboardStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const totalJobs = await Job.countDocuments();
//     const totalApplications = await Application.countDocuments();
    
//     const usersByRole = await User.aggregate([
//       { $group: { _id: '$role', count: { $sum: 1 } } }
//     ]);
    
//     const applicationsByStatus = await Application.aggregate([
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);
    
//     res.json({
//       totalUsers,
//       totalJobs,
//       totalApplications,
//       usersByRole,
//       applicationsByStatus
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password").sort({ createdAt: -1 });
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.userId);
//     res.json({ message: "User deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getAllJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
//     res.json(jobs);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.deleteJob = async (req, res) => {
//   try {
//     await Job.findByIdAndDelete(req.params.jobId);
//     res.json({ message: "Job deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    
    res.json({
      totalUsers,
      totalJobs,
      totalApplications
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.jobId);
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};