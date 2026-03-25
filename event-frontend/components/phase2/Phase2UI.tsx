"use client";

import LoadingScreen   from "./LoadingScreen";
import LoginScreen     from "./LoginScreen";
import Phase2Dashboard from "./Phase2Dashboard";

export default function Phase2UI({
  checkingAuth,
  isAllowed,
  form,
  message,
  loading,
  progress,
  answers,
  handleChange,
  handleLogin,
  handleAnswerChange,
  handleSubmit,
}: any) {

  // 1. Still checking auth
  if (checkingAuth) {
    return <LoadingScreen />;
  }

  // 2. Not allowed — show login
  if (!isAllowed) {
    return (
      <LoginScreen
        form={form}
        loading={loading}
        message={message}
        handleChange={handleChange}
        handleLogin={handleLogin}
      />
    );
  }

  // 3. Allowed — show the game
  return (
    <Phase2Dashboard
      message={message}
      progress={progress}
      answers={answers}
      handleAnswerChange={handleAnswerChange}
      handleSubmit={handleSubmit}
    />
  );
}