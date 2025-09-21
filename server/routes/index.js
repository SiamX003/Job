// routes/index.js
import express from "express";
import userRoutes from "./userRoutes.js";
import jobRoutes from "./jobRoutes.js";
import applicationRoutes from "./applicationRoutes.js";
import contactRoutes from "./contactRoutes.js";

const router = express.Router();

// ✅ Use singular "/user" so it matches frontend calls
router.use("/user", userRoutes);  

router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/contact", contactRoutes);

export default router;
