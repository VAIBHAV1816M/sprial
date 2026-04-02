"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type VerifyUIProps = {
  onVerify: () => Promise<boolean>;
  loading: boolean;
  message: string;
};

export default function VerifyUI({
  onVerify,
  loading,
  message,
}: VerifyUIProps) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    const success = await onVerify();
    if (success) {
      setShowModal(true);
    }
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
          border: "1px solid rgba(167,139,250,0.15)", // Purple accent for Verify step
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
            onClick={handleClick}
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

          {/* Message Status */}
          {message && (
            <p className="text-center text-[0.7rem] mt-2 tracking-wide uppercase" style={{ color: "#a78bfa", fontFamily: "'Share Tech Mono', monospace" }}>
              [ {message} ]
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* ── Success Modal Overlay ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-[380px] rounded-2xl p-8 flex flex-col items-center text-center gap-4"
              style={{
                background: "rgba(7, 9, 13, 0.95)",
                border: "1px solid rgba(0,255,204,0.3)", // Cyan/Green for success
                boxShadow: "0 0 40px rgba(0,255,204,0.15)",
              }}
            >
              {/* Success Icon */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: "rgba(0,255,204,0.1)", border: "1px solid rgba(0,255,204,0.4)" }}>
                <span className="text-2xl text-[#00ffcc]">✓</span>
              </div>

              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#00ffcc", fontSize: "1.5rem" }}>
                Congratulations!
              </h2>
              
              {/* This is the only line changed to support your dynamic phase names */}
              <p className="text-[0.9rem]" style={{ color: "#8892a4", lineHeight: 1.6 }}>
                {message}
              </p>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
