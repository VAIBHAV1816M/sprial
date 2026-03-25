"use client";

import { useState, useEffect } from "react";
import API from "../../services/api";
import { saveToken, getToken } from "../../utils/auth";

export default function Phase3() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [progress, setProgress] = useState<any>({});
  const [answers, setAnswers] = useState<any>({}); // ⭐ IMPORTANT

  useEffect(() => {

    const token = getToken();
    const entry = localStorage.getItem("entry");
    const inside = sessionStorage.getItem("insidePhase3");

    if (token) {

      const fetchData = async () => {

        try {

          const res = await API.get("/phase/phase3");

          if (entry === "home" || inside === "true") {

            setIsAllowed(true);
            setProgress(res.data.cluesSolved || {});
            setAnswers(res.data.cluesAnswers || {}); // ⭐ ADDED
            setMessage("");

            sessionStorage.setItem("insidePhase3", "true");
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

      if (phase === 3) {

        setIsAllowed(true);
        setMessage("");

        sessionStorage.setItem("insidePhase3", "true");

        const data = await API.get("/phase/phase3");

        setProgress(data.data.cluesSolved || {});
        setAnswers(data.data.cluesAnswers || {}); // ⭐ ADDED

      }

      else if (phase === 1) {

        setMessage("Complete Phase 1 first.");

      }

      else if (phase === 2) {

        setMessage("Complete Phase 2 first.");

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

      const res = await API.post("/phase/phase3/answer", {
        clueId,
        answer: answers[clueId]
      });

      setMessage(res.data.message);

      if (res.data.message.includes("completed")) {

        alert("🎉 Congratulations! You have completed the event.");
        return;

      }

      setProgress(res.data.cluesSolved || {});

      // ⭐ KEEP ANSWER AFTER SUBMIT
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

  if (!isAllowed) {

    return (

      <div className="flex justify-center items-center h-screen">

        <div className="w-[400px] p-8 border rounded-lg shadow-lg">

          <h1 className="text-2xl font-bold mb-6 text-center">
            Phase 3 Login
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

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

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Phase 3
      </h1>

      {message && (
        <p className="mb-4 text-green-400">
          {message}
        </p>
      )}

      <h2>Final Clues</h2>

      {["clue1","clue2","clue3","clue4"].map((clue) => (

        <div key={clue} className="border p-4 mb-4">

          <p>{clue} question here</p>

          <input
            value={answers?.[clue] || ""} // ⭐ PREFILL
            onChange={(e)=>handleAnswerChange(e,clue)}
            className="border p-2 mr-2"
            disabled={progress?.[clue]} // ⭐ DISABLE IF SOLVED
          />

          <button
            onClick={()=>handleSubmit(clue)}
            className={`px-4 py-1 ${
              progress?.[clue] ? "bg-green-500" : "bg-black"
            } text-white`}
          >
            {progress?.[clue] ? "Solved ✓" : "Submit"}
          </button>

        </div>

      ))}

    </div>

  );

}