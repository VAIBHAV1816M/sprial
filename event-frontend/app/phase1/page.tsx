"use client";

import { useState, useEffect } from "react";
import API from "../../services/api";
import { getToken, saveToken } from "../../utils/auth";
import Phase1UI from "../../components/phase1/Phase1UI";

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
  const [answers, setAnswers] = useState<any>({});
  const [wrongSignal, setWrongSignal] = useState<Record<string, number>>({});

  // ✅ UPDATED: Added imageUrl to Clue 4 while keeping IDs consistent with your logic
  const clues = [
    { id: "clue1", question: "Enter the first decrypted sequence found in the terminal logs." },
    { id: "clue2", question: "Identify the protocol used to bypass the initial firewall layer." },
    { id: "clue3", question: "What is the secondary access key hidden within the source code?" },
    { 
      id: "clue4", 
      question: "“Stop staring at the whole… pick the right fragment.”", 
      imageUrl: "/images/clue4_visual.png" 
    },
    { id: "clue5", question: "Final validation: Enter the master override string to complete Phase 1." }
  ];

  // ✅ UPDATED LOGIC (controlled access)
  useEffect(() => {

  const token = getToken();
  const entry = localStorage.getItem("entry"); // 🔥 same as phase3
  const inside = sessionStorage.getItem("insidePhase1"); // 🔥 new

  if (token) {

    const fetchData = async () => {
      try {
        const res = await API.get("/phase/phase1");

        if (entry === "home" || inside === "true") {

          setIsAllowed(true);
          setSolved(res.data.cluesSolved || {});
          setAnswers(res.data.cluesAnswers || {});
          setMessage("");

          // ✅ mark user inside phase
          sessionStorage.setItem("insidePhase1", "true");

          // ✅ clear entry flag
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

if (phase === 1) {
  setIsAllowed(true);
  setMessage("");

  sessionStorage.setItem("insidePhase1", "true"); // ✅ IMPORTANT

  const data = await API.get("/phase/phase1");

  setSolved(data.data.cluesSolved || {});
  setAnswers(data.data.cluesAnswers || {});
}

      else if (phase === 2 || phase === 3) {
        setMessage("You have already completed Phase 1.");
        setIsAllowed(false); // ✅ ADDED
      }

    } catch (err:any) {
      setMessage(
        err.response?.data?.message || "Login failed"
      );
    }

    setLoading(false);
  };

  const handleAnswerChange = (clueId:string, value:string) => {
    setAnswers({
      ...answers,
      [clueId]: value
    });
  };

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

      setAnswers((prev:any) => ({
        ...prev,
        [clueId]: answers[clueId]
      }));

    } catch (err:any) {
      setMessage(err.response?.data?.message || "Error");

      setWrongSignal((prev) => ({
        ...prev,
        [clueId]: Date.now()
      }));
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

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

  return (
    <Phase1UI
      clues={clues}
      solved={solved}
      answers={answers}
      wrongSignal={wrongSignal}
      onAnswerChange={handleAnswerChange}
      onSubmit={handleSubmit}
      message={message}
    />
  );
}
