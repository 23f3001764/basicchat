"use client";

import { useState } from "react";
import UserSearch from "./UserSearch";
import ChatWindow from "./ChatWindow";

export default function ChatDashboard({ onClose, user }: any) {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      {/* MAIN GLASS CONTAINER */}
      <div className="relative w-[900px] h-[550px] flex rounded-2xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-red-400 text-xl hover:scale-110"
        >
          ✖
        </button>

        {/* LEFT PANEL */}
        <div className="w-[30%] border-r border-white/20 p-4">
          <UserSearch
            onSelectUser={setSelectedUser}
            currentUser={user}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[70%] flex flex-col">
          {selectedUser ? (
            <ChatWindow user={user} selectedUser={selectedUser} />
          ) : (
            <div className="flex items-center justify-center h-full text-white/60">
              Select a user to start chatting
            </div>
          )}
        </div>

      </div>
    </div>
  );
}