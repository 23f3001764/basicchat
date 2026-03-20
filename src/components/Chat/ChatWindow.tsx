"use client";

import { useState } from "react";
import { sendMessage, listenMessages } from "@/lib/chat";
import MessageBubble from "./MessageBubble";
import { useEffect } from "react";

export default function ChatWindow({ user, selectedUser }: any) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = listenMessages(user.id, selectedUser.id, setMessages);
    return () => unsubscribe && unsubscribe();
  }, [selectedUser]);

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage({
      text,
      senderId: user.id,
      receiverId: selectedUser.id,
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-full text-white">

      {/* HEADER */}
      <div className="p-3 border-b border-white/20 font-semibold">
        {selectedUser.username}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} currentUser={user} />
        ))}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-white/20 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 p-2 rounded bg-white/10 border border-white/20 text-white placeholder-gray-300"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 px-4 rounded"
        >
          Send
        </button>
      </div>

    </div>
  );
}