import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

// 🔥 SOURCES (MIT + others)
const SOURCES = [
  "https://www.technologyreview.com/feed/",
  "https://feeds.bbci.co.uk/news/technology/rss.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
];

// 🔥 DOMAIN → KEYWORDS MAP
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  Robotics: ["robot", "automation", "ai"],
  Space: ["space", "nasa", "astronomy"],
  AI: ["ai", "machine learning", "deep learning"],
  Finance: ["stock", "market", "finance"],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const domains: string[] = body?.domains || [];

    let allArticles: any[] = [];

    // 🔥 FETCH RSS
    for (const url of SOURCES) {
      try {
        const feed = await parser.parseURL(url);

        const articles = feed.items.map((item) => ({
          id: item.guid || item.link,
          title: item.title || "",
          description: (item.contentSnippet || "").slice(0, 200),
        }));

        allArticles.push(...articles);
      } catch (err) {
        console.log("Feed error:", url);
      }
    }

    // 🔥 BUILD KEYWORDS FROM DOMAINS
    let keywords: string[] = [];

    domains.forEach((d) => {
      if (DOMAIN_KEYWORDS[d]) {
        keywords.push(...DOMAIN_KEYWORDS[d]);
      }
    });

    // 🔥 REMOVE DUPLICATES
    keywords = [...new Set(keywords)];

    // 🔥 FILTER (YOUR LOGIC)
    let filtered = allArticles;

    if (keywords.length > 0) {
      filtered = allArticles.filter((article) => {
        const text = (article.title + " " + article.description).toLowerCase();
        return keywords.some((keyword) =>
          text.includes(keyword.toLowerCase())
        );
      });
    }

    // 🔥 LIMIT
    const final = filtered.slice(0, 15);

    return NextResponse.json({ articles: final });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}