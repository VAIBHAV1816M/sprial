"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";
import RegisterUI from "@/components/auth/RegisterUI";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

      await API.post("/auth/register", form);

      setMessage("Registration successful!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <RegisterUI
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      message={message}
    />
  );
}