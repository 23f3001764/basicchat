"use client";

import { useEffect, useState } from "react";
import AIModal from "@/components/AIModal";

export default function NewsPanel() {
  const [news, setNews] = useState<any[]>([]);
  const [aiData, setAiData] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 🔥 FETCH NEWS ON LOAD (LOGIN BASED)
  useEffect(() => {
    const fetchNews = async () => {
      const domains = JSON.parse(localStorage.getItem("domains") || "[]");

      console.log("USER DOMAINS:", domains);

      const res = await fetch("/api/live-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domains }),
      });

      const data = await res.json();

      console.log("FILTERED NEWS:", data.articles);

      setNews(data.articles || []);
    };

    fetchNews();
  }, []);

  // 🔥 AI HANDLER
  const handleAI = async (item: any) => {
    setLoadingId(item.id);

    const cache = JSON.parse(localStorage.getItem("aiCache") || "{}");

    if (cache[item.id]) {
      setAiData(cache[item.id]);
      setLoadingId(null);
      return;
    }

    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          article: {
            title: item.title,
            description: item.description || "",
          },
        }),
      });

      const result = await res.json();
      const parsed = JSON.parse(result.raw);

      const finalData = {
        id: item.id,
        articles: parsed.articles,
      };

      cache[item.id] = finalData;
      localStorage.setItem("aiCache", JSON.stringify(cache));

      setAiData(finalData);

    } catch (err) {
      console.error(err);
    }

    setLoadingId(null);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-4">
      <h2 className="text-xl font-bold mb-4">📰 Live News</h2>

      {news.length === 0 && (
        <p className="text-sm opacity-60">No articles found...</p>
      )}

      {news.map((item) => (
        <div
          key={item.id}
          className="mb-4 p-4 rounded-xl bg-white/10 backdrop-blur-md"
        >
          <h3 className="text-sm font-semibold">{item.title}</h3>

          <button
            onClick={() => handleAI(item)}
            className="mt-2 px-3 py-1 text-xs bg-purple-600 rounded-lg"
          >
            {loadingId === item.id ? "Generating..." : "🤖 AI Insight"}
          </button>
        </div>
      ))}

      {/* 🔥 MODAL */}
      <AIModal data={aiData} onClose={() => setAiData(null)} />
    </div>
  );
}