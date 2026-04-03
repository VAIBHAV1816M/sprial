"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const QuestionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#00ffcc" strokeWidth={1.5} className="w-6 h-6">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth={2} className="w-6 h-6">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// New Icon for the Zoom Trigger
const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

export default function ClueCard({
  clue, solved, isActive, answer, wrongSignal, onAnswerChange, onSubmit, delay = 0,
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
    if (solved) setWrongFlash(false);
  }, [solved]);

  useEffect(() => {
    if (wrongSignal > 0) {
      setWrongFlash(true);
      if (wrongFlashTimerRef.current) clearTimeout(wrongFlashTimerRef.current);
      wrongFlashTimerRef.current = setTimeout(() => setWrongFlash(false), 2500);
    }
  }, [wrongSignal]);

  const handleSubmit = () => {
    if (solved) return;
    const now = Date.now();
    if (now - lastSubmitRef.current < 500) return;
    lastSubmitRef.current = now;
    onSubmit(answer);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest(".zoom-btn")) return; // Don't flip if clicking zoom
    if (target.closest("input") || target.closest("button") || target.closest(".clue-image-container")) return;
    setIsFlipped((prev) => !prev);
  };

  return (
    <>
      <motion.div
        className="group relative w-[480px] h-[280px] shrink-0 [perspective:1200px] cursor-pointer"
        onClick={handleCardClick}
        initial={{ opacity: 0, rotateY: -10 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, delay: delay / 1000 }}
      >
        {/* Universal Zoom Trigger */}
        <button 
          className="zoom-btn absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 border border-[#00ffcc]/30 text-[#00ffcc] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#00ffcc]/20"
          onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
        >
          <ExpandIcon />
        </button>

        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* FRONT */}
          <div className={`absolute inset-0 [backface-visibility:hidden] rounded-[20px] flex flex-col p-6 border-[1px] justify-between backdrop-blur-md ${solved ? "bg-[rgba(6,20,16,0.85)] border-[#34d399]/60" : wrongFlash ? "bg-[rgba(20,5,5,0.85)] border-[#ef4444]/70" : "bg-[rgba(7,9,13,0.85)] border-[#00ffcc]/30"}`}>
            <div>{solved ? <CheckIcon /> : <QuestionIcon />}</div>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {solved ? (
                <><p className="text-[#8892a4] text-[0.65rem] uppercase font-mono">Decrypted</p><p className="font-bold text-[#34d399] text-xl font-orbitron">{answer}</p></>
              ) : (
                <span className="font-bold text-[#e8eaf0] text-xl font-syne">Clue {clue.id.replace("clue", "")}</span>
              )}
            </div>
          </div>

          {/* BACK */}
          <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[20px] flex flex-row p-6 gap-5 border-[1px] ${wrongFlash ? "bg-[rgba(26,7,7,0.95)] border-[#ef4444]/70" : "bg-[rgba(7,9,13,0.95)] border-[#00ffcc]/40"}`}>
            <div className="flex-1 flex flex-col h-full overflow-hidden">
               <div className="flex-1 overflow-y-auto pr-2 clue-scroll">
                 {clue.imageUrl && (
                    <div className="clue-image-container mb-3 h-24 rounded border border-[#00ffcc]/20 overflow-hidden" onClick={() => setIsZoomed(true)}>
                       <img src={clue.imageUrl} className="w-full h-full object-cover" alt="clue" />
                    </div>
                 )}
                 <p className="text-[#e8eaf0] text-[0.85rem] font-dm">{clue.question}</p>
               </div>
            </div>
            <div className="flex flex-col justify-center gap-3 w-[150px]">
              <input ref={inputRef} className="w-full bg-[#0c0f14] border border-[#00ffcc]/20 rounded-lg p-2 text-sm text-[#e8eaf0] outline-none" value={answer} onChange={(e) => onAnswerChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder="Input..." disabled={solved} />
              <button className="w-full py-2 bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/30 rounded-lg text-[0.7rem] font-bold" onClick={handleSubmit} disabled={solved}>Submit</button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ─── UNIVERSAL POP-UP ─── */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80" onClick={() => setIsZoomed(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-w-[800px] w-full bg-[#07090d] border border-[#00ffcc]/30 rounded-[30px] p-8 flex flex-col md:flex-row gap-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex-1 bg-black/40 rounded-xl flex items-center justify-center min-h-[300px] border border-[#00ffcc]/10">
                {clue.imageUrl ? <img src={clue.imageUrl} className="max-h-[60vh] object-contain" /> : <div className="text-[#00ffcc]/20 font-mono">NO VISUAL DATA</div>}
              </div>
              <div className="w-full md:w-[250px] flex flex-col justify-center">
                <span className="text-[0.7rem] font-bold text-[#00ffcc] uppercase mb-2 tracking-widest">Analysis: Clue {clue.id.replace("clue", "")}</span>
                <p className="text-[#e8eaf0] text-lg italic border-l-2 border-[#00ffcc]/30 pl-4">"{clue.question}"</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
