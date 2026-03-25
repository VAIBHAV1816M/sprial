const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  currentPhase: {
    type: Number,
    default: 1
  },

  phase1Completed: {
    type: Boolean,
    default: false
  },

  phase2Completed: {
    type: Boolean,
    default: false
  },

  phase3Completed: {
    type: Boolean,
    default: false
  },

  // ================= EXISTING (UNCHANGED) =================
  cluesSolvedPhase1: {
    clue1: { type: Boolean, default: false },
    clue2: { type: Boolean, default: false },
    clue3: { type: Boolean, default: false },
    clue4: { type: Boolean, default: false },
    clue5: { type: Boolean, default: false }
  },

  cluesSolvedPhase2: {
    c11: { type: Boolean, default: false },
    c1: { type: Boolean, default: false },

    c22: { type: Boolean, default: false },
    c2: { type: Boolean, default: false },

    c33: { type: Boolean, default: false },
    c3: { type: Boolean, default: false },

    c44: { type: Boolean, default: false },
    c4: { type: Boolean, default: false }
  },

  cluesSolvedPhase3: {
    clue1: { type: Boolean, default: false },
    clue2: { type: Boolean, default: false },
    clue3: { type: Boolean, default: false },
    clue4: { type: Boolean, default: false }
  },

  // ================= NEW (ANSWERS STORAGE) =================

  cluesAnswersPhase1: {
    clue1: { type: String, default: "" },
    clue2: { type: String, default: "" },
    clue3: { type: String, default: "" },
    clue4: { type: String, default: "" },
    clue5: { type: String, default: "" }
  },

  cluesAnswersPhase2: {
    c11: { type: String, default: "" },
    c1: { type: String, default: "" },

    c22: { type: String, default: "" },
    c2: { type: String, default: "" },

    c33: { type: String, default: "" },
    c3: { type: String, default: "" },

    c44: { type: String, default: "" },
    c4: { type: String, default: "" }
  },

  cluesAnswersPhase3: {
    clue1: { type: String, default: "" },
    clue2: { type: String, default: "" },
    clue3: { type: String, default: "" },
    clue4: { type: String, default: "" }
  },

  // ================= EXISTING =================

  phase1CompletedTime: Date,
  phase1Token: String,
  phase2CompletedTime: Date,
  phase2Token: String,
  phase3CompletedTime: Date

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);