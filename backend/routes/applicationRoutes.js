const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const auth = require("../middleware/auth");
const { permit } = require("../middleware/roles");

// protected
router.post("/", auth, permit("candidate"), applicationController.apply);

// recruiter: get applicants for a job
router.get("/job/:jobId", auth, permit("recruiter"), applicationController.getApplicationsForJob);

// candidate: get own applications (can also let user see their own by token)
router.get("/user/:userId", auth, applicationController.getApplicationsForUser);

module.exports = router;







// const express = require("express");
// const router = express.Router();
// const applicationController = require("../controllers/applicationController");
// const auth = require("../middleware/auth");
// const { permit } = require("../middleware/roles");

// // protected
// router.post("/", auth, permit("candidate"), applicationController.apply);

// // recruiter: get applicants for a job
// router.get("/job/:jobId", auth, permit("recruiter"), applicationController.getApplicationsForJob);

// // candidate: get own applications (can also let user see their own by token)
// router.get("/user/:userId", auth, applicationController.getApplicationsForUser);

// module.exports = router;
