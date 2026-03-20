"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { saveUserToDB } from "@/lib/user";

export default function UserSetup({ onUserCreated }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  // ✅ Generate avatar
  const generateAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };

  // ✅ Handle signup
  const handleSignup = async () => {
    if (!username || !password || !avatar) {
      alert("Fill all fields + generate avatar");
      return;
    }

    const user = {
      id: uuidv4(),
      username,
      password,
      avatar,
    };

    // ✅ Save locally
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ Save to Firebase
    await saveUserToDB(user);

    // ✅ Redirect / callback
    onUserCreated(user);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-[350px] border border-white/20 shadow-xl">
      
      <h2 className="text-xl font-bold text-white">Create Account</h2>

      {/* Username */}
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 rounded bg-white/20 text-white placeholder-gray-300 outline-none"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 rounded bg-white/20 text-white placeholder-gray-300 outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Avatar */}
      <button
        onClick={generateAvatar}
        className="bg-blue-500 px-4 py-2 rounded text-white"
      >
        Generate Avatar
      </button>

      {avatar && (
        <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full" />
      )}

      {/* Signup */}
      <button
        onClick={handleSignup}
        className="bg-green-500 px-4 py-2 rounded text-white w-full"
      >
        Sign Up
      </button>
    </div>
  );
}
