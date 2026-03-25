const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  verifyPhase1,
  verifyPhase2
} = require("../controllers/verifyController");

router.post("/phase1", authMiddleware, verifyPhase1);
router.post("/phase2", authMiddleware, verifyPhase2);

module.exports = router;