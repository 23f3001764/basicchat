import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const keywords = body?.keywords;
    const source = body?.source;

    // ✅ FIX: strict validation
    if (
      !keywords ||
      !Array.isArray(keywords) ||
      keywords.length === 0 ||
      !source
    ) {
      return NextResponse.json({
        error: "INVALID_INPUT",
        message: "keywords[] and source required",
      });
    }

    const feed = await parser.parseURL(source);

    // 🔥 CLEAN + LIMIT
    const articles = feed.items.slice(0, 10).map((item) => ({
      title: item.title || "",
      description: (item.contentSnippet || "").slice(0, 200),
    }));

    // 🔥 FILTER USING ALL KEYWORDS
    const filtered = articles.filter((a) =>
      keywords.some((kw: string) =>
        (a.title + " " + a.description)
          .toLowerCase()
          .includes(kw.toLowerCase())
      )
    );

    // 🔥 LIMIT HARD
    const finalArticles =
      filtered.length > 0
        ? filtered.slice(0, 4)
        : articles.slice(0, 4);

    const keywordText = keywords.join(" ").toLowerCase();

    let svgHint = "";

    if (keywordText.includes("robot")) {
      svgHint =
        "Draw a clean robot diagram with labeled parts (head, arms, sensors).";
    } else if (
      keywordText.includes("ai") ||
      keywordText.includes("chip") ||
      keywordText.includes("tech")
    ) {
      svgHint =
        "Draw a line chart or chip diagram with axes and labels.";
    } else if (keywordText.includes("finance")) {
      svgHint = "Draw a financial growth chart.";
    } else if (keywordText.includes("climate")) {
      svgHint = "Draw an environmental trend graph.";
    }

    const prompt = `
Keywords: ${keywords.join(", ")}

Articles:
${finalArticles
  .map((a, i) => `${i + 1}. ${a.title} - ${a.description}`)
  .join("\n")}

Task:
- Select ONLY 2 BEST UNIQUE articles
- DO NOT repeat or duplicate articles

For each:
- title
- summary (60–100 words)
- SVG

SVG RULES:
- width="300" height="300"
- centered
- clean design

${svgHint}

Return ONLY JSON:
{
  "articles": [
    {
      "title": "",
      "summary": "",
      "svg": ""
    }
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    console.log("FULL GEMINI RESPONSE:", data);

    // 🚨 RATE LIMIT
    if (data?.error?.code === 429) {
      return NextResponse.json({
        error: "RATE_LIMIT",
        message: data.error.message,
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return NextResponse.json({ error: "NO_AI_RESPONSE" });
    }

    // 🔥 CLEAN JSON
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return NextResponse.json({ raw: cleanText });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}