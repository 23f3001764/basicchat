"use client";

import { useState } from "react";

const sources = [
  {
    name: "BBC Tech",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    keywords: [
      "AI","Robotics","Technology","Innovation","Cybersecurity",
      "Climate","Energy","Startups","Science"
    ]
  },
  {
    name: "NYTimes Tech",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    keywords: [
      "AI","Climate","Science","Tech","Energy","Policy"
    ]
  }
];

export default function AIInsights() {
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleKeyword = (kw: string) => {
    if (selectedKeywords.includes(kw)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== kw));
    } else if (selectedKeywords.length < 2) {
      setSelectedKeywords([...selectedKeywords, kw]);
    }
  };

  const handleFetch = async () => {
    if (!selectedSource || selectedKeywords.length === 0) return;

    setLoading(true);
    setError("");
    setData([]);

    const results: any[] = [];

    for (const keyword of selectedKeywords) {
      try {
        const res = await fetch("/api/ai-insights", {
          method: "POST",
          body: JSON.stringify({
            keyword,
            source: selectedSource.url,
          }),
        });

        const result = await res.json();

        console.log("RAW GEMINI:", result);

        // 🚨 HANDLE RATE LIMIT
        if (result.error === "RATE_LIMIT") {
          setError("⚠️ API limit reached. Please try again after some time.");
          setLoading(false);
          return;
        }

        if (!result.raw) continue;

        let cleanText = result.raw
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        try {
          const parsed = JSON.parse(cleanText);
          results.push(parsed);
        } catch (e) {
          console.error("JSON Parse Error:", cleanText);
        }
      } catch (err) {
        console.error("Request Error:", err);
      }
    }

    setData(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black/40 backdrop-blur-sm text-white p-6">

      <h1 className="text-3xl font-bold mb-6">🤖 AI Insights</h1>

      {/* SOURCE */}
      <select
        className="p-2 text-black rounded w-full"
        onChange={(e) =>
          setSelectedSource(
            sources.find(s => s.name === e.target.value)
          )
        }
      >
        <option>Select Source</option>
        {sources.map(s => (
          <option key={s.name}>{s.name}</option>
        ))}
      </select>

      {/* KEYWORDS */}
      {selectedSource && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedSource.keywords.map((kw: string) => (
            <button
              key={kw}
              onClick={() => toggleKeyword(kw)}
              className={`px-3 py-1 rounded-full ${
                selectedKeywords.includes(kw)
                  ? "bg-blue-500"
                  : "bg-white/20"
              }`}
            >
              {kw}
            </button>
          ))}
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleFetch}
        className="mt-6 px-4 py-2 bg-purple-600 rounded-xl"
      >
        {loading ? "Generating..." : "Get AI Insights"}
      </button>

      {/* ERROR */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-xl">
          {error}
        </div>
      )}

      {/* RESULTS */}
      <div className="mt-8 space-y-8">
        {data.map((res, i) =>
          res.articles?.map((a: any, j: number) => (
            <div
              key={`${i}-${j}`}
              className="p-6 rounded-2xl backdrop-blur-3xl bg-black/40 border border-white/10 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-2">{a.title}</h2>

              <p className="text-white/90 leading-relaxed">
                {a.summary}
              </p>

              {/* SVG */}
              <div className="mt-6 flex justify-center items-center bg-white/90 p-4 rounded-xl">
                <div
                  className="w-[250px] md:w-[300px]"
                  dangerouslySetInnerHTML={{ __html: a.svg }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}