"use client";

import { useState } from "react";
import { createUser } from "@/lib/user";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid"; // ✅ CORRECT PLACE

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();

  const generateAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };

  const handleSignup = async () => {
    if (!username || !password || !avatar) {
      return alert("Fill all fields");
    }

    const user = {
      id: uuidv4(), // ✅ ID FIX
      username,
      password,
      avatar,
    };

    await createUser(user);

    localStorage.setItem("user", JSON.stringify(user));

    router.push("/");
  };

  return (
    <div className="glass p-6 w-80 flex flex-col gap-4 text-white">

      <h2 className="text-xl text-center">Signup</h2>

      <input
        placeholder="Username"
        className="p-2 w-full rounded bg-white/10 border border-white/30 text-white placeholder-gray-300"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="p-2 w-full rounded bg-white/10 border border-white/30 text-white placeholder-gray-300"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={generateAvatar} className="bg-white/20 py-2 rounded">
        Generate Avatar
      </button>

      {avatar && (
        <img src={avatar} className="w-16 h-16 mx-auto rounded-full" />
      )}

      <button onClick={handleSignup} className="bg-blue-500 py-2 rounded">
        Signup
      </button>

      <p className="text-center text-sm">
        Already have an account?
        <span
          className="text-blue-400 cursor-pointer ml-1"
          onClick={() => router.push("/login")}
        >
          Login
        </span>
      </p>

    </div>
  );
}