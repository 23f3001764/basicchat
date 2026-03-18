"use client";

export default function MessageBubble({ msg, currentUser }: any) {
  const isMe = msg.senderId === currentUser.id;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-2 m-1 rounded-lg max-w-[60%] ${
          isMe
            ? "bg-blue-500 text-white"
            : "bg-white/20 text-white"
        }`}
      >
        <p>{msg.text}</p>

        {/* ✅ STATUS TICKS */}
        {isMe && (
          <div className="text-xs mt-1 text-right">
            {msg.status === "sent" && "✓"}
            {msg.status === "seen" && "✓✓"}
          </div>
        )}
      </div>
    </div>
  );
}