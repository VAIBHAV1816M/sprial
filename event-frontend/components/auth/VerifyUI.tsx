"use client";

import { useState } from "react";

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
    <div className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden text-white">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-white/5 blur-[120px]" />

      {/* Card */}
      <div className="relative z-10 w-[380px] px-10 py-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.08)] text-center">

        <h1 className="text-2xl font-semibold mb-6">
          Verify Access
        </h1>

        <button
          onClick={handleClick}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-white text-black font-medium transition-all duration-300 hover:scale-105 hover:bg-gray-200 active:scale-95 shadow-lg hover:shadow-white/20 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {message && (
          <p className="mt-5 text-sm text-green-400">
            {message}
          </p>
        )}

      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 text-center shadow-lg animate-fadeIn">

            <h2 className="text-xl font-semibold mb-4">
              Verification Successful 🎉
            </h2>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
            >
              Continue
            </button>

          </div>

        </div>
      )}

    </div>
  );
}