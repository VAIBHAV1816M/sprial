const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getPhase1Clues,
  submitPhase1Answer,
  getPhase2Clues,
  submitPhase2Answer,
  getPhase3Clues,
  submitPhase3Answer
} = require("../controllers/phaseController");


// PHASE 1
router.get("/phase1", authMiddleware, getPhase1Clues);
router.post("/phase1/answer", authMiddleware, submitPhase1Answer);


// PHASE 2
router.get("/phase2", authMiddleware, getPhase2Clues);
router.post("/phase2/answer", authMiddleware, submitPhase2Answer);


// PHASE 3
router.get("/phase3", authMiddleware, getPhase3Clues);
router.post("/phase3/answer", authMiddleware, submitPhase3Answer);


module.exports = router;