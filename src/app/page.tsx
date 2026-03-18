"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/GlassCard";
import UserSetup from "@/components/UserSetup";
import ChatWindow from "@/components/ChatWindow";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
  {!user ? (
    <GlassCard>
      <UserSetup onUserCreated={setUser} />
    </GlassCard>
  ) : (
    <ChatWindow user={user} />
  )}
</div>
  );
}