"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DonutRadial from "./DonutRadial";
import ClueCard    from "./ClueCard";

// Replace these with your real clue questions
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

// Must match order in DonutRadial SEGMENTS array
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
  };

  const solvedMain = MAIN_IDS.filter((id) => progress?.[id]).length;
  const solvedSub  = Object.values(SUB_MAP).filter((id) => progress?.[id]).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 40% 50%, #06110d 0%, #050709 65%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 32px",
          background: "rgba(5,7,9,0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(0,255,204,0.07)",
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

      {/* ── Message banner ── */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              margin: "16px 32px 0",
              padding: "12px 20px",
              borderRadius: 12,
              background: "rgba(0,255,204,0.06)",
              border: "1px solid rgba(0,255,204,0.18)",
              color: "#00ffcc",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.78rem",
              textAlign: "center",
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>

          {/* Donut */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8892a4" }}
            >
              Select a segment to view its clue
            </motion.p>

            <DonutRadial
              progress={progress}
              activeMain={activeMain}
              activeSub={activeSub}
              onSelectMain={handleSelectMain}
              onSelectSub={handleSelectSub}
            />

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 8 }}>
              {MAIN_IDS.map((id) => (
                <motion.div
                  key={id}
                  animate={{
                    background: progress?.[id] ? "#00ffcc" : "rgba(0,255,204,0.1)",
                    boxShadow:  progress?.[id] ? "0 0 8px rgba(0,255,204,0.5)" : "none",
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ width: 8, height: 8, borderRadius: "50%", border: "1px solid rgba(0,255,204,0.2)" }}
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
            isSolved={!!progress?.[activeMain ?? ""]}
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
            isSolved={!!progress?.[activeSub ?? ""]}
            onChange={handleAnswerChange}
            onSubmit={handleSubmit}
            onClose={() => setActiveSub(null)}
          />
        </div>
      </div>
    </div>
  );
}