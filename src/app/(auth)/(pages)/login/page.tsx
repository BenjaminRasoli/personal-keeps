"use client";
import { auth } from "@/app/config/FireBaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg bg-surface p-8 m-5 shadow-xl">
        <h1 className="text-3xl font-bold text-text">Welcome Back</h1>
        <p className="text-muted text-sm text-center">
          Sign in to your account to continue
        </p>

        <form
          noValidate
          className="flex w-full flex-col gap-4"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="rounded bg-danger/20 p-2 text-danger text-sm text-center">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            className="rounded border border-muted px-4 py-2 focus:border-black focus:ring outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="rounded border border-muted px-4 py-2 focus:border-black focus:ring outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="rounded bg-black py-2 text-surface font-semibold shadow hover:opacity-80 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
