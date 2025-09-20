// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const userRoutes = require("./routes/userRoutes");
// const jobRoutes = require("./routes/jobRoutes");
// const applicationRoutes = require("./routes/applicationRoutes");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // root route
// app.get("/", (req, res) => res.send("Backend server is running 🚀"));

// // api routes
// app.use("/api/users", userRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/applications", applicationRoutes);

// // connect to MongoDB and start server
// const PORT = process.env.PORT || 5000;
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB Connected");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch(err => {
//     console.error("❌ DB Connection Error:", err.message);
//     process.exit(1);
//   });
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// root route
app.get("/", (req, res) => res.send("Backend server is running 🚀"));

// api routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/contact", contactRoutes);
//app.use('/api/admin', require('./routes/adminRoutes'));
// Test each component separately
console.log("Testing User model...");
try {
  const User = require('./models/User');
  console.log("User model OK");
} catch (err) {
  console.log("User model error:", err.message);
}

console.log("Testing Job model...");
try {
  const Job = require('./models/Job');
  console.log("Job model OK");
} catch (err) {
  console.log("Job model error:", err.message);
}

console.log("Testing Application model...");
try {
  const Application = require('./models/Application');
  console.log("Application model OK");
} catch (err) {
  console.log("Application model error:", err.message);
}

console.log("Testing admin controller...");
try {
  const adminController = require('./controllers/adminController');
  console.log("Admin controller OK, functions:", Object.keys(adminController));
} catch (err) {
  console.log("Admin controller error:", err.message);
}

console.log("Testing admin routes...");
try {
  const adminRoutes = require('./routes/adminRoutes');
  console.log("Admin routes OK, type:", typeof adminRoutes);
  app.use('/api/admin', adminRoutes);
  console.log("Admin routes mounted successfully");
} catch (err) {
  console.log("Admin routes error:", err.message);
}


// connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  });

