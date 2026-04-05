"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClueHex from "./ClueHex";
import CluePanel from "./CluePanel";
import CompletionScreen from "./CompletionScreen";
import ParticleBackground from "./ParticleBackground";

// --- OVERLAY SECTION (April 5th) ---
const UNLOCK_TIME = new Date("2026-04-05T15:00:00+05:30");

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
      <span
        className="text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1 rounded-full border flex items-center gap-2 mb-8"
        style={{ color: "rgba(0,255,204,0.6)", borderColor: "rgba(0,255,204,0.18)" }}
      >
        <span className="w-[5px] h-[5px] rounded-full bg-[#00ffcc] inline-block animate-pulse" />
        Locked
      </span>

      <h1
        className="text-4xl font-extrabold mb-3 text-center"
        style={{ fontFamily: "'Syne', sans-serif", color: "#e8eaf0" }}
      >
        Phase 3 Coming Soon
      </h1>
      <p className="text-sm mb-12" style={{ color: "#8892a4" }}>
        Unlocks on April 5th
      </p>

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
            <span className="text-2xl font-bold font-mono" style={{ color: "#00ffcc" }}>
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
// --- END OVERLAY SECTION ---

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
  { id: "clue1", title: "Clue 1", subtitle: "Decrypt", text: "Among the hexes, lies a number.\nCount the edges to reveal it." },
  { id: "clue2", title: "Clue 2", subtitle: "Analyze", text: "On the east side lies a hidden bloom.\nNo sunlight, no scent—count what defines it." },
  { id: "clue3", title: "Clue 3", subtitle: "Unlock", text: "Rise once above the common ground,\nwhere paths don’t end, just turn around.\nFollow the curve that won’t stay straight,\nthen face what it refuses to state." },
];

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
          position: "relative", zIndex: 10, width: "90%", maxWidth: "400px",
          background: "rgba(7, 9, 13, 0.85)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,229,255,0.12)", borderRadius: "16px",
          padding: "24px 20px", display: "flex", flexDirection: "column", gap: "24px",
          boxShadow: "0 0 80px rgba(0,229,255,0.04), 0 24px 48px rgba(0,0,0,0.6)",
        }}
        className="sm:p-9"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <span style={{
            fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase",
            padding: "4px 12px", borderRadius: "99px", border: "1px solid rgba(0,229,255,0.18)",
            color: "rgba(0,229,255,0.6)", display: "flex", alignItems: "center", gap: "8px", width: "fit-content"
          }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00e5ff" }} className="animate-pulse" />
            Phase 3 // Secure Access
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#e8eaf0", fontSize: "1.6rem", lineHeight: 1.2 }}>
            Authentication
          </h1>
          <p style={{ fontSize: "0.75rem", color: "#8892a4" }}>Establish secure link to Core Data Integration.</p>
        </motion.div>

        <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(0,229,255,0.18), transparent)" }} />

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { name: "email", type: "email", label: "Email", placeholder: "agent@network.io" },
            { name: "password", type: "password", label: "Security Key", placeholder: "••••••••" },
          ].map((field, i) => (
            <motion.div key={field.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.07 }} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8892a4", fontFamily: "'Share Tech Mono', monospace" }}>{field.label}</label>
              <input name={field.name} type={field.type} placeholder={field.placeholder} onChange={handleChange} required style={{
                background: "#0c0f14", border: "1px solid rgba(0,229,255,0.18)", borderRadius: "8px",
                padding: "12px 16px", fontSize: "0.85rem", color: "#e8eaf0", outline: "none",
                fontFamily: "'Share Tech Mono', monospace", caretColor: "#00e5ff", transition: "border-color 0.2s"
              }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.45)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.18)")}
              />
            </motion.div>
          ))}
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
            marginTop: "8px", background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.3)", borderRadius: "8px", padding: "12px", color: "#00e5ff", fontFamily: "'Orbitron', monospace", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, transition: "background 0.2s"
          }}>
            {loading ? "Authenticating..." : "Authenticate"}
          </motion.button>
        </form>
        {message && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", fontSize: "0.75rem", color: isError ? "#ff4466" : "#00ff88", fontFamily: "'Share Tech Mono', monospace" }}>{message}</motion.p>}
      </motion.div>
    </div>
  );
};

const Phase3UI = ({
  message, loading, isAllowed, checkingAuth, progress, answers,
  isEventComplete, handleChange, handleLogin, handleAnswerChange, handleSubmit,
}: Props) => {
  const [activeClue, setActiveClue] = useState<string | null>(null);

  if (checkingAuth) return null;

  if (!isAllowed) {
    return (
      <>
        <ComingSoonOverlay />
        <LoginScreen handleLogin={handleLogin} handleChange={handleChange} loading={loading} message={message} />
      </>
    );
  }

  const handleHexClick = (clueId: string) => {
    setActiveClue((prev) => (prev === clueId ? null : clueId));
  };

  const solvedCount = Object.values(progress || {}).filter(Boolean).length;
  const isError = message.toLowerCase().includes("wrong") || message.toLowerCase().includes("error");

  return (
    <div
      className="h-screen w-screen text-[#e8eaf0] font-dm relative overflow-hidden flex flex-col"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #06110d 0%, #050709 65%)" }}
    >
      <ComingSoonOverlay />

      <div className="absolute top-[-150px] left-[-150px] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(0,255,204,0.05)_0%,transparent_70%)]" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(167,139,250,0.04)_0%,transparent_70%)]" />

      <div
        className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-[#050709d1] backdrop-blur-md border-b border-[rgba(0,255,204,0.1)] relative z-50 shrink-0"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#00ffcc", fontSize: "0.9rem", letterSpacing: "0.1em" }}>PHASE 3</span>
          <span style={{ fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, background: "rgba(0,255,204,0.06)", border: "1px solid rgba(0,255,204,0.15)", color: "rgba(0,255,204,0.5)" }}>Integration</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8892a4" }}>Clues Solved</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#00ffcc", fontSize: "0.85rem" }}>{solvedCount} / 3</span>
        </div>
      </div>

      <AnimatePresence>
        {message && !isEventComplete && (
          <motion.div
            initial={{ opacity: 0, y: -30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -30, x: "-50%" }}
            style={{
              position: "absolute", top: "85px", left: "50%", zIndex: 100, padding: "10px 24px", borderRadius: "30px",
              background: isError ? "rgba(255, 68, 102, 0.1)" : "rgba(0, 255, 136, 0.1)", border: `1px solid ${isError ? "rgba(255, 68, 102, 0.3)" : "rgba(0, 255, 136, 0.3)"}`,
              boxShadow: `0 0 20px ${isError ? "rgba(255, 68, 102, 0.15)" : "rgba(0, 255, 136, 0.15)"}`, color: isError ? "#ff4466" : "#00ff88",
              fontFamily: "'Share Tech Mono', monospace", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: "8px", backdropFilter: "blur(10px)"
            }}
          >
            <span style={{ fontSize: "1rem" }}>{isError ? "⚠" : "✓"}</span>
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[900px] mx-auto flex flex-col items-center justify-center gap-6 px-6 z-10 flex-1 h-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-2 text-[0.68rem] text-[#8892a4] tracking-[0.14em] uppercase mb-2">
            <span className="w-1.5 h-1.5 bg-[#00ffcc] rounded-full shadow-[0_0_8px_#00ffcc] animate-pulse" />
            Phase 3
          </div>
          <h1 className="font-syne font-extrabold text-[clamp(1.8rem,7vw,3rem)] leading-[1.1] tracking-wide bg-gradient-to-br from-[#e8eaf0] to-[#00ffcc] bg-clip-text text-transparent uppercase">
            Core Data Integration
          </h1>
          <p className="text-[#8892a4] text-[0.65rem] sm:text-[0.8rem] mt-2 font-mono tracking-widest uppercase text-center max-w-[80%] sm:max-w-full">
            Assemble the final sequence
          </p>
        </motion.div>

        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
          className="flex flex-row flex-wrap sm:flex-nowrap justify-center items-center gap-3 sm:gap-4 w-full"
        >
          {clues.map((clue) => (
            <motion.div key={clue.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <ClueHex
                id={clue.id}
                title={clue.title}
                subtitle={clue.subtitle}
                active={activeClue === clue.id}
                solved={!!progress?.[clue.id]}
                onClick={() => handleHexClick(clue.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="w-full sm:h-[240px] flex justify-center items-start mt-4 sm:mt-2">
          <CluePanel
            activeClue={activeClue}
            isSolved={activeClue ? !!progress?.[activeClue] : false}
            answerValue={activeClue ? (answers?.[activeClue] || "") : ""}
            questionText={activeClue ? clues.find(c => c.id === activeClue)?.text : undefined}
            onAnswerChange={(e) => activeClue && handleAnswerChange(e, activeClue)}
            onSubmit={() => activeClue && handleSubmit(activeClue)}
          />
        </div>
      </div>

      <AnimatePresence>
        {isEventComplete && <CompletionScreen />}
      </AnimatePresence>
    </div>
  );
};

export default Phase3UI;
