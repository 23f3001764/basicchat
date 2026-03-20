"use client";

import { useState } from "react";
import { loginUser } from "@/lib/user";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const user = await loginUser(username, password);

    if (!user) return alert("Invalid credentials");

    localStorage.setItem("user", JSON.stringify(user));
    router.push("/");
  };

  return (
    <div className="glass p-6 w-80 flex flex-col gap-4 text-white">

      <h2 className="text-xl text-center">Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 w-full rounded bg-white/20 text-white placeholder-gray-300 outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 w-full rounded bg-white/20 text-white placeholder-gray-300 outline-none"
      />

      <button onClick={handleLogin} className="bg-blue-500 py-2 rounded">
        Login
      </button>

      {/* 🔥 SWITCH TO SIGNUP */}
      <p className="text-center text-sm">
        Don’t have an account?
        <span
          className="text-blue-400 cursor-pointer ml-1"
          onClick={() => router.push("/signup")}
        >
          Signup
        </span>
      </p>

    </div>
  );
}