const User = require("../models/User");
const crypto = require("crypto");

/* ---------------- PHASE 1 ANSWERS ---------------- */

const phase1Answers = {
  clue1: "answer1",
  clue2: "answer2",
  clue3: "answer3",
  clue4: "answer4",
  clue5: "answer5"
};

/* ---------------- PHASE 2 ANSWERS ---------------- */

const phase2Answers = {
  c11: "main1",
  c1: "sub1",

  c22: "main2",
  c2: "sub2",

  c33: "main3",
  c3: "sub3",

  c44: "main4",
  c4: "sub4"
};

/* ---------------- PHASE 3 ANSWERS ---------------- */

const phase3Answers = {
  clue1: "mail1",
  clue2: "mail2",
  clue3: "mail3",
  clue4: "mail4"
};


/* ---------------- GET PHASE 1 CLUES ---------------- */

const getPhase1Clues = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.currentPhase !== 1) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      cluesSolved: user.cluesSolvedPhase1,
      cluesAnswers: user.cluesAnswersPhase1   // ⭐ ADDED
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ---------------- SUBMIT PHASE 1 ANSWER ---------------- */

const submitPhase1Answer = async (req, res) => {
  try {
    const { clueId, answer } = req.body;

    const user = await User.findById(req.userId);

    if (user.currentPhase !== 1) {
      return res.status(403).json({ message: "Access denied" });
    }

    const progress = user.cluesSolvedPhase1;

    if (progress[clueId]) {
      return res.json({
        message: "Clue already solved",
        cluesSolved: progress
      });
    }

    const correctAnswer = phase1Answers[clueId];

    if (!correctAnswer) {
      return res.status(400).json({ message: "Invalid clue" });
    }

    if (answer.toLowerCase() !== correctAnswer.toLowerCase()) {
      return res.status(400).json({ message: "Wrong answer" });
    }

    user.cluesSolvedPhase1[clueId] = true;
    user.cluesAnswersPhase1[clueId] = answer;   // ⭐ ADDED

    const p = user.cluesSolvedPhase1;

    if (p.clue1 && p.clue2 && p.clue3 && p.clue4 && p.clue5) {
      user.phase1Completed = true;
      user.phase1CompletedTime = new Date();

      const token = crypto.randomBytes(16).toString("hex");
      user.phase1Token = token;

      await user.save();

      return res.json({
        message: "Phase 1 completed",
        phase1Token: token
      });
    }

    await user.save();

    res.json({
      message: "Correct answer",
      cluesSolved: user.cluesSolvedPhase1
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ---------------- GET PHASE 2 CLUES ---------------- */

const getPhase2Clues = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.currentPhase !== 2) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      cluesSolved: user.cluesSolvedPhase2,
      cluesAnswers: user.cluesAnswersPhase2   // ⭐ ADDED
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ---------------- SUBMIT PHASE 2 ANSWER ---------------- */

const submitPhase2Answer = async (req, res) => {
  try {
    const { clueId, answer } = req.body;

    const user = await User.findById(req.userId);

    if (user.currentPhase !== 2) {
      return res.status(403).json({ message: "Access denied" });
    }

    const progress = user.cluesSolvedPhase2;

    if (progress[clueId]) {
      return res.json({
        message: "Clue already solved",
        cluesSolved: progress
      });
    }

    if (clueId === "c1" && !progress.c11)
      return res.status(403).json({ message: "Solve main clue first" });

    if (clueId === "c2" && !progress.c22)
      return res.status(403).json({ message: "Solve main clue first" });

    if (clueId === "c3" && !progress.c33)
      return res.status(403).json({ message: "Solve main clue first" });

    if (clueId === "c4" && !progress.c44)
      return res.status(403).json({ message: "Solve main clue first" });

    const correctAnswer = phase2Answers[clueId];

    if (!correctAnswer) {
      return res.status(400).json({ message: "Invalid clue" });
    }

    if (answer.toLowerCase() !== correctAnswer.toLowerCase()) {
      return res.status(400).json({ message: "Wrong answer" });
    }

    user.cluesSolvedPhase2[clueId] = true;
    user.cluesAnswersPhase2[clueId] = answer;   // ⭐ ADDED

    const p = user.cluesSolvedPhase2;

    if (
      p.c11 && p.c1 &&
      p.c22 && p.c2 &&
      p.c33 && p.c3 &&
      p.c44 && p.c4
    ) {

      user.phase2Completed = true;
      user.phase2CompletedTime = new Date();

      const token = crypto.randomBytes(16).toString("hex");
      user.phase2Token = token;

      await user.save();

      return res.json({
        message: "Phase 2 completed",
        phase2Token: token
      });
    }

    await user.save();

    res.json({
      message: "Correct answer",
      cluesSolved: user.cluesSolvedPhase2
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ---------------- GET PHASE 3 CLUES ---------------- */

const getPhase3Clues = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.currentPhase !== 3) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      cluesSolved: user.cluesSolvedPhase3,
      cluesAnswers: user.cluesAnswersPhase3   // ⭐ ADDED
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ---------------- SUBMIT PHASE 3 ANSWER ---------------- */

const submitPhase3Answer = async (req, res) => {
  try {
    const { clueId, answer } = req.body;

    const user = await User.findById(req.userId);

    if (user.currentPhase !== 3) {
      return res.status(403).json({ message: "Access denied" });
    }

    const progress = user.cluesSolvedPhase3;

    if (progress[clueId]) {
      return res.json({
        message: "Clue already solved",
        cluesSolved: progress
      });
    }

    const correctAnswer = phase3Answers[clueId];

    if (!correctAnswer) {
      return res.status(400).json({ message: "Invalid clue" });
    }

    if (answer.toLowerCase() !== correctAnswer.toLowerCase()) {
      return res.status(400).json({ message: "Wrong answer" });
    }

    user.cluesSolvedPhase3[clueId] = true;
    user.cluesAnswersPhase3[clueId] = answer;   // ⭐ ADDED

    const p = user.cluesSolvedPhase3;

    if (p.clue1 && p.clue2 && p.clue3 && p.clue4) {
      user.phase3Completed = true;
      user.phase3CompletedTime = new Date();

      await user.save();

      return res.json({
        message: "Phase 3 completed. Send the email now."
      });
    }

    await user.save();

    res.json({
      message: "Correct answer",
      cluesSolved: user.cluesSolvedPhase3
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getPhase1Clues,
  submitPhase1Answer,
  getPhase2Clues,
  submitPhase2Answer,
  getPhase3Clues,
  submitPhase3Answer
};