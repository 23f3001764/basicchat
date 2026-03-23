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
      "AI","Climate","Science","Technology","Policy",
      "Innovation","Startups","Energy","Research"
    ]
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    keywords: [
      "AI","Gadgets","Apps","Big Tech","Google",
      "Apple","Meta","VR","AR","Software","Internet"
    ]
  },
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    keywords: [
      "AI","Machine Learning","Deep Learning","Robotics",
      "Biotech","Climate Tech","Quantum","Research","Innovation"
    ]
  }
];

export default function AIInsights() {
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleKeyword = (kw: string) => {
    setError("");

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
    setData(null);

    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: selectedKeywords, // ✅ FIXED
          source: selectedSource.url,
        }),
      });

      const result = await res.json();

      console.log("RAW GEMINI:", result);

      if (result.error === "RATE_LIMIT") {
        setError("⚠️ API limit reached. Try later.");
        setLoading(false);
        return;
      }

      if (result.error === "INVALID_INPUT") {
        setError("⚠️ Invalid input sent.");
        setLoading(false);
        return;
      }

      if (!result.raw) {
        setError("⚠️ No response from AI.");
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(result.raw);

      // ✅ DEDUP SAFETY
      const unique = [];
      const titles = new Set();

      parsed.articles.forEach((a: any) => {
        if (!titles.has(a.title)) {
          titles.add(a.title);
          unique.push(a);
        }
      });

      setData({ articles: unique });

    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black/40 backdrop-blur-sm text-white p-6">

      <h1 className="text-3xl font-bold mb-6">🤖 AI Insights</h1>

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

      <button
        onClick={handleFetch}
        className="mt-6 px-4 py-2 bg-purple-600 rounded-xl"
      >
        {loading ? "Generating..." : "Get AI Insights"}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-xl">
          {error}
        </div>
      )}

      {data && (
        <div className="mt-8 space-y-8">
          {data.articles.map((a: any, i: number) => (
            <div
              key={i}
              className="p-6 rounded-2xl backdrop-blur-3xl bg-black/40 border border-white/10 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-2">{a.title}</h2>

              <p className="text-white/90">{a.summary}</p>

              <div className="mt-6 flex justify-center bg-white/90 p-4 rounded-xl">
                <div
                  className="w-[250px] md:w-[300px]"
                  dangerouslySetInnerHTML={{ __html: a.svg }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}