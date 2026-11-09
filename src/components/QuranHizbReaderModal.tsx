"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Layers,
  ScrollText,
  Share2,
  Loader2,
  Check,
} from "lucide-react";
import {
  QuranHizbData,
  QuranPage,
  QuranWord,
  getHizbMeta,
  ALL_AHZAB_INDEX,
  getTomonDivisionInfo,
  cleanQuranWordText,
} from "@/lib/quran";

interface DynamicPageItem {
  type: "banner" | "basmala" | "word";
  title?: string;
  basmalaText?: string;
  word?: QuranWord;
  surahTitle?: string;
}

interface DynamicQuranPage {
  pageNumber: number;
  isOpening: boolean;
  surahTitle?: string;
  openingLines?: QuranPage["lines"];
  items?: DynamicPageItem[];
  wordCount?: number;
}

/**
 * الخيار 2 (التقسيم الديناميكي الكامل والمتوازن فائق الجمال):
 * ملء كل صفحة شاشة بالكامل حتى نهايتها بتدفق طبيعي متصل ومريح (دون التقيد بـ 7-9 كلمات في السطر)
 * بحيث ينزل السطر تلقائياً عند نفاذ المساحة، وتتصل الآيات حتى امتلاء الصفحة بوقار وهيبة (13-15 سطراً)
 * مع الموازنة التامة والمنع الحازم لأي سطر أخير يتيم أو مقطوع (Anti-Orphan & Smart Lookahead)،
 * وحفظ فواصل الآيات التامة دون قطع الكلمات أو تشويه السطر الأخير.
 */
function partitionHizbWords(
  hizbData: QuranHizbData,
  baseTargetWords: number = 180,
  estWordsPerLine: number = 13
): DynamicQuranPage[] {
  const isHizb1 = hizbData.hizb_number === 1;
  const pages: DynamicQuranPage[] = [];

  if (isHizb1 && hizbData.pages.length >= 2) {
    // 1. الفاتحة (صفحة تصديرية مركزة في الوسط بهيبة الخط المغربي)
    pages.push({
      pageNumber: 1,
      isOpening: true,
      surahTitle: hizbData.pages[0].page_surah_title || "الفاتحة",
      openingLines: hizbData.pages[0].lines,
    });
    // 2. أول البقرة حتى المفلحون (صفحة تصديرية مركزة في الوسط بهيبة الخط المغربي)
    pages.push({
      pageNumber: 2,
      isOpening: true,
      surahTitle: hizbData.pages[1].page_surah_title || "البقرة",
      openingLines: hizbData.pages[1].lines,
    });
  }

  // تجميع كل العناصر (اللافتات والكلمات) من باقي صفحات الحزب
  const startP = isHizb1 ? 2 : 0;
  const items: DynamicPageItem[] = [];

  for (let p = startP; p < hizbData.pages.length; p++) {
    const page = hizbData.pages[p];
    const pageSurah = page.page_surah_title || "";
    for (const l of page.lines) {
      if (l.is_surah_title === "1") {
        items.push({
          type: "banner",
          title: l.surah_title_ar || l.surah_title,
          surahTitle: l.surah_title_ar || l.surah_title,
        });
      } else if (l.is_basmala === "1") {
        items.push({
          type: "basmala",
          basmalaText: l.basmala_text || "بِسْمِ اِ۬للَّهِ اِ۬لرَّحْمَٰنِ اِ۬لرَّحِيمِ",
          surahTitle: l.surah_title_ar || l.surah_title || pageSurah,
        });
      } else if (l.words) {
        for (const w of l.words) {
          if (w.hizb_number && Number(w.hizb_number) !== hizbData.hizb_number) {
            continue;
          }
          items.push({
            type: "word",
            word: w,
            surahTitle: l.surah_title_ar || pageSurah,
          });
        }
      }
    }
  }

  const wordItems = items.filter((x) => x.type === "word");
  const totalWords = wordItems.length;
  // حساب عدد الصفحات الديناميكية المثالي لملء كل صفحة بالكامل دون ترك صفحات شبه فارغة
  const numDynamicPages = Math.max(1, Math.round(totalWords / baseTargetWords));
  const avgTarget = totalWords / numDynamicPages;

  let currentPageItems: DynamicPageItem[] = [];
  let currentWordCount = 0;
  let pageNum = pages.length + 1;
  let currentSurahTitle = items[0]?.surahTitle || "";
  let wordsConsumed = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    currentPageItems.push(item);

    if (item.surahTitle) {
      currentSurahTitle = item.surahTitle;
    }
    if (item.type === "word" && item.word) {
      currentWordCount++;
      wordsConsumed++;
    }

    const isVerseEnd = item.type === "word" && item.word?.is_last_word === "1";
    const remainingDynamicPages = numDynamicPages - (pageNum - (isHizb1 ? 3 : 1));

    // قطع الصفحة بذكاء عند نهاية آية تامة مع فحص السطر الأخير والمقارنة بالآية التالية (Lookahead)
    if (remainingDynamicPages > 1 && isVerseEnd && currentWordCount >= avgTarget - 28) {
      const lastLineWords = currentWordCount % estWordsPerLine || estWordsPerLine;

      // حساب عدد كلمات الآية القادمة لتقييم أيهما أقرب وأجمل للسطر
      let nextVerseWords = 0;
      for (let j = i + 1; j < items.length; j++) {
        if (items[j].type === "word") nextVerseWords++;
        if (items[j].type === "word" && items[j].word?.is_last_word === "1") break;
      }

      const currentDiff = Math.abs(currentWordCount - avgTarget);
      const nextCount = currentWordCount + nextVerseWords;
      const nextDiff = Math.abs(nextCount - avgTarget);
      const nextLastLineWords = nextCount % estWordsPerLine || estWordsPerLine;

      // غرامة السطر الأخير اليتيم (Orphan Penalty) لمنع ترك كلمة أو كلمتين في السطر
      let currentPenalty = currentDiff + (lastLineWords <= 2 ? 80 : lastLineWords <= 4 ? 30 : 0);
      let nextPenalty = nextDiff + (nextLastLineWords <= 2 ? 80 : nextLastLineWords <= 4 ? 30 : 0);

      if (nextCount > avgTarget + 30) nextPenalty += 60;

      if (currentPenalty <= nextPenalty || currentWordCount >= avgTarget + 25) {
        if (lastLineWords >= 3 || currentWordCount >= avgTarget + 35) {
          pages.push({
            pageNumber: pageNum++,
            isOpening: false,
            surahTitle: currentSurahTitle,
            items: currentPageItems,
            wordCount: currentWordCount,
          });
          currentPageItems = [];
          currentWordCount = 0;
        }
      }
    }
  }

  if (currentPageItems.length > 0) {
    pages.push({
      pageNumber: pageNum++,
      isOpening: false,
      surahTitle: currentSurahTitle,
      items: currentPageItems,
      wordCount: currentWordCount,
    });
  }

  return pages;
}

interface QuranHizbReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  hizbNumber: number;
  hizbPeriod?: "subh" | "masa" | "custom";
  onCompleted?: (hizbNumber: number, period?: "subh" | "masa" | "custom") => void;
}

export function QuranHizbReaderModal({
  isOpen,
  onClose,
  hizbNumber,
  hizbPeriod = "custom",
  onCompleted,
}: QuranHizbReaderModalProps) {
  const [currentHizb, setCurrentHizb] = useState<number>(hizbNumber);
  const [data, setData] = useState<QuranHizbData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(26);
  const [viewMode, setViewMode] = useState<"page" | "scroll">("page");
  const [isCompletedToday, setIsCompletedToday] = useState<boolean>(false);
  const [justCompleted, setJustCompleted] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync hizbNumber prop with internal state
  useEffect(() => {
    if (hizbNumber) {
      setCurrentHizb(hizbNumber);
      setCurrentPageIndex(0);
    }
  }, [hizbNumber]);

  // Load Hizb Data
  useEffect(() => {
    if (!isOpen || !currentHizb) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/quran/hizb/${currentHizb}`)
      .then((res) => {
        if (!res.ok) throw new Error("فشل تحميل بيانات الحزب");
        return res.json();
      })
      .then((hizbData: QuranHizbData) => {
        if (isMounted) {
          setData(hizbData);
          setCurrentPageIndex(0);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching hizb data:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentHizb]);

  // Check if completed today in localStorage
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    try {
      const now = new Date();
      const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const savedChecksStr = localStorage.getItem("minhaj_faqir_checks");
      if (savedChecksStr) {
        const savedChecks = JSON.parse(savedChecksStr);
        const dayChecks = savedChecks[todayKey] || {};
        if (hizbPeriod === "subh" && dayChecks["h1_subh"]) {
          setIsCompletedToday(true);
        } else if (hizbPeriod === "masa" && dayChecks["h1_masa"]) {
          setIsCompletedToday(true);
        } else {
          // Check general quran log
          const quranLogStr = localStorage.getItem("minhaj_quran_ahzab_checks");
          if (quranLogStr) {
            const quranLog = JSON.parse(quranLogStr);
            if (quranLog[todayKey]?.[currentHizb]) {
              setIsCompletedToday(true);
            } else {
              setIsCompletedToday(false);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen, currentHizb, hizbPeriod]);

  // Handle Mark as Completed
  const handleMarkCompleted = () => {
    try {
      const now = new Date();
      const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      // 1. Update faqir checks
      const savedChecksStr = localStorage.getItem("minhaj_faqir_checks") || "{}";
      const savedChecks = JSON.parse(savedChecksStr);
      if (!savedChecks[todayKey]) savedChecks[todayKey] = {};

      if (hizbPeriod === "subh") {
        savedChecks[todayKey]["h1_subh"] = true;
      } else if (hizbPeriod === "masa") {
        savedChecks[todayKey]["h1_masa"] = true;
      } else {
        // Fallback or custom
        savedChecks[todayKey]["h1_subh"] = true;
      }
      localStorage.setItem("minhaj_faqir_checks", JSON.stringify(savedChecks));

      // 2. Update general quran tracking log
      const quranLogStr = localStorage.getItem("minhaj_quran_ahzab_checks") || "{}";
      const quranLog = JSON.parse(quranLogStr);
      if (!quranLog[todayKey]) quranLog[todayKey] = {};
      quranLog[todayKey][currentHizb] = true;
      localStorage.setItem("minhaj_quran_ahzab_checks", JSON.stringify(quranLog));

      // 3. Dispatch custom event for immediate UI sync
      window.dispatchEvent(
        new CustomEvent("faqir-checks-updated", {
          detail: { dateKey: todayKey, hizbNumber: currentHizb, period: hizbPeriod },
        })
      );

      setIsCompletedToday(true);
      setJustCompleted(true);
      if (onCompleted) {
        onCompleted(currentHizb, hizbPeriod);
      }
      setTimeout(() => setJustCompleted(false), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const targetWordsPerPage = Math.max(120, Math.round(170 * (26 / fontSize)));
  const dynamicPages = useMemo(() => {
    if (!data) return [];
    return partitionHizbWords(data, targetWordsPerPage);
  }, [data, targetWordsPerPage]);

  if (!isOpen) return null;

  const meta = getHizbMeta(currentHizb);

  const totalPages = dynamicPages.length;
  const safePageIndex = Math.min(currentPageIndex, Math.max(0, totalPages - 1));
  const currentPage: DynamicQuranPage | null = dynamicPages[safePageIndex] || null;

  const handlePrevPage = () => {
    if (safePageIndex > 0) {
      setCurrentPageIndex(safePageIndex - 1);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  const handleNextPage = () => {
    if (safePageIndex < totalPages - 1) {
      setCurrentPageIndex(safePageIndex + 1);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  const handleSelectHizb = (hNum: number) => {
    setCurrentHizb(hNum);
    setCurrentPageIndex(0);
  };

  const renderHabtiMark = () => (
    <span
      className="inline-block font-maghribi-quran text-[0.62em] font-bold leading-none text-[#9E7B35] dark:text-[#E5C378] select-none ms-0.5"
      style={{ verticalAlign: "0.35em" }}
      title="وقف الهبطي (المصحف المحمدي)"
      aria-label="وقف الهبطي"
    >
      ص
    </span>
  );

  const renderBasmalaLine = (rawBasmala?: string) => {
    const base = rawBasmala || "بِسْمِ اِ۬للَّهِ اِ۬لرَّحْمَٰنِ اِ۬لرَّحِيمِ";
    const hasHabti = base.includes("\u06d6");
    const displayBasmala = base.replace(/\u06d6/g, "");
    return (
      <span className="inline-block whitespace-nowrap">
        <span>{displayBasmala}</span>
        {hasHabti && renderHabtiMark()}
      </span>
    );
  };

  const renderQuranWord = (w: QuranWord, wIdx: number) => {
    const tomonInfo =
      w.is_first_tomon === "1"
        ? getTomonDivisionInfo(w.tomon_number || "1", currentHizb)
        : null;
    const cleanedText = cleanQuranWordText(w.text);
    const hasHabti = cleanedText.includes("\u06d6");
    const displayWord = hasHabti ? cleanedText.replace(/\u06d6/g, "") : cleanedText;

    return (
      <React.Fragment key={w.id || wIdx}>
        {/* Moroccan Quran Division Badge (Hizb, Nisf, Rub', Thumun) */}
        {tomonInfo && (
          <span
            className={`inline-flex items-center gap-1 mx-1.5 align-middle rounded-full select-none cursor-default font-amiri ${tomonInfo.badgeStyle}`}
            title={tomonInfo.label}
          >
            <span>{tomonInfo.label}</span>
          </span>
        )}

        {/* Word + Optional Habti Stop + Optional Sajdah + Optional Verse Rosette kept non-breaking */}
        <span className="inline-block whitespace-nowrap">
          <span className="hover:text-[#C5A059] transition-colors">
            {displayWord}
          </span>
          {hasHabti && renderHabtiMark()}

          {/* Maliki Sajdah emblem when indicated by Awqaf Mushaf */}
          {w.is_last_word === "1" && w.verse?.sajda === "1" && (
            <span
              className="inline-flex items-center gap-0.5 mx-1 text-[#9E7B35] dark:text-[#E5C378] select-none align-middle"
              title="موضع سجدة التلاوة"
            >
              <span className="font-maghribi-quran text-[1.05em] leading-none">
                ۩
              </span>
            </span>
          )}

          {/* Ornate Moroccan Mushaf Rosette Verse Number in Western Digits (1, 2, 3...) */}
          {w.is_last_word === "1" && w.verse?.verse_number && (
            <span
              className="relative inline-flex items-center justify-center min-w-[28px] h-[28px] px-1 mx-1 select-none align-middle"
              title={`الآية ${w.verse.verse_number}`}
            >
              <svg
                viewBox="0 0 36 36"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full text-[#C5A059]"
              >
                <polygon
                  points="18,1.5 22.8,6.2 29.5,6.5 29.8,13.2 34.5,18 29.8,22.8 29.5,29.5 22.8,29.8 18,34.5 13.2,29.8 6.5,29.5 6.2,22.8 1.5,18 6.2,13.2 6.5,6.5 13.2,6.2"
                  fill="currentColor"
                  fillOpacity="0.14"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinejoin="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="10.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  strokeOpacity="0.65"
                />
              </svg>
              <span
                className="relative z-10 font-jakarta text-[11px] font-bold leading-none text-[#826122] dark:text-[#E5C378]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {w.verse.verse_number}
              </span>
            </span>
          )}
        </span>{" "}
      </React.Fragment>
    );
  };

  const renderDynamicQuranPage = (page: DynamicQuranPage) => {
    // 1. الفاتحة وأول البقرة (صفحات تصديرية مركزة في الوسط بهيبة ووقار)
    if (page.isOpening && page.openingLines) {
      return (
        <div
          className="space-y-4 font-maghribi-quran selection:bg-[#C5A059]/30 text-center py-6 sm:py-8 max-w-xl mx-auto"
          style={{ fontSize: `${fontSize}px` }}
        >
          {page.openingLines.map((line) => {
            if (line.is_surah_title === "1") {
              return (
                <div
                  key={line.line_id}
                  className="my-4 py-2 px-6 rounded-2xl bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059]/35 to-[#C5A059]/20 border-2 border-[#C5A059] text-center shadow-xs max-w-sm mx-auto"
                >
                  <div className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-snug">
                    سُورَةُ {line.surah_title_ar || line.surah_title}
                  </div>
                </div>
              );
            }

            if (line.is_basmala === "1") {
              return (
                <div
                  key={line.line_id}
                  className="w-full text-center text-[#1B4332] dark:text-[#E5C378] py-1.5 select-text"
                  style={{ lineHeight: 2 }}
                >
                  {renderBasmalaLine(line.basmala_text)}
                </div>
              );
            }

            return (
              <div
                key={line.line_id}
                className="w-full text-center text-[#143628] dark:text-[#EAF2ED] select-text py-1"
                style={{
                  textAlign: "center",
                  textAlignLast: "center",
                  lineHeight: 2.3,
                }}
              >
                {line.words.map((w, wIdx) => renderQuranWord(w, wIdx))}
              </div>
            );
          })}
        </div>
      );
    }

    if (!page.items) return null;

    // 2. تقسيم عناصر الصفحة الديناميكية الكاملة إلى لافتات وبسملات وفقرات نصية متصلة
    const sections: Array<{
      type: "banner" | "basmala" | "text";
      title?: string;
      basmalaText?: string;
      words?: QuranWord[];
      isEndOfSurah?: boolean;
    }> = [];
    let curWords: QuranWord[] = [];

    for (const it of page.items) {
      if (it.type === "banner" || it.type === "basmala") {
        if (curWords.length > 0) {
          const lastW = curWords[curWords.length - 1];
          sections.push({
            type: "text",
            words: curWords,
            isEndOfSurah:
              lastW.is_last_word === "1" && lastW.verse?.is_last_verse === "1",
          });
          curWords = [];
        }
        if (it.type === "banner") {
          sections.push({ type: "banner", title: it.title });
        } else {
          sections.push({ type: "basmala", basmalaText: it.basmalaText });
        }
      } else if (it.type === "word" && it.word) {
        curWords.push(it.word);
      }
    }
    if (curWords.length > 0) {
      const lastW = curWords[curWords.length - 1];
      sections.push({
        type: "text",
        words: curWords,
        isEndOfSurah:
          lastW.is_last_word === "1" && lastW.verse?.is_last_verse === "1",
      });
    }

    return (
      <div
        className="space-y-4 font-maghribi-quran selection:bg-[#C5A059]/30 py-1"
        style={{ fontSize: `${fontSize}px` }}
      >
        {sections.map((sec, sIdx) => {
          if (sec.type === "banner") {
            return (
              <div
                key={`bn-${sIdx}`}
                className="my-4 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059]/35 to-[#C5A059]/20 border-2 border-[#C5A059] text-center shadow-xs"
              >
                <div className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-snug">
                  سُورَةُ {sec.title}
                </div>
              </div>
            );
          }

          if (sec.type === "basmala") {
            return (
              <div
                key={`bsm-${sIdx}`}
                className="w-full text-center text-[#1B4332] dark:text-[#E5C378] py-1 select-text"
                style={{ lineHeight: 2 }}
              >
                {renderBasmalaLine(sec.basmalaText)}
              </div>
            );
          }

          return (
            <div
              key={`txt-${sIdx}`}
              className="w-full text-justify text-[#143628] dark:text-[#EAF2ED] select-text"
              style={{
                textAlign: "justify",
                textJustify: "inter-word",
                textAlignLast:
                  sec.isEndOfSurah || (sec.words && sec.words.length % 13 > 0 && sec.words.length % 13 <= 4)
                    ? "center"
                    : "auto",
                textWrap: "pretty" as any,
                lineHeight: 2.3,
              }}
            >
              {sec.words?.map((w, wIdx) => renderQuranWord(w, wIdx))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md transition-all duration-300"
      dir="rtl"
    >
      <div className="relative w-full max-w-4xl h-[95vh] max-h-[920px] bg-[#FAF7F2] dark:bg-[#07130E] border-2 border-[#C5A059]/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1D2A24] dark:text-[#E8F0EC]">
        {/* TOP BAR / HEADER */}
        <div className="p-3.5 sm:p-4 bg-[#143628] border-b-2 border-[#C5A059]/50 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C378] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-amiri text-lg sm:text-2xl font-bold text-[#FAF7F2]">
                  الحِزْبُ {currentHizb}
                </h3>
                {hizbPeriod === "subh" && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-200 text-xs font-bold">
                    🌅 حِزْبُ الصَّبَاحِ
                  </span>
                )}
                {hizbPeriod === "masa" && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-xs font-bold">
                    🌇 حِزْبُ المَسَاءِ
                  </span>
                )}
              </div>
              <p className="text-xs text-[#E8F0EC]/80 font-ibm line-clamp-1">
                سُوَر: {meta.surahs.join(" • ")} | مطلع: «<span className="font-maghribi-quran text-sm text-[#FAF7F2]">{meta.matlaa}</span>»
              </p>
            </div>
          </div>

          {/* Quick Hizb Dropdown Selector */}
          <div className="flex items-center gap-2">
            <select
              value={currentHizb}
              onChange={(e) => handleSelectHizb(Number(e.target.value))}
              className="bg-white/10 text-white border border-[#C5A059]/40 rounded-xl px-2.5 py-1.5 text-xs font-amiri font-bold hover:bg-white/20 transition cursor-pointer"
            >
              {ALL_AHZAB_INDEX.map((h) => (
                <option key={h.hizb_number} value={h.hizb_number} className="text-black">
                  الحزب {h.hizb_number} ({h.surahs.slice(0, 2).join("، ")})
                </option>
              ))}
            </select>

            {/* Font Size Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-xl p-1 border border-white/15">
              <button
                onClick={() => setFontSize((f) => Math.min(38, f + 2))}
                className="p-1 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"
                title="تكبير الخط"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFontSize((f) => Math.max(18, f - 2))}
                className="p-1 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"
                title="تصغير الخط"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode((m) => (m === "page" ? "scroll" : "page"))}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition cursor-pointer"
              title={viewMode === "page" ? "تفعيل وضع التمرير المتصل" : "تفعيل وضع المصحف بالصفحات"}
            >
              {viewMode === "page" ? <ScrollText className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-xl border border-white/20 transition cursor-pointer"
              title="إغلاق المصحف"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* READING AREA */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6] dark:from-[#091811] dark:to-[#050D09]"
        >
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 py-24">
              <Loader2 className="w-10 h-10 text-[#C5A059] animate-spin" />
              <div className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E5C378]">
                جَارٍ تَحْمِيلُ الحِزْبِ المُبَارَكِ بِالخَطِّ المَغْرِبِيِّ الأَصِيلِ...
              </div>
              <p className="text-xs text-[#52796F] dark:text-[#9BB0A5] font-ibm">
                مِنْ نُسْخَةِ المَصْحَفِ المَحَمَّدِيِّ الشَّرِيفِ (رِوَايَةُ وَرْشٍ عَنْ نَافِعٍ)
              </p>
            </div>
          ) : !data || totalPages === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 py-20 text-center">
              <BookOpen className="w-12 h-12 text-gray-400" />
              <p className="font-amiri text-lg text-gray-600 dark:text-gray-300">
                تعذر تحميل بيانات هذا الحزب حالياً. يرجى المحاولة لاحقاً.
              </p>
            </div>
          ) : viewMode === "page" ? (
            // SINGLE PAGE MUSHAF VIEW (Dynamic Full Pages - Option 2)
            currentPage && (
              <div className="max-w-2xl mx-auto bg-[#FFFDF9] dark:bg-[#0B1F17] rounded-2xl border-4 border-[#C5A059]/70 p-4 sm:p-6 shadow-xl relative transition-all duration-300">
                {/* Decorative Top Moroccan Border Line */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#C5A059]/40 text-xs font-amiri font-bold text-[#826122] dark:text-[#E5C378]">
                  <span>سُورَةُ {currentPage.surahTitle || meta.surahs[0]}</span>
                  <span className="px-3 py-0.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30">
                    الحِزْبُ {currentHizb}
                  </span>
                  <span>الصَّفْحَةُ {currentPage.pageNumber}</span>
                </div>

                {/* Quran Page Body (Option 2 Dynamic Flow) */}
                {renderDynamicQuranPage(currentPage)}

                {/* Decorative Bottom Line */}
                <div className="flex items-center justify-between pt-3 mt-4 border-t-2 border-[#C5A059]/40 text-xs font-ibm text-[#52796F] dark:text-[#9BB0A5]">
                  <span>مصحف محمد السادس بالخط المغربي</span>
                  <span className="font-bold text-[#C5A059]">
                    {safePageIndex + 1} / {totalPages}
                  </span>
                  <span>رواية ورش عن نافع</span>
                </div>
              </div>
            )
          ) : (
            // CONTINUOUS SCROLL VIEW (All Dynamic Pages of the Hizb)
            <div className="max-w-2xl mx-auto space-y-6">
              {dynamicPages.map((page) => (
                <div
                  key={page.pageNumber}
                  className="bg-[#FFFDF9] dark:bg-[#0B1F17] rounded-2xl border-2 border-[#C5A059]/50 p-4 sm:p-6 shadow-md"
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#C5A059]/30 text-xs font-amiri font-bold text-[#826122] dark:text-[#E5C378]">
                    <span>سورة {page.surahTitle || meta.surahs[0]}</span>
                    <span>صفحة {page.pageNumber}</span>
                  </div>

                  {/* Quran Page Body (Option 2 Dynamic Flow) */}
                  {renderDynamicQuranPage(page)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION & COMPLETION BAR */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#0A1A13] border-t-2 border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Page Navigator (in Page Mode) */}
          {viewMode === "page" ? (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={handlePrevPage}
                disabled={safePageIndex === 0}
                className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#C5A059]/40 text-[#143628] dark:text-[#FAF7F2] text-xs font-bold flex items-center gap-1 hover:bg-[#C5A059]/15 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الصفحة السابقة</span>
              </button>

              <span className="text-xs font-ibm font-bold text-[#826122] dark:text-[#E5C378] px-2">
                {safePageIndex + 1} / {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={safePageIndex >= totalPages - 1}
                className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#C5A059]/40 text-[#143628] dark:text-[#FAF7F2] text-xs font-bold flex items-center gap-1 hover:bg-[#C5A059]/15 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <span>الصفحة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-xs text-[#52796F] dark:text-[#9BB0A5] font-ibm">
              وضع التمرير المتصل: {totalPages} صفحات للحزب المبارك
            </div>
          )}

          {/* Completion Button */}
          <div className="w-full sm:w-auto flex items-center justify-end">
            <button
              onClick={handleMarkCompleted}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                isCompletedToday
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-gradient-to-r from-[#1B4332] via-[#245942] to-[#1B4332] hover:from-[#143628] hover:to-[#143628] text-[#E5C378] border border-[#C5A059]/50"
              }`}
            >
              {isCompletedToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>أَتْمَمْتَ قِرَاءَةَ هَذَا الحِزْبِ اليَوْمَ (تَقَبَّلَ اللَّهُ) ✓</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>أَتْمَمْتُ قِرَاءَةَ الحِزْبِ (تَقَبَّلَ اللَّهُ) ✅</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Celebration Toast on Completion */}
        {justCompleted && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-[#143628] text-white border-2 border-[#C5A059] shadow-2xl flex items-center gap-3 animate-bounce">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="font-amiri text-base font-bold text-[#E5C378]">
                تَقَبَّلَ اللَّهُ طَاعَتَكُمْ وَجَعَلَ القُرْآنَ رَبِيعَ قُلُوبِكُمْ 🌿
              </div>
              <div className="text-[11px] text-[#E8F0EC]/80 font-ibm">
                تم تسجيل إنجاز الحزب في سجل وردك اليومي بنجاح
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
