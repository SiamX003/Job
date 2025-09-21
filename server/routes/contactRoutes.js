import express from "express";
import { sendMessage, getMessages } from "../controllers/contactController.js";
import auth from "../middlewares/auth.js";        // check folder name: in your screenshot it's "middlewares"
import { permit } from "../middlewares/roles.js"; // same here

const router = express.Router();

// Public route to send message
router.post("/", sendMessage);

// Optional: protected route to get all messages (for admins)
router.get("/", auth, permit("admin"), getMessages);

export default router; // ✅ ESM export
