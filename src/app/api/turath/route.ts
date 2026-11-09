import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type {
  BukhariBookData,
  BukhariSearchResult,
  ShifaChapterData,
  ShifaSearchResult,
} from "@/types/turath";

const MAX_SEARCH_RESULTS = 40;

function normalizeArabicForSearch(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .toLowerCase();
}

function parseNumberRangeMatch(numberLabel: string | undefined, target: number): boolean {
  if (!numberLabel) return false;
  const parts = numberLabel.split("-").map((s) => parseInt(s.trim(), 10));
  if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
    return target >= parts[0] && target <= parts[1];
  }
  return false;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") || "bukhari";
    const query = (searchParams.get("q") || "").trim();

    if (source !== "bukhari" && source !== "shifa") {
      return NextResponse.json(
        { error: "Invalid source. Expected 'bukhari' or 'shifa'." },
        { status: 400 }
      );
    }

    if (source === "bukhari") {
      if (query.length > 0) {
        if (query.length < 2 && !/^\d+$/.test(query)) {
          return NextResponse.json(
            { error: "Search query must be at least 2 characters." },
            { status: 400 }
          );
        }

        const normQ = normalizeArabicForSearch(query);
        const numericMatch = query.replace(/^#|رقم\s*/i, "").trim();
        const targetNum = /^\d+$/.test(numericMatch) ? parseInt(numericMatch, 10) : null;

        const exactNumberHits: BukhariSearchResult[] = [];
        const textHits: BukhariSearchResult[] = [];
        let totalMatches = 0;

        for (let bookNum = 1; bookNum <= 97; bookNum++) {
          const bookPath = path.join(
            process.cwd(),
            "src",
            "data",
            "turath",
            "bukhari",
            `book_${bookNum}.json`
          );
          if (!fs.existsSync(bookPath)) continue;

          const bookData = JSON.parse(
            fs.readFileSync(bookPath, "utf-8")
          ) as BukhariBookData;

          for (const h of bookData.hadiths) {
            const bab = bookData.babs[h.babId];
            if (!bab) continue;

            const isNumHit =
              targetNum !== null &&
              (h.number === targetNum || parseNumberRangeMatch(h.numberLabel, targetNum));

            if (isNumHit) {
              totalMatches++;
              if (exactNumberHits.length < MAX_SEARCH_RESULTS) {
                exactNumberHits.push({ bookMeta: bookData.meta, bab, hadith: h });
              }
              continue;
            }

            if (targetNum !== null && query.length <= 4) {
              // For pure numeric lookups up to 4 digits, only match hadith numbers to avoid spurious verse/year hits
              continue;
            }

            const matchedText =
              normalizeArabicForSearch(h.text_ar).includes(normQ) ||
              normalizeArabicForSearch(bab.title_ar).includes(normQ) ||
              normalizeArabicForSearch(bab.sharh_ar).includes(normQ) ||
              h.text_fr.toLowerCase().includes(normQ) ||
              h.text_en.toLowerCase().includes(normQ);

            if (matchedText) {
              totalMatches++;
              if (exactNumberHits.length + textHits.length < MAX_SEARCH_RESULTS) {
                textHits.push({ bookMeta: bookData.meta, bab, hadith: h });
              }
            }
          }
        }

        const combined = [...exactNumberHits, ...textHits].slice(0, MAX_SEARCH_RESULTS);
        return NextResponse.json(
          {
            source: "bukhari",
            query,
            totalMatches,
            truncated: totalMatches > combined.length,
            results: combined,
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
          }
        );
      }

      const bookParam = parseInt(searchParams.get("book") || "1", 10);
      if (Number.isNaN(bookParam) || bookParam < 1 || bookParam > 97) {
        return NextResponse.json(
          { error: "Invalid Bukhari book number (1-97)." },
          { status: 400 }
        );
      }

      const filePath = path.join(
        process.cwd(),
        "src",
        "data",
        "turath",
        "bukhari",
        `book_${bookParam}.json`
      );
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "Book not found." }, { status: 404 });
      }

      const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as BukhariBookData;
      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }

    // source === "shifa"
    if (query.length > 0) {
      if (query.length < 2) {
        return NextResponse.json(
          { error: "Search query must be at least 2 characters." },
          { status: 400 }
        );
      }

      const normQ = normalizeArabicForSearch(query);
      const results: ShifaSearchResult[] = [];
      let totalMatches = 0;

      for (let ch = 0; ch <= 13; ch++) {
        const chPath = path.join(
          process.cwd(),
          "src",
          "data",
          "turath",
          "shifa",
          `chapter_${ch}.json`
        );
        if (!fs.existsSync(chPath)) continue;

        const chData = JSON.parse(fs.readFileSync(chPath, "utf-8")) as ShifaChapterData;
        for (const fasl of chData.fasls) {
          const matched =
            normalizeArabicForSearch(fasl.title_ar).includes(normQ) ||
            normalizeArabicForSearch(fasl.text_ar).includes(normQ) ||
            normalizeArabicForSearch(fasl.sharh_ar).includes(normQ) ||
            chData.meta.title_fr.toLowerCase().includes(normQ) ||
            chData.meta.maliki_focus_fr.toLowerCase().includes(normQ);

          if (matched) {
            totalMatches++;
            if (results.length < MAX_SEARCH_RESULTS) {
              results.push({ chapterMeta: chData.meta, fasl });
            }
          }
        }
      }

      return NextResponse.json(
        {
          source: "shifa",
          query,
          totalMatches,
          truncated: totalMatches > results.length,
          results,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        }
      );
    }

    const chapterParam = parseInt(searchParams.get("chapter") || "0", 10);
    if (Number.isNaN(chapterParam) || chapterParam < 0 || chapterParam > 13) {
      return NextResponse.json(
        { error: "Invalid Ash-Shifa chapter number (0-13)." },
        { status: 400 }
      );
    }

    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "turath",
      "shifa",
      `chapter_${chapterParam}.json`
    );
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as ShifaChapterData;
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", message },
      { status: 500 }
    );
  }
}
