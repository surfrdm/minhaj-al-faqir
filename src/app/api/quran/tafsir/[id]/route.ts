import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface TafsirVerseEntry {
  key: string;
  surah_number: number;
  verse_number: number;
  surah_name: string;
  warsh_ref: string;
  hafs_note: string;
  verse_text: string;
  mukhtasar: string;
  ibn_atiyyah: string;
  qurtubi: string;
  ibn_ashur: string;
  fr_translation: string;
  fr_mokhtasar: string;
}

interface HizbTafsirPayload {
  hizb_number: number;
  riwaya: string;
  sources: Record<string, { label: string; full_title: string }>;
  ordered_keys: string[];
  verses: Record<string, TafsirVerseEntry>;
}

const memoryCache = new Map<number, HizbTafsirPayload>();

function loadHizbTafsir(hizbNum: number): HizbTafsirPayload | null {
  const cached = memoryCache.get(hizbNum);
  if (cached) return cached;

  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "tafsir",
    `hizb_${hizbNum}.json`
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8")) as HizbTafsirPayload;
  memoryCache.set(hizbNum, parsed);
  return parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hizbNum = parseInt(id, 10);

    if (isNaN(hizbNum) || hizbNum < 1 || hizbNum > 60) {
      return NextResponse.json(
        { error: "Invalid hizb number. Must be between 1 and 60." },
        { status: 400 }
      );
    }

    const data = loadHizbTafsir(hizbNum);
    if (!data) {
      return NextResponse.json(
        {
          available: false,
          hizb_number: hizbNum,
          preview_hizb: 1,
          message: "Tafsir preview is currently available for Hizb 1.",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const verseKey = searchParams.get("verse");
    const mode = searchParams.get("mode");

    if (verseKey) {
      const entry = data.verses[verseKey];
      if (!entry) {
        return NextResponse.json(
          {
            available: true,
            found: false,
            hizb_number: hizbNum,
            verse_key: verseKey,
            ordered_keys: data.ordered_keys,
          },
          { status: 404 }
        );
      }

      const idx = data.ordered_keys.indexOf(verseKey);
      const prevKey =
        verseKey === "1:1"
          ? "1:0"
          : idx > 0
            ? data.ordered_keys[idx - 1]
            : null;
      const nextKey =
        verseKey === "1:0"
          ? data.ordered_keys[0] || null
          : idx >= 0 && idx < data.ordered_keys.length - 1
            ? data.ordered_keys[idx + 1]
            : null;

      return NextResponse.json(
        {
          available: true,
          found: true,
          hizb_number: hizbNum,
          riwaya: data.riwaya,
          sources: data.sources,
          prev_key: prevKey,
          next_key: nextKey,
          verse: entry,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        }
      );
    }

    if (mode === "summary") {
      const summaryVerses: Record<
        string,
        Pick<
          TafsirVerseEntry,
          "key" | "surah_number" | "verse_number" | "surah_name" | "warsh_ref" | "hafs_note" | "verse_text" | "mukhtasar" | "fr_translation"
        >
      > = {};
      for (const [k, v] of Object.entries(data.verses)) {
        summaryVerses[k] = {
          key: v.key,
          surah_number: v.surah_number,
          verse_number: v.verse_number,
          surah_name: v.surah_name,
          warsh_ref: v.warsh_ref,
          hafs_note: v.hafs_note,
          verse_text: v.verse_text,
          mukhtasar: v.mukhtasar,
          fr_translation: v.fr_translation,
        };
      }
      return NextResponse.json(
        {
          available: true,
          hizb_number: hizbNum,
          riwaya: data.riwaya,
          sources: data.sources,
          ordered_keys: data.ordered_keys,
          verses: summaryVerses,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        }
      );
    }

    // Default fallback returns concise summary + metadata (safe well below Vercel 4.5MB response cap)
    return NextResponse.json(
      {
        available: true,
        hizb_number: hizbNum,
        riwaya: data.riwaya,
        sources: data.sources,
        ordered_keys: data.ordered_keys,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", message },
      { status: 500 }
    );
  }
}
