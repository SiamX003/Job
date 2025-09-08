import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import armRouter from "./category/arm.js";

// Load environment variables
dotenv.config();

const app = express();   // ✅ initialize app BEFORE using app.use

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ===== CORS =====
app.use(cors({
  origin: 'http://localhost:3000', // React frontend
  credentials: true,               // allow cookies
}));
app.options('*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// ===== TEST ROUTE =====
app.get('/', (req, res) => {
  res.json({
    message: `Server is running on port ${process.env.PORT}`,
  });
});

// ===== API ROUTES =====
app.use("/api/user", userRouter);
app.use("/api/arm", armRouter);   // ✅ Arm route works here

// ===== DB CONNECTION + SERVER START =====
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB', err);
    process.exit(1);
  });
