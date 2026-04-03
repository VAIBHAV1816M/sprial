"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";
import { saveToken, getToken } from "../../utils/auth";
import Phase2UI from "@/components/phase2/Phase2UI";

const UNLOCK_TIME = new Date("2026-04-04T02:00:00+05:30");

function ComingSoonOverlay() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calc = () => {
      const diff = UNLOCK_TIME.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;
  if (Date.now() >= UNLOCK_TIME.getTime()) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #06110d 0%, #020304 100%)" }}
    >
      {/* Locked badge */}
      <span
        className="text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1 rounded-full border flex items-center gap-2 mb-8"
        style={{ color: "rgba(0,255,204,0.6)", borderColor: "rgba(0,255,204,0.18)" }}
      >
        <span className="w-[5px] h-[5px] rounded-full bg-[#00ffcc] inline-block animate-pulse" />
        Locked
      </span>

      {/* Title */}
      <h1
        className="text-4xl font-extrabold mb-3 text-center"
        style={{ fontFamily: "'Syne', sans-serif", color: "#e8eaf0" }}
      >
        Phase 2 Coming Soon
      </h1>
      <p className="text-sm mb-12" style={{ color: "#8892a4" }}>
        Unlocks on April 4th
      </p>

      {/* Countdown */}
      <div className="flex gap-4">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center w-20 h-20 rounded-xl"
            style={{
              background: "#07090d",
              border: "1px solid rgba(0,255,204,0.15)",
              boxShadow: "0 0 20px rgba(0,255,204,0.04)",
            }}
          >
            <span
              className="text-2xl font-bold font-mono"
              style={{ color: "#00ffcc" }}
            >
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[0.55rem] tracking-widest uppercase mt-1" style={{ color: "#8892a4" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Phase2() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      setLoading(false);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, clueId: string) => {
    setAnswers({ ...answers, [clueId]: e.target.value });
  };

  const handleSubmit = async (clueId: string) => {
    try {
      const res = await API.post("/phase/phase2/answer", {
        clueId,
        answer: answers[clueId],
      });
      setMessage(res.data.message);
      if (res.data.phase2Token) {
        localStorage.setItem("verifyPhase", "2");
        router.push("/verify");
        return;
      }
      setProgress(res.data.cluesSolved || {});
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
