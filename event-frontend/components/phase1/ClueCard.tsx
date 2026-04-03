"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = {
  clue: any;
  solved: boolean;
  isActive: boolean;
  answer: string;
  wrongSignal: number;
  onAnswerChange: (val: string) => void;
  onSubmit: (val: string) => void;
  delay?: number;
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const QuestionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#00ffcc" strokeWidth={1.5} className="w-6 h-6">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth={2} className="w-6 h-6">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function ClueCard({
  clue,
  solved,
  isActive,
  answer,
  wrongSignal,
  onAnswerChange,
  onSubmit,
  delay = 0,
}: Props) {

  const [isFlipped, setIsFlipped] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrongFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSubmitRef = useRef<number>(0);

  useEffect(() => {
    if (isFlipped && !solved && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 460);
    }
  }, [isFlipped, solved]);

  useEffect(() => {
    if (solved) {
      setWrongFlash(false);
      if (wrongFlashTimerRef.current) {
        clearTimeout(wrongFlashTimerRef.current);
      }
    }
  }, [solved]);

  useEffect(() => {
    if (!isFlipped && wrongFlash) {
      setWrongFlash(false);
      if (wrongFlashTimerRef.current) {
        clearTimeout(wrongFlashTimerRef.current);
      }
    }
  }, [isFlipped]);

  useEffect(() => {
    if (wrongSignal > 0) {
      triggerWrongFlash();
    }
  }, [wrongSignal]);

  const triggerWrongFlash = () => {
    setWrongFlash(true);
    if (wrongFlashTimerRef.current) clearTimeout(wrongFlashTimerRef.current);
    wrongFlashTimerRef.current = setTimeout(() => {
      setWrongFlash(false);
    }, 2500);
  };

  const handleSubmit = () => {
    if (solved) return;
    const now = Date.now();
    if (now - lastSubmitRef.current < 500) return;
    lastSubmitRef.current = now;
    onSubmit(answer);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.closest(".zoom-btn")) return; // Prevent flip on zoom click

    if (
      target.closest("input") ||
      target.closest("button") ||
      target.closest(".clue-image-container") ||
      target.className.toString().includes("clue-scroll")
    ) return;

    setIsFlipped((prev) => !prev);
  };

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  const tipText = isFlipped
    ? "Click to close"
    : solved
      ? "Solved - Click to view"
      : "Click to reveal";

  return (
    <>
      <motion.div
        data-clue-id={clue.id}
        className="group relative w-[480px] h-[280px] shrink-0 [perspective:1200px] max-[900px]:w-[340px] max-[900px]:h-[220px] max-[520px]:w-[90vw] cursor-pointer"
        onClick={handleCardClick}
        initial={{ opacity: 0, rotateY: -10 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        viewport={{ once: true, margin: "0px 0px -40px 0px" }}
        transition={{
          opacity: { duration: 0.4 },
          rotateY: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }
        }}
      >
        {/* Universal Zoom Trigger Button */}
        <button
          className={`zoom-btn absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 border border-[#00ffcc]/30 text-[#00ffcc] transition-all hover:bg-[#00ffcc]/20 ${isFlipped ? "opacity-100 animate-pulse shadow-[0_0_12px_rgba(0,255,204,0.5)]" : "opacity-0 group-hover:opacity-100"
            }`}
          onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
        >
          <ExpandIcon />
        </button>

        <div className="absolute -bottom-[28px] left-1/2 -translate-x-1/2 text-[0.58rem] tracking-[0.1em] uppercase text-[#00ffcc]/[0.4] opacity-0 transition-opacity duration-250 pointer-events-none whitespace-nowrap z-20 font-mono group-hover:opacity-100">
          {tipText}
        </div>

        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* FRONT */}
          <div className={`absolute inset-0 [backface-visibility:hidden] rounded-[20px] flex flex-col p-[24px_28px_26px] border-[1px] transition-all duration-400 justify-between backdrop-blur-md ${solved ? "bg-[rgba(6,20,16,0.85)] border-[#34d399]/60 shadow-[0_0_30px_rgba(52,211,153,0.3)]" : wrongFlash ? "bg-[rgba(20,5,5,0.85)] border-[#ef4444]/70 shadow-[0_0_36px_rgba(239,68,68,0.4)]" : "bg-[rgba(7,9,13,0.85)] border-[#00ffcc]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-[#00ffcc]/60"}`}>
            <div className="flex justify-between items-start">
              <div>{solved ? <CheckIcon /> : <QuestionIcon />}</div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {solved ? (
                <><p className="text-[#8892a4] text-[0.65rem] uppercase tracking-[0.2em] mb-2 font-mono">Decrypted Value</p><p className="font-bold text-[#34d399] text-xl uppercase tracking-wider font-orbitron">{answer}</p></>
              ) : (
                <span className="font-bold text-[#e8eaf0] text-xl font-syne tracking-wide">Clue {clue.id.replace("clue", "")}</span>
              )}
            </div>
          </div>

          {/* BACK */}
          <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[20px] flex flex-row items-stretch p-[24px] gap-5 border-[1px] transition-all duration-300 ${wrongFlash ? "bg-[rgba(26,7,7,0.95)] border-[#ef4444]/70" : solved ? "bg-[rgba(6,20,16,0.95)] border-[#34d399]/40" : "bg-[rgba(7,9,13,0.95)] border-[#00ffcc]/40 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl"}`}>
            <div
              className="flex-1 flex flex-col h-full overflow-hidden cursor-zoom-in"
              onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
            >
              <div className="flex items-center gap-2 mb-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                <span className={`w-1.5 h-1.5 rounded-full ${wrongFlash ? "bg-[#ef4444]" : solved ? "bg-[#34d399]" : "bg-[#00ffcc] animate-pulse"}`} />
                <span className={`font-mono text-[0.65rem] tracking-[0.15em] uppercase ${wrongFlash ? "text-[#ef4444]" : solved ? "text-[#34d399]" : "text-[#00ffcc]"}`}>{wrongFlash ? "Warning // Invalid" : solved ? "Status // Solved" : "Awaiting Input"}</span>
              </div>
              <div className="flex-1 overflow-hidden pr-1">
                {clue.imageUrl && (
                  <div className="clue-image-container mb-4 relative w-full h-32 rounded-lg overflow-hidden border border-[#00ffcc]/20 group/img" onClick={(e) => e.stopPropagation()}>
                    <img src={clue.imageUrl} alt="Visual Clue" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                  </div>
                )}
                {clue.heading && (
                  <p className="text-[#00ffcc] text-[0.65rem] font-mono tracking-[0.12em] uppercase italic mb-2 opacity-80">— {clue.heading}</p>
                )}

                {/* Hide question text when linkLabel is present — button replaces it */}
                {!clue.linkLabel && (
                  <p className="text-[#e8eaf0] text-[0.75rem] leading-[1.55] font-dm whitespace-pre-line mb-3">{clue.question}</p>
                )}

                {/* Square Visit button — fills full remaining height */}
                {clue.downloadUrl && clue.linkLabel && (
                  <a
                    href={clue.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="h-[90px] md:h-[185px] flex flex-col items-center justify-center gap-2 w-full rounded-xl border border-[#00ffcc]/40 text-[#00ffcc] text-[0.8rem] font-bold tracking-[0.2em] uppercase font-orbitron transition-all hover:bg-[#00ffcc]/15 hover:border-[#00ffcc]/80 hover:shadow-[0_0_20px_rgba(0,255,204,0.3)] active:scale-95"
                    style={{ background: "rgba(0,255,204,0.06)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 mb-1">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    {clue.linkLabel}
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3 w-[160px] shrink-0 relative">
              <input ref={inputRef} className={`w-full bg-[#0c0f14] border rounded-lg py-3 px-3 text-[0.85rem] text-[#e8eaf0] outline-none font-mono ${wrongFlash ? "border-[#ef4444]/50" : solved ? "border-[#34d399]/40 text-[#34d399]" : "border-[#00ffcc]/20 focus:border-[#00ffcc]/60"}`} value={answer} onChange={(e) => onAnswerChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder={solved ? "Locked" : "Input..."} disabled={solved} />
              <button className={`w-full py-3 rounded-lg uppercase text-[0.7rem] font-bold tracking-widest font-orbitron ${wrongFlash ? "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30" : solved ? "bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30" : "bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/30 hover:bg-[#00ffcc]/20"}`} onClick={(e) => { stopProp(e); handleSubmit(); }} disabled={solved}>{solved ? "Locked" : "Submit"}</button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ─── POP-UP OVERLAY (Dynamically sizing based on Image presence) ─── */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80" onClick={() => setIsZoomed(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full bg-[#07090d] border border-[#00ffcc]/30 rounded-[30px] p-8 flex flex-col md:flex-row gap-8 ${clue.imageUrl ? "max-w-[900px]" : "max-w-[600px]"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setIsZoomed(false)} className="absolute top-6 right-6 text-[#8892a4] hover:text-[#00ffcc] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>

              {clue.imageUrl && (
                <div className="flex-1 rounded-2xl overflow-hidden border border-[#00ffcc]/10 bg-black/40 flex items-center justify-center min-h-[300px]">
                  <img src={clue.imageUrl} alt="Enlarged" className="w-full h-auto max-h-[70vh] object-contain" />
                </div>
              )}

              <div className={`w-full flex flex-col justify-center ${clue.imageUrl ? "md:w-[300px]" : "items-center py-6"}`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-[#00ffcc] rounded-full animate-pulse shadow-[0_0_8px_#00ffcc]" />
                  <span className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#00ffcc]">Analysis: Clue {clue.id.replace("clue", "")}</span>
                </div>

                {/* Heading (e.g. clue 5) — teal italic title above content */}
                {clue.heading && (
                  <p className="text-[#00ffcc] text-[0.72rem] font-mono tracking-[0.14em] uppercase italic mb-4 opacity-90">— {clue.heading}</p>
                )}

                {/* Extra hint text — white & prominent */}
                {clue.extraText && (
                  <p className={`text-[#e8eaf0] text-[1.1rem] leading-[2] font-dm italic border-[#00ffcc]/30 whitespace-pre-line ${clue.imageUrl ? "border-l-2 pl-4" : ""}`}>
                    {clue.extraText}
                  </p>
                )}

                {/* Question — purple only for clue1 (has extraText), white for all others */}
                <p className={`mt-4 whitespace-pre-line border-l-2 pl-4 leading-relaxed ${clue.extraText
                  ? "text-[0.82rem] text-[#a78bfa] font-mono tracking-wide border-[#a78bfa]/40"
                  : "text-[0.88rem] text-[#e8eaf0] font-mono border-[#00ffcc]/30"
                  }`}>
                  {clue.extraText && "⚠ "}{clue.question}
                </p>

                {/* Link button — label & icon driven by clue.linkLabel */}
                {clue.downloadUrl && (
                  <a
                    href={clue.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#00ffcc]/30 text-[#00ffcc] text-[0.72rem] font-bold tracking-[0.18em] uppercase font-orbitron transition-all hover:bg-[#00ffcc]/20 hover:shadow-[0_0_18px_rgba(0,255,204,0.2)] hover:border-[#00ffcc]/60"
                    style={{ background: "rgba(0,255,204,0.05)" }}
                  >
                    {clue.linkLabel === "Visit" ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    )}
                    {clue.linkLabel || "Download"}
                  </a>
                )}

                <div className="mt-6 text-[0.6rem] uppercase tracking-[0.3em] text-[#8892a4] font-mono">
                  Analysis Required // Tier 1 Data
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
