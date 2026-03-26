import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

const SOURCES = [
  "https://www.technologyreview.com/feed/",
  "https://feeds.bbci.co.uk/news/technology/rss.xml",
];

export async function GET() {
  let all: any[] = [];

  for (const url of SOURCES) {
    try {
      const feed = await parser.parseURL(url);

      const articles = feed.items.map((item) => ({
        title: item.title,
        description: item.contentSnippet || "",
      }));

      all.push(...articles);
    } catch {}
  }

  return NextResponse.json({ articles: all.slice(0, 20) });
}