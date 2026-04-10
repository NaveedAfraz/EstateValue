require("dotenv").config();

const PORT = process.env.PORT || 5000;
const express = require("express");
const cors = require("cors");
const propertyRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const path = require("path");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://estate-value.vercel.app",
  "https://estatevalue-2ibw.onrender.com",
  "https://estatevalue-1.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "Origin",
      "X-Requested-With",
      "Accept",
      "ngrok-skip-browser-warning",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(express.json());
app.use(
  "/uploads",
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "Origin",
      "X-Requested-With",
      "Accept",
      "ngrok-skip-browser-warning",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["Set-Cookie"],
  }),
  express.static(path.join(__dirname, "../uploads")),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contacts", contactRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;

// Prevent crashes from unhandled errors (critical for Render stability)
process.on("uncaughtException", (err) => {
  console.error("🔴 Uncaught Exception (process kept alive):", err.message);
});
process.on("unhandledRejection", (reason) => {
  console.error("🔴 Unhandled Rejection (process kept alive):", reason);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
