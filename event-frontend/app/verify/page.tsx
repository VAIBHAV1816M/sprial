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

      setMessage(res.data.message);

      if (res.data.verified) {
        localStorage.removeItem("verifyPhase");
        setLoading(false);
        return true; // ✅ success
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