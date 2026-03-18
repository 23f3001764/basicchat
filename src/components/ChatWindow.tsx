"use client";

import { useEffect, useState } from "react";
import {
  sendMessage,
  listenMessages,
  updateMessageStatus
} from "@/lib/chat";
import MessageBubble from "./MessageBubble";
import UserSearch from "./UserSearch";

export default function ChatWindow({ user }: any) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  // 🔁 REALTIME LISTENER + STATUS UPDATE
  useEffect(() => {
    if (!selectedUser) return;

    const unsubscribe = listenMessages(
      user.id,
      selectedUser.id,
      async (msgs: any[]) => {
        setMessages(msgs);

        // ✅ Mark messages as SEEN
        msgs.forEach((msg) => {
          if (
            msg.receiverId === user.id &&
            msg.status === "sent"
          ) {
            updateMessageStatus(msg.id, "seen");
          }
        });
      }
    );

    return () => unsubscribe();
  }, [selectedUser]);

  // 📤 SEND MESSAGE
  const handleSend = async () => {
    if (!text.trim()) return;

    const msg = {
      text,
      senderId: user.id,
      receiverId: selectedUser.id,
      participants: [user.id, selectedUser.id],
      timestamp: Date.now(),
      status: "sent",
    };

    await sendMessage(msg);
    setText("");
  };

  return (
    <div className="h-screen flex items-center justify-center">

      <div className="w-[900px] h-[550px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl flex overflow-hidden">

        {/* LEFT: USERS */}
        <div className="w-1/3 border-r border-white/20 p-3">
          <UserSearch
            onSelectUser={setSelectedUser}
            currentUser={user}
          />
        </div>

        {/* RIGHT: CHAT */}
        <div className="w-2/3 flex flex-col">

          {/* HEADER */}
          <div className="p-3 border-b border-white/20 text-white">
            {selectedUser ? selectedUser.username : "Select a user"}
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3">
            {messages.map((msg, i) => (
              <MessageBubble key={msg.id || i} msg={msg} currentUser={user} />
            ))}
          </div>

          {/* INPUT */}
          {selectedUser && (
            <div className="flex p-3 gap-2 border-t border-white/20">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 p-2 rounded bg-white/20 text-white"
                placeholder="Type message..."
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 px-4 rounded text-white"
              >
                Send
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}