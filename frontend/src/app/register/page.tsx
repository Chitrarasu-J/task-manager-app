"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          Create Account
        </h1>

        <form onSubmit={handleRegister}>
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-sm mt-6 text-center">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-indigo-600 cursor-pointer font-semibold hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
