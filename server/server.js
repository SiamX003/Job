import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/connectDB.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));

// ===== Routes =====
app.use("/api/user", userRouter);

// ===== Test route =====
app.get("/", (req, res) => res.json({ message: `Server running on port ${process.env.PORT}` }));

// ===== Start server =====
connectDB().then(() => {
  app.listen(process.env.PORT || 1000, () => {
    console.log(`✅ Server running on port ${process.env.PORT}`);
  });
});
