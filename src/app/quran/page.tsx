"use client";

import React, { Suspense, useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Search,
  ChevronLeft,
  Sun,
  Sunset,
  Sparkles,
  Layers,
  Compass,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ALL_AHZAB_INDEX,
  HizbIndexItem,
  getTodayAhzabNumbers,
} from "@/lib/quran";
import { ALL_THEMATIC_TOPICS, getTotalThematicVersesCount } from "@/lib/quran_thematic";
import { QuranHizbReaderModal } from "@/components/QuranHizbReaderModal";
import { QuranThematicExplorer } from "@/components/QuranThematicExplorer";
import { QiblaCompassModal } from "@/components/QiblaCompassModal";

// Fixed date for deterministic SSR / SSG prerender
const INITIAL_DATE = new Date("2026-11-05T12:00:00Z");

const VALID_THEMATIC_TOPICS = new Set(["all", ...ALL_THEMATIC_TOPICS.map((t) => t.id)]);

function QuranUrlSync({
  onSync,
}: {
  onSync: (opts: {
    view: "ahzab" | "thematic";
    topicId: string;
    searchQuery: string;
    mode?: "thematic" | "mushaf";
  }) => void;
}) {
  const searchParams = useSearchParams();
  const prevKeyRef = useRef<string>("__INIT__");
  const rawView = searchParams.get("view") || "";
  const rawTopic = searchParams.get("topic") || "";
  const rawQ = (searchParams.get("q") || "").trim();
  const rawMode = searchParams.get("mode") || "";

  useEffect(() => {
    const hashIsThematic =
      typeof window !== "undefined" && window.location.hash === "#thematic";
    const key = `${rawView}|${rawTopic}|${rawQ}|${rawMode}|${hashIsThematic ? "1" : "0"}`;
    if (prevKeyRef.current === key) return;

    const isDefault =
      prevKeyRef.current === "__INIT__" &&
      !rawView &&
      !rawTopic &&
      !rawQ &&
      !rawMode &&
      !hashIsThematic;
    prevKeyRef.current = key;
    if (isDefault) return;

    const shouldShowThematic =
      rawView === "thematic" ||
      hashIsThematic ||
      Boolean(rawTopic) ||
      Boolean(rawQ) ||
      rawMode === "mushaf";

    const safeTopic =
      rawTopic && VALID_THEMATIC_TOPICS.has(rawTopic) ? rawTopic : "all";
    const safeMode: "thematic" | "mushaf" | undefined =
      rawMode === "mushaf" || (rawQ && !rawTopic)
        ? "mushaf"
        : rawMode === "thematic" || rawTopic
          ? "thematic"
          : undefined;

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        onSync({
          view: shouldShowThematic ? "thematic" : "ahzab",
          topicId: safeTopic,
          searchQuery: rawQ,
          mode: safeMode,
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [rawView, rawTopic, rawQ, rawMode, onSync]);

  return null;
}

export default function QuranIndexPage() {
  const [mainView, setMainView] = useState<"ahzab" | "thematic">("ahzab");
  const [urlTopicId, setUrlTopicId] = useState<string>("all");
  const [urlSearchQuery, setUrlSearchQuery] = useState<string>("");
  const [urlMode, setUrlMode] = useState<"thematic" | "mushaf" | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "today" | "first_half" | "second_half" | "mufassal"
  >("all");
  const [activeReaderHizb, setActiveReaderHizb] = useState<number | null>(null);
  const [readerPeriod, setReaderPeriod] = useState<"subh" | "masa" | "custom">("custom");
  const [todayAhzab, setTodayAhzab] = useState(() => getTodayAhzabNumbers(INITIAL_DATE));
  const [showQiblaModal, setShowQiblaModal] = useState(false);

  const totalThematicVerses = useMemo(() => getTotalThematicVersesCount(), []);

  // Update client-side on mount
  React.useEffect(() => {
    queueMicrotask(() => {
      setTodayAhzab(getTodayAhzabNumbers(new Date()));
    });
  }, []);

  // Filtered Ahzab
  const filteredAhzab = useMemo(() => {
    let list: HizbIndexItem[] = ALL_AHZAB_INDEX;

    // Apply Filter Tab
    if (selectedFilter === "today") {
      list = list.filter(
        (h) =>
          h.hizb_number === todayAhzab.morningHizb ||
          h.hizb_number === todayAhzab.eveningHizb
      );
    } else if (selectedFilter === "first_half") {
      list = list.filter((h) => h.hizb_number <= 30);
    } else if (selectedFilter === "second_half") {
      list = list.filter((h) => h.hizb_number > 30);
    } else if (selectedFilter === "mufassal") {
      list = list.filter((h) => h.hizb_number >= 51);
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((h) => {
        const matchesNum = String(h.hizb_number).includes(q);
        const matchesSurah = h.surahs.some((s) => s.toLowerCase().includes(q));
        const matchesMatlaa = h.matlaa.toLowerCase().includes(q);
        return matchesNum || matchesSurah || matchesMatlaa;
      });
    }

    return list;
  }, [selectedFilter, searchQuery, todayAhzab]);

  const openHizbReader = (hizbNumber: number, period: "subh" | "masa" | "custom" = "custom") => {
    setActiveReaderHizb(hizbNumber);
    setReaderPeriod(period);
  };

  const handleSyncUrl = React.useCallback(
    (opts: {
      view: "ahzab" | "thematic";
      topicId: string;
      searchQuery: string;
      mode?: "thematic" | "mushaf";
    }) => {
      setMainView(opts.view);
      setUrlTopicId(opts.topicId);
      setUrlSearchQuery(opts.searchQuery);
      setUrlMode(opts.mode);
    },
    []
  );

  return (
    <div
      className="min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC] flex flex-col selection:bg-[#C5A059]/25 selection:text-[#1B4332]"
      dir="rtl"
    >
      <Suspense fallback={null}>
        <QuranUrlSync onSync={handleSyncUrl} />
      </Suspense>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#A1B3A9]">
          <Link href="/" className="hover:text-[#C5A059] transition">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-[#143628] dark:text-[#E5C378] font-bold">
            المصحف المحمدي الشريف (60 حزباً)
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-white border-2 border-[#C5A059]/40 shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>رِوَايَةُ وَرْشٍ عَنْ نَافِعٍ • الخَطُّ المَغْرِبِيُّ الأَصِيلُ</span>
            </div>

            <h1 className="font-amiri text-2xl sm:text-5xl font-bold text-[#FAF7F2] leading-tight">
              المُصْحَفُ المَحَمَّدِيُّ الشَّرِيفُ
            </h1>

            <p className="text-xs sm:text-sm text-[#E8F0EC]/85 font-ibm leading-relaxed">
              تصفح وتلاوة الأحزاب الستين كاملة كما خُطت في المصحف المحمدي الشريف الصادر عن وزارة الأوقاف والشؤون الإسلامية بالمملكة المغربية، مع متابعة الورد الراتب اليومي (حزبا الصباح والمساء) وتأشير الإنجاز في فضاء الفقير.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#C5A059]/25 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[#E5C378] block font-ibm">عدد الأحزاب</span>
              <span className="text-base font-bold font-amiri text-white">60 حِزْباً كَامِلاً</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[#E5C378] block font-ibm">عدد الصفحات</span>
              <span className="text-base font-bold font-amiri text-white">638 صَفْحَةً</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[#E5C378] block font-ibm">حزب الصباح اليوم</span>
              <button
                onClick={() => openHizbReader(todayAhzab.morningHizb, "subh")}
                className="text-sm font-bold text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sun className="w-3.5 h-3.5" />
                <span>الحزب {todayAhzab.morningHizb}</span>
              </button>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[#E5C378] block font-ibm">حزب المساء اليوم</span>
              <button
                onClick={() => openHizbReader(todayAhzab.eveningHizb, "masa")}
                className="text-sm font-bold text-orange-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sunset className="w-3.5 h-3.5" />
                <span>الحزب {todayAhzab.eveningHizb}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main View Switcher & Qibla Compass Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center justify-center p-1.5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] w-full max-w-lg shadow-xs">
            <button
              onClick={() => setMainView("ahzab")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                mainView === "ahzab"
                  ? "bg-[#143628] text-[#E5C378] shadow-sm"
                  : "text-[#52796F] dark:text-[#A1B3A9] hover:text-[#143628] dark:hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>الأحزاب الستون (المصحف)</span>
            </button>

            <button
              onClick={() => setMainView("thematic")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                mainView === "thematic"
                  ? "bg-[#143628] text-[#E5C378] shadow-sm"
                  : "text-[#52796F] dark:text-[#A1B3A9] hover:text-[#143628] dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>الكشاف القرآني لمقامات السلوك</span>
            </button>
          </div>

          <button
            onClick={() => setShowQiblaModal(true)}
            className="px-4 py-3 rounded-2xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] border-2 border-[#C5A059]/60 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-md cursor-pointer shrink-0"
          >
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>بوصلة القبلة للصلاة</span>
          </button>
        </div>

        {mainView === "thematic" ? (
          <QuranThematicExplorer
            key={`${urlTopicId}-${urlSearchQuery}-${urlMode || ""}`}
            onOpenHizb={(hNum) => openHizbReader(hNum, "custom")}
            initialTopicId={urlTopicId}
            initialSearchQuery={urlSearchQuery}
            initialMode={urlMode}
          />
        ) : (
          <>
            {/* Quick CTA into Full Mushaf Search & Thematic Proofs */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-l from-[#143628]/8 via-[#C5A059]/10 to-white dark:from-[#143628]/60 dark:via-[#122820] dark:to-[#0E2019] border border-[#C5A059]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#826122] dark:text-[#E5C378]">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>الكَشَّافُ القُرْآنِيُّ وَالبَحْثُ الشَّامِلُ فِي المُصْحَفِ (6,214 آيَةً)</span>
                </div>
                <p className="text-xs font-ibm text-[#52796F] dark:text-[#A1B3A9]">
                  تصفح {totalThematicVerses} شاهداً قرآنياً مؤصلاً في 12 باباً سلوكياً، أو ابحث فوراً عن أي كلمة أو آية في المصحف المحمدي مع التفاسير الأربعة.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setUrlMode("thematic");
                    setMainView("thematic");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] border border-[#C5A059]/45 text-xs font-bold transition cursor-pointer"
                >
                  تصفح {totalThematicVerses} شاهداً مؤصلاً
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUrlMode("mushaf");
                    setUrlSearchQuery("الذكر");
                    setMainView("thematic");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#122820] hover:border-[#C5A059] text-[#143628] dark:text-[#E5C378] border border-[#C5A059]/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>البحث في 6,214 آية</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث برقم الحزب (مثلاً: 1)، اسم السورة (البقرة)، أو مطلع الآية..."
                  className="w-full pr-10 pl-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#1D2A24] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
                {(
                  [
                    { key: "all", label: "جميع الأحزاب (60)" },
                    { key: "today", label: "حزبا اليوم الراتب" },
                    { key: "first_half", label: "النصف الأول (1-30)" },
                    { key: "second_half", label: "النصف الثاني (31-60)" },
                    { key: "mufassal", label: "المُفَصَّل (51-60)" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedFilter === tab.key
                        ? "bg-[#143628] text-white dark:bg-[#C5A059] dark:text-[#143628] shadow-xs"
                        : "bg-[#FAF7F2] dark:bg-[#122820] text-[#52796F] dark:text-[#A1B3A9] hover:bg-[#C5A059]/15"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 60 Ahzab Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAhzab.map((hizb) => {
                const isMorning = hizb.hizb_number === todayAhzab.morningHizb;
                const isEvening = hizb.hizb_number === todayAhzab.eveningHizb;

                return (
                  <div
                    key={hizb.hizb_number}
                    className={`p-5 rounded-2xl bg-white dark:bg-[#0E2019] border transition-all duration-200 space-y-3 shadow-xs hover:shadow-md ${
                      isMorning || isEvening
                        ? "border-2 border-[#C5A059] ring-2 ring-[#C5A059]/20"
                        : "border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]/60"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#143628] dark:bg-[#1B4332] text-[#C5A059] flex items-center justify-center font-sans font-bold text-sm">
                          {hizb.hizb_number}
                        </div>
                        <div>
                          <h3 className="font-amiri text-base sm:text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                            الحِزْبُ {hizb.hizb_number}
                          </h3>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-1.5">
                        {isMorning && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                            🌅 ورد الصباح
                          </span>
                        )}
                        {isEvening && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300 text-[10px] font-bold">
                            🌇 ورد المساء
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] font-bold">
                          {hizb.page_count} صفحة
                        </span>
                      </div>
                    </div>

                    {/* Surahs contained */}
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {hizb.surahs.map((surah) => (
                        <span
                          key={surah}
                          className="px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#122820] text-[#52796F] dark:text-[#A1B3A9] border border-[#E7DFD5]/80 dark:border-[#203D31]/80 font-ibm"
                        >
                          سورة {surah}
                        </span>
                      ))}
                    </div>

                    {/* Opening Aya (Matlaa) */}
                    <p className="text-base text-[#143628] dark:text-[#FAF7F2] font-maghribi-quran leading-loose p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#C5A059]/20 line-clamp-2">
                      « {hizb.matlaa} »
                    </p>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-[10px] text-gray-500 font-ibm">
                        ص {hizb.start_page} إلى ص {hizb.end_page}
                      </span>

                      <button
                        onClick={() =>
                          openHizbReader(
                            hizb.hizb_number,
                            isMorning ? "subh" : isEvening ? "masa" : "custom"
                          )
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>تلاوة الحزب بالمصحف</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAhzab.length === 0 && (
              <div className="p-12 text-center bg-white dark:bg-[#0E2019] rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
                <p className="font-amiri text-lg text-gray-600 dark:text-gray-300">
                  لم يتم العثور على أي حزب يطابق بحثك «{searchQuery}».
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilter("all");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#143628] text-white text-xs font-bold transition cursor-pointer"
                >
                  عرض جميع الأحزاب الستين
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Reader Modal */}
      {activeReaderHizb && (
        <QuranHizbReaderModal
          isOpen={true}
          onClose={() => setActiveReaderHizb(null)}
          hizbNumber={activeReaderHizb}
          hizbPeriod={readerPeriod}
        />
      )}

      {/* Qibla Compass Modal */}
      <QiblaCompassModal
        isOpen={showQiblaModal}
        onClose={() => setShowQiblaModal(false)}
      />

      <Footer />
    </div>
  );
}
