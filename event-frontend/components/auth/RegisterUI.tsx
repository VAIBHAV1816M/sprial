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
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden text-white">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-white/5 blur-[120px]" />

      {/* Card */}
      <div className="relative z-10 w-[400px] px-10 py-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.08)] animate-fadeIn">

        {/* Header */}
        <div className="mb-9 text-center">
          <h1 className="text-2xl font-semibold tracking-wide">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Join the puzzle challenge
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">

          {/* Name */}
          <input
            name="name"
            value={form.name}
            placeholder="Full Name"
            onChange={onChange}
            required
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-xl outline-none transition-all focus:border-white/30 focus:ring-1 focus:ring-white/20"
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={onChange}
            required
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-xl outline-none transition-all focus:border-white/30 focus:ring-1 focus:ring-white/20"
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            value={form.password}
            placeholder="Password"
            onChange={onChange}
            required
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-xl outline-none transition-all focus:border-white/30 focus:ring-1 focus:ring-white/20"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full py-3 rounded-xl bg-white text-black font-medium transition-all duration-300 hover:scale-105 hover:bg-gray-200 active:scale-95 shadow-lg hover:shadow-white/20 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-sm text-center text-red-400 animate-fadeIn">
            {message}
          </p>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/30">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-white/40">
          Already have an account?{" "}
          <span
            className="text-white cursor-pointer hover:underline"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}