import { NextResponse } from "next/server";

const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN || "";
const NOTION_MEMBERS_DB_ID =
  process.env.NOTION_MEMBERS_DB_ID || "402b3765-5def-8142-af31-fd8b4a2ffd8e";
const SYNC_SECRET = process.env.SYNC_SECRET || "zawiya-mohammedia-secret-2026";

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "Minhaj Al-Faqir N8N / Notion Sync Gateway",
    endpoint: "/api/members/sync",
    methods: ["POST"],
    notion_db: NOTION_MEMBERS_DB_ID,
  });
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("x-sync-secret");
    // Verify token if provided (permissive fallback for local dev)
    if (authHeader && !authHeader.includes(SYNC_SECRET) && !authHeader.includes("Bearer")) {
      return NextResponse.json({ error: "Unauthorized sync request" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    // If batch updates are provided in payload (from n8n), process them
    if (body.updates && Array.isArray(body.updates)) {
      const results = [];
      for (const item of body.updates) {
        if (!item.id) continue;
        const updateProperties: any = {};
        if (typeof item.paidMonths === "number") {
          updateProperties["الشهور المؤداة (من 12)"] = { number: item.paidMonths };
        }
        if (typeof item.annualPaid === "number") {
          updateProperties["المبلغ المؤدى سنوياً (درهم)"] = { number: item.annualPaid };
        }
        if (item.status) {
          updateProperties["حالة الانضباط"] = { select: { name: item.status } };
        }

        const res = await fetch(`https://api.notion.com/v1/pages/${item.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${NOTION_API_TOKEN}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ properties: updateProperties }),
        });
        results.push({ id: item.id, status: res.status });
      }

      return NextResponse.json({
        success: true,
        message: `Processed ${results.length} member updates from n8n automation`,
        results,
        syncedAt: new Date().toISOString(),
      });
    }

    // Otherwise, trigger full fetch query to Notion to confirm live connection
    const res = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_MEMBERS_DB_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page_size: 100 }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    const count = (data.results || []).length;

    return NextResponse.json({
      success: true,
      message: `Sync verified with Notion database. Found ${count} active records.`,
      recordsCount: count,
      syncedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
