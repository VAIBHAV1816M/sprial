"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClueHex from "./ClueHex";
import CluePanel from "./CluePanel";
import CompletionScreen from "./CompletionScreen";
import ParticleBackground from "./ParticleBackground";
import Overlay from "@/components/overlay/Overlay"; // ✅ ADDED

type Props = {
  message: string;
  loading: boolean;
  isAllowed: boolean;
  checkingAuth: boolean;
  progress: Record<string, boolean>;
  answers: Record<string, string>;
  isEventComplete: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleAnswerChange: (e: React.ChangeEvent<HTMLInputElement>, clueId: string) => void;
  handleSubmit: (clueId: string) => void;
};

const clues = [
  { id: "clue1", title: "Clue 1", subtitle: "Decrypt" },
  { id: "clue2", title: "Clue 2", subtitle: "Analyze" },
  { id: "clue3", title: "Clue 3", subtitle: "Unlock" },
  { id: "clue4", title: "Clue 4", subtitle: "Decrypt Key" },
];

// ── Login Screen ─────────────
const LoginScreen = ({
  handleLogin,
  handleChange,
  loading,
  message,
}: Pick<Props, "handleLogin" | "handleChange" | "loading" | "message">) => {
  
  const isError = message.toLowerCase().includes("wrong") || 
                  message.toLowerCase().includes("failed") || 
                  message.toLowerCase().includes("error") || 
                  message.toLowerCase().includes("incorrect");

  return (
    <div
      className="flex justify-center items-center h-screen w-screen overflow-hidden relative"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #06110d 0%, #050709 65%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "relative", zIndex: 10, width: "400px",
          background: "rgba(7, 9, 13, 0.85)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,229,255,0.12)", borderRadius: "16px",
          padding: "36px", display: "flex", flexDirection: "column", gap: "24px",
          boxShadow: "0 0 80px rgba(0,229,255,0.04), 0 24px 48px rgba(0,0,0,0.6)",
        }}
      >
        <h1 style={{ color: "#e8eaf0" }}>Authentication</h1>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

          <button type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        {message && (
          <p style={{ color: isError ? "#ff4466" : "#00ff88" }}>
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
};

// ── Main Phase3 UI ─────────────────────────────────────────────────────────────
const Phase3UI = ({
  message, loading, isAllowed, checkingAuth, progress, answers,
  isEventComplete, handleChange, handleLogin, handleAnswerChange, handleSubmit,
}: Props) => {

  const [activeClue, setActiveClue] = useState<string | null>(null);

  // ✅ ADDED: Overlay while checking auth
  if (checkingAuth) {
    return <Overlay show={true} message="Verifying Access..." />;
  }

  if (!isAllowed) {
    return <LoginScreen handleLogin={handleLogin} handleChange={handleChange} loading={loading} message={message} />;
  }

  const handleHexClick = (clueId: string) => {
    setActiveClue((prev) => (prev === clueId ? null : clueId));
  };

  const solvedCount = Object.values(progress || {}).filter(Boolean).length;
  const isError = message.toLowerCase().includes("wrong") || message.toLowerCase().includes("error");

  return (
    <div className="h-screen w-screen relative">

      {/* ✅ ADDED: Overlay during loading */}
      <Overlay show={loading} message="Processing..." />

      <div>
        {clues.map((clue) => (
          <ClueHex
            key={clue.id}
            id={clue.id}
            title={clue.title}
            subtitle={clue.subtitle}
            active={activeClue === clue.id}
            solved={!!progress?.[clue.id]}
            onClick={() => handleHexClick(clue.id)}
          />
        ))}
      </div>

      <CluePanel
        activeClue={activeClue}
        isSolved={activeClue ? !!progress?.[activeClue] : false}
        answerValue={activeClue ? (answers?.[activeClue] || "") : ""}
        onAnswerChange={(e) => activeClue && handleAnswerChange(e, activeClue)}
        onSubmit={() => activeClue && handleSubmit(activeClue)}
      />

      <AnimatePresence>
        {isEventComplete && <CompletionScreen />}
      </AnimatePresence>
    </div>
  );
};

export default Phase3UI;
