// routes/jobRoutes.js
import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { recruiterOnly } from "../middlewares/roles.js";

const router = express.Router();

// ✅ Public routes
router.get("/", getJobs);          // Get all jobs
router.get("/:id", getJobById);    // Get job by ID

// ✅ Recruiter-only routes (must be authenticated)
router.post("/", authMiddleware, recruiterOnly, createJob);      // Create job
router.put("/:id", authMiddleware, recruiterOnly, updateJob);    // Update job
router.delete("/:id", authMiddleware, recruiterOnly, deleteJob); // Delete job

export default router;
