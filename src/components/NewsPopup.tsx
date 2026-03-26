"use client";

import { useEffect, useState, useRef } from "react";
import { listenToNews } from "@/lib/news";

export default function NewsPopup() {
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let unsubscribe: any;

    const init = async () => {
      unsubscribe = await listenToNews("", (news) => {
        if (!news || news.length === 0) return;

        console.log("🔔 NEWS:", news);

        setQueue(news);
        setCurrentIndex(0);
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 🔥 AUTO ROTATE NEWS
  useEffect(() => {
    if (queue.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % queue.length);
    }, 4000); // 4 sec per news

    return () => clearInterval(interval);
  }, [queue]);

  if (queue.length === 0) return null;

  const current = queue[currentIndex];

  return (
    <div className="fixed bottom-4 left-4 bg-white/20 backdrop-blur-lg p-4 rounded-xl w-72 shadow-xl border border-white/10">
      <h4 className="text-sm font-bold">{current.title}</h4>
      <p className="text-xs opacity-70">{current.category}</p>
    </div>
  );
}