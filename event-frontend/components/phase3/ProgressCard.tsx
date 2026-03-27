"use client";

import { motion } from "framer-motion";

type Props = {
  progress: Record<string, boolean>;
};

const ProgressCard = ({ progress }: Props) => {
  const solved = Object.values(progress || {}).filter(Boolean).length;
  const isComplete = solved === 4;

  return (
    <div
      className="fixed top-8 right-8 z-50 flex items-center"
      style={{
        background: "rgba(10, 22, 45, 0.65)",
        border: "1px solid rgba(0, 229, 255, 0.15)",
        // A subtle accent line on the right side that turns green when done
        borderRight: isComplete ? "3px solid #00ff88" : "3px solid #00e5ff",
        borderRadius: "6px", // Much sleeker, smaller shape
        padding: "8px 16px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      }}
    >
      {/* Label & Number */}
      <div className="flex items-baseline gap-3">
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            color: "#4a6d88",
            textTransform: "uppercase",
          }}
        >
          CLUES SOLVED
        </span>
        <span
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "1rem",
            fontWeight: 600,
            color: isComplete ? "#00ff88" : "#00e5ff",
            textShadow: isComplete ? "0 0 10px rgba(0,255,136,0.4)" : "none",
          }}
        >
          {solved}/4
        </span>
      </div>

      {/* Divider */}
      <div 
        style={{ 
          width: "1px", 
          height: "16px", 
          background: "rgba(0, 229, 255, 0.2)",
          margin: "0 14px"
        }} 
      />

      {/* Small Glowing Dot Indicators */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => {
          const isSolved = progress?.[`clue${i}`];
          return (
            <motion.div
              key={i}
              animate={{
                backgroundColor: isSolved ? "#00ff88" : "transparent",
                borderColor: isSolved ? "#00ff88" : "rgba(0, 229, 255, 0.3)",
                boxShadow: isSolved ? "0 0 8px rgba(0,255,136,0.6)" : "none",
              }}
              transition={{ duration: 0.3 }}
              style={{ 
                width: 6, 
                height: 6, 
                borderRadius: "50%", 
                border: "1px solid" 
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProgressCard;