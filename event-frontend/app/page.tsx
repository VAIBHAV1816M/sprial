"use client";

import { useRouter } from "next/navigation";
import HomeUI from "@/components/home/HomeUI";

export default function Home() {

  const router = useRouter();

  const handleRegister = () => {
    router.push("/register");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <HomeUI 
      onRegister={handleRegister}
      onLogin={handleLogin}
    />
  );
}