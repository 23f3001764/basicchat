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
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
  u.username?.toLowerCase().includes(query.toLowerCase()) &&
  u.id !== currentUser.id   // ✅ REMOVE SELF
  );

  return (
    <div>
      <input
        placeholder="Search user"
        className="p-2 w-full rounded bg-white/20 text-white"
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="mt-2 space-y-2">
        {filtered.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="flex items-center gap-2 p-2 cursor-pointer hover:bg-white/20 rounded"
          >
            <img
              src={user.avatar}
              className="w-8 h-8 rounded-full"
            />
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}