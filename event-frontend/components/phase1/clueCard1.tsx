"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  clue: { id: string; question: string };
  solved: boolean;
  answer: string;
  onAnswerChange: (val: string) => void;
  onSubmit: () => void;
  delay?: number;
};

export default function ClueCard({
  clue,
  solved,
  answer,
  onAnswerChange,
  onSubmit,
  delay = 0,
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const solvedRef = useRef(solved);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    solvedRef.current = solved;
  }, [solved]);

  const handleSubmit = () => {
    onSubmit();
    setTimeout(() => {
      if (!solvedRef.current) {
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 1500);
      }
    }, 280);
  };

  // --- Icon Components ---
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

  const tipText = isFlipped ? "Click to close" : solved ? "Click to see answer" : "Click to answer";

  return (
    <motion.div
      className="group relative w-[480px] h-[280px] shrink-0 cursor-pointer [perspective:1200px] max-[900px]:w-[340px] max-[900px]:h-[220px] max-[520px]:w-[90vw]"
      onClick={() => setIsFlipped(!isFlipped)}
      // Replacement for .cc-inner.not-revealed (Scroll Reveal)
      initial={{ opacity: 0, rotateY: -10 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ 
        opacity: { duration: 0.4 },
        rotateY: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }
      }}
    >
      {/* Tooltip: Replacement for .cc-outer::before */}
      <div className="absolute -bottom-[28px] left-1/2 -translate-x-1/2 text-[0.58rem] tracking-[0.1em] uppercase text-[#00ffcc]/[0.35] opacity-0 transition-opacity duration-250 pointer-events-none whitespace-nowrap z-20 font-dm group-hover:opacity-100">
        {tipText}
      </div>

      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* FRONT FACE: Replacement for .cc-front */}
        <div
          className={`absolute inset-0 [backface-visibility:hidden] rounded-[20px] flex flex-col p-[24px_28px_26px] border-[1.5px] transition-all duration-400 justify-between
          ${solved 
            ? "bg-[#061410] border-[#34d399]/90 shadow-[0_0_30px_rgba(52,211,153,0.65),0_0_80px_rgba(52,211,153,0.12),inset_0_0_32px_rgba(52,211,153,0.06)]" 
            : wrongFlash
            ? "border-[#ef4444]/90 shadow-[0_0_36px_rgba(239,68,68,0.75),0_0_90px_rgba(239,68,68,0.14),inset_0_0_30px_rgba(239,68,68,0.07)]"
            : "bg-[#0a1512] border-[#00ffcc]/50 shadow-[0_0_18px_rgba(0,255,204,0.22),0_0_55px_rgba(0,255,204,0.05),inset_0_0_28px_rgba(0,255,204,0.03)] group-hover:border-[#00ffcc]/80 group-hover:shadow-[0_0_32px_rgba(0,255,204,0.40),0_0_80px_rgba(0,255,204,0.08),inset_0_0_32px_rgba(0,255,204,0.05)]"
          }`}
        >
          {/* Inner Glow Border: Replacement for .cc-front::after */}
          <div className={`absolute inset-[-1px] rounded-[21px] border pointer-events-none blur-[1.5px] transition-all duration-400
            ${solved ? "border-[#34d399]/50" : wrongFlash ? "border-[#ef4444]/50" : "border-[#00ffcc]/28"}`} 
          />

          <div className="flex justify-between items-start relative z-10">
            <div>{solved ? <CheckIcon /> : <QuestionIcon />}</div>
            <div className="grid grid-cols-2 gap-[3px]">
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className="w-[6px] h-[6px] border-[1.5px] border-[#00ffcc]/[0.22]" />
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
            {solved ? (
              <>
                <p className="text-[0.64rem] text-[#8892a4] mb-1">Your Answer</p>
                <p className="font-bold text-[#a78bfa] text-lg tracking-wide uppercase">{answer}</p>
              </>
            ) : (
              <span className="font-bold text-[#e8eaf0] text-xl tracking-tight">Clue {clue.id}</span>
            )}
          </div>

          {solved && <div className="text-center text-[#34d399] text-xs font-dm tracking-widest uppercase relative z-10">✓ Solved</div>}
        </div>

        {/* BACK FACE: Replacement for .cc-back */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[20px] flex flex-row items-center p-[24px_28px_26px] gap-6 bg-[#080e18] border-[1.5px] border-[#a78bfa]/40 shadow-[0_0_22px_rgba(167,139,250,0.14),inset_0_0_28px_rgba(167,139,250,0.04)] cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1">
             {/* Simple Answer Icon Replacement */}
            <svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth={1.5} className="w-[22px] h-[22px] mb-3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-[#e8eaf0] font-dm text-sm leading-relaxed">{clue.question}</p>
          </div>

          {solved ? (
            <div className="p-[10px_18px] rounded-[11px] bg-[#34d399]/[0.09] border border-[#34d399]/[0.32] text-[#34d399] text-xs font-bold whitespace-nowrap">
              ✓ Solved
            </div>
          ) : (
            <div className="flex flex-col gap-3 min-w-[140px]">
              <input
                ref={inputRef}
                className="w-full bg-[#00ffcc]/[0.04] border border-[#00ffcc]/[0.22] rounded-[11px] p-[11px_14px] text-[#e8eaf0] text-sm focus:border-[#00ffcc]/[0.55] outline-none transition-colors"
                value={answer}
                onChange={(e) => onAnswerChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                onClick={(e) => e.stopPropagation()}
                placeholder="Enter answer..."
              />
              <button
                className="w-full p-[11px_22px] rounded-[11px] bg-[#00ffcc]/[0.09] border border-[#00ffcc]/[0.32] text-[#00ffcc] text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-35 transition-all hover:bg-[#00ffcc]/20"
                disabled={!answer.trim()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit();
                }}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}