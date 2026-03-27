"use client";

import { motion, AnimatePresence } from "framer-motion";

type RegisterUIProps = {
  form: {
    name: string;
    email: string;
    password: string;
  };
  onChange: (e: any) => void;
  onSubmit: (e: any) => void;
  loading: boolean;
  message: string;
};

export default function RegisterUI({
  form,
  onChange,
  onSubmit,
  loading,
  message,
}: RegisterUIProps) {
  
  const isError = message.toLowerCase().includes("error") || 
                  message.toLowerCase().includes("failed") || 
                  message.toLowerCase().includes("already");

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-[#050709] overflow-hidden text-[#e8eaf0] font-dm">
      
      {/* ─── Ambient Background Glows ─── */}
      <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(0,255,204,0.08)_0%,transparent_70%)]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(167,139,250,0.07)_0%,transparent_70%)]" />

      {/* ─── Floating HUD Message Pill ─── */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -30, x: "-50%" }}
            className="fixed top-[40px] left-1/2 z-[100] px-6 py-2.5 rounded-full backdrop-blur-md border font-mono text-[0.8rem] uppercase tracking-widest shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            style={{ 
              background: isError ? "rgba(255, 68, 102, 0.15)" : "rgba(0, 255, 136, 0.15)",
              borderColor: isError ? "rgba(255, 68, 102, 0.4)" : "rgba(0, 255, 136, 0.4)",
              color: isError ? "#ff4466" : "#00ff88",
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Registration Card (Glow Fixed) ─── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[420px] p-10 rounded-[28px] bg-[rgba(7,9,13,0.9)] backdrop-blur-xl border border-[#00ffcc]/20 shadow-[0_0_40px_rgba(0,255,204,0.08),inset_0_0_20px_rgba(0,255,204,0.02)]"
      >
        {/* Card Header */}
        <div className="mb-10 flex flex-col items-center">
          <div className="flex items-center gap-2 text-[0.6rem] text-[#00ffcc]/60 tracking-[0.25em] uppercase mb-4 font-mono">
             <span className="w-1.5 h-1.5 bg-[#00ffcc] rounded-full shadow-[0_0_8px_#00ffcc] animate-pulse" />
             Protocol: Registration
          </div>
          <h1 className="text-[2.2rem] font-extrabold font-syne tracking-tight text-[#e8eaf0] uppercase text-center leading-none">
            Create Profile
          </h1>
          <p className="mt-3 text-[0.65rem] text-[#8892a4] font-mono tracking-widest uppercase opacity-60">
            Establish secure link to the network
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          {[
            { name: "name", type: "text", label: "Identity Name", placeholder: "e.g. Neo" },
            { name: "email", type: "email", label: "Email Address", placeholder: "agent@matrix.io" },
            { name: "password", type: "password", label: "Access Cipher", placeholder: "••••••••" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-2">
              <label className="text-[0.6rem] font-mono uppercase tracking-[0.2em] text-[#8892a4] pl-1">
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                value={form[field.name as keyof typeof form]}
                placeholder={field.placeholder}
                onChange={onChange}
                required
                className="w-full bg-[#0c0f14]/80 border border-[#00ffcc]/15 text-[#e8eaf0] placeholder-[#8892a4]/30 px-5 py-3.5 rounded-xl outline-none transition-all focus:border-[#00ffcc]/50 font-mono text-sm"
              />
            </div>
          ))}

          {/* Glowing Register Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: "0_0_20px_rgba(0,255,204,0.15)" }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full py-4 rounded-xl bg-[rgba(0,255,204,0.05)] border border-[#00ffcc]/40 text-[#00ffcc] font-orbitron font-bold text-[0.75rem] tracking-[0.25em] uppercase transition-all hover:bg-[rgba(0,255,204,0.1)] disabled:opacity-50"
          >
            {loading ? "Initializing..." : "Register Identity"}
          </motion.button>
        </form>

        {/* Footer Link */}
        <div className="mt-10 pt-8 border-t border-[#00ffcc]/10 flex flex-col items-center">
          <p className="text-center text-xs text-[#8892a4] tracking-wider">
            Already verified?{" "}
            <span
              className="text-[#00ffcc] font-bold cursor-pointer hover:underline transition-all ml-1"
              onClick={() => (window.location.href = "/login")}
            >
              Access Login
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}