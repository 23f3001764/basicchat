import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

export async function POST(req: NextRequest) {
  try {
    const { keywords, source } = await req.json();

    if (!keywords || !source) {
      return NextResponse.json({ error: "INVALID_INPUT" });
    }

    const feed = await parser.parseURL(source);

    // 🔥 STEP 1: CLEAN + LIMIT INPUT
    const articles = feed.items.slice(0, 12).map((item) => ({
      title: item.title || "",
      description: (item.contentSnippet || "").slice(0, 200),
    }));

    // 🔥 STEP 2: FILTER USING ALL KEYWORDS
    const filtered = articles.filter((a) =>
      keywords.some((kw: string) =>
        (a.title + " " + a.description)
          .toLowerCase()
          .includes(kw.toLowerCase())
      )
    );

    // 🔥 STEP 3: HARD LIMIT (MAX 4 ARTICLES → still cheap)
    const finalArticles =
      filtered.length > 0
        ? filtered.slice(0, 4)
        : articles.slice(0, 4);

    // 🔥 DYNAMIC SVG LOGIC
    const keywordText = keywords.join(" ").toLowerCase();

    let svgHint = "";

    if (keywordText.includes("robot")) {
      svgHint =
        "Draw a clean robot diagram with labeled parts (head, sensors, arms).";
    } else if (
      keywordText.includes("ai") ||
      keywordText.includes("chip") ||
      keywordText.includes("tech")
    ) {
      svgHint =
        "Draw a line chart or chip architecture diagram with axes and labels.";
    } else if (keywordText.includes("finance")) {
      svgHint = "Draw a financial growth chart (bar or line graph).";
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
- Select ONLY 2 BEST UNIQUE articles relevant to ANY keyword
- DO NOT repeat articles
- DO NOT return similar titles

For each:
- title
- summary (60–100 words)
- SVG visualization

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

STRICT:
- No markdown
- No explanation
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

    // 🚨 HANDLE RATE LIMIT
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

    // 🔥 CLEAN MARKDOWN JUST IN CASE
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