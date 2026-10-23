import { NextResponse } from "next/server";

const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN || "";
const NOTION_MEMBERS_DB_ID =
  process.env.NOTION_MEMBERS_DB_ID || "402b3765-5def-8142-af31-fd8b4a2ffd8e";

export async function GET() {
  try {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_MEMBERS_DB_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page_size: 50 }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: res.status });
    }

    const data = await res.json();
    const members = (data.results || []).map((page: any) => {
      const props = page.properties;
      const name = props["اسم الفقير"]?.title?.[0]?.plain_text || "فقير جديد";
      const monthly = props["الملزومة الشهرية (درهم)"]?.number || 100;
      const paidMonths = props["الشهور المؤداة (من 12)"]?.number || 0;
      const annualTarget = props["الملزومة السنوية المستهدفة (درهم)"]?.number || 2000;
      const annualPaid = props["المبلغ المؤدى سنوياً (درهم)"]?.number || 0;
      const city = props["المدينة / الزاوية"]?.select?.name || "المحمدية";
      const status = props["حالة الانضباط"]?.select?.name || "🟡 في طور الاستيفاء";

      return {
        id: page.id,
        name,
        monthly,
        paidMonths,
        annualTarget,
        annualPaid,
        annualRemaining: Math.max(0, annualTarget - annualPaid),
        annualPercentage: Math.min(100, Math.round((annualPaid / (annualTarget || 1)) * 100)),
        city,
        status,
      };
    });

    return NextResponse.json({ members });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, city, monthly, annualTarget } = body;

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_MEMBERS_DB_ID },
        properties: {
          "اسم الفقير": {
            title: [{ text: { content: name || "فقير جديد" } }],
          },
          "المدينة / الزاوية": {
            select: { name: city || "المحمدية" },
          },
          "الملزومة الشهرية (درهم)": {
            number: Number(monthly) || 100,
          },
          "الشهور المؤداة (من 12)": {
            number: 0,
          },
          "الملزومة السنوية المستهدفة (درهم)": {
            number: Number(annualTarget) || 2000,
          },
          "المبلغ المؤدى سنوياً (درهم)": {
            number: 0,
          },
          "حالة الانضباط": {
            select: { name: "🟡 في طور الاستيفاء" },
          },
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: res.status });
    }

    const created = await res.json();
    return NextResponse.json({ success: true, id: created.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, paidMonths, annualPaid } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing member ID" }, { status: 400 });
    }

    const updateProperties: any = {};
    if (typeof paidMonths === "number") {
      updateProperties["الشهور المؤداة (من 12)"] = { number: paidMonths };
    }
    if (typeof annualPaid === "number") {
      updateProperties["المبلغ المؤدى سنوياً (درهم)"] = { number: annualPaid };
    }

    const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${NOTION_API_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: updateProperties,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: res.status });
    }

    const updated = await res.json();
    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
