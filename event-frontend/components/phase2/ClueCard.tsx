"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  isSub?: boolean;
  clueId: string;
  stageNum: number;
  question: string;
  answer: string;
  isSolved: boolean;
  onChange: (e: any, clueId: string) => void;
  onSubmit: (clueId: string) => void;
  onClose: () => void;
}

export default function ClueCard({
  isOpen, isSub = false, clueId, stageNum,
  question, answer, isSolved, onChange, onSubmit, onClose,
}: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const accent = isSub ? "#a78bfa" : "#00ffcc";
  const accentA = isSub ? "rgba(167,139,250," : "rgba(0,255,204,";
  const bg = isSub ? "#070610" : "#07090d";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={clueId + (isSub ? "-sub" : "-main")}
            initial={isMobile ? { opacity: 0 } : { width: 0, opacity: 0 }}
            animate={isMobile ? { opacity: 1 } : { width: isSub ? 320 : 350, opacity: 1 }}
            exit={isMobile ? { opacity: 0 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
            style={isMobile ? {
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)"
            } : { overflow: "hidden", flexShrink: 0 }}
            onClick={isMobile ? onClose : undefined}
          >
            <motion.div
              initial={isMobile ? { y: 20, scale: 0.95, opacity: 0 } : { x: 24, opacity: 0 }}
              animate={isMobile ? { y: 0, scale: 1, opacity: 1 } : { x: 0, opacity: 1 }}
              exit={isMobile ? { y: 20, scale: 0.95, opacity: 0 } : { x: 24, opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: isMobile ? "90%" : (isSub ? 300 : 330),
                maxWidth: 400,
                minHeight: isMobile ? "auto" : 420,
                maxHeight: isMobile ? "90vh" : "none",
                overflowY: isMobile ? "auto" : "visible",
                background: bg,
                border: `1px solid ${accentA}0.12)`,
                borderRadius: 16,
                padding: isMobile ? "24px 20px" : "32px 28px",
                marginLeft: isMobile ? 0 : (isSub ? 16 : 24),
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
                {question.startsWith("IMAGES:") ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {question.replace("IMAGES:", "").split(",").map((src, i) => (
                      <img
                        key={i}
                        src={src.trim()}
                        alt={`Clue ${i + 1}`}
                        onClick={() => setShowPopup(true)}
                        style={{ width: "100%", borderRadius: 0, cursor: "pointer", border: `1px solid ${accentA}0.2)` }}
                      />
                    ))}
                  </div>
                ) : question.startsWith("IMAGE_DL:") ? (
                  <img
                    src={question.replace("IMAGE_DL:", "").split("|")[0]}
                    alt="Clue"
                    onClick={() => setShowPopup(true)}
                    style={{ width: "100%", borderRadius: 0, cursor: "pointer", border: `1px solid ${accentA}0.2)` }}
                  />
                ) : question.startsWith("TEXT_IMAGE:") ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontSize: "0.95rem", color: "#e8eaf0", lineHeight: 1.65 }}>
                      {question.replace("TEXT_IMAGE:", "").split("|")[0]}
                    </p>
                    <img
                      src={question.replace("TEXT_IMAGE:", "").split("|")[1]}
                      alt="Clue"
                      onClick={() => setShowPopup(true)}
                      style={{ width: "100%", borderRadius: 0, cursor: "pointer", border: `1px solid ${accentA}0.2)` }}
                    />
                  </div>
                ) : question.startsWith("IMAGE:") ? (
                  <img
                    src={question.replace("IMAGE:", "")}
                    alt="Clue"
                    onClick={() => setShowPopup(true)}
                    style={{ width: "100%", borderRadius: 0, cursor: "pointer", border: `1px solid ${accentA}0.2)` }}
                  />
                ) : (
                  <p
                    onClick={() => setShowPopup(true)}
                    style={{ fontSize: "0.95rem", color: "#e8eaf0", lineHeight: 1.65, cursor: "pointer", textDecoration: "underline", textDecorationColor: `${accentA}0.4)` }}>
                    {question}
                  </p>
                )}
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
                  onBlur={(e) => (e.target.style.borderColor = `${accentA}0.18)`)}
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

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setShowPopup(false)}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.7)",
              zIndex: 9999,
              backdropFilter: "blur(5px)",
              padding: 24,
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: bg,
                border: `1px solid ${accentA}0.3)`,
                borderRadius: 16,
                padding: 40,
                maxWidth: 600,
                width: "100%",
                boxShadow: `0 0 40px ${accentA}0.2)`,
                display: "flex",
                flexDirection: "column",
                gap: 20
              }}
            >
              <h3 style={{
                fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", color: accent, margin: 0
              }}>
                {clueId.toUpperCase()} Clue
              </h3>
              {question.startsWith("IMAGES:") ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", maxHeight: "60vh" }}>
                  {question.replace("IMAGES:", "").split(",").map((src, i) => (
                    <img
                      key={i}
                      src={src.trim()}
                      alt={`Clue ${i + 1}`}
                      style={{ width: "100%", objectFit: "contain", borderRadius: 0 }}
                    />
                  ))}
                </div>
              ) : question.startsWith("IMAGE_DL:") ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <img
                    src={question.replace("IMAGE_DL:", "").split("|")[0]}
                    alt="Clue"
                    style={{ width: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: 0 }}
                  />
                  <a
                    href={question.replace("IMAGE_DL:", "").split("|")[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "10px 24px",
                      borderRadius: 8,
                      background: accent,
                      color: bg,
                      textDecoration: "none",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: "bold",
                      textAlign: "center",
                      alignSelf: "center",
                      marginTop: 10
                    }}
                  >
                    Download
                  </a>
                </div>
              ) : question.startsWith("TEXT_IMAGE:") ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <p style={{ fontSize: "1.2rem", color: "#e8eaf0", lineHeight: 1.6, margin: 0 }}>
                    {question.replace("TEXT_IMAGE:", "").split("|")[0]}
                  </p>
                  <img
                    src={question.replace("TEXT_IMAGE:", "").split("|")[1]}
                    alt="Clue"
                    style={{ width: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: 0 }}
                  />
                </div>
              ) : question.startsWith("IMAGE:") ? (
                <img
                  src={question.replace("IMAGE:", "")}
                  alt="Clue"
                  style={{ width: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: 0 }}
                />
              ) : (
                <p style={{ fontSize: "1.2rem", color: "#e8eaf0", lineHeight: 1.6, margin: 0 }}>
                  {question}
                </p>
              )}
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  marginTop: 20,
                  padding: "10px 24px",
                  borderRadius: 8,
                  background: `${accentA}0.1)`,
                  border: `1px solid ${accent}`,
                  color: accent,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  alignSelf: "flex-end"
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}