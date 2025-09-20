const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/contactController");
const auth = require("../middleware/auth"); // optional, if you want protected route
const { permit } = require("../middleware/roles"); // optional, for admin access

// Public route to send message
router.post("/", sendMessage);

// Optional: protected route to get all messages (for admins)
router.get("/", auth, permit("admin"), getMessages);

module.exports = router;
