"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Added Next.js Router
import API from "../../services/api";
import { saveToken, getToken } from "../../utils/auth";
import Phase2UI from "@/components/phase2/Phase2UI";

// ADD this above export default function Phase2()
const UNLOCK_TIME = new Date("2026-04-04T08:00:00+05:30");

function ComingSoonOverlay() {
  const now = new Date();
  if (now >= UNLOCK_TIME) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-2">Phase 2 Coming Soon</h1>
      <p className="text-lg">Unlocks on April 4th at 8:00 AM IST</p>
    </div>
  );
}

export default function Phase2() {
  const router = useRouter(); // Initialize router

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Consider making interfaces for these if you know the exact shape!
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = getToken();
    const entry = localStorage.getItem("entry");
    const inside = sessionStorage.getItem("insidePhase2");

    if (token) {
      const fetchData = async () => {
        try {
          const res = await API.get("/phase/phase2");

          if (entry === "home" || inside === "true") {
            setIsAllowed(true);
            setProgress(res.data.cluesSolved || {});
            setAnswers(res.data.cluesAnswers || {});
            setMessage("");

            sessionStorage.setItem("insidePhase2", "true");
            localStorage.removeItem("entry");
          } else {
            setIsAllowed(false);
          }
        } catch {
          setIsAllowed(false);
        } finally {
          setCheckingAuth(false);
        }
      };

      fetchData();
    } else {
      setCheckingAuth(false);
    }
  }, []);

  // NEW: Auto-clear messages after 3.5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3500); 

      // Cleanup function to prevent memory leaks
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Use proper React ChangeEvent type
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Use proper React FormEvent type
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      const token = res.data.token;
      const phase = res.data.currentPhase;

      saveToken(token);

      if (phase === 2) {
        setIsAllowed(true);
        setMessage("");

        sessionStorage.setItem("insidePhase2", "true");

        const data = await API.get("/phase/phase2");

        setProgress(data.data.cluesSolved || {});
        setAnswers(data.data.cluesAnswers || {});
      } else if (phase === 1) {
        setMessage("Complete Phase 1 first.");
      } else if (phase === 3) {
        setMessage("You have already completed Phase 2.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      // Moved to finally block so it always runs, even if there's an error
      setLoading(false); 
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, clueId: string) => {
    setAnswers({
      ...answers,
      [clueId]: e.target.value
    });
  };

  const handleSubmit = async (clueId: string) => {
    try {
      const res = await API.post("/phase/phase2/answer", {
        clueId,
        answer: answers[clueId]
      });

      setMessage(res.data.message);

      if (res.data.phase2Token) {
        localStorage.setItem("verifyPhase", "2");
        
        // FIXED: Using Next.js router instead of window.location
        router.push("/verify"); 
        return;
      }

      // Update progress with server response
      setProgress(res.data.cluesSolved || {});

      // We don't need to manually set the answer state here because 
      // handleAnswerChange already did it while the user was typing!

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error submitting answer");
    }
  };

  return (
    <>
      <ComingSoonOverlay />
      <Phase2UI
        checkingAuth={checkingAuth}
        isAllowed={isAllowed}
        form={form}
        message={message}
        loading={loading}
        progress={progress}
        answers={answers}
        handleChange={handleChange}
        handleLogin={handleLogin}
        handleAnswerChange={handleAnswerChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
