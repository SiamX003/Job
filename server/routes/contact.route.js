import { Router } from "express";
import { createContactController, getAllContactsController } from "../controllers/contact.controller.js";
import auth from "../middlewares/auth.js"; // optional, protect admin route

const router = Router();

// POST /api/contact -> save new message
router.post("/", createContactController);

// GET /api/contact -> list all messages (protected)
router.get("/", auth, getAllContactsController);

export default router;
