"use client";

import { motion } from "framer-motion";

const CompletionScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(6, 13, 26, 0.95)",
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Grid & Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />
      
      {/* Sweeping Radar/Glow effect */}
      <motion.div
        initial={{ top: "-100%" }}
        animate={{ top: "200%" }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
          boxShadow: "0 0 20px #00ff88",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      {/* Main Content Box */}
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        style={{
          background: "rgba(0, 255, 136, 0.05)",
          border: "1px solid rgba(0, 255, 136, 0.3)",
          borderRadius: "16px",
          padding: "60px 80px",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 0 50px rgba(0, 255, 136, 0.1)",
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.85rem",
            letterSpacing: "0.3em",
            color: "#00ff88",
            marginBottom: "16px",
          }}
        >
          // SYSTEM OVERRIDE SUCCESSFUL
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 0 30px rgba(0, 255, 136, 0.5)",
            marginBottom: "24px",
            textTransform: "uppercase",
          }}
        >
          ACCESS GRANTED
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
            margin: "0 auto 32px",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "1.1rem",
            color: "#cde8ff",
            lineHeight: 1.6,
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          All fragments integrated. Master key sequence accepted. 
          <br />
          <span style={{ color: "#00ff88", fontWeight: 600 }}>Congratulations, you have completed the final phase.</span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default CompletionScreen;