const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const auth = require("../middleware/auth");
const { permit } = require("../middleware/roles");
// DEBUG - Add these lines
/*
console.log("=== DEBUG APPLICATION ROUTES ===");
console.log("auth:", typeof auth);
console.log("permit:", typeof permit);
console.log("applicationController:", Object.keys(applicationController));
console.log("updateApplicationStatus:", typeof applicationController.updateApplicationStatus);
//////////////////////////////////
*/
// Apply for a job (candidates only)
router.post("/", 
  auth, 
  permit("candidate"), 
  applicationController.apply
);

// Get all applications for a specific job (recruiters only - for their own jobs)
router.get("/job/:jobId", 
  auth, 
  permit("recruiter"), 
  applicationController.getApplicationsForJob
);

// Get applications for a specific user
// Candidates can see their own, recruiters can see applications for their jobs
router.get("/user/:userId", 
  auth, 
  applicationController.getApplicationsForUser
);

// Update application status (recruiters only - for their own jobs)
router.put("/:applicationId/status", 
  auth, 
  permit("recruiter"), 
  applicationController.updateApplicationStatus
);

// Withdraw application (candidates only - their own applications)
router.delete("/:applicationId", 
  auth, 
  permit("candidate"), 
  applicationController.withdrawApplication
);

// Get current user's applications (candidates only)
router.get("/my-applications", 
  auth, 
  permit("candidate"), 
  (req, res) => {
    req.params.userId = req.user.id;
    applicationController.getApplicationsForUser(req, res);
  }
);

// Get applications for recruiter's jobs with optional status filter
router.get("/recruiter/applications", 
  auth, 
  permit("recruiter"), 
  async (req, res) => {
    try {
      const Application = require("../models/Application");
      const { status } = req.query;
      
      // Use basic query instead of static method
      let query = { recruiterId: req.user.id };
      if (status) {
        query.status = status;
      }
      
      const applications = await Application.find(query)
        .populate('candidateId', 'name email resumeLink')
        .populate('jobId', 'title company location')
        .sort({ createdAt: -1 });
      
      res.json({
        message: "Applications retrieved successfully",
        totalApplications: applications.length,
        applications: applications
      });
    } catch (error) {
      console.error("Recruiter applications error:", error);
      res.status(500).json({ message: "Server error while retrieving applications" });
    }
  }
);

// Get application statistics for recruiter
router.get("/recruiter/stats", 
  auth, 
  permit("recruiter"), 
  async (req, res) => {
    try {
      const Application = require("../models/Application");
      
      // Use basic aggregation instead of static method
      const applications = await Application.find({ recruiterId: req.user.id });
      const totalApplications = applications.length;
      
      // Count by status
      const breakdown = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});
      
      const stats = Object.keys(breakdown).map(status => ({
        status: status,
        count: breakdown[status]
      }));
      
      res.json({
        message: "Statistics retrieved successfully",
        totalApplications: totalApplications,
        breakdown: stats
      });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "Server error while retrieving statistics" });
    }
  }
);

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const applicationController = require("../controllers/applicationController");
// const auth = require("../middleware/auth");
// const { permit } = require("../middleware/roles");

// // Apply for a job (candidates only)
// router.post("/", 
//   auth, 
//   permit("candidate"), 
//   applicationController.apply
// );

// // Get all applications for a specific job (recruiters only - for their own jobs)
// router.get("/job/:jobId", 
//   auth, 
//   permit("recruiter"), 
//   applicationController.getApplicationsForJob
// );

// // Get applications for a specific user
// // Candidates can see their own, recruiters can see applications for their jobs
// router.get("/user/:userId", 
//   auth, 
//   applicationController.getApplicationsForUser
// );
// //for debugging the backend issue'''''''''''''''
// // console.log("auth:", typeof auth);
// // console.log("permit recruiter:", typeof permit("recruiter"));
// // console.log("updateApplicationStatus:", typeof applicationController.updateApplicationStatus);


// // Update application status (recruiters only - for their own jobs)
// router.put("/:applicationId/status", 
//   auth, 
//   permit("recruiter"), 
//   applicationController.updateApplicationStatus
// );

// // Withdraw application (candidates only - their own applications)
// router.delete("/:applicationId", 
//   auth, 
//   permit("candidate"), 
//   applicationController.withdrawApplication
// );

// // Get current user's applications (candidates only)
// router.get("/my-applications", 
//   auth, 
//   permit("candidate"), 
//   (req, res) => {
//     req.params.userId = req.user.id;
//     applicationController.getApplicationsForUser(req, res);
//   }
// );

// // Get applications for recruiter's jobs with optional status filter
// router.get("/recruiter/applications", 
//   auth, 
//   permit("recruiter"), 
//   async (req, res) => {
//     try {
//       const Application = require("../models/Application");
//       const { status } = req.query;
      
//       let applications;
//       if (status) {
//         applications = await Application.findByRecruiter(req.user.id, status);
//       } else {
//         applications = await Application.findByRecruiter(req.user.id);
//       }
      
//       // Get stats
//       const stats = await Application.getApplicationStats(req.user.id);
      
//       res.json({
//         message: "Applications retrieved successfully",
//         totalApplications: applications.length,
//         statusBreakdown: stats,
//         applications: applications
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Server error while retrieving applications" });
//     }
//   }
// );

// // Get application statistics for recruiter
// router.get("/recruiter/stats", 
//   auth, 
//   permit("recruiter"), 
//   async (req, res) => {
//     try {
//       const Application = require("../models/Application");
//       const stats = await Application.getApplicationStats(req.user.id);
      
//       const totalApplications = stats.reduce((sum, stat) => sum + stat.count, 0);
      
//       res.json({
//         message: "Statistics retrieved successfully",
//         totalApplications: totalApplications,
//         breakdown: stats
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Server error while retrieving statistics" });
//     }
//   }
// );

// module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const applicationController = require("../controllers/applicationController");
// // const auth = require("../middleware/auth");
// // const { permit } = require("../middleware/roles");

// // // protected
// // router.post("/", auth, permit("candidate"), applicationController.apply);

// // // recruiter: get applicants for a job
// // router.get("/job/:jobId", auth, permit("recruiter"), applicationController.getApplicationsForJob);

// // // candidate: get own applications (can also let user see their own by token)
// // router.get("/user/:userId", auth, applicationController.getApplicationsForUser);

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const applicationController = require("../controllers/applicationController");
// const auth = require("../middleware/auth");
// const { permit } = require("../middleware/roles");

// // Apply for a job (candidates only)
// router.post("/", 
//   auth, 
//   permit("candidate"), 
//   applicationController.apply
// );

// // Get all applications for a specific job (recruiters only - for their own jobs)
// router.get("/job/:jobId", 
//   auth, 
//   permit("recruiter"), 
//   applicationController.getApplicationsForJob
// );

// // Get applications for a specific user
// // Candidates can see their own, recruiters can see applications for their jobs
// router.get("/user/:userId", 
//   auth, 
//   applicationController.getApplicationsForUser
// );

// // Update application status (recruiters only - for their own jobs)
// router.put("/:applicationId/status", 
//   auth, 
//   permit("recruiter"), 
//   applicationController.updateApplicationStatus
// );

// // Withdraw application (candidates only - their own applications)
// router.delete("/:applicationId", 
//   auth, 
//   permit("candidate"), 
//   applicationController.withdrawApplication
// );

// // Get current user's applications (candidates only)
// router.get("/my-applications", 
//   auth, 
//   permit("candidate"), 
//   (req, res) => {
//     req.params.userId = req.user.id;
//     applicationController.getApplicationsForUser(req, res);
//   }
// );

// // Get applications for recruiter's jobs with optional status filter
// router.get("/recruiter/applications", 
//   auth, 
//   permit("recruiter"), 
//   async (req, res) => {
//     try {
//       const Application = require("../models/Application");
//       const { status } = req.query;
      
//       let applications;
//       if (status) {
//         applications = await Application.findByRecruiter(req.user.id, status);
//       } else {
//         applications = await Application.findByRecruiter(req.user.id);
//       }
      
//       // Get stats
//       const stats = await Application.getApplicationStats(req.user.id);
      
//       res.json({
//         message: "Applications retrieved successfully",
//         totalApplications: applications.length,
//         statusBreakdown: stats,
//         applications: applications
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Server error while retrieving applications" });
//     }
//   }
// );

// // Get application statistics for recruiter
// router.get("/recruiter/stats", 
//   auth, 
//   permit("recruiter"), 
//   async (req, res) => {
//     try {
//       const Application = require("../models/Application");
//       const stats = await Application.getApplicationStats(req.user.id);
      
//       const totalApplications = stats.reduce((sum, stat) => sum + stat.count, 0);
      
//       res.json({
//         message: "Statistics retrieved successfully",
//         totalApplications: totalApplications,
//         breakdown: stats
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Server error while retrieving statistics" });
//     }
//   }
// );

// module.exports = router;







// // const express = require("express");
// // const router = express.Router();
// // const applicationController = require("../controllers/applicationController");
// // const auth = require("../middleware/auth");
// // const { permit } = require("../middleware/roles");

// // // protected
// // router.post("/", auth, permit("candidate"), applicationController.apply);

// // // recruiter: get applicants for a job
// // router.get("/job/:jobId", auth, permit("recruiter"), applicationController.getApplicationsForJob);

// // // candidate: get own applications (can also let user see their own by token)
// // router.get("/user/:userId", auth, applicationController.getApplicationsForUser);

// // module.exports = router;
