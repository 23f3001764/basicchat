"use client";

import { useEffect, useState } from "react";
import { sendMessage, subscribeToMessages } from "@/lib/chat";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ selectedUser }: any) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ REALTIME LISTENER
  useEffect(() => {
    if (!selectedUser) return;

    const unsubscribe = subscribeToMessages(
      currentUser.id,
      selectedUser.id,
      setMessages
    );

    return () => unsubscribe();
  }, [selectedUser]);

  // ✅ SEND MESSAGE
  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage({
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      text,
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-full justify-between">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isOwn={msg.senderId === currentUser.id}
          />
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t border-white/20">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 p-2 rounded bg-white/20 text-white outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 px-4 py-2 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}