"use client";

import { motion } from "framer-motion";

export default function LoginScreen({ form, loading, message, handleChange, handleLogin }: any) {
  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #06110d 0%, #050709 65%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-[400px] rounded-2xl p-9 flex flex-col gap-6"
        style={{
          background: "#07090d",
          border: "1px solid rgba(0,255,204,0.12)",
          boxShadow: "0 0 80px rgba(0,255,204,0.04), 0 24px 48px rgba(0,0,0,0.6)",
        }}
      >
        {/* Tag */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <span
            className="text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1 rounded-full border flex items-center gap-2 w-fit"
            style={{ color: "rgba(0,255,204,0.6)", borderColor: "rgba(0,255,204,0.18)" }}
          >
            <span className="w-[5px] h-[5px] rounded-full bg-[#00ffcc] inline-block" />
            Phase 2 Access
          </span>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col gap-1">
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#e8eaf0", fontSize: "1.6rem" }}>
            Authenticate
          </h1>
          <p className="text-xs" style={{ color: "#8892a4" }}>
            Enter your credentials to access Phase 2
          </p>
        </motion.div>

        {/* Divider */}
        <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(0,255,204,0.18), transparent)" }} />

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {[
            { name: "email", type: "email", label: "Email", placeholder: "agent@phase2.io" },
            { name: "password", type: "password", label: "Password", placeholder: "••••••••" },
          ].map((field, i) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
              className="flex flex-col gap-1"
            >
              <label className="text-[0.6rem] tracking-[0.1em] uppercase" style={{ color: "#8892a4" }}>
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="rounded-lg px-4 py-3 text-sm font-mono outline-none transition-all"
                style={{
                  background: "#0c0f14",
                  border: "1px solid rgba(0,255,204,0.18)",
                  color: "#e8eaf0",
                  caretColor: "#00ffcc",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,255,204,0.45)")}
                onBlur={(e)  => (e.target.style.borderColor = "rgba(0,255,204,0.18)")}
              />
            </motion.div>
          ))}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="py-3 rounded-lg text-xs tracking-[0.12em] uppercase mt-1"
            style={{
              background: "rgba(0,255,204,0.08)",
              border: "1px solid rgba(0,255,204,0.3)",
              color: "#00ffcc",
              fontFamily: "'DM Sans', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Authenticating..." : "Login"}
          </motion.button>
        </form>

        {/* Error */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs"
            style={{ color: "#f87171" }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}