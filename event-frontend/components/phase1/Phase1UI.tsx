"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClueCard from "./ClueCard";

// ─── Types ────────────────────────────────────────────────────────────────────
type Clue = {
  id: string;
  question: string;
  imageUrl?: string;
};

type Props = {
  clues: Clue[];
  solved: Record<string, boolean>;
  answers: Record<string, string>;
  wrongSignal: Record<string, number>;
  onAnswerChange: (clueId: string, value: string) => void;
  onSubmit: (clueId: string) => void;
  message: string;
};

interface Orb {
  x: number; y: number;
  vx: number; vy: number;
  r: number; base: number; alpha: number;
}

// ─── Background shape config ──────────────────────────────────────────────────
const SHAPES = [
  { left: "48%", top: 80, size: 260, teal: true, spd: 20, dir: 1, op: 1.00 },
  { left: "72%", top: 260, size: 160, teal: false, spd: 28, dir: -1, op: 0.55 },
  { left: "8%", top: 300, size: 200, teal: true, spd: 25, dir: 1, op: 0.35 },
  { left: "82%", top: 600, size: 130, teal: true, spd: 32, dir: -1, op: 0.40 },
  { left: "15%", top: 700, size: 180, teal: false, spd: 22, dir: 1, op: 0.30 },
  { left: "55%", top: 900, size: 220, teal: true, spd: 18, dir: -1, op: 0.45 },
  { left: "30%", top: 1100, size: 150, teal: false, spd: 35, dir: 1, op: 0.30 },
  { left: "75%", top: 1200, size: 200, teal: true, spd: 24, dir: -1, op: 0.38 },
  { left: "5%", top: 1300, size: 140, teal: true, spd: 30, dir: 1, op: 0.28 },
  { left: "60%", top: 1500, size: 170, teal: false, spd: 26, dir: -1, op: 0.35 },
];

function RotatingShape({ teal = true }: { teal?: boolean }) {
  const accent = teal ? "#00ffcc" : "#a78bfa";
  return (
    <div className="absolute inset-0">
      <div 
        className="absolute inset-[18%] rounded-md border" 
        style={{ background: `${accent}10`, borderColor: `${accent}26` }} 
      />
      {["tl", "tr", "bl", "br"].map((p) => (
        <div
          key={p}
          className={`absolute w-[28%] h-[28%] rounded border 
            ${p === "tl" ? "top-0 left-0" : p === "tr" ? "top-0 right-0" : p === "bl" ? "bottom-0 left-0" : "bottom-0 right-0"}`}
          style={{ background: `${accent}0d`, borderColor: `${accent}1f` }}
        />
      ))}
      <div className="absolute inset-[35%] bg-[#050709] rounded-sm z-10" />
    </div>
  );
}

export default function Phase1UI({
  clues, solved, answers, wrongSignal, onAnswerChange, onSubmit, message,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const orbsRef = useRef<Orb[]>([]);
  const rafRef = useRef<number>(0);
  const [showNote, setShowNote] = useState(false);

  useEffect(() => {
    orbsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * 1600, y: Math.random() * 1200,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.4, base: Math.random(), alpha: Math.random() * 0.45 + 0.15,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      for (let c = 0; c <= 20; c++) {
        const x = (c / 20) * W;
        const d = Math.abs((mouseRef.current.x / W) - c / 20);
        ctx.strokeStyle = `rgba(0,255,204,${Math.max(0.015, 0.055 - d * 0.1)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      orbsRef.current.forEach((o) => {
        const dx = mouseRef.current.x - o.x; const dy = mouseRef.current.y - o.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const pull = Math.max(0, 1 - dist / 260);
        o.vx += (dx / dist) * pull * 0.04; o.vy += (dy / dist) * pull * 0.04;
        o.vx *= 0.96; o.vy *= 0.96; o.x += o.vx; o.y += o.vy;
        if (o.x < -10) o.x = W + 10; if (o.x > W + 10) o.x = -10;
        if (o.y < -10) o.y = H + 10; if (o.y > H + 10) o.y = -10;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r + pull * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = o.base < 0.6 ? `rgba(0,255,204,${o.alpha + pull * 0.5})` : `rgba(167,139,250,${o.alpha + pull * 0.5})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (shapeRef.current) {
        const rx = (e.clientX / window.innerWidth - 0.5) * 22;
        const ry = (e.clientY / window.innerHeight - 0.5) * 15;
        shapeRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const rows: Array<[Clue, Clue | null]> = [];
  for (let i = 0; i < clues.length; i += 2) { rows.push([clues[i], clues[i + 1] ?? null]); }
  const solvedCount = Object.values(solved).filter(Boolean).length;

  const isError = message.toLowerCase().includes("wrong") || 
                  message.toLowerCase().includes("failed") || 
                  message.toLowerCase().includes("error") || 
                  message.toLowerCase().includes("incorrect");

  return (
    <div className="relative min-h-screen bg-[#050709] text-[#e8eaf0] font-dm selection:bg-neon-teal/30 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none block" />

      {/* Ambient Glow Blobs */}
      <div className="fixed top-[-150px] left-[-150px] w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(0,255,204,0.07)_0%,transparent_70%)]" />
      <div className="fixed top-[25%] right-[-120px] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(167,139,250,0.06)_0%,transparent_70%)]" />
      <div className="fixed bottom-[15%] left-[10%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(0,255,204,0.05)_0%,transparent_70%)]" />
      <div className="fixed bottom-[30%] right-[5%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(167,139,250,0.05)_0%,transparent_70%)]" />

      {/* Rotating Background Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {SHAPES.map((s, i) => (
          <div
            key={i}
            ref={i === 0 ? shapeRef : undefined}
            className="absolute -translate-x-1/2 transition-transform duration-75 ease-out"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, opacity: s.op }}
          >
            <motion.div
              className="w-full h-full"
              animate={{ rotate: s.dir === 1 ? 360 : -360 }}
              transition={{ repeat: Infinity, duration: s.spd, ease: "linear" }}
            >
              <RotatingShape teal={s.teal} />
            </motion.div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="fixed top-0 inset-x-0 z-[100] flex items-center gap-2.5 px-10 py-[18px] bg-[#050709]/82 backdrop-blur-[14px] border-b border-[#00ffcc]/10">
          <span className="font-syne font-extrabold text-[1rem]">Phase 1</span>
          <span className="text-[#8892a4] text-[0.8rem]">/</span>
          <span className="text-[0.88rem] text-[#8892a4]">Clues & Answers</span>
          <span className="ml-2 text-[0.75rem] text-[#8892a4]">{solvedCount}/{clues.length} solved</span>
          <span className="ml-auto text-[#00ffcc] text-[0.7rem] tracking-[0.12em] uppercase">● Live</span>
        </nav>

        {/* ── Floating Glowing Mission Button ── */}
        <div className="fixed top-[85px] right-10 z-[100]">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,255,204,0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNote(!showNote)}
            className="px-6 py-2 rounded-lg text-[0.7rem] font-bold tracking-[0.15em] uppercase transition-all border"
            style={{
              background: "rgba(0,255,204,0.05)",
              borderColor: "rgba(0,255,204,0.3)",
              color: "#00ffcc",
              boxShadow: "0 0 15px rgba(0,255,204,0.1)",
              backdropFilter: "blur(8px)"
            }}
          >
            {showNote ? "Close Terminal" : "Mission Note"}
          </motion.button>
        </div>

        {/* ── Mission Note Section ── */}
        <AnimatePresence>
          {showNote && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed top-[135px] right-10 z-[90] w-[320px] p-6 rounded-xl border border-[#00ffcc]/20 backdrop-blur-xl bg-[#07090d]/90"
              style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,255,204,0.05)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#00ffcc] rounded-full animate-pulse shadow-[0_0_8px_#00ffcc]" />
                <span className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#00ffcc]">System Briefing</span>
              </div>
              <p className="text-[0.8rem] leading-relaxed text-[#8892a4] font-mono">
                Note down all the clues carefully. These fragments are required to be <span className="text-[#e8eaf0] font-bold">encrypted</span>. 
                <br /><br />
                User objective: Construct a specific <span className="text-[#00ffcc] underline decoration-[#00ffcc]/30 underline-offset-4">page name</span> from the decoded fragments to bypass next security layer.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Hero */}
        <header className="pt-[140px] px-10 pb-20 max-w-[900px] mx-auto">
          <div className="flex items-center gap-2 text-[0.68rem] text-[#8892a4] tracking-[0.14em] uppercase mb-6">
            <span className="inline-block w-1.5 h-1.5 bg-[#00ffcc] rounded-full shadow-[0_0_8px_#00ffcc] animate-pulse" />
            Phase 1 — Reveal
          </div>
          <h1 className="font-syne font-extrabold text-[clamp(2.2rem,5vw,4rem)] leading-[1.12] bg-gradient-to-br from-[#e8eaf0] via-[#e8eaf0] to-[#00ffcc] bg-clip-text text-transparent">
            Uncover the clues one by one.
          </h1>
        </header>

        {/* Staggered Card Grid */}
        <div className="max-w-[1280px] mx-auto px-15 pb-[220px]">
          {rows.map(([left, right], idx) => {
            const isOddRow = idx % 2 === 0;
            if (!right) return (
              <div key={left.id} className="flex justify-center mb-20 pt-10">
                <ClueCard 
                   clue={left} solved={!!solved?.[left.id]} 
                   answer={answers?.[left.id] ?? ""} 
                   wrongSignal={wrongSignal?.[left.id] ?? 0}
                   onAnswerChange={(v) => onAnswerChange(left.id, v)} 
                   onSubmit={() => onSubmit(left.id)}
                   isActive={!solved?.[left.id]}
                />
              </div>
            );
            return (
              <div key={left.id} className="grid grid-cols-1 md:grid-cols-[1fr_100px_1fr] mb-[100px] items-start">
                <div className={`flex justify-center md:justify-end md:pr-7 ${isOddRow ? "md:pb-[100px]" : ""}`}>
                  <ClueCard 
                    clue={left} solved={!!solved?.[left.id]} 
                    answer={answers?.[left.id] ?? ""} 
                    wrongSignal={wrongSignal?.[left.id] ?? 0}
                    onAnswerChange={(v) => onAnswerChange(left.id, v)} 
                    onSubmit={() => onSubmit(left.id)} delay={0}
                    isActive={!solved?.[left.id]}
                  />
                </div>
                <div className="hidden md:block" />
                <div className={`flex justify-center md:justify-start md:pl-7 ${isOddRow ? "md:pt-[140px]" : "md:pt-[140px]"}`}>
                  <ClueCard 
                    clue={right} solved={!!solved?.[right.id]} 
                    answer={answers?.[right.id] ?? ""} 
                    wrongSignal={wrongSignal?.[right.id] ?? 0}
                    onAnswerChange={(v) => onAnswerChange(right.id, v)} 
                    onSubmit={() => onSubmit(right.id)} delay={180}
                    isActive={!solved?.[right.id]}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}