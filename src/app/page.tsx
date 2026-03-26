"use client";

import { useState, useEffect } from "react";
import ChatDashboard from "@/components/Chat/ChatDashboard";
import NewsPanel from "@/components/NewsPanel";
import { useRouter } from "next/navigation";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="h-full w-full flex items-center justify-center text-white relative">

      {/* TOP RIGHT BUTTONS */}
      <div className="absolute top-6 right-6 flex gap-3 z-50">
        {!user ? (
          <>
            <button
              className="bg-white/20 px-4 py-2 rounded"
              onClick={() => router.push("/login")}
            >
              Login
            </button>

            <button
              className="bg-blue-500 px-4 py-2 rounded"
              onClick={() => router.push("/signup")}
            >
              Signup
            </button>
          </>
        ) : (
          <button
            className="bg-red-500 px-4 py-2 rounded"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>

      {/* CENTER */}
      <h1 className="text-5xl font-bold">STEAMI</h1>

      {/* 🔥 GLASS CONTROL PANEL */}
      {user && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl p-3 rounded-2xl flex flex-col gap-4 shadow-xl border border-white/20 z-50">

          {/* NEWS */}
          <button onClick={() => setNewsOpen(true)}>📰</button>

          {/* CHAT */}
          <button onClick={() => setChatOpen(true)}>💬</button>

          {/* AI */}
          <button onClick={() => setAiOpen(true)}>🤖</button>

        </div>
      )}

      {/* CHAT POPUP */}
      {chatOpen && user && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center">
          <ChatDashboard onClose={() => setChatOpen(false)} user={user} />
        </div>
      )}

      {/* AI POPUP */}
      {aiOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl">
            <h2>AI Insights</h2>
            <button onClick={() => setAiOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* 🔥 SLIDE NEWS PANEL */}
      <NewsPanel open={newsOpen} onClose={() => setNewsOpen(false)} />
    </div>
  );
}