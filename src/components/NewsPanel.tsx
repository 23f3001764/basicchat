"use client";

import { useEffect, useState } from "react";
import AIModal from "@/components/AIModal";
import {
  getStoredNews,
  saveNews,
  getAIInsight,
  saveAIInsight,
} from "@/lib/firestoreNews";

// ✅ PROPER TYPES
interface NewsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function NewsPanel({ open, onClose }: NewsPanelProps) {
  const [news, setNews] = useState<any[]>([]);
  const [aiData, setAiData] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // ============================
  // LOAD NEWS ONLY WHEN OPEN
  // ============================
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      let stored = await getStoredNews();

      if (stored.length === 0) {
        const res = await fetch("/api/fetch-news");
        const data = await res.json();

        await saveNews(data.articles);
        stored = await getStoredNews();
      }

      setNews(stored);
    };

    load();
  }, [open]);

  // ============================
  // AI HANDLER
  // ============================
  const handleAI = async (item: any) => {
    setLoadingId(item.id);

    const existing = await getAIInsight(item.id);

    if (existing) {
      setAiData({
        articles: [{ summary: existing.summary, svg: existing.svg }],
      });
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
            description: item.description,
          },
        }),
      });

      const result = await res.json();
      const parsed = JSON.parse(result.raw);
      const ai = parsed.articles[0];

      await saveAIInsight({
        articleId: item.id,
        summary: ai.summary,
        svg: ai.svg,
      });

      setAiData(parsed);
    } catch (err) {
      console.error(err);
    }

    setLoadingId(null);
  };

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* SLIDING PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] bg-white/10 backdrop-blur-xl border-l border-white/20 z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">📰 News</h2>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
          {news.map((item) => (
            <div key={item.id} className="mb-4 p-3 bg-white/10 rounded-xl">
              <h3 className="text-sm">{item.title}</h3>

              <button
                onClick={() => handleAI(item)}
                className="mt-2 bg-purple-600 px-2 py-1 rounded"
              >
                {loadingId === item.id ? "..." : "🤖 AI"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <AIModal data={aiData} onClose={() => setAiData(null)} />
    </>
  );
}