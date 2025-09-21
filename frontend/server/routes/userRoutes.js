import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", registerUser);   // ✅ POST /api/user/register
router.post("/login", loginUser);         // ✅ POST /api/user/login

// Profile
router.get("/me", authMiddleware, getProfile);     // ✅ GET /api/user/me
router.put("/me", authMiddleware, updateProfile);  // ✅ PUT /api/user/me

export default router;
