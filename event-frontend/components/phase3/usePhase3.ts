// components/phase3/usePhase3.ts

import { useState, useEffect } from "react";
import API from "@/services/api";
import { saveToken, getToken } from "@/utils/auth";

export const usePhase3 = () => {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [progress, setProgress] = useState<any>({});
  const [answers, setAnswers] = useState<any>({});
  
  // NEW: State to track if the entire event is finished
  const [isEventComplete, setIsEventComplete] = useState(false);

  // ─── NEW: Auto-clear message timer ───
  useEffect(() => {
    if (message) {
      // Clear the message after 3 seconds
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); 

      // Cleanup function to prevent memory leaks
      return () => clearTimeout(timer);
    }
  }, [message]);
  // ──────────────────────────────────────

  useEffect(() => {
    const token = getToken();
    const entry = localStorage.getItem("entry");
    const inside = sessionStorage.getItem("insidePhase3");

    if (token) {
      const fetchData = async () => {
        try {
          const res = await API.get("/phase/phase3");

          if (entry === "home" || inside === "true") {
            setIsAllowed(true);
            setProgress(res.data.cluesSolved || {});
            setAnswers(res.data.cluesAnswers || {});
            setMessage("");

            // Optional: If the backend tells us they already finished everything on initial load
            const solvedCount = Object.values(res.data.cluesSolved || {}).filter(Boolean).length;
            if (solvedCount === 4) {
              setIsEventComplete(true);
            }

            sessionStorage.setItem("insidePhase3", "true");
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

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);

      const token = res.data.token;
      const phase = res.data.currentPhase;

      saveToken(token);

      if (phase === 3) {
        setIsAllowed(true);
        setMessage("");
        sessionStorage.setItem("insidePhase3", "true");

        const data = await API.get("/phase/phase3");

        setProgress(data.data.cluesSolved || {});
        setAnswers(data.data.cluesAnswers || {});

        // Check if they are logging in and have already finished
        const solvedCount = Object.values(data.data.cluesSolved || {}).filter(Boolean).length;
        if (solvedCount === 4) {
          setIsEventComplete(true);
        }

      } else if (phase === 1) {
        setMessage("Complete Phase 1 first.");
      } else if (phase === 2) {
        setMessage("Complete Phase 2 first.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  const handleAnswerChange = (e: any, clueId: string) => {
    setAnswers({
      ...answers,
      [clueId]: e.target.value
    });
  };

  const handleSubmit = async (clueId: string) => {
    try {
      const res = await API.post("/phase/phase3/answer", {
        clueId,
        answer: answers[clueId]
      });

      setMessage(res.data.message);

      // UPDATED: Trigger the custom completion screen instead of the alert
      if (res.data.message.includes("completed")) {
        // Update local state so the final hexagon turns green
        setProgress((prev: any) => ({ ...prev, [clueId]: true }));
        setAnswers((prev: any) => ({ ...prev, [clueId]: answers[clueId] }));
        
        // Trigger the Full-Screen UI
        setIsEventComplete(true); 
        return;
      }

      setProgress(res.data.cluesSolved || {});
      setAnswers((prev: any) => ({
        ...prev,
        [clueId]: answers[clueId]
      }));

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return {
    form,
    message,
    loading,
    isAllowed,
    checkingAuth,
    progress,
    answers,
    isEventComplete, 
    handleChange,
    handleLogin,
    handleAnswerChange,
    handleSubmit
  };
};