"use client";

import { useState, useEffect } from "react";
import API from "../../services/api";
import { getToken, saveToken } from "../../utils/auth";
import Phase1UI from "@/components/phase1/Phase1UI";

export default function Phase1() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [solved, setSolved] = useState<any>({});
  const [answers, setAnswers] = useState<any>({}); // ⭐ IMPORTANT

  const clues = [
    { id: "clue1", question: "Clue 1 question here" },
    { id: "clue2", question: "Clue 2 question here" },
    { id: "clue3", question: "Clue 3 question here" },
    { id: "clue4", question: "Clue 4 question here" },
    { id: "clue5", question: "Clue 5 question here" }
  ];

  /*
  🔥 AUTO LOGIN
  */
  useEffect(() => {

    const token = getToken();

    if (token) {

      const fetchData = async () => {

        try {

          const res = await API.get("/phase/phase1");

          setIsAllowed(true);
          setSolved(res.data.cluesSolved || {});
          setAnswers(res.data.cluesAnswers || {}); // ⭐ ADDED

          setMessage("");

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

  // Handle login input
  const handleChange = (e:any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /*
  🔐 LOGIN HANDLER
  */
  const handleLogin = async (e:any) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post("/auth/login", form);

      const token = res.data.token;
      const phase = res.data.currentPhase;

      saveToken(token);

      if (phase === 1) {

        setIsAllowed(true);
        setMessage("");

        const data = await API.get("/phase/phase1");

        setSolved(data.data.cluesSolved || {});
        setAnswers(data.data.cluesAnswers || {}); // ⭐ ADDED

      }

      else if (phase === 2 || phase === 3) {

        setMessage("You have already completed Phase 1.");

      }

    } catch (err:any) {

      setMessage(
        err.response?.data?.message || "Login failed"
      );

    }

    setLoading(false);

  };

  // Handle input
  const handleAnswerChange = (clueId:string, value:string) => {

    setAnswers({
      ...answers,
      [clueId]: value
    });

  };

  // Submit answer
  const handleSubmit = async (clueId:string) => {

    try {

      const res = await API.post("/phase/phase1/answer", {
        clueId,
        answer: answers[clueId]
      });

      setMessage(res.data.message);

      if (res.data.phase1Token) {

        localStorage.setItem("verifyPhase", "1");
        window.location.href = "/verify";
        return;

      }

      setSolved(res.data.cluesSolved || {});

      // ⭐ keep answer after submit
      setAnswers((prev:any) => ({
        ...prev,
        [clueId]: answers[clueId]
      }));

    } catch (err:any) {

      setMessage(err.response?.data?.message || "Error");

    }

  };

  /*
  ---------------- UI ----------------
  */

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // 🔴 LOGIN UI
  if (!isAllowed) {

    return (

      <div className="flex justify-center items-center h-screen">

        <div className="w-[400px] p-8 border rounded-lg shadow-lg">

          <h1 className="text-2xl font-bold mb-6 text-center">
            Phase 1 Login
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <input
              name="email"
              type="email"
              placeholder="Email"
              className="border p-2 rounded"
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="border p-2 rounded"
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="bg-black text-white p-2 rounded"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {message && (
            <p className="mt-4 text-center text-red-500">
              {message}
            </p>
          )}

        </div>

      </div>

    );

  }

  // ✅ SHOW CLUES

  return (
  <Phase1UI
    clues={clues}
    solved={solved}
    answers={answers}
    onAnswerChange={handleAnswerChange}
    onSubmit={handleSubmit}
    message={message}
  />
);

}