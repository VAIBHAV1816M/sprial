"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div
      className="flex flex-col justify-center items-center h-screen gap-6"
      style={{ background: "#050709" }}
    >
      <div className="relative flex items-center justify-center w-28 h-28">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-[#00ffcc]"
            style={{
              width: `${112 - i * 28}px`,
              height: `${112 - i * 28}px`,
              opacity: 0.12 + i * 0.18,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 3.5 - i * 0.8, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <motion.div
          className="w-5 h-5 rounded-full bg-[#00ffcc]"
          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ boxShadow: "0 0 20px rgba(0,255,204,0.8)" }}
        />
      </div>

      <motion.p
        className="font-mono text-xs tracking-[0.22em] uppercase"
        style={{ color: "#00ffcc" }}
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Initializing Phase 2...
      </motion.p>
    </div>
  );
}