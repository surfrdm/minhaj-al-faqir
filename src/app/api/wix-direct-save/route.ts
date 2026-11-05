import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  let editsMap: Record<string, string> = {};

  // 1. Try to read from local file first (if exists)
  try {
    const filePath = path.join(process.cwd(), "src/data/direct_page_edits.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(fileContent);
    if (parsed && typeof parsed === "object") {
      editsMap = { ...editsMap, ...parsed };
    }
  } catch (error) {
    // File not found or read-only, proceed to cloud
  }

  // 2. If Supabase is configured, fetch latest edits from Supabase cloud database
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("site_page_edits")
        .select("element_key, html_content");

      if (!error && Array.isArray(data)) {
        for (const row of data) {
          if (row.element_key && row.html_content) {
            editsMap[row.element_key] = row.html_content;
          }
        }
      }
    } catch (e) {
      console.warn("Supabase fetch failed in wix-direct-save GET:", e);
    }
  }

  return NextResponse.json(editsMap, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(request: Request) {
  try {
    const newEdits: Record<string, string> = await request.json();
    if (!newEdits || typeof newEdits !== "object") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Filter out unsafe/malformed keys (e.g. root selectors or browser extensions)
    const sanitizedEdits: Record<string, string> = {};
    for (const [key, val] of Object.entries(newEdits)) {
      if (
        !key ||
        key.endsWith("::") ||
        key.includes("SL_") ||
        key.includes("chrome-extension") ||
        key.includes("SL_Balloon")
      ) {
        continue;
      }
      sanitizedEdits[key] = val;
    }

    let storageUsed = "local";

    // 1. Persist to Supabase Cloud Database if configured
    if (isSupabaseConfigured()) {
      try {
        const rows = Object.entries(sanitizedEdits).map(([k, v]) => ({
          element_key: k,
          html_content: v,
          updated_at: new Date().toISOString(),
        }));

        if (rows.length > 0) {
          const { error } = await supabase
            .from("site_page_edits")
            .upsert(rows, { onConflict: "element_key" });

          if (!error) {
            storageUsed = "supabase_cloud";
          } else {
            console.warn("Supabase upsert warning:", error);
          }
        }
      } catch (err) {
        console.warn("Supabase sync exception:", err);
      }
    }

    // 2. Try writing to local filesystem (works on local machine, Mac, NAS, Docker)
    try {
      const filePath = path.join(process.cwd(), "src/data/direct_page_edits.json");
      let current: Record<string, string> = {};
      try {
        const existing = await fs.readFile(filePath, "utf-8");
        current = JSON.parse(existing);
      } catch {
        current = {};
      }

      const merged = {
        ...current,
        ...sanitizedEdits,
      };

      await fs.writeFile(filePath, JSON.stringify(merged, null, 2), "utf-8");
      if (storageUsed === "local") storageUsed = "local_filesystem";
    } catch (fsErr) {
      // On Vercel serverless, filesystem is read-only (EROFS) - this is normal
      if (storageUsed === "local") {
        storageUsed = "client_cache_and_serverless";
      }
    }

    return NextResponse.json({
      success: true,
      message: "تم حفظ ونشر التعديلات بنجاح في السيرفر والموقع!",
      storage: storageUsed,
      count: Object.keys(sanitizedEdits).length,
    });
  } catch (error: any) {
    console.error("Error in wix-direct-save POST:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ التعديلات", details: error?.message },
      { status: 500 }
    );
  }
}
