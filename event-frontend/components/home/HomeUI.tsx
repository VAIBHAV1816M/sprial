import Hero from "./Hero";
import Background from "./Background";
import CursorGlow from "./CursorGlow";

type HomeUIProps = {
  onRegister: () => void;
  onLogin: () => void;
};

export default function HomeUI({ onRegister, onLogin }: HomeUIProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">

      {/* 🌀 Video Background */}
      <Background />

      {/* ✨ Cursor Glow (ADD THIS LINE) */}
      <CursorGlow />

      {/* 🌑 Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* 💡 Soft center glow */}
      <div className="absolute w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />

      {/* 🎯 Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <Hero onRegister={onRegister} onLogin={onLogin} />
      </div>

    </div>
  );
}