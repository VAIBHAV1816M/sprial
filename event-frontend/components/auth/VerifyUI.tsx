"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type VerifyUIProps = {
  onVerify: () => Promise<boolean>;
  loading: boolean;
  message: string;
  nextPath: string; // Received from app/verify/page.tsx
};

export default function VerifyUI({
  onVerify,
  loading,
  message,
  nextPath,
}: VerifyUIProps) {
  const router = useRouter();

  // Helper function to render text and make the specific names clickable
  const renderInteractiveMessage = (text: string) => {
    const names = ["startbeyondlogic", "fire-777"];
    const foundName = names.find((name) => text.includes(name));

    if (!foundName) return text;

    const parts = text.split(foundName);

    return (
      <>
        {parts[0]}
        <span
          onClick={() => router.push(nextPath)}
          className="cursor-pointer font-extrabold underline transition-all hover:opacity-80"
          style={{ color: "#00ffcc", textDecorationColor: "rgba(0,255,204,0.4)" }}
        >
          {foundName}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen relative overflow-hidden text-[#e8eaf0] font-dm"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #06110d 0%, #050709 65%)" }}
    >
      {/* ── Main Verification Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-[400px] rounded-2xl p-9 flex flex-col gap-6"
        style={{
          background: "rgba(7, 9, 13, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(167,139,250,0.15)",
          boxShadow: "0 0 80px rgba(167,139,250,0.04), 0 24px 48px rgba(0,0,0,0.6)",
        }}
      >
        {/* Tag */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <span
            className="text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1 rounded-full border flex items-center gap-2 w-fit"
            style={{ color: "rgba(167,139,250,0.7)", borderColor: "rgba(167,139,250,0.25)" }}
          >
            <span className="w-[5px] h-[5px] rounded-full bg-[#a78bfa] inline-block animate-pulse" />
            Security Protocol
          </span>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-col gap-1">
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#e8eaf0", fontSize: "1.6rem" }}>
            Verify Access
          </h1>
          <p className="text-xs" style={{ color: "#8892a4" }}>
            Initiate secure handshake to confirm identity.
          </p>
        </motion.div>

        {/* Divider */}
        <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(167,139,250,0.25), transparent)" }} />

        {/* Action Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4 mt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onVerify}
            disabled={loading}
            className="py-3 rounded-lg text-xs tracking-[0.12em] uppercase font-bold w-full transition-all"
            style={{
              background: "rgba(167,139,250,0.1)",
              border: "1px solid rgba(167,139,250,0.4)",
              color: "#a78bfa",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              boxShadow: loading ? "none" : "0 0 15px rgba(167,139,250,0.1)",
            }}
          >
            {loading ? "Establishing Link..." : "Initiate Verification"}
          </motion.button>

          {/* Simple Success Message (Clickable Phase Name) */}
          {message && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-[0.8rem] mt-2 leading-relaxed" 
              style={{ color: "#e8eaf0", fontFamily: "'Share Tech Mono', monospace" }}
            >
              [ {renderInteractiveMessage(message)} ]
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
