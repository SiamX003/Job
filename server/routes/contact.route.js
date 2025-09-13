// server/routes/contact.route.js
import express from "express";
import {
  createContactController,
  getAllContactsController,
} from "../controllers/contact.controller.js";

const router = express.Router();

// POST /apicontact  -> save a new contact message
router.post("/", createContactController);

// GET /apicontact   -> list all messages (optional admin view)
router.get("/", getAllContactsController);

export default router;
