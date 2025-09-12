// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import contactRouter from "./routes/contact.route.js";

// Load environment variables FIRST
dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({ crossOriginResourcePolicy: false }));

// ===== CORS =====
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// ===== ROUTES =====
app.use("/api/contact", contactRouter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: `Server is running on port ${process.env.PORT}` });
});

// ===== DB CONNECTION + SERVER START =====
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    import('./routes/user.route.js')
      .then((userRouterModule) => {
        const userRouter = userRouterModule.default;
        app.use("/api/user", userRouter);

        // Start server AFTER routes are loaded
        app.listen(process.env.PORT || 1000, () => {
          console.log(`✅ Server is running on port ${process.env.PORT || 1000}`);
        });
      })
      .catch(err => {
        console.error("❌ Failed to load user routes:", err);
        process.exit(1);
      });
  })
  .catch(err => {
    console.error("❌ Failed to connect to DB:", err);
    process.exit(1);
  });

export default app;
