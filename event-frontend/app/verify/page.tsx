"use client";

import { useState } from "react";
import API from "../../services/api";
import VerifyUI from "@/components/auth/VerifyUI";

export default function Verify() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [isSuccessModal, setIsSuccessModal] = useState(false);

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
        const name = phase === "1" ? "startbeyondlogic" : "fire-777";
        const path = phase === "1" ? "/phase2" : "/phase3";

        // We set these, but we also return true so the UI knows to look at them
        setNextPath(path);

        if (phase === "1") {
          setMessage("Verification complete. Reconstruct the answers of phase1 into a meaningful sentence and visit spiraldit.online/(your answer)");
        } else {
          setMessage("Congrats! You have completed Phase 2. Now rearrange the inner clues' answers to identify the Instagram ID.");
          setIsSuccessModal(true);
        }

        localStorage.removeItem("verifyPhase");
        setLoading(false);
        return true;
      } else {
        setMessage(res.data.message || "Verification failed");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Connection error");
    }

    setLoading(false);
    return false;
  };

  return (
    <VerifyUI
      onVerify={handleVerify}
      loading={loading}
      message={message}
      nextPath={nextPath}
      isSuccessModal={isSuccessModal}
    />
  );
}
