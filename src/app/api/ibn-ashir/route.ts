import { NextResponse } from "next/server";
import { IBN_ASHIR_LESSONS } from "@/lib/ibn-ashir";

const NOTION_DATABASE_ID = "48b99299-da33-4d0c-9852-6ffbb5c94037";

export async function GET() {
  const token = process.env.NOTION_API_TOKEN;

  if (token) {
    try {
      const response = await fetch(
        `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page_size: 100 }),
          next: { revalidate: 3600 },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return NextResponse.json({
            source: "notion",
            lessons: data.results,
          });
        }
      }
    } catch {
      // Fallback cleanly to local dataset
    }
  }

  return NextResponse.json({
    source: "local",
    lessons: IBN_ASHIR_LESSONS,
  });
}
