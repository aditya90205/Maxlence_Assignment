import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { dbConnection } from "./config/dbConnect.js";
import { connectRedis } from "./config/redis.js";
import passport from "./config/passport.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(generalLimiter);

// CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["*"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Session configuration for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "User Management API is running!",
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Initialize database
  await dbConnection();

  // Initialize Redis
  await connectRedis();

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, "uploads", "profiles");
  await import("fs").then((fs) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  });
});

export default app;
