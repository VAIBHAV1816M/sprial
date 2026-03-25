"use client";

import { useState, useEffect } from "react";
import API from "../../services/api";
import { saveToken, getToken } from "../../utils/auth";
import Phase2UI from "@/components/phase2/Phase2UI";

export default function Phase2() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [progress, setProgress] = useState<any>({});
  const [answers, setAnswers] = useState<any>({});

  useEffect(() => {

    const token = getToken();
    const entry = localStorage.getItem("entry");
    const inside = sessionStorage.getItem("insidePhase2");

    if (token) {

      const fetchData = async () => {

        try {

          const res = await API.get("/phase/phase2");

          if (entry === "home" || inside === "true") {

            setIsAllowed(true);
            setProgress(res.data.cluesSolved || {});
            setAnswers(res.data.cluesAnswers || {});
            setMessage("");

            sessionStorage.setItem("insidePhase2", "true");
            localStorage.removeItem("entry");

          } else {
            setIsAllowed(false);
          }

        } catch {
          setIsAllowed(false);
        } finally {
          setCheckingAuth(false);
        }

      };

      fetchData();

    } else {
      setCheckingAuth(false);
    }

  }, []);

  const handleChange = (e:any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e:any) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post("/auth/login", form);

      const token = res.data.token;
      const phase = res.data.currentPhase;

      saveToken(token);

      if (phase === 2) {

        setIsAllowed(true);
        setMessage("");

        sessionStorage.setItem("insidePhase2", "true");

        const data = await API.get("/phase/phase2");

        setProgress(data.data.cluesSolved || {});
        setAnswers(data.data.cluesAnswers || {});

      }

      else if (phase === 1) {
        setMessage("Complete Phase 1 first.");
      }

      else if (phase === 3) {
        setMessage("You have already completed Phase 2.");
      }

    } catch (err:any) {
      setMessage(err.response?.data?.message || "Login failed");
    }

    setLoading(false);

  };

  const handleAnswerChange = (e:any, clueId:string) => {

    setAnswers({
      ...answers,
      [clueId]: e.target.value
    });

  };

  const handleSubmit = async (clueId:string) => {

    try {

      const res = await API.post("/phase/phase2/answer", {
        clueId,
        answer: answers[clueId]
      });

      setMessage(res.data.message);

      if (res.data.phase2Token) {
        localStorage.setItem("verifyPhase", "2");
        window.location.href = "/verify";
        return;
      }

      setProgress(res.data.cluesSolved || {});

      setAnswers((prev:any) => ({
        ...prev,
        [clueId]: answers[clueId]
      }));

    } catch (err:any) {
      setMessage(err.response?.data?.message || "Error");
    }

  };

  return (
    <Phase2UI
      checkingAuth={checkingAuth}
      isAllowed={isAllowed}
      form={form}
      message={message}
      loading={loading}
      progress={progress}
      answers={answers}
      handleChange={handleChange}
      handleLogin={handleLogin}
      handleAnswerChange={handleAnswerChange}
      handleSubmit={handleSubmit}
    />
  );

}