// src/app/api/ai-insights/route.ts

import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const keywords = body?.keywords;
    const source = body?.source;
    const article = body?.article;

    // ===============================
    // 🔥 SINGLE ARTICLE MODE (NEW)
    // ===============================
    if (article) {
      const prompt = `
Article:
${article.title} - ${article.description}

Task:
- Generate a 60–100 word summary
- Generate a clean SVG visualization

SVG RULES:
- width="300" height="300"
- clean design

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

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return NextResponse.json({ raw: cleanText });
    }

    // ===============================
    // 🔥 ORIGINAL MODE (UNCHANGED)
    // ===============================
    if (
      !keywords ||
      !Array.isArray(keywords) ||
      keywords.length === 0 ||
      !source
    ) {
      return NextResponse.json({
        error: "INVALID_INPUT",
      });
    }

    const feed = await parser.parseURL(source);

    const articles = feed.items.slice(0, 10).map((item) => ({
      title: item.title || "",
      description: (item.contentSnippet || "").slice(0, 200),
    }));

    const filtered = articles.filter((a) =>
      keywords.some((kw: string) =>
        (a.title + " " + a.description)
          .toLowerCase()
          .includes(kw.toLowerCase())
      )
    );

    const finalArticles =
      filtered.length > 0
        ? filtered.slice(0, 4)
        : articles.slice(0, 4);

    const prompt = `
Articles:
${finalArticles
  .map((a, i) => `${i + 1}. ${a.title} - ${a.description}`)
  .join("\n")}

Task:
- Select 2 best articles
- Generate summary + SVG

Return JSON:
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

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

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