import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

export async function POST(req: NextRequest) {
  try {
    const { keyword, source } = await req.json();

    const feed = await parser.parseURL(source);

    // 🔥 STEP 1: CLEAN + LIMIT INPUT
    const articles = feed.items.slice(0, 10).map((item) => ({
      title: item.title,
      description: (item.contentSnippet || "").slice(0, 200),
    }));

    // 🔥 STEP 2: FILTER BY KEYWORD
    const filtered = articles.filter((a) =>
      (a.title + " " + a.description)
        .toLowerCase()
        .includes(keyword.toLowerCase())
    );

    // 🔥 STEP 3: HARD LIMIT (MAX 2 ARTICLES)
    const finalArticles =
      filtered.length > 0
        ? filtered.slice(0, 2)
        : articles.slice(0, 2);

    // 🔥 DYNAMIC SVG LOGIC
    const keywordLower = keyword.toLowerCase();

    let svgHint = "";

    if (keywordLower.includes("robot")) {
      svgHint =
        "Draw a clean robot diagram with labeled parts (head, sensors, arms).";
    } else if (
      keywordLower.includes("ai") ||
      keywordLower.includes("chip") ||
      keywordLower.includes("tech")
    ) {
      svgHint =
        "Draw a line chart or chip architecture diagram with axes and labels.";
    } else if (keywordLower.includes("finance")) {
      svgHint = "Draw a financial growth chart (bar or line graph).";
    } else if (keywordLower.includes("climate")) {
      svgHint = "Draw an environmental trend graph.";
    }

    const prompt = `
Keyword: ${keyword}

Articles:
${finalArticles
  .map((a, i) => `${i + 1}. ${a.title} - ${a.description}`)
  .join("\n")}

Task:
1. Select top 2 most relevant articles
2. For each:
   - Generate a 60–100 word summary
   - Generate a PROFESSIONAL SVG visualization

SVG RULES:
- width="300" height="300"
- centered
- minimal colors (2–4)
- clean modern design
- include labels if graph

${svgHint}

Return ONLY valid JSON:
{
  "articles": [
    {
      "title": "",
      "summary": "",
      "svg": ""
    }
  ]
}

NO markdown
NO explanation
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

    // 🚨 RATE LIMIT HANDLING
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

    return NextResponse.json({ raw: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}