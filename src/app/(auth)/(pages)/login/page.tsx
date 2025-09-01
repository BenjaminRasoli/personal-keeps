"use client";
import { useState } from "react";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-72 flex-col items-center gap-4 rounded bg-white p-6 shadow-2xl">
        <h1 className="text-2xl font-bold text-gray-800">Login</h1>
        <form className="flex w-full flex-col gap-3 " onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="email"
            className="rounded border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
