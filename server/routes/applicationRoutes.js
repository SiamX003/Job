import express from "express";
import { apply, getApplicationsForJob, getApplicationsForUser } from "../controllers/applicationController.js";
import auth from "../middlewares/auth.js";
import { permit } from "../middlewares/roles.js";

const router = express.Router();

router.post("/", auth, permit("candidate"), apply);
router.get("/job/:jobId", auth, permit("recruiter"), getApplicationsForJob);
router.get("/user/:userId", auth, getApplicationsForUser);

export default router;
