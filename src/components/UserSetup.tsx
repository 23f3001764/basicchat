"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { saveUserToDB } from "@/lib/user";

export default function UserSetup({ onUserCreated }: any) {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const generateAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setAvatar(url);
  };

  const createUser = async () => {
  const user = {
    id: uuidv4(),
    username,
    avatar,
  };

  localStorage.setItem("user", JSON.stringify(user));

  await saveUserToDB(user);

  onUserCreated(user);
  };

  return (
  <div className="flex flex-col gap-4 items-center">

  <input
    placeholder="Enter username"
    className="p-2 w-full rounded bg-white/20 text-white text-center"
    onChange={(e) => setUsername(e.target.value)}
  />

  <button className="bg-white/20 px-4 py-2 rounded" onClick={generateAvatar}>
    Generate Avatar
  </button>

  {avatar && (
    <img src={avatar} className="w-24 h-24 rounded-full" />
  )}

  <button
    className="bg-blue-500 px-4 py-2 rounded text-white"
    onClick={createUser}
  >
    Create User
  </button>

  </div>
  );
}