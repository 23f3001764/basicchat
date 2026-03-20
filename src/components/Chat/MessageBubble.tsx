export default function MessageBubble({ msg, isOwn }: any) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-3 py-2 rounded-lg max-w-[60%] ${
          isOwn
            ? "bg-blue-500 text-white"
            : "bg-gray-300 text-black"
        }`}
      >
        <div>{msg.text}</div>

        {isOwn && (
          <div className="text-xs mt-1 text-right opacity-70">
            {msg.status === "seen" ? "✓✓" : "✓"}
          </div>
        )}
      </div>
    </div>
  );
}