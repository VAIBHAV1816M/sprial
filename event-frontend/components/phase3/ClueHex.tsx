"use client";

import { motion } from "framer-motion";

type Props = {
  id: string;
  title: string;
  subtitle: string;
  active: boolean;
  solved: boolean;
  onClick: () => void;
};

export default function ClueHex({ id, title, subtitle, active, solved, onClick }: Props) {
  // Determine styles based on state
  const isSelected = active && !solved;
  
  const borderColor = solved ? "rgba(52,211,153,0.8)" : isSelected ? "rgba(0,255,204,0.9)" : "rgba(0,255,204,0.25)";
  const bgColor = solved ? "rgba(52,211,153,0.15)" : isSelected ? "rgba(0,255,204,0.15)" : "rgba(7,9,13,0.6)";
  const textColor = solved ? "#34d399" : isSelected ? "#00ffcc" : "#e8eaf0";
  const glow = solved ? "0 0 20px rgba(52,211,153,0.3)" : isSelected ? "0 0 25px rgba(0,255,204,0.4)" : "none";

  return (
    <motion.div
      whileHover={!solved ? { scale: 1.05, filter: "drop-shadow(0 0 15px rgba(0,255,204,0.3))" } : {}}
      whileTap={!solved ? { scale: 0.95 } : {}}
      onClick={onClick}
      style={{
        width: "140px",
        height: "160px",
        cursor: "pointer",
        position: "relative",
        filter: `drop-shadow(${glow})`, // The subtle glow effect
      }}
    >
      {/* The Hexagon Shape */}
      <div
        style={{
          width: "100%", height: "100%",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: bgColor,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
          border: `2px solid ${borderColor}`,
          transition: "all 0.3s ease",
        }}
      >
        {/* Inner glow line effect */}
        <div 
          style={{
            position: "absolute", inset: "2px",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            border: `1px solid ${borderColor}`, opacity: 0.3, pointerEvents: "none"
          }}
        />

        <div style={{ zIndex: 10, textAlign: "center", display: "flex", flexDirection: "column", gap: "6px" }}>
          {solved ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth={2.5} className="w-8 h-8 mx-auto mb-1">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: textColor, margin: 0 }}>
              {title}
            </h3>
          )}
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: solved ? "#34d399" : "#8892a4" }}>
            {solved ? "Integrated" : subtitle}
          </span>
        </div>
      </div>
    </motion.div>
  );
}