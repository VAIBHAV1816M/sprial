type LoginUIProps = {
  form: {
    email: string;
    password: string;
  };
  onChange: (e: any) => void;
  onSubmit: (e: any) => void;
  loading: boolean;
  message: string;
};

export default function LoginUI({
  form,
  onChange,
  onSubmit,
  loading,
  message
}: LoginUIProps) {
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden text-white">

      {/* ✨ Outer Glow */}
      <div className="absolute w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />

      {/* 🧊 Card */}
      <div className="relative z-10 w-[380px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.08)] animate-fadeIn">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-8 text-center tracking-wide">
          Welcome Back
        </h1>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-5">

          {/* Email */}
          <input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            autoComplete="email"
            onChange={onChange}
            required
            className="bg-black/40 border border-white/10 p-3 rounded-lg focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all"
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            value={form.password}
            placeholder="Password"
            autoComplete="current-password"
            onChange={onChange}
            required
            className="bg-black/40 border border-white/10 p-3 rounded-lg focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all"
          />

          {/* Button */}
          <button
            type="submit"
            className="mt-2 py-3 rounded-xl bg-white text-black font-medium transition-all duration-300 hover:scale-105 hover:bg-gray-200 active:scale-95 shadow-lg hover:shadow-white/30"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Error */}
        {message && (
          <p className="mt-4 text-center text-sm text-red-400 animate-fadeIn">
            {message}
          </p>
        )}

        {/* 🔗 Register link (NEW) */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <span
            className="text-white cursor-pointer hover:underline"
            onClick={() => window.location.href = "/register"}
          >
            Register
          </span>
        </p>

      </div>

    </div>
  );
}