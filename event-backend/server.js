const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const phaseRoutes = require("./routes/phaseRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const verifyRoutes = require("./routes/verifyRoutes");

const app = express();

// connect database
connectDB();

// ✅ FIXED CORS (IMPORTANT)
const corsOptions = {
  origin: [
    //"http://localhost:3000",
    "https://spiral.vercel.app",
    "https://spiraldit.online",
    "https://www.spiraldit.online",
    "https://sprial.onrender.com",
  ],
  credentials: true
};

app.use(cors(corsOptions));

// ✅ VERY IMPORTANT (handles preflight)
app.options("*", cors(corsOptions));

// middlewares
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/phase", phaseRoutes);
app.use("/api/verify", verifyRoutes);

// test protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    userId: req.userId
  });
});

// base route
app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});