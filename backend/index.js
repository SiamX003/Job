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

