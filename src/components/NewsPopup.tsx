"use client";

import { useEffect, useState, useRef } from "react";
import { listenToNews } from "@/lib/news";

export default function NewsPopup() {
  const [queue, setQueue] = useState<any[]>([]);
  const [current, setCurrent] = useState<any | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // 🔥 prevent double execution
    if (initialized.current) return;
    initialized.current = true;

    let unsubscribe: any;

    const init = async () => {
      // ✅ global news (no user filter)
      unsubscribe = await listenToNews("", (news) => {
        // 🔥 ignore empty overwrite
        if (!news || news.length === 0) return;

        console.log("🔔 POPUP NEWS:", news);

        setQueue((prev) => [...news.slice(0, 1), ...prev]);
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((q) => q.slice(1));

      const timer = setTimeout(() => {
        setCurrent(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [queue, current]);

  if (!current) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white/20 backdrop-blur-lg p-4 rounded-xl w-72 shadow-xl border border-white/10">
      <h4 className="text-sm font-bold">{current.title}</h4>
      <p className="text-xs opacity-70">{current.category}</p>
    </div>
  );
}