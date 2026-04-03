const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const phaseRoutes = require("./routes/phaseRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// connect database
connectDB();

// ✅ CORS CONFIG
const corsOptions = {
  origin: [
    "https://spiral.vercel.app",
    "https://spiraldit.online",
    "https://www.spiraldit.online",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

// ❌ REMOVE this (causing crash)
// app.options("*", cors(corsOptions));

// middlewares
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/phase", phaseRoutes);
app.use("/api/verify", verifyRoutes);

// protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    userId: req.userId,
  });
});

// base route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// dynamic port (RENDER REQUIREMENT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
