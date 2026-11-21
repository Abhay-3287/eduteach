
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Routes
const schoolApplicationRoutes = require("./routes/schoolApplicationRoutes");
const authRoutes = require("./routes/authRoutes");

// Error Middleware
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
  })
);

// Body Parser
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/school-applications", schoolApplicationRoutes);

// Home API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EduTrack India API",
  });
});

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduTrack backend is running",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
    environment: process.env.NODE_ENV || "development",
  });
});

// 404 Middleware (Must be after all routes)
app.use(notFound);

// Global Error Handler (Must be last)
app.use(errorHandler);

// Server Configuration
const PORT = process.env.PORT || 5000;

// Connect MongoDB and Start Server
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`EduTrack API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
