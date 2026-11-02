import { NextResponse } from "next/server";
import diwaneData from "@/data/diwane_master.json";

function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "") // remove harakat / tashkeel
    .replace(/[إأآء]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\u0600-\u06FF\s]/g, "") // keep only arabic letters and spaces
    .trim()
    .toLowerCase();
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let searchWord = "";
    let selectedId = "";
    let previousPoemId = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      searchWord = body.query || "";
      selectedId = body.poemId || "";
      previousPoemId = body.previousPoemId || "";
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      searchWord = (formData.get("query") as string) || "";
      selectedId = (formData.get("poemId") as string) || "";
      previousPoemId = (formData.get("previousPoemId") as string) || "";
    }

    const poems = diwaneData.poems;
    const silsilas = diwaneData.silsilas;

    // Helper: get upcoming chain of poems in the current Silsila
    const getUpcomingChain = (poem: any) => {
      if (!poem || !poem.silsilaId) return [];
      const silsila = silsilas.find((s) => s.id === poem.silsilaId);
      if (!silsila) return [];
      return silsila.poems.filter((p) => p.order > (poem.orderInSilsila || 0));
    };

    // 1. Direct poem selection by ID
    if (selectedId) {
      const found = poems.find((p) => p.id === selectedId);
      if (found) {
        return NextResponse.json({
          success: true,
          poem: found,
          currentVerseIndex: 0,
          upcomingChain: getUpcomingChain(found),
          silsila: silsilas.find((s) => s.id === found.silsilaId) || null,
        });
      }
    }

    // 2. Intelligent Arabic Keyword & Acoustic Transcript Matching
    if (searchWord.trim()) {
      const normalizedQuery = normalizeArabic(searchWord);
      const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);

      let bestPoem: any = null;
      let bestScore = 0;
      let bestVerseIdx = 0;

      for (const poem of poems) {
        let score = 0;
        let matchedVerseIdx = 0;

        // Check keywords
        if (poem.keywords) {
          for (const kw of poem.keywords) {
            const nKw = normalizeArabic(kw);
            if (normalizedQuery.includes(nKw) || nKw.includes(normalizedQuery)) {
              score += 12;
            }
          }
        }

        // Check title and poet
        const nTitle = normalizeArabic(poem.title);
        const nPoet = normalizeArabic(poem.poet);
        if (normalizedQuery.includes(nTitle) || nTitle.includes(normalizedQuery)) {
          score += 18;
        }
        if (normalizedQuery.includes(nPoet) || nPoet.includes(normalizedQuery)) {
          score += 8;
        }

        // Check each verse
        poem.allVerses.forEach((verse, vIdx) => {
          const nVerse = normalizeArabic(verse);
          if (nVerse.includes(normalizedQuery)) {
            score += 25;
            matchedVerseIdx = vIdx;
          } else {
            let wordHits = 0;
            queryWords.forEach((qw) => {
              if (nVerse.includes(qw)) {
                wordHits++;
              }
            });
            if (wordHits > 0) {
              const verseScore = wordHits * 6;
              if (verseScore > score) {
                score = verseScore;
                matchedVerseIdx = vIdx;
              }
            }
          }
        });

        if (score > bestScore) {
          bestScore = score;
          bestPoem = poem;
          bestVerseIdx = matchedVerseIdx;
        }
      }

      if (bestPoem && bestScore >= 5) {
        const isNewPoem = previousPoemId && previousPoemId !== bestPoem.id;
        return NextResponse.json({
          success: true,
          poem: bestPoem,
          currentVerseIndex: bestVerseIdx,
          isTransition: Boolean(isNewPoem),
          confidence: `${bestScore > 20 ? "مطابقة دقيقة جداً" : "مطابقة معتبرة"} (${bestScore} نقطة)`,
          message: isNewPoem
            ? `✨ انتقل الإنشاد إلى: «${bestPoem.title}» (${bestPoem.silsilaName || "السماع"})`
            : "متابعة الإنشاد الجاري في السلسلة",
          upcomingChain: getUpcomingChain(bestPoem),
          silsila: silsilas.find((s) => s.id === bestPoem.silsilaId) || null,
        });
      }
    }

    // 3. Fallback: cycle or return next in sequence if previousPoemId is provided
    let fallbackPoem = poems[0];
    if (previousPoemId) {
      const curIdx = poems.findIndex((p) => p.id === previousPoemId);
      if (curIdx !== -1 && curIdx + 1 < poems.length) {
        fallbackPoem = poems[curIdx + 1];
      }
    }

    return NextResponse.json({
      success: true,
      poem: fallbackPoem,
      currentVerseIndex: 0,
      confidence: "نوبة السماع الجارية",
      message: "تم توجيه السماع وفق الترتيب الصوفي المعتمد",
      upcomingChain: getUpcomingChain(fallbackPoem),
      silsila: silsilas.find((s) => s.id === fallbackPoem.silsilaId) || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
