"use client";

import { useState } from "react";
import API from "../../services/api";
import { saveToken } from "../../utils/auth";

export default function Phase2Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e:any) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post("/auth/login", form);

      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data.token;
      const phase = res.data.currentPhase;

      // save token
      saveToken(token);

      /*
      PHASE 2 ACCESS RULE
      */

      if (phase === 2) {

        window.location.href = "/phase2";

      }

      else if (phase === 1) {

        setMessage("Access denied. Complete Phase 1 first.");

      }

      else if (phase === 3) {

        setMessage("You have already completed Phase 2. Proceed to the Phase 3 website.");

      }

    } catch (err:any) {

      setMessage(
        err.response?.data?.message || "Login failed"
      );

    }

    setLoading(false);

  };

    return (
        <h1 className="text-2xl font-bold mb-6 text-center">Phase 2 Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />
          <button type="submit" className="bg-black text-white p-2 rounded">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
