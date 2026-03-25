"use client";

import { useState, useEffect } from "react";
import ChatDashboard from "@/components/Chat/ChatDashboard";
import { useRouter } from "next/navigation";

export default function Home() {
  const [open, setOpen] = useState(false);
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

        {!user && (
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
        )}

        {user && (
          <button
            className="bg-red-500 px-4 py-2 rounded"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>

      {/* MAIN CENTER CONTENT */}
      <div className="flex flex-col items-center justify-center gap-6">

        {/* TITLE */}
        <h1 className="text-5xl font-bold hover:scale-110 transition">
          STEAMI
        </h1>

        {/* CHAT BUTTON */}
        {user && (
          <button
            className="fixed bottom-6 right-96 text-3xl z-50"
            onClick={() => setOpen(true)}
          >
            💬
          </button>
        )}

        {/* AI BUTTON */}
        {user && (
          <button
            className="fixed bottom-20 right-96 text-sm bg-purple-600 px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition z-50"
            onClick={() => router.push("/ai-insights")}
          >
            🤖 AI Insights
          </button>
        )}
      </div>

      {/* CHAT DASHBOARD */}
      {open && user && (
        <ChatDashboard onClose={() => setOpen(false)} user={user} />
      )}
    </div>
  );
}