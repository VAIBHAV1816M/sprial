const User = require("../models/User");

/* -------- PHASE 1 VERIFICATION -------- */

const verifyPhase1 = async (req, res) => {

  try {

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        verified: false
      });
    }

    if (!user.phase1Completed) {
      return res.status(403).json({
        message: "Phase 1 not completed",
        verified: false
      });
    }

    // unlock Phase 2
    user.currentPhase = 2;

    await user.save();

    res.json({
      message: "Verification successful",
      verified: true
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};


/* -------- PHASE 2 VERIFICATION -------- */

const verifyPhase2 = async (req, res) => {

  try {

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        verified: false
      });
    }

    if (!user.phase2Completed) {
      return res.status(403).json({
        message: "Phase 2 not completed",
        verified: false
      });
    }

    // unlock Phase 3
    user.currentPhase = 3;

    await user.save();

    res.json({
      message: "Verification successful",
      verified: true
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};

module.exports = {
  verifyPhase1,
  verifyPhase2
};