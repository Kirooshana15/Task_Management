const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const errorMiddleware = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const workItemRoutes = require("./routes/workItemRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "*", 
    credentials: false, // If origin is *, credentials must be false
  })
);

// ─── Request Parsing ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── HTTP Request Logger (dev only) ──────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "ServiceFlow API is running.",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/work-items", workItemRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
