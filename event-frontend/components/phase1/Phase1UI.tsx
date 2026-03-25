"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ClueCard from "./ClueCard";

// ─── Types ────────────────────────────────────────────────────────────────────
type Clue = {
  id: string;
  question: string;
};

type Props = {
  clues: Clue[];
  solved: Record<string, boolean>;
  answers: Record<string, string>;
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
  clues, solved, answers, onAnswerChange, onSubmit, message,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const orbsRef = useRef<Orb[]>([]);
  const rafRef = useRef<number>(0);

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
      // Grid logic
      for (let c = 0; c <= 20; c++) {
        const x = (c / 20) * W;
        const d = Math.abs((mouseRef.current.x / W) - c / 20);
        ctx.strokeStyle = `rgba(0,255,204,${Math.max(0.015, 0.055 - d * 0.1)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      // Orbs logic
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

  return (
    <div className="relative min-h-screen bg-[#050709] text-[#e8eaf0] font-dm selection:bg-neon-teal/30 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none block" />

      {/* Ambient Glow Blobs - Replacing phase1.css blobs */}
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

        {/* Staggered Card Grid - Logic from phase1.css */}
        <div className="max-w-[1280px] mx-auto px-15 pb-[220px]">
          {rows.map(([left, right], idx) => {
            const isOddRow = idx % 2 === 0;
            if (!right) return (
              <div key={left.id} className="flex justify-center mb-20 pt-10">
                <ClueCard 
                   clue={left} solved={!!solved?.[left.id]} 
                   answer={answers?.[left.id] ?? ""} 
                   onAnswerChange={(v) => onAnswerChange(left.id, v)} 
                   onSubmit={() => onSubmit(left.id)} 
                />
              </div>
            );
            return (
              <div key={left.id} className="grid grid-cols-1 md:grid-cols-[1fr_100px_1fr] mb-[100px] items-start">
                <div className={`flex justify-center md:justify-end md:pr-7 ${isOddRow ? "md:pb-[100px]" : "md:pt-[120px]"}`}>
                  <ClueCard 
                    clue={left} solved={!!solved?.[left.id]} 
                    answer={answers?.[left.id] ?? ""} 
                    onAnswerChange={(v) => onAnswerChange(left.id, v)} 
                    onSubmit={() => onSubmit(left.id)} delay={0} 
                  />
                </div>
                <div className="hidden md:block" />
                <div className={`flex justify-center md:justify-start md:pl-7 ${isOddRow ? "md:pt-[140px]" : "md:pb-[100px]"}`}>
                  <ClueCard 
                    clue={right} solved={!!solved?.[right.id]} 
                    answer={answers?.[right.id] ?? ""} 
                    onAnswerChange={(v) => onAnswerChange(right.id, v)} 
                    onSubmit={() => onSubmit(right.id)} delay={180} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Message Banner */}
        {message && (
          <div className="sticky bottom-8 flex justify-center z-50 pointer-events-none px-4">
            <p className="bg-[#050709]/92 border border-[#00ffcc]/25 rounded-full px-[30px] py-2.5 text-[0.85rem] text-[#00ffcc] tracking-[0.06em] backdrop-blur-xl shadow-[0_0_24px_rgba(0,255,204,0.12)]">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}