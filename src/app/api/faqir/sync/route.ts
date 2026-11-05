import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const discipleId = searchParams.get("discipleId") || "default_faqir";

  let resultData: Record<string, any> = {};

  // 1. Try local file cache
  try {
    const filePath = path.join(process.cwd(), "src/data/faqir_server_sync.json");
    const content = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(content);
    if (parsed && parsed[discipleId]) {
      resultData = parsed[discipleId];
    }
  } catch (e) {
    // Local file absent or read-only
  }

  // 2. Query Supabase cloud if active
  if (isSupabaseConfigured()) {
    try {
      const { data: notes, error: notesErr } = await supabase
        .from("faqir_notes")
        .select("*")
        .eq("disciple_id", discipleId)
        .order("created_at", { ascending: false });

      if (!notesErr && Array.isArray(notes) && notes.length > 0) {
        resultData.notes = notes.map((n) => ({
          id: n.note_id || n.id,
          title: n.title,
          content: n.content || "",
          category: n.category || "dhikr",
          date: n.note_date || n.created_at?.slice(0, 10),
        }));
      }
    } catch (err) {
      console.warn("Supabase faqir sync GET warning:", err);
    }
  }

  return NextResponse.json(resultData, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      discipleId = "default_faqir",
      habits,
      checks,
      planner,
      notes,
      paidMonths,
    } = body;

    let storageMode = "local_and_cache";

    // 1. Persist Notes & Wird to Supabase Cloud if configured
    if (isSupabaseConfigured()) {
      try {
        if (Array.isArray(notes) && notes.length > 0) {
          const noteRows = notes.map((n: any) => ({
            disciple_id: discipleId,
            note_id: String(n.id),
            title: n.title || "خاطرة سلوكية",
            content: n.content || "",
            category: n.category || "dhikr",
            note_date: n.date || new Date().toISOString().slice(0, 10),
          }));

          await supabase
            .from("faqir_notes")
            .upsert(noteRows, { onConflict: "note_id" });
        }
        storageMode = "supabase_cloud";
      } catch (err) {
        console.warn("Supabase faqir sync error:", err);
      }
    }

    // 2. Persist locally to filesystem if writable
    try {
      const filePath = path.join(process.cwd(), "src/data/faqir_server_sync.json");
      let current: Record<string, any> = {};
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        current = JSON.parse(fileContent);
      } catch {
        current = {};
      }

      current[discipleId] = {
        updatedAt: new Date().toISOString(),
        habits,
        checks,
        planner,
        notes,
        paidMonths,
      };

      await fs.writeFile(filePath, JSON.stringify(current, null, 2), "utf-8");
    } catch (fsErr) {
      // Ignore read-only on Vercel
    }

    return NextResponse.json({
      success: true,
      message: "تم حفظ ومزامنة بيانات الفقير في السيرفر بنجاح!",
      storage: storageMode,
    });
  } catch (err: any) {
    console.error("Error in faqir sync POST:", err);
    return NextResponse.json(
      { error: "تعذر حفظ البيانات في السيرفر", details: err?.message },
      { status: 500 }
    );
  }
}
