const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const auth = require("../middleware/auth");
const { permit } = require("../middleware/roles");
//debug logs
console.log("jobController:", jobController);
console.log("auth:", auth);
console.log("permit:", permit)
// public
router.get("/", jobController.getJobs);
router.get("/:id", jobController.getJob);

// protected - recruiters only for create/update/delete
router.post("/", auth, permit("recruiter"), jobController.createJob);
router.put("/:id", auth, permit("recruiter"), jobController.updateJob);
router.delete("/:id", auth, permit("recruiter"), jobController.deleteJob);

module.exports = router;







// const express = require("express");
// const router = express.Router();
// const jobController = require("../controllers/jobController");
// //const auth = require("../middleware/auth");
// const { protect } = require("../middleware/auth");
// const { permit } = require("../middleware/roles");

// // public
// router.get("/", jobController.getJobs);
// router.get("/:id", jobController.getJob);

// // protected - recruiters only for create/update/delete
// // router.post("/", auth, permit("recruiter"), jobController.createJob);
// // router.put("/:id", auth, permit("recruiter"), jobController.updateJob);
// // router.delete("/:id", auth, permit("recruiter"), jobController.deleteJob);
// router.post("/", protect, permit("recruiter"), jobController.createJob);
// router.put("/:id", protect, permit("recruiter"), jobController.updateJob);
// router.delete("/:id", protect, permit("recruiter"), jobController.deleteJob);
// module.exports = router;
