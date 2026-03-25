// src/app/api/news/fetch/route.ts

import Parser from "rss-parser";
import { NextResponse } from "next/server";
import { addNews } from "@/lib/firebase";

const parser = new Parser();

const SOURCES = [
  {
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    category: "AI",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    category: "Tech",
  },
  {
    url: "https://www.sciencedaily.com/rss/top.xml",
    category: "Science",
  },
];

export async function GET() {
  try {
    for (const source of SOURCES) {
      const feed = await parser.parseURL(source.url);

      const articles = feed.items.slice(0, 5);

      for (const item of articles) {
        await addNews({
          title: item.title || "",
          description: item.contentSnippet || "",
          source: source.url,
          category: source.category,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}