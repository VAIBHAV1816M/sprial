"use client";

import { useState } from "react";
import API from "../../services/api";
import { saveToken } from "../../utils/auth";
import { useRouter } from "next/navigation";
import LoginUI from "@/components/auth/LoginUI";

export default function Login() {

  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post("/auth/login", form);

      const token = res.data.token;
      const phase = res.data.currentPhase;

      saveToken(token);

      const entry = localStorage.getItem("entry");

      if (entry === "phase2") {

        if (phase === 2) window.location.href = "/phase2";
        else if (phase === 1) setMessage("Access denied. Complete Phase 1 first.");
        else if (phase === 3) setMessage("You have already completed Phase 2.");

        localStorage.removeItem("entry");
        return;
      }

      if (entry === "phase3") {

        if (phase === 3) window.location.href = "/phase3";
        else if (phase === 1) setMessage("Complete Phase 1 first.");
        else if (phase === 2) setMessage("Complete Phase 2 first.");

        localStorage.removeItem("entry");
        return;
      }

      localStorage.setItem("entry", "home");

      if (phase === 1) router.push("/phase1");
      else if (phase === 2) router.push("/phase2");
      else if (phase === 3) router.push("/phase3");

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <LoginUI
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      message={message}
    />
  );
}