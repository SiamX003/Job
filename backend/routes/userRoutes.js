// userRoutes.js
const express = require("express");
const { register, login, getProfile } = require("../controllers/userController");
const auth = require("../middleware/auth"); // Changed this line

const router = express.Router();

// public routes
router.post("/register", register);
router.post("/login", login);

// protected route
router.get("/me", auth, getProfile); // Changed this line

module.exports = router;


// const express = require("express");
// const { register, login, getProfile } = require("../controllers/userController");
// const { protect } = require("../middleware/auth"); // make sure this file exists

// const router = express.Router();

// // public routes
// router.post("/register", register);
// router.post("/login", login);

// // protected route
// router.get("/me", protect, getProfile);

// module.exports = router;






// const express = require("express");
// const { register, login, getProfile } = require("../controllers/userController");
// const { protect } = require("../middleware/auth");

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// // Protected route
// router.get("/me", protect, getProfile);

// module.exports = router;
