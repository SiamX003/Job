import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";
import armRouter from "./category/arm.js";

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({ crossOriginResourcePolicy: false }));

// ===== CORS =====
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ===== ROUTES =====
app.get("/", (req, res) => res.json({ message: `Server running on port ${process.env.PORT}` }));
app.use("/api/user", userRouter);
app.use("/api/arm", armRouter);

// ===== START SERVER =====
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  });
});
