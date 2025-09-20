const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const { permit } = require("../middleware/roles");

router.get("/dashboard", auth, permit("admin"), adminController.getDashboardStats);
router.get("/users", auth, permit("admin"), adminController.getAllUsers);
router.delete("/users/:userId", auth, permit("admin"), adminController.deleteUser);
router.get("/jobs", auth, permit("admin"), adminController.getAllJobs);
router.delete("/jobs/:jobId", auth, permit("admin"), adminController.deleteJob);

///debug

// console.log("Auth middleware:", typeof auth);
// console.log("Permit function:", typeof permit);
// console.log("Permit admin:", typeof permit("admin"));
module.exports = router;