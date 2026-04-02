"use client";

import { useState } from "react";
import API from "../../services/api";
import VerifyUI from "@/components/auth/VerifyUI";

export default function Verify() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (): Promise<boolean> => {
    try {
      setLoading(true);

      const phase = localStorage.getItem("verifyPhase");

      let res;

      if (phase === "1") {
        res = await API.post("/verify/phase1");
      } else if (phase === "2") {
        res = await API.post("/verify/phase2");
      } else {
        setMessage("Invalid verification state");
        setLoading(false);
        return false;
      }

      if (res.data.verified) {
        // --- LOGIC FOR DYNAMIC NAMES ---
        const nextName = phase === "1" ? "shadow-x" : "fire-777";
        setMessage(`you have complete this phase now move to the next phase go to ${nextName} for another clues`);
        // -------------------------------

        localStorage.removeItem("verifyPhase");
        setLoading(false);
        return true; // ✅ success
      } else {
        // If not verified, use the default message from the database
        setMessage(res.data.message);
      }

    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Verification failed"
      );
    }

    setLoading(false);
    return false; // ❌ fail
  };

  return (
    <VerifyUI
      onVerify={handleVerify}
      loading={loading}
      message={message}
    />
  );
}
