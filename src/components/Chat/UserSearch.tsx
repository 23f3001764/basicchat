"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/user";

type User = {
  id: string;
  username: string;
  avatar: string;
};

export default function UserSearch({ onSelectUser, currentUser }: any) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data as User[]); // ✅ now types match
    };

    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) &&
      u.id !== currentUser.id // ✅ remove self
  );

  return (
    <div className="flex flex-col gap-3 text-white">

  <input
    placeholder="Search user"
    className="p-2 rounded bg-white/10 border border-white/20 text-white placeholder-gray-300"
    onChange={(e) => setQuery(e.target.value)}
  />

  <div className="space-y-2 overflow-y-auto max-h-[400px]">
    {filtered.map((user) => (
      <div
        key={user.id}
        onClick={() => onSelectUser(user)}
        className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-white/20"
      >
        <img src={user.avatar} className="w-8 h-8 rounded-full" />
        <span>{user.username}</span>
      </div>
    ))}
  </div>

</div>
  );
}