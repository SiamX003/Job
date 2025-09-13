// server/server.js (or index.js)
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/connectDB.js";
import contactRouter from "./routes/contact.route.js"; // ✅ this path matches your file

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));

// routes
app.use("/apicontact", contactRouter); // ✅ matches your React/Thunder URL

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 1000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
