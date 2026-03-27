"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DonutRadial from "./DonutRadial";
import ClueCard    from "./ClueCard";
import ParticleBackground from "./ParticleBackground"; 

// ── Define Clues & Mappings ──
const QUESTIONS: Record<string, string> = {
  c11: "c11 question here",
  c22: "c22 question here",
  c33: "c33 question here",
  c44: "c44 question here",
  c1:  "c1 question here",
  c2:  "c2 question here",
  c3:  "c3 question here",
  c4:  "c4 question here",
};

const MAIN_IDS = ["c44", "c11", "c22", "c33"];
const SUB_MAP:  Record<string, string> = { c44: "c4", c11: "c1", c22: "c2", c33: "c3" };

interface Props {
  message:        string;
  progress:       any;
  answers:        any;
  handleAnswerChange: (e: any, clueId: string) => void;
  handleSubmit:   (clueId: string) => void;
}

export default function Phase2Dashboard({
  message, progress, answers, handleAnswerChange, handleSubmit,
}: Props) {

  const safeProgress = { ...(progress || {}) };

  const [activeMain,    setActiveMain]    = useState<string | null>(null);
  const [activeSub,     setActiveSub]     = useState<string | null>(null);
  const [activeMainIdx, setActiveMainIdx] = useState(0);
  const [activeSubIdx,  setActiveSubIdx]  = useState(0);

  const handleSelectMain = (id: string, idx: number) => {
    if (activeMain === id) { setActiveMain(null); setActiveSub(null); return; }
    setActiveMain(id);
    setActiveMainIdx(idx);
    setActiveSub(null); 
  };

  const handleSelectSub = (id: string, idx: number) => {
    if (activeSub === id) { setActiveSub(null); return; }
    setActiveSub(id);
    setActiveSubIdx(idx);
    setActiveMain(null); 
  };

  const solvedMain = MAIN_IDS.filter((id) => safeProgress[id]).length;
  const solvedSub  = Object.values(SUB_MAP).filter((id) => safeProgress[id]).length;

  const isError = message.toLowerCase().includes("wrong") || 
                  message.toLowerCase().includes("failed") || 
                  message.toLowerCase().includes("error") || 
                  message.toLowerCase().includes("incorrect");

  return (
    <div
      className="bg-[#050709] text-[#e8eaf0] font-dm selection:bg-neon-teal/30"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ── Interactive Constellation Background ── */}
      <ParticleBackground />

      {/* ── Top bar (elevated z-index) ── */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 32px",
          background: "rgba(5,7,9,0.82)", 
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(0,255,204,0.1)",
          position: "sticky", top: 0, zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#00ffcc", fontSize: "0.9rem", letterSpacing: "0.1em" }}>
            PHASE 2
          </span>
          <span style={{
            fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "3px 10px", borderRadius: 20,
            background: "rgba(0,255,204,0.06)", border: "1px solid rgba(0,255,204,0.15)",
            color: "rgba(0,255,204,0.5)",
          }}>
            Active
          </span>
        </div>

        <div style={{ display: "flex", gap: 28 }}>
          {[
            { label: "Main Clues", val: `${solvedMain} / 4`, color: "#00ffcc" },
            { label: "Sub Clues",  val: `${solvedSub} / 4`,  color: "#a78bfa" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8892a4" }}>{label}</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color, fontSize: "0.85rem" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating HUD Message Pill ── */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -30, x: "-50%" }}
            style={{
              position: "fixed",
              top: "85px",
              left: "50%",
              zIndex: 100,
              padding: "10px 24px",
              borderRadius: "30px",
              background: isError ? "rgba(255, 68, 102, 0.1)" : "rgba(0, 255, 136, 0.1)",
              border: `1px solid ${isError ? "rgba(255, 68, 102, 0.3)" : "rgba(0, 255, 136, 0.3)"}`,
              boxShadow: `0 0 20px ${isError ? "rgba(255, 68, 102, 0.15)" : "rgba(0, 255, 136, 0.15)"}`,
              color: isError ? "#ff4466" : "#00ff88",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backdropFilter: "blur(10px)"
            }}
          >
            <span style={{ fontSize: "1rem" }}>{isError ? "⚠" : "✓"}</span>
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Layout Wrapper ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 10 }}>
        
        {/* ── Hero Text Section (Matched to Phase 1) ── */}
        <div className="w-full max-w-[1100px] mx-auto pt-10 pb-4 px-8 z-10">
          <div className="flex items-center gap-2 text-[0.68rem] text-[#8892a4] tracking-[0.14em] uppercase mb-4">
            <span className="w-1.5 h-1.5 bg-[#00ffcc] rounded-full shadow-[0_0_8px_#00ffcc] animate-pulse" />
            Phase 2 — Infiltrate
          </div>
          <h1 className="font-syne font-extrabold text-[clamp(1.8rem,3.5vw,3rem)] leading-[1.12] bg-gradient-to-br from-[#e8eaf0] via-[#e8eaf0] to-[#00ffcc] bg-clip-text text-transparent max-w-[800px]">
            Navigate the outer sectors to unlock the core.
          </h1>
        </div>

        {/* ── Main content (Radar & Cards) ── */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px 32px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>

            {/* Donut */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8892a4" }}
              >
                Select a segment to view its clue
              </motion.p>

              <DonutRadial
                progress={safeProgress}
                activeMain={activeMain}
                activeSub={activeSub}
                onSelectMain={handleSelectMain}
                onSelectSub={handleSelectSub}
              />

              {/* Progress dots */}
              <div style={{ display: "flex", gap: 10 }}>
                {MAIN_IDS.map((id) => (
                  <motion.div
                    key={id}
                    animate={{
                      background: safeProgress[id] ? "#00ffcc" : "rgba(0,255,204,0.1)",
                      boxShadow:  safeProgress[id] ? "0 0 10px rgba(0,255,204,0.5)" : "none",
                    }}
                    transition={{ duration: 0.4 }}
                    style={{ width: 10, height: 10, borderRadius: "50%", border: "1px solid rgba(0,255,204,0.2)" }}
                  />
                ))}
              </div>
            </div>

            {/* Main clue card */}
            <ClueCard
              isOpen={!!activeMain}
              isSub={false}
              clueId={activeMain ?? ""}
              stageNum={activeMainIdx + 1}
              question={QUESTIONS[activeMain ?? ""] ?? ""}
              answer={answers?.[activeMain ?? ""] ?? ""}
              isSolved={!!safeProgress[activeMain ?? ""]}
              onChange={handleAnswerChange}
              onSubmit={handleSubmit}
              onClose={() => { setActiveMain(null); setActiveSub(null); }}
            />

            {/* Sub clue card */}
            <ClueCard
              isOpen={!!activeSub}
              isSub={true}
              clueId={activeSub ?? ""}
              stageNum={activeSubIdx + 1}
              question={QUESTIONS[activeSub ?? ""] ?? ""}
              answer={answers?.[activeSub ?? ""] ?? ""}
              isSolved={!!safeProgress[activeSub ?? ""]}
              onChange={handleAnswerChange}
              onSubmit={handleSubmit}
              onClose={() => setActiveSub(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}