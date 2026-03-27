"use client";

import { motion } from "framer-motion";

const toRad = (d: number) => (d * Math.PI) / 180;

function arcPath(cx: number, cy: number, r: number, w: number, startDeg: number, endDeg: number): string {
  const r1 = r, r2 = r - w;
  const s = toRad(startDeg), e = toRad(endDeg);
  const x1 = cx + r1 * Math.cos(s), y1 = cy + r1 * Math.sin(s);
  const x2 = cx + r1 * Math.cos(e), y2 = cy + r1 * Math.sin(e);
  const x3 = cx + r2 * Math.cos(e), y3 = cy + r2 * Math.sin(e);
  const x4 = cx + r2 * Math.cos(s), y4 = cy + r2 * Math.sin(s);
  const lg = endDeg - startDeg > 180 ? 1 : 0;
  return `M${x1},${y1} A${r1},${r1} 0 ${lg} 1 ${x2},${y2} L${x3},${y3} A${r2},${r2} 0 ${lg} 0 ${x4},${y4} Z`;
}

function midPoint(cx: number, cy: number, r: number, s: number, e: number) {
  const a = toRad((s + e) / 2);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

// SCALED UP DIMENSIONS
const CX = 140, CY = 140;
const OR = 130, OW = 45;
const IR = 75, IW = 26;

const SEGMENTS = [
  { id: "c44", label: "C44", ms: [-80, -10] as [number,number], subId: "c4",  ss: [-74, -16] as [number,number] },
  { id: "c11", label: "C11", ms: [10,   80] as [number,number], subId: "c1",  ss: [16,   74] as [number,number] },
  { id: "c22", label: "C22", ms: [100, 170] as [number,number], subId: "c2",  ss: [106, 164] as [number,number] },
  { id: "c33", label: "C33", ms: [190, 260] as [number,number], subId: "c3",  ss: [196, 254] as [number,number] },
];

interface Props {
  progress:     Record<string, boolean>;
  activeMain:   string | null;
  activeSub:    string | null;
  onSelectMain: (id: string, idx: number) => void;
  onSelectSub:  (id: string, idx: number) => void;
}

export default function DonutRadial({ progress, activeMain, activeSub, onSelectMain, onSelectSub }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{ position: "relative", width: 500, height: 500, flexShrink: 0 }}
    >
      <svg viewBox="-20 -20 320 320" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#0d2218" />
            <stop offset="100%" stopColor="#040d08" />
          </radialGradient>
        </defs>

        {/* Ambient outer rings */}
        <circle cx={CX} cy={CY} r={OR + 20} fill="none" stroke="rgba(0,255,204,0.04)" strokeWidth={1.5} />
        <circle cx={CX} cy={CY} r={OR + 32} fill="none" stroke="rgba(0,255,204,0.02)" strokeWidth={1} />

        {/* Base tracks */}
        <circle cx={CX} cy={CY} r={OR} fill="none" stroke="rgba(0,255,204,0.05)" strokeWidth={OW} />
        <circle cx={CX} cy={CY} r={IR} fill="none" stroke="rgba(167,139,250,0.04)" strokeWidth={IW} />

        {/* MAIN SEGMENTS */}
        {SEGMENTS.map(({ id, label, ms }, i) => {
          const d        = arcPath(CX, CY, OR, OW, ms[0], ms[1]);
          const lp       = midPoint(CX, CY, OR - OW / 2, ms[0], ms[1]);
          const isSolved = !!progress?.[id];
          const isActive = activeMain === id;

          return (
            <motion.g
              key={id}
              style={{ cursor: "pointer" }}
              onClick={() => onSelectMain(id, i)}
              animate={{
                opacity: isActive ? 1 : isSolved ? 0.88 : 0.65,
                filter: isActive
                  ? "drop-shadow(0 0 18px rgba(0,255,204,0.75))"
                  : isSolved
                  ? "drop-shadow(0 0 10px rgba(52,211,153,0.45))"
                  : "none",
              }}
              whileHover={{ opacity: 1, filter: "drop-shadow(0 0 12px rgba(0,255,204,0.55))" }}
              transition={{ duration: 0.25 }}
            >
              <path
                d={d}
                fill={isSolved ? "rgba(52,211,153,0.25)" : isActive ? "rgba(0,255,204,0.28)" : "rgba(0,255,204,0.16)"}
                stroke={isSolved ? "#34d399" : "#00ffcc"}
                strokeWidth={isActive ? 1.5 : 0.6}
              />
              <text
                x={lp.x} y={lp.y + 5}
                textAnchor="middle"
                fontSize={isSolved ? 14 : 11}
                fill={isSolved ? "#34d399" : "#00ffcc"}
                fontFamily="Syne, sans-serif"
                fontWeight={700}
              >
                {isSolved ? "✓" : label}
              </text>
            </motion.g>
          );
        })}

        {/* SUB SEGMENTS */}
        {SEGMENTS.map(({ id, subId, ss }, i) => {
          const d        = arcPath(CX, CY, IR, IW, ss[0], ss[1]);
          const lp       = midPoint(CX, CY, IR - IW / 2, ss[0], ss[1]);
          const unlocked = !!progress?.[id];
          const isSolved = !!progress?.[subId];
          const isActive = activeSub === subId;

          return (
            <motion.g
              key={subId}
              // FIX: Removed pointerEvents bug. Now relying solely on React JS logic.
              style={{ cursor: unlocked ? "pointer" : "default" }}
              onClick={() => {
                // Ignore clicks if the segment isn't unlocked yet
                if (unlocked) {
                  onSelectSub(subId, i);
                }
              }}
              animate={{
                opacity: isSolved ? 0.9 : isActive ? 1 : unlocked ? 0.72 : 0.18,
                filter: isActive
                  ? "drop-shadow(0 0 14px rgba(167,139,250,0.65))"
                  : isSolved
                  ? "drop-shadow(0 0 8px rgba(167,139,250,0.35))"
                  : "none",
              }}
              whileHover={unlocked ? { opacity: 1, filter: "drop-shadow(0 0 10px rgba(167,139,250,0.5))" } : {}}
              transition={{ duration: 0.3 }}
            >
              <path
                d={d}
                fill={isSolved ? "rgba(167,139,250,0.3)" : isActive ? "rgba(167,139,250,0.28)" : "rgba(167,139,250,0.18)"}
                stroke="#a78bfa"
                strokeWidth={isActive ? 1.2 : 0.5}
              />
              <text
                x={lp.x} y={lp.y + 3}
                textAnchor="middle"
                fontSize={8}
                fill="#a78bfa"
                fontFamily="Syne, sans-serif"
                fontWeight={700}
              >
                {isSolved ? "✓" : subId.toUpperCase()}
              </text>
            </motion.g>
          );
        })}

        {/* HUB */}
        <circle cx={CX} cy={CY} r={44} fill="url(#hubGrad)" stroke="rgba(0,255,204,0.3)" strokeWidth={1.5} />
        <circle cx={CX} cy={CY} r={36} fill="none" stroke="rgba(0,255,204,0.08)" strokeWidth={1} strokeDasharray="4 6" />
        <text x={CX} y={CY - 6} textAnchor="middle" fontFamily="Syne, sans-serif" fontWeight={800} fontSize={11} fill="#00ffcc">PHASE</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontFamily="Syne, sans-serif" fontWeight={800} fontSize={11} fill="#00ffcc">TWO</text>
      </svg>
    </motion.div>
  );
}