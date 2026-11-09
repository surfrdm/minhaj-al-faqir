import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type {
  BukhariBookData,
  BukhariSearchResult,
  ShifaChapterData,
  ShifaSearchResult,
  TurathSearchFieldScope,
} from "@/types/turath";

const MAX_GLOBAL_RESULTS = 50;
const MAX_SCOPED_RESULTS = 80;

const SHIFA_CHAPTER_PART_MAP: Record<number, number> = {
  0: 0,
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 2,
  6: 2,
  7: 2,
  8: 2,
  9: 3,
  10: 3,
  11: 4,
  12: 4,
  13: 4,
};

function normalizeForSearch(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[«»"'()\[\]{}،؛:.؟!\-\/]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function splitTokens(normalizedQuery: string): string[] {
  return normalizedQuery.split(" ").filter((tok) => tok.length > 0);
}

function matchesAllTokens(haystack: string, tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  for (let i = 0; i < tokens.length; i++) {
    if (!haystack.includes(tokens[i])) return false;
  }
  return true;
}

function parseNumberRangeMatch(
  numberLabel: string | undefined,
  target: number
): boolean {
  if (!numberLabel) return false;
  const parts = numberLabel.split("-").map((s) => parseInt(s.trim(), 10));
  if (
    parts.length === 2 &&
    !Number.isNaN(parts[0]) &&
    !Number.isNaN(parts[1])
  ) {
    return target >= parts[0] && target <= parts[1];
  }
  return false;
}

function parseScope(raw: string | null): TurathSearchFieldScope {
  if (raw === "text" || raw === "sharh") return raw;
  return "all";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") || "bukhari";
    const query = (searchParams.get("q") || "").trim();
    const fieldScope = parseScope(searchParams.get("scope"));

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

        const rawBook = searchParams.get("book");
        let bookFilter: number | null = null;
        if (rawBook && rawBook !== "all") {
          const parsed = parseInt(rawBook, 10);
          if (Number.isNaN(parsed) || parsed < 1 || parsed > 97) {
            return NextResponse.json(
              { error: "Invalid Bukhari book filter (1-97)." },
              { status: 400 }
            );
          }
          bookFilter = parsed;
        }

        const rawBabId = searchParams.get("babId");
        const babFilter =
          rawBabId && rawBabId !== "all" ? rawBabId.trim() : null;

        const normQ = normalizeForSearch(query);
        const queryTokens = splitTokens(normQ);
        const numericMatch = query.replace(/^#|رقم\s*/i, "").trim();
        const targetNum = /^\d+$/.test(numericMatch)
          ? parseInt(numericMatch, 10)
          : null;

        const maxResults =
          bookFilter !== null || babFilter !== null
            ? MAX_SCOPED_RESULTS
            : MAX_GLOBAL_RESULTS;

        const exactNumberHits: BukhariSearchResult[] = [];
        const textHits: BukhariSearchResult[] = [];
        let totalMatches = 0;

        const startBook = bookFilter ?? 1;
        const endBook = bookFilter ?? 97;

        for (let bookNum = startBook; bookNum <= endBook; bookNum++) {
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

          const normBabCache = new Map<
            string,
            { title: string; sharh: string; scholar: string }
          >();

          for (const h of bookData.hadiths) {
            if (babFilter && h.babId !== babFilter) continue;

            const bab = bookData.babs[h.babId];
            if (!bab) continue;

            const isNumHit =
              targetNum !== null &&
              (h.number === targetNum ||
                parseNumberRangeMatch(h.numberLabel, targetNum));

            if (isNumHit) {
              totalMatches++;
              if (exactNumberHits.length < maxResults) {
                exactNumberHits.push({ bookMeta: bookData.meta, bab, hadith: h });
              }
              continue;
            }

            if (targetNum !== null && query.length <= 4) {
              continue;
            }

            if (queryTokens.length === 0) continue;

            let cachedBab = normBabCache.get(bab.id);
            if (!cachedBab) {
              cachedBab = {
                title: normalizeForSearch(bab.title_ar),
                sharh: normalizeForSearch(bab.sharh_ar),
                scholar: normalizeForSearch(bab.sharh_scholar),
              };
              normBabCache.set(bab.id, cachedBab);
            }

            let haystack = "";
            if (fieldScope === "text") {
              haystack = `${normalizeForSearch(h.text_ar)} ${cachedBab.title} ${h.text_fr.toLowerCase()} ${h.text_en.toLowerCase()}`;
            } else if (fieldScope === "sharh") {
              haystack = `${cachedBab.sharh} ${cachedBab.scholar}`;
            } else {
              haystack = `${normalizeForSearch(h.text_ar)} ${cachedBab.title} ${cachedBab.sharh} ${h.text_fr.toLowerCase()} ${h.text_en.toLowerCase()}`;
            }

            if (matchesAllTokens(haystack, queryTokens)) {
              totalMatches++;
              if (exactNumberHits.length + textHits.length < maxResults) {
                textHits.push({ bookMeta: bookData.meta, bab, hadith: h });
              }
            }
          }
        }

        const combined = [...exactNumberHits, ...textHits].slice(0, maxResults);
        return NextResponse.json(
          {
            source: "bukhari",
            query,
            scope: fieldScope,
            filters: {
              book: bookFilter,
              babId: babFilter,
            },
            totalMatches,
            truncated: totalMatches > combined.length,
            results: combined,
          },
          {
            headers: {
              "Cache-Control":
                "public, s-maxage=3600, stale-while-revalidate=86400",
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

      const data = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
      ) as BukhariBookData;
      return NextResponse.json(data, {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }

    // source === "shifa"
    if (query.length > 0) {
      if (query.length < 2 && !/^\d+$/.test(query)) {
        return NextResponse.json(
          { error: "Search query must be at least 2 characters." },
          { status: 400 }
        );
      }

      const rawPart = searchParams.get("part");
      let partFilter: number | null = null;
      if (rawPart && rawPart !== "all") {
        const parsed = parseInt(rawPart, 10);
        if (Number.isNaN(parsed) || parsed < 0 || parsed > 4) {
          return NextResponse.json(
            { error: "Invalid Ash-Shifa part filter (0-4)." },
            { status: 400 }
          );
        }
        partFilter = parsed;
      }

      const rawChapter = searchParams.get("chapter");
      let chapterFilter: number | null = null;
      if (rawChapter && rawChapter !== "all") {
        const parsed = parseInt(rawChapter, 10);
        if (Number.isNaN(parsed) || parsed < 0 || parsed > 13) {
          return NextResponse.json(
            { error: "Invalid Ash-Shifa chapter filter (0-13)." },
            { status: 400 }
          );
        }
        chapterFilter = parsed;
      }

      const rawFaslId = searchParams.get("faslId");
      const faslFilter =
        rawFaslId && rawFaslId !== "all" ? rawFaslId.trim() : null;

      const normQ = normalizeForSearch(query);
      const queryTokens = splitTokens(normQ);
      const numericMatch = query.replace(/^#|رقم\s*/i, "").trim();
      const targetNum = /^\d+$/.test(numericMatch)
        ? parseInt(numericMatch, 10)
        : null;

      const maxResults =
        partFilter !== null || chapterFilter !== null || faslFilter !== null
          ? MAX_SCOPED_RESULTS
          : MAX_GLOBAL_RESULTS;

      const results: ShifaSearchResult[] = [];
      let totalMatches = 0;

      const startCh = chapterFilter ?? 0;
      const endCh = chapterFilter ?? 13;

      for (let ch = startCh; ch <= endCh; ch++) {
        if (partFilter !== null && SHIFA_CHAPTER_PART_MAP[ch] !== partFilter) {
          continue;
        }

        const chPath = path.join(
          process.cwd(),
          "src",
          "data",
          "turath",
          "shifa",
          `chapter_${ch}.json`
        );
        if (!fs.existsSync(chPath)) continue;

        const chData = JSON.parse(
          fs.readFileSync(chPath, "utf-8")
        ) as ShifaChapterData;

        const normMetaText = normalizeForSearch(
          `${chData.meta.part_ar} ${chData.meta.title_ar} ${chData.meta.title_fr}`
        );
        const normMetaSharh = normalizeForSearch(
          `${chData.meta.maliki_focus_ar} ${chData.meta.maliki_focus_fr}`
        );

        for (const fasl of chData.fasls) {
          if (faslFilter && fasl.id !== faslFilter) continue;

          if (targetNum !== null && query.length <= 2) {
            if (chapterFilter !== null && fasl.faslNumber === targetNum) {
              totalMatches++;
              if (results.length < maxResults) {
                results.push({ chapterMeta: chData.meta, fasl });
              }
            }
            continue;
          }

          if (queryTokens.length === 0) continue;

          let haystack = "";
          if (fieldScope === "text") {
            haystack = `${normalizeForSearch(fasl.title_ar)} ${normalizeForSearch(fasl.text_ar)} ${normMetaText}`;
          } else if (fieldScope === "sharh") {
            haystack = `${normalizeForSearch(fasl.sharh_ar)} ${normalizeForSearch(fasl.sharh_scholar)} ${normMetaSharh}`;
          } else {
            haystack = `${normalizeForSearch(fasl.title_ar)} ${normalizeForSearch(fasl.text_ar)} ${normalizeForSearch(fasl.sharh_ar)} ${normMetaText} ${normMetaSharh}`;
          }

          if (matchesAllTokens(haystack, queryTokens)) {
            totalMatches++;
            if (results.length < maxResults) {
              results.push({ chapterMeta: chData.meta, fasl });
            }
          }
        }
      }

      return NextResponse.json(
        {
          source: "shifa",
          query,
          scope: fieldScope,
          filters: {
            part: partFilter,
            chapter: chapterFilter,
            faslId: faslFilter,
          },
          totalMatches,
          truncated: totalMatches > results.length,
          results,
        },
        {
          headers: {
            "Cache-Control":
              "public, s-maxage=3600, stale-while-revalidate=86400",
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

    const data = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    ) as ShifaChapterData;
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
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
