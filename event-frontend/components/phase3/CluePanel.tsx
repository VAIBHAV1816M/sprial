"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  activeClue: string | null;
  isSolved: boolean;
  answerValue: string;
  questionText?: string; // 👈 Added this so you can pass your real clue text later!
  onAnswerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

export default function CluePanel({
  activeClue, isSolved, answerValue, questionText, onAnswerChange, onSubmit,
}: Props) {
  const [displayedText, setDisplayedText] = useState("");
  
  // Use the provided questionText, or fallback to the default text
  const defaultText = "Rise once above the common ground,\nwhere paths don’t end, just turn around.\nFollow the curve that won’t stay straight,\nthen face what it refuses to state.";
  const fullText = isSolved 
    ? "Data fragment integrated successfully. The master key sequence is stabilizing." 
    : (questionText || defaultText);

  // ── Typewriter Effect Logic ──
  useEffect(() => {
    if (!activeClue) return;
    
    setDisplayedText(""); // Reset text when clue changes
    let i = 0;
    
    const typingInterval = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(typingInterval);
      }
    }, 15); // Sped up slightly for longer clues

    return () => clearInterval(typingInterval);
  }, [activeClue, isSolved, fullText]);

  return (
    <>
      {/* Custom Sleek Scrollbar styling injected directly into this component */}
      <style>{`
        .terminal-scroll::-webkit-scrollbar { width: 4px; }
        .terminal-scroll::-webkit-scrollbar-track { background: rgba(0, 255, 204, 0.05); border-radius: 4px; }
        .terminal-scroll::-webkit-scrollbar-thumb { background: rgba(0, 255, 204, 0.3); border-radius: 4px; }
        .terminal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 204, 0.5); }
      `}</style>

      <AnimatePresence mode="wait">
        {activeClue ? (
          <motion.div
            key={activeClue}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-5 sm:p-8 rounded-2xl bg-[rgba(7,9,13,0.8)] backdrop-blur-md border border-[rgba(0,255,204,0.15)] shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_40px_rgba(0,255,204,0.05)] w-full max-w-full"
            style={{
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isSolved ? "#34d399" : "#00ffcc", display: "inline-block" }} />
              <h3 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", color: isSolved ? "#34d399" : "#00ffcc", textTransform: "uppercase" }}>
                NODE_0{activeClue.replace("clue", "")} // STATUS: {isSolved ? "INTEGRATED" : "AWAITING INPUT"}
              </h3>
            </div>

            {/* ── SCROLLABLE TEXT AREA ── */}
            {/* We lock the height here so massive clues won't break your single-page layout! */}
            <div 
              className="terminal-scroll"
              style={{ 
                maxHeight: "120px",  // Maximum height before it starts scrolling internally
                overflowY: "auto",   // Enables the internal scrollbar
                marginBottom: "32px",
                paddingRight: "10px" // Adds breathing room so text doesn't hit the scrollbar
              }}
            >
              <p style={{ color: "#e8eaf0", fontSize: "0.95rem", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", minHeight: "48px", margin: 0, whiteSpace: "pre-wrap" }}>
                {displayedText}
                {/* Blinking Cursor while typing */}
                {displayedText.length < fullText.length && (
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    style={{ display: "inline-block", width: "8px", height: "15px", background: "#00ffcc", marginLeft: "4px", verticalAlign: "middle" }} 
                  />
                )}
              </p>
            </div>

            {/* Input Area */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch w-full">
              <div className="flex-1 relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono" style={{ color: isSolved ? "#34d399" : "#00ffcc" }}>
                  {">"}
                </span>
                <input
                  type="text"
                  value={answerValue}
                  onChange={onAnswerChange}
                  disabled={isSolved}
                  placeholder={isSolved ? "Sequence locked." : "Enter your answer..."}
                  onKeyDown={(e) => e.key === "Enter" && !isSolved && onSubmit()}
                  className="w-full py-3.5 pr-4 pl-9 rounded-lg font-mono text-[0.9rem] outline-none transition-colors"
                  style={{
                    background: "#0c0f14", border: `1px solid ${isSolved ? "rgba(52,211,153,0.3)" : "rgba(0,255,204,0.2)"}`,
                    color: isSolved ? "#34d399" : "#e8eaf0",
                    caretColor: "#00ffcc",
                    opacity: isSolved ? 0.7 : 1, cursor: isSolved ? "not-allowed" : "text"
                  }}
                />
              </div>
              
              <motion.button
                whileHover={!isSolved ? { scale: 1.02, boxShadow: "0 0 15px rgba(0,255,204,0.2)" } : {}}
                whileTap={!isSolved ? { scale: 0.98 } : {}}
                onClick={onSubmit}
                disabled={isSolved}
                className="py-3.5 sm:py-0 px-8 rounded-lg font-orbitron text-[0.75rem] tracking-widest font-bold uppercase transition-all w-full sm:w-auto"
                style={{
                  background: isSolved ? "rgba(52,211,153,0.1)" : "rgba(0,255,204,0.08)",
                  border: `1px solid ${isSolved ? "rgba(52,211,153,0.4)" : "rgba(0,255,204,0.4)"}`,
                  color: isSolved ? "#34d399" : "#00ffcc",
                  cursor: isSolved ? "default" : "pointer", opacity: isSolved ? 0.6 : 1,
                }}
              >
                {isSolved ? "Locked" : "Submit"}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "40px", color: "rgba(136,146,164,0.5)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            [ Select a data node above to begin ]
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}