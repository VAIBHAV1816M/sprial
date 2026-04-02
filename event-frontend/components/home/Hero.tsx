type HeroProps = {
  onRegister: () => void;
  onLogin: () => void;
};

export default function Hero({ onRegister, onLogin }: HeroProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center text-white px-6 animate-fadeIn">

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide animate-slideUp drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        THE SPIRAL
      </h1>

      {/* Subtitle */}
      <p className="mb-12 text-lg md:text-xl max-w-2xl text-gray-400 animate-slideUp delay-100 leading-relaxed">
        Solve clues across multiple phases and prove your intelligence.
        Only the sharpest minds will reach the final stage.
      </p>

      {/* Buttons */}
      <div className="flex gap-6 animate-slideUp delay-200">

        {/* Register */}
        <button
          onClick={onRegister}
          className="px-8 py-3 rounded-xl bg-white text-black font-medium transition-all duration-300 hover:scale-105 hover:bg-gray-200 active:scale-95 shadow-lg hover:shadow-white/20"
        >
          Register
        </button>

        {/* Login */}
        <button
          onClick={onLogin}
          className="px-8 py-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/10 active:scale-95 shadow-lg hover:shadow-white/10"
        >
          Login
        </button>

      </div>

    </div>
  );
}
