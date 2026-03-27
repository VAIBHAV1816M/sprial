"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen:    boolean;
  isSub?:    boolean;
  clueId:    string;
  stageNum:  number;
  question:  string;
  answer:    string;
  isSolved:  boolean;
  onChange:  (e: any, clueId: string) => void;
  onSubmit:  (clueId: string) => void;
  onClose:   () => void;
}

export default function ClueCard({
  isOpen, isSub = false, clueId, stageNum,
  question, answer, isSolved, onChange, onSubmit, onClose,
}: Props) {
  const accent  = isSub ? "#a78bfa" : "#00ffcc";
  const accentA = isSub ? "rgba(167,139,250," : "rgba(0,255,204,";
  const bg      = isSub ? "#070610"           : "#07090d";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={clueId + (isSub ? "-sub" : "-main")}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: isSub ? 320 : 350, opacity: 1 }} // Increased outer widths
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
          style={{ overflow: "hidden", flexShrink: 0 }}
        >
          <motion.div
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: isSub ? 300 : 330, // Increased inner widths
              minHeight: 420, // Increased height
              background: bg,
              border: `1px solid ${accentA}0.12)`,
              borderRadius: 16,
              padding: "32px 28px", // Increased padding
              marginLeft: isSub ? 16 : 24,
              display: "flex",
              flexDirection: "column",
              gap: 22,
              position: "relative",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: 16, right: 16,
                width: 28, height: 28, borderRadius: "50%",
                border: `1px solid ${accentA}0.2)`,
                background: "transparent", color: accent,
                cursor: "pointer", fontSize: "0.8rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              ✕
            </button>

            {/* Tag */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase",
              color: `${accentA}0.6)`,
              border: `1px solid ${accentA}0.18)`,
              borderRadius: 20, padding: "5px 14px", width: "fit-content",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0, display: "inline-block" }} />
              {isSub ? "Sub Clue" : "Main Clue"}
            </div>

            {/* Title */}
            <div style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: isSub ? "1.4rem" : "1.6rem", // Larger title
              color: "#e8eaf0", lineHeight: 1.1,
            }}>
              {clueId.toUpperCase()} — Stage {stageNum}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: `linear-gradient(90deg, ${accentA}0.18), transparent)` }} />

            {/* Question */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8892a4" }}>
                Clue
              </span>
              <p style={{ fontSize: "0.95rem", color: "#e8eaf0", lineHeight: 1.65 }}>
                {question}
              </p>
            </div>

            {/* Input + Button */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: "auto" }}>
              <input
                value={answer}
                onChange={(e) => onChange(e, clueId)}
                disabled={isSolved}
                placeholder="Enter your answer…"
                style={{
                  width: "100%", borderRadius: 8,
                  padding: "12px 16px",
                  background: isSub ? "#09090f" : "#0c0f14",
                  border: `1px solid ${accentA}0.18)`,
                  color: "#e8eaf0",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.85rem",
                  outline: "none",
                  caretColor: accent,
                  opacity: isSolved ? 0.4 : 1,
                  cursor: isSolved ? "not-allowed" : "text",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = `${accentA}0.45)`)}
                onBlur={(e)  => (e.target.style.borderColor = `${accentA}0.18)`)}
              />

              <motion.button
                whileHover={!isSolved ? { scale: 1.02 } : {}}
                whileTap={!isSolved ? { scale: 0.97 } : {}}
                onClick={() => !isSolved && onSubmit(clueId)}
                disabled={isSolved}
                style={{
                  width: "100%", padding: "12px",
                  borderRadius: 8,
                  background: isSolved ? `${accentA}0.07)` : `${accentA}0.08)`,
                  border: `1px solid ${accentA}${isSolved ? "0.18" : "0.28"})`,
                  color: isSolved ? (isSub ? "rgba(167,139,250,0.45)" : "#34d399") : accent,
                  fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: isSolved ? "default" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                {isSolved ? "Solved ✓" : "Submit Answer"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}