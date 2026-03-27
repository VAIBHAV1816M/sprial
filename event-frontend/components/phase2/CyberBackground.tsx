"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Orb {
  x: number; y: number;
  vx: number; vy: number;
  r: number; base: number; alpha: number;
}

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
  const c = teal ? "rgba(0,255,204," : "rgba(167,139,250,";
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-[18%] rounded-md border border-current/15 bg-current/5" style={{ color: teal ? "#00ffcc" : "#a78bfa" }} />
      {["tl", "tr", "bl", "br"].map((p) => (
        <div
          key={p}
          className={`absolute w-[28%] h-[28%] rounded border border-current/12 bg-current/5 
            ${p === "tl" ? "top-0 left-0" : p === "tr" ? "top-0 right-0" : p === "bl" ? "bottom-0 left-0" : "bottom-0 right-0"}`}
          style={{ color: teal ? "#00ffcc" : "#a78bfa" }}
        />
      ))}
      <div className="absolute inset-[35%] bg-[#050709] rounded-sm z-10" />
    </div>
  );
}

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const orbsRef = useRef<Orb[]>([]);
  const rafRef = useRef<number>(0);

  // ── Initialise orbs ──
  useEffect(() => {
    orbsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * 1600, y: Math.random() * 1200,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.4, base: Math.random(), alpha: Math.random() * 0.45 + 0.15,
    }));
  }, []);

  // ── Canvas Animation ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      // Grid lines
      for (let c = 0; c <= 20; c++) {
        const x = (c / 20) * W;
        const d = Math.abs((mouseRef.current.x / W) - c / 20);
        ctx.strokeStyle = `rgba(0,255,204,${Math.max(0.015, 0.055 - d * 0.1)})`;
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
        ctx.fillStyle = o.base < 0.6 ? `rgba(0,255,204,${o.alpha + pull})` : `rgba(167,139,250,${o.alpha + pull})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  // ── Mouse Tracking ──
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

  return (
    <>
      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none block opacity-60" />

      {/* Ambient Glow Blobs */}
      <div className="fixed top-[-150px] left-[-150px] w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(0,255,204,0.07)_0%,transparent_70%)]" />
      <div className="fixed top-[25%] right-[-120px] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(167,139,250,0.06)_0%,transparent_70%)]" />

      {/* Rotating Background Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        {SHAPES.map((s, i) => (
          <div
            key={i}
            ref={i === 0 ? shapeRef : undefined}
            className="absolute -translate-x-1/2"
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
    </>
  );
}