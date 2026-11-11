import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import zlib from "zlib";

interface RawSearchVerse {
  k: string; // Warsh S:V key (matches /api/quran/tafsir/[hizb]?verse=k)
  h: number; // hizb_number
  p: number; // page_number
  sn: number; // surah_number
  s: string; // surah_name
  vn: string; // verse_number (Warsh)
  hn: string; // hafs_note
  t: string; // exact Warsh verse_text
  m: string; // mukhtasar tafsir
}

interface IndexedVerse extends RawSearchVerse {
  normVerse: string;
  normUthmani: string;
  normSurah: string;
  normTafsir: string;
  normHafsNote: string;
}

export interface QuranSearchHit {
  verse_key: string;
  hizb_number: number;
  page_number: number;
  surah_number: number;
  surah_name: string;
  verse_number: string;
  hafs_note: string;
  verse_text: string;
  mukhtasar: string;
  match_source: "verse" | "tafsir" | "ref";
}

function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    .replace(/\u06d2\u0654/g, "ي")
    .replace(/\u06d2\u0655/g, "ي")
    .replace(/\u06d2/g, "ي")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u06DE\u06E9]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[«»"'()\[\]{}،؛:.؟!\-\/]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function collapseMedialAlif(normText: string): string {
  return normText
    .replace(/صلوه/g, "صلاه")
    .replace(/زكوه/g, "زكاه")
    .replace(/حيوه/g, "حياه")
    .replace(/غدوه/g, "غداه")
    .split(" ")
    .map((w) => (w.length > 2 ? w[0] + w.slice(1).replace(/ا/g, "") : w))
    .join(" ");
}

function stripLeadingPrefix(token: string): string {
  if (token.startsWith("ال") && token.length > 4) return token.slice(2);
  if (token.startsWith("وال") && token.length > 5) return token.slice(3);
  if (token.startsWith("بال") && token.length > 5) return token.slice(3);
  if (token.startsWith("لل") && token.length > 4) return token.slice(2);
  return token;
}

const globalForSearch = globalThis as typeof globalThis & {
  __minhajQuranSearchIndex?: IndexedVerse[];
};

function getSearchIndex(): IndexedVerse[] {
  if (globalForSearch.__minhajQuranSearchIndex) {
    return globalForSearch.__minhajQuranSearchIndex;
  }

  const indexPath = path.join(process.cwd(), "src", "data", "quran_search_index.json.gz");
  const rawBuffer = zlib.gunzipSync(fs.readFileSync(indexPath));
  const rawItems = JSON.parse(rawBuffer.toString("utf-8")) as RawSearchVerse[];

  const indexed: IndexedVerse[] = rawItems.map((item) => {
    const normVerse = normalizeArabic(item.t);
    return {
      ...item,
      normVerse,
      normUthmani: collapseMedialAlif(normVerse),
      normSurah: normalizeArabic(item.s),
      normTafsir: normalizeArabic(item.m),
      normHafsNote: normalizeArabic(item.hn),
    };
  });

  globalForSearch.__minhajQuranSearchIndex = indexed;
  return indexed;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const rawQ = (searchParams.get("q") || "").trim();
    const hizbFilterRaw = searchParams.get("hizb");
    const scope = searchParams.get("scope") || "all"; // "all" | "verse"
    const limit = Math.min(300, Math.max(1, parseInt(searchParams.get("limit") || "60", 10) || 60));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10) || 0);

    if (!rawQ) {
      return NextResponse.json({
        query: "",
        total: 0,
        limit,
        offset,
        results: [],
      });
    }

    const index = getSearchIndex();
    const hizbFilter = hizbFilterRaw ? parseInt(hizbFilterRaw, 10) : null;

    // Direct Surah:Verse reference (e.g. "33:41" or "2:152")
    const refMatch = rawQ.match(/^(\d{1,3})\s*[:\/\-]\s*(\d{1,3})$/);
    if (refMatch) {
      const sNum = parseInt(refMatch[1], 10);
      const aNum = refMatch[2];
      const matches = index.filter((item) => {
        if (item.sn !== sNum) return false;
        if (item.vn === aNum) return true;
        // Also match Kufi/Hafs numbering cited in hafs_note
        const hafsNums = item.hn.match(/\d+/g);
        return Boolean(hafsNums && hafsNums.includes(aNum));
      });
      const sliced = matches.slice(offset, offset + limit).map<QuranSearchHit>((item) => ({
        verse_key: item.k,
        hizb_number: item.h,
        page_number: item.p,
        surah_number: item.sn,
        surah_name: item.s,
        verse_number: item.vn,
        hafs_note: item.hn,
        verse_text: item.t,
        mukhtasar: item.m,
        match_source: "ref",
      }));
      return NextResponse.json({
        query: rawQ,
        total: matches.length,
        limit,
        offset,
        results: sliced,
      });
    }

    const normQ = normalizeArabic(rawQ);
    if (!normQ) {
      return NextResponse.json({
        query: rawQ,
        total: 0,
        limit,
        offset,
        results: [],
      });
    }

    const noAlifQ = collapseMedialAlif(normQ);
    const tokens = normQ.split(" ").filter((t) => t.length >= 2 || /^\d+$/.test(t));
    if (tokens.length === 0) {
      return NextResponse.json({
        query: rawQ,
        total: 0,
        limit,
        offset,
        results: [],
      });
    }

    const tokenForms = tokens.map((tok) => {
      const noAlifTok = collapseMedialAlif(tok);
      const stem = stripLeadingPrefix(tok);
      const noAlifStem = collapseMedialAlif(stem);
      return { tok, noAlifTok, stem, noAlifStem };
    });

    const scored: Array<{ score: number; matchSource: "verse" | "tafsir" | "ref"; item: IndexedVerse }> = [];

    for (const item of index) {
      if (hizbFilter && item.h !== hizbFilter) continue;

      let score = 0;
      let matchSource: "verse" | "tafsir" | "ref" = "verse";

      // Exact full phrase in verse text
      if (item.normVerse.includes(normQ) || item.normUthmani.includes(noAlifQ)) {
        score += 100;
      } else {
        // Check token coverage across verse text (+ surah) vs tafsir
        let verseHits = 0;
        let stemHits = 0;
        let tafsirHits = 0;
        let surahHits = 0;

        for (const tf of tokenForms) {
          if (item.normVerse.includes(tf.tok) || item.normUthmani.includes(tf.noAlifTok)) {
            verseHits++;
          } else if (item.normSurah.includes(tf.tok) || item.normSurah.includes(tf.stem)) {
            surahHits++;
          } else if (
            tf.stem.length >= 3 &&
            (item.normVerse.includes(tf.stem) || item.normUthmani.includes(tf.noAlifStem))
          ) {
            stemHits++;
          }

          if (
            scope !== "verse" &&
            (item.normTafsir.includes(tf.tok) ||
              (tf.stem.length >= 3 && item.normTafsir.includes(tf.stem)))
          ) {
            tafsirHits++;
          }
        }

        const totalDirectOrStem = verseHits + stemHits + surahHits;
        if (totalDirectOrStem === tokens.length) {
          score += verseHits * 25 + stemHits * 12 + surahHits * 15;
        } else if (scope !== "verse" && totalDirectOrStem + tafsirHits >= tokens.length) {
          // Verify every token matches either verse, surah, or tafsir
          const allCovered = tokenForms.every(
            (tf) =>
              item.normVerse.includes(tf.tok) ||
              item.normUthmani.includes(tf.noAlifTok) ||
              item.normSurah.includes(tf.tok) ||
              item.normSurah.includes(tf.stem) ||
              (tf.stem.length >= 3 &&
                (item.normVerse.includes(tf.stem) || item.normUthmani.includes(tf.noAlifStem))) ||
              item.normTafsir.includes(tf.tok) ||
              (tf.stem.length >= 3 && item.normTafsir.includes(tf.stem))
          );
          if (allCovered) {
            score += verseHits * 20 + stemHits * 10 + tafsirHits * 6;
            if (verseHits === 0 && stemHits === 0) matchSource = "tafsir";
          }
        }
      }

      if (score > 0) {
        if (item.normTafsir.includes(normQ)) score += 10;
        scored.push({ score, matchSource, item });
      }
    }

    scored.sort((a, b) => b.score - a.score || a.item.sn - b.item.sn || parseInt(a.item.vn, 10) - parseInt(b.item.vn, 10));

    const results: QuranSearchHit[] = scored.slice(offset, offset + limit).map(({ item, matchSource }) => ({
      verse_key: item.k,
      hizb_number: item.h,
      page_number: item.p,
      surah_number: item.sn,
      surah_name: item.s,
      verse_number: item.vn,
      hafs_note: item.hn,
      verse_text: item.t,
      mukhtasar: item.m,
      match_source: matchSource,
    }));

    return NextResponse.json(
      {
        query: rawQ,
        total: scored.length,
        limit,
        offset,
        results,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (err: unknown) {
    console.error("[api/quran/search] Search failed:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", message },
      { status: 500 }
    );
  }
}
