"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Sparkles,
  Users,
  HeartHandshake,
  Heart,
  GraduationCap,
  ShieldCheck,
  Search,
  BookOpen,
  BookOpenText,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Filter,
  Crown,
  Coins,
  Compass,
  Loader2,
  X,
} from "lucide-react";
import {
  ALL_THEMATIC_TOPICS,
  getTotalThematicVersesCount,
  normalizeArabicForSearch,
} from "@/lib/quran_thematic";
import type { ThematicTopicEntry, VerifiedQuranVerse } from "@/types/quran-evidence";
import { formatQuranTextForMashriqiDots, toArabicDigits } from "@/lib/quran";
import { QuranicEvidencePanel } from "@/components/QuranicEvidencePanel";

interface QuranThematicExplorerProps {
  onOpenHizb?: (hizbNumber: number) => void;
  initialTopicId?: string;
  initialSearchQuery?: string;
  initialMode?: "thematic" | "mushaf";
}

interface MushafSearchHit {
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

type ClassicalTafsirSource =
  | "mukhtasar"
  | "qurtubi"
  | "ibn_atiyyah"
  | "ibn_ashur"
  | "french";

interface ClassicalTafsirVerse {
  key: string;
  surah_name: string;
  verse_number: number;
  warsh_ref: string;
  hafs_note?: string;
  verse_text: string;
  mukhtasar: string;
  ibn_atiyyah: string;
  qurtubi: string;
  ibn_ashur: string;
  fr_translation?: string;
  fr_mokhtasar?: string;
}

const TOPIC_ICONS: Record<string, React.ElementType> = {
  Sparkles,
  Crown,
  Users,
  HeartHandshake,
  Coins,
  Heart,
  GraduationCap,
  Compass,
  ShieldCheck,
  BookOpen,
};

const QUICK_SEARCH_CHIPS = [
  "الذكر",
  "تسبح",
  "لا إله إلا الله",
  "الصحبة",
  "ينفقون",
  "التوبة",
  "الرحمة",
  "الصبر",
  "33:41",
];

const TAFSIR_TABS: Array<{ id: ClassicalTafsirSource; label: string }> = [
  { id: "mukhtasar", label: "المختصر" },
  { id: "qurtubi", label: "القرطبي" },
  { id: "ibn_atiyyah", label: "ابن عطية" },
  { id: "ibn_ashur", label: "ابن عاشور" },
  { id: "french", label: "Français" },
];

export function QuranThematicExplorer({
  onOpenHizb,
  initialTopicId = "all",
  initialSearchQuery = "",
  initialMode,
}: QuranThematicExplorerProps) {
  const [explorerMode, setExplorerMode] = useState<"thematic" | "mushaf">(
    initialMode || (initialSearchQuery && initialTopicId === "all" ? "mushaf" : "thematic")
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopicId || "all");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery || "");

  // Full-Mushaf live search states
  const [mushafScope, setMushafScope] = useState<"all" | "verse">("all");
  const [mushafHits, setMushafHits] = useState<MushafSearchHit[]>([]);
  const [mushafTotal, setMushafTotal] = useState<number>(0);
  const [mushafLoading, setMushafLoading] = useState<boolean>(false);
  const [mushafLoadingMore, setMushafLoadingMore] = useState<boolean>(false);
  const [mushafDotted, setMushafDotted] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Per-hit classical tafsir drawer inside Full-Mushaf view
  const [openHitKey, setOpenHitKey] = useState<string | null>(null);
  const [loadingHitKey, setLoadingHitKey] = useState<string | null>(null);
  const [hitTafsirCache, setHitTafsirCache] = useState<Record<string, ClassicalTafsirVerse>>({});
  const [activeTafsirTab, setActiveTafsirTab] =
    useState<ClassicalTafsirSource>("mukhtasar");

  const totalThematicVerses = useMemo(() => getTotalThematicVersesCount(), []);

  const selectedTopic = useMemo<ThematicTopicEntry | undefined>(
    () =>
      selectedTopicId === "all"
        ? undefined
        : ALL_THEMATIC_TOPICS.find((t) => t.id === selectedTopicId),
    [selectedTopicId]
  );

  // Filtered curated verses inside Thematic mode
  const filteredThematicVerses = useMemo<VerifiedQuranVerse[]>(() => {
    const cleanQ = normalizeArabicForSearch(searchQuery);
    const list: VerifiedQuranVerse[] = [];

    for (const topic of ALL_THEMATIC_TOPICS) {
      if (selectedTopicId !== "all" && topic.id !== selectedTopicId) continue;

      const topicTitleNorm = normalizeArabicForSearch(topic.title);
      for (const verse of topic.verses) {
        if (!cleanQ) {
          list.push(verse);
        } else {
          const match =
            normalizeArabicForSearch(verse.verse_text).includes(cleanQ) ||
            normalizeArabicForSearch(verse.surah_name).includes(cleanQ) ||
            normalizeArabicForSearch(verse.tafsir_summary || "").includes(cleanQ) ||
            normalizeArabicForSearch(verse.ishari_benefit).includes(cleanQ) ||
            normalizeArabicForSearch(verse.practical_amal || "").includes(cleanQ) ||
            topicTitleNorm.includes(cleanQ) ||
            (verse.keywords || []).some((k) => normalizeArabicForSearch(k).includes(cleanQ));
          if (match) list.push(verse);
        }
      }
    }

    return list;
  }, [selectedTopicId, searchQuery]);

  const runMushafSearch = useCallback(
    async (queryText: string, scopeVal: "all" | "verse", offsetVal = 0, append = false) => {
      const q = queryText.trim();
      if (!q) {
        setMushafHits([]);
        setMushafTotal(0);
        return;
      }

      if (append) {
        setMushafLoadingMore(true);
      } else {
        setMushafLoading(true);
      }

      try {
        const res = await fetch(
          `/api/quran/search?q=${encodeURIComponent(q)}&scope=${scopeVal}&limit=30&offset=${offsetVal}`
        );
        if (res.ok) {
          const data = await res.json();
          const incoming: MushafSearchHit[] = data.results || [];
          setMushafTotal(data.total || 0);
          setMushafHits((prev) => (append ? [...prev, ...incoming] : incoming));
        }
      } catch (err) {
        console.error("[QuranThematicExplorer] Mushaf search error:", err);
      } finally {
        setMushafLoading(false);
        setMushafLoadingMore(false);
      }
    },
    []
  );

  // Trigger debounced search whenever in mushaf mode
  useEffect(() => {
    if (explorerMode !== "mushaf") return;
    const q = searchQuery.trim();
    if (!q) {
      queueMicrotask(() => {
        setMushafHits([]);
        setMushafTotal(0);
      });
      return;
    }

    const timer = setTimeout(() => {
      runMushafSearch(q, mushafScope, 0, false);
    }, 240);

    return () => clearTimeout(timer);
  }, [explorerMode, searchQuery, mushafScope, runMushafSearch]);

  const toggleHitTafsir = async (hit: MushafSearchHit) => {
    const cacheKey = `${hit.hizb_number}:${hit.verse_key}`;
    if (openHitKey === cacheKey) {
      setOpenHitKey(null);
      return;
    }

    setOpenHitKey(cacheKey);
    if (hitTafsirCache[cacheKey]) return;

    try {
      setLoadingHitKey(cacheKey);
      const res = await fetch(
        `/api/quran/tafsir/${hit.hizb_number}?verse=${encodeURIComponent(hit.verse_key)}`
      );
      if (res.ok) {
        const json = await res.json();
        if (json?.found && json.verse) {
          setHitTafsirCache((prev) => ({ ...prev, [cacheKey]: json.verse }));
        }
      }
    } catch (err) {
      console.error("[QuranThematicExplorer] Hit tafsir fetch error:", err);
    } finally {
      setLoadingHitKey(null);
    }
  };

  const formatHitText = (raw: string) =>
    mushafDotted ? formatQuranTextForMashriqiDots(raw, { stripHabti: true }) : raw;

  const handleCopyHit = (hit: MushafSearchHit) => {
    const txt =
      `﴿ ${formatHitText(hit.verse_text)} ﴾\n` +
      `[سورة ${hit.surah_name} • الآية ${hit.verse_number} — الحزب ${hit.hizb_number}${
        hit.hafs_note ? ` • ${hit.hafs_note}` : ""
      }]\n\n` +
      (hit.mukhtasar ? `📖 التفسير المختصر:\n${hit.mukhtasar}\n\n` : "") +
      `— منصة منهاج الفقير (البحث الشامل في المصحف المحمدي)`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(txt);
      setCopiedKey(hit.verse_key);
      setTimeout(() => setCopiedKey(null), 2200);
    }
  };

  const handleShareHitWhatsApp = (hit: MushafSearchHit) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const txt =
      `📖 من المصحف المحمدي الشريف:\n\n` +
      `﴿ ${formatHitText(hit.verse_text)} ﴾\n` +
      `[سورة ${hit.surah_name}، الآية ${hit.verse_number} — الحزب ${hit.hizb_number}]\n\n` +
      (hit.mukhtasar ? `📘 التفسير المختصر:\n${hit.mukhtasar}\n\n` : "") +
      `طالع الآية وتفاسيرها الأربعة على منصة منهاج الفقير:\n${origin}/quran?view=thematic&mode=mushaf&q=${encodeURIComponent(hit.verse_key)}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(txt)}`, "_blank");
  };

  return (
    <section id="thematic" className="space-y-6 pt-2 text-right" dir="rtl">
      {/* SECTION HEADER & DUAL SEARCH SWITCH */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-white to-[#F5EFE6] dark:from-[#0E2019] dark:via-[#091811] dark:to-[#050E0A] border-2 border-[#C5A059]/40 shadow-sm relative overflow-hidden space-y-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#826122] dark:text-[#E5C378] text-xs font-bold font-ibm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>فِقْهُ الطَّرِيقِ مِنْ آيَاتِ الذِّكْرِ الحَكِيمِ وَالمُصْحَفِ الكَامِلِ</span>
            </div>

            <h2 className="font-amiri text-2xl sm:text-3xl lg:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2]">
              الكَشَّافُ القُرْآنِيُّ المَوْسُوعِيُّ لِمَقَامَاتِ السُّلُوكِ
            </h2>

            <p className="text-xs sm:text-sm text-[#52796F] dark:text-[#9BB0A5] font-ibm max-w-2xl leading-relaxed">
              تصفح {toArabicDigits(totalThematicVerses)} شاهداً قرآنياً مؤصلاً في 12 باباً سلوكياً وتربوياً بالشرح التفسيري والإشاري والعملي، أو ابحث فوراً في <strong className="text-[#143628] dark:text-[#E5C378]">كامل آيات المصحف المحمدي الشريف (6,214 آية برواية ورش)</strong> مع التفاسير الأربعة المعتمدة.
            </p>
          </div>

          {/* Dual Metrics Badge */}
          <div className="px-4 py-3 rounded-2xl bg-[#143628] text-[#FAF7F2] border border-[#C5A059]/40 flex items-center gap-3 shrink-0 shadow-md">
            <BookOpen className="w-5 h-5 text-[#C5A059]" />
            <div className="text-right space-y-0.5">
              <div className="text-[11px] text-[#E8F0EC]/80 font-ibm">المخزون القرآني الموثق</div>
              <div className="font-amiri text-base sm:text-lg font-bold text-[#E5C378]">
                {toArabicDigits(totalThematicVerses)} شاهداً • 6,214 آية
              </div>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setExplorerMode("thematic")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              explorerMode === "thematic"
                ? "bg-[#143628] text-[#E5C378] border border-[#C5A059] shadow-sm"
                : "bg-white dark:bg-[#122820] text-[#52796F] dark:text-[#A1B3A9] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
            }`}
          >
            <Filter className="w-4 h-4 text-[#C5A059]" />
            <span>الكشاف الموضوعي المؤصل ({toArabicDigits(totalThematicVerses)} آيات)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setExplorerMode("mushaf");
              if (!searchQuery.trim()) {
                setSearchQuery("الذكر");
              }
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              explorerMode === "mushaf"
                ? "bg-[#143628] text-[#E5C378] border border-[#C5A059] shadow-sm"
                : "bg-white dark:bg-[#122820] text-[#52796F] dark:text-[#A1B3A9] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
            }`}
          >
            <Search className="w-4 h-4 text-[#C5A059]" />
            <span>البحث الشامل في كامل المصحف (6,214 آية)</span>
          </button>
        </div>

        {/* SEARCH BAR + QUICK CHIPS */}
        <div className="space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row gap-2.5 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#826122] dark:text-[#C5A059]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && explorerMode === "mushaf") {
                    runMushafSearch(searchQuery, mushafScope, 0, false);
                  }
                }}
                placeholder={
                  explorerMode === "mushaf"
                    ? "ابحث عن أي كلمة في كامل المصحف أو برقم السورة والآية (مثلاً: الذكر، تسبح، لا إله إلا الله، 33:41)..."
                    : "ابحث في الشواهد المؤصلة أو في التفسير الإشاري والسلوكي..."
                }
                className="w-full pr-10 pl-10 py-2.5 rounded-2xl bg-white dark:bg-[#122820] border-2 border-[#E7DFD5] dark:border-[#203D31] focus:border-[#C5A059] text-xs sm:text-sm font-ibm text-[#1D2A24] dark:text-[#FAF7F2] placeholder-[#826122]/60 focus:outline-hidden transition shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  aria-label="مسح البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {explorerMode === "mushaf" && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setMushafScope("all")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    mushafScope === "all"
                      ? "bg-[#C5A059] text-[#143628]"
                      : "bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-[#52796F] dark:text-[#A1B3A9]"
                  }`}
                >
                  النص والتفسير
                </button>
                <button
                  type="button"
                  onClick={() => setMushafScope("verse")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    mushafScope === "verse"
                      ? "bg-[#C5A059] text-[#143628]"
                      : "bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-[#52796F] dark:text-[#A1B3A9]"
                  }`}
                >
                  النص القرآني فقط
                </button>
              </div>
            )}
          </div>

          {/* Quick Topic / Word Search Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#826122] dark:text-[#E5C378] ml-1">
              بحث سريع:
            </span>
            {QUICK_SEARCH_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setSearchQuery(chip);
                  setExplorerMode("mushaf");
                }}
                className="px-2.5 py-1 rounded-full bg-white/85 dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-[11px] font-ibm text-[#143628] dark:text-[#D5E2DB] transition cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODE A: THEMATIC CURATED EXPLORER */}
      {explorerMode === "thematic" && (
        <div className="space-y-5">
          {/* 12 Topic Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedTopicId("all")}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold font-amiri transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer ${
                selectedTopicId === "all"
                  ? "bg-[#143628] text-[#FAF7F2] shadow-sm border border-[#C5A059]"
                  : "bg-[#FAF7F2] dark:bg-[#0E2019] text-[#52796F] dark:text-[#9BB0A5] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>كُلُّ المَوْضُوعَاتِ ({toArabicDigits(totalThematicVerses)})</span>
            </button>

            {ALL_THEMATIC_TOPICS.map((topic) => {
              const Icon = TOPIC_ICONS[topic.icon] || Sparkles;
              const isSelected = selectedTopicId === topic.id;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold font-amiri transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-[#143628] text-[#FAF7F2] shadow-sm border border-[#C5A059]"
                      : "bg-[#FAF7F2] dark:bg-[#0E2019] text-[#52796F] dark:text-[#9BB0A5] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{topic.title}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10 font-sans">
                    {topic.verses.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Topic Overview Box */}
          {selectedTopic && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#C5A059]/45 shadow-2xs space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378]">
                  {selectedTopic.category}
                </span>
                <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378]">
                  {selectedTopic.verses.length} شاهداً قرآنياً مؤصلاً
                </span>
              </div>
              <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                {selectedTopic.title}
              </h3>
              <p className="text-xs sm:text-sm font-ibm text-[#52796F] dark:text-[#9BB0A5] leading-relaxed">
                {selectedTopic.overview || selectedTopic.subtitle}
              </p>
            </div>
          )}

          {/* Cross-Search Escalation Banner when user types a query */}
          {searchQuery.trim().length >= 2 && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#143628]/8 dark:bg-[#143628]/50 border border-[#C5A059]/40 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs sm:text-sm font-ibm text-[#143628] dark:text-[#E8F0EC]">
                عرض <strong>{filteredThematicVerses.length}</strong> من الشواهد المؤصلة عن «{searchQuery.trim()}». هل تريد استخراج <strong>كل الآيات الواردة في كامل المصحف الشريف (6,214 آية)</strong>؟
              </p>
              <button
                type="button"
                onClick={() => setExplorerMode("mushaf")}
                className="px-3.5 py-2 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] border border-[#C5A059]/50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>بحث شامل في كامل المصحف عن «{searchQuery.trim()}»</span>
              </button>
            </div>
          )}

          {filteredThematicVerses.length === 0 ? (
            <div className="p-10 text-center rounded-3xl bg-[#FAF7F2] dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
              <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
              <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                لا يوجد شاهد مختصر بهذه الصياغة في الأبواب الـ12
              </h4>
              <p className="text-xs text-[#52796F] dark:text-[#9BB0A5] font-ibm">
                يمكنك البحث مباشرة في نص المصحف الشريف كاملاً (6,214 آية) وتفاسيره الأربعة.
              </p>
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setExplorerMode("mushaf")}
                  className="px-4 py-2 rounded-xl bg-[#143628] text-[#E5C378] text-xs font-bold cursor-pointer"
                >
                  البحث الشامل في 6,214 آية عن «{searchQuery.trim()}»
                </button>
              )}
            </div>
          ) : (
            <QuranicEvidencePanel
              key={`${selectedTopicId}-${searchQuery.trim()}`}
              verses={filteredThematicVerses}
              topicLabel={selectedTopic?.title || "الكشاف القرآني الموثق"}
              variant="grid"
              defaultCollapsed={false}
              initialVisibleCount={
                selectedTopicId === "all" && !searchQuery.trim() ? 24 : undefined
              }
              onOpenHizb={onOpenHizb}
              showScriptToggle={true}
            />
          )}
        </div>
      )}

      {/* MODE B: FULL MUSHAF SEARCH (6,214 AYAHS) */}
      {explorerMode === "mushaf" && (
        <div className="space-y-4">
          {/* Status Strip + Script Toggle */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs sm:text-sm font-ibm text-[#143628] dark:text-[#E8F0EC]">
              {mushafLoading ? (
                <span className="inline-flex items-center gap-2 text-[#826122] dark:text-[#E5C378] font-bold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري البحث في جميع الأحزاب الستين (6,214 آية)...</span>
                </span>
              ) : searchQuery.trim() ? (
                <span>
                  نتائج البحث الشامل عن <strong>«{searchQuery.trim()}»</strong>:{" "}
                  <strong className="text-[#C5A059] font-mono">
                    {toArabicDigits(mushafTotal)}
                  </strong>{" "}
                  آية في المصحف المحمدي (عرض {toArabicDigits(mushafHits.length)} من {toArabicDigits(mushafTotal)})
                </span>
              ) : (
                <span>اكتب كلمةً أو مرجع سورة وآية (مثل 33:41) للبحث في المصحف كله.</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMushafDotted((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E5C378] transition cursor-pointer"
            >
              {mushafDotted ? "الخط: بالنقط الواضحة" : "الخط: المغربي الأصيل"}
            </button>
          </div>

          {!mushafLoading && mushafHits.length === 0 && searchQuery.trim() ? (
            <div className="p-12 text-center rounded-3xl bg-[#FAF7F2] dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-2">
              <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                لم يُعثر على نتائج تطابق «{searchQuery.trim()}»
              </p>
              <p className="text-xs font-ibm text-[#52796F] dark:text-[#9BB0A5]">
                جرّب البحث بجذر أقصر مثل «ذكر» أو «سبح» أو برقم مثل «18:28».
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mushafHits.map((hit) => {
                const cacheKey = `${hit.hizb_number}:${hit.verse_key}`;
                const isOpen = openHitKey === cacheKey;
                const isLoadingTafsir = loadingHitKey === cacheKey;
                const fullTafsir = hitTafsirCache[cacheKey];
                const isCopied = copiedKey === hit.verse_key;

                return (
                  <article
                    key={`${hit.verse_key}-${hit.hizb_number}`}
                    className="p-4 sm:p-5 rounded-3xl bg-[#FAF7F2] dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]/70 transition-all space-y-3 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-amiri font-bold text-[#143628] dark:text-[#E5C378]">
                          سُورَةُ {hit.surah_name} • الآيَةُ {hit.verse_number}
                        </span>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-[#52796F] dark:text-[#A1B3A9] font-bold">
                            {hit.match_source === "ref"
                              ? "مرجع رقمي"
                              : hit.match_source === "tafsir"
                                ? "مطابقة في التفسير"
                                : "في نص الآية"}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] font-bold font-mono">
                            الحزب {hit.hizb_number} • ص {hit.page_number}
                          </span>
                        </div>
                      </div>

                      {hit.hafs_note && (
                        <div className="text-[11px] text-[#52796F] dark:text-[#9BB0A5] font-ibm">
                          {hit.hafs_note}
                        </div>
                      )}

                      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#122820] border border-[#C5A059]/30">
                        <blockquote className="text-lg sm:text-xl font-maghribi-quran font-bold text-[#143628] dark:text-[#FAF7F2] leading-loose text-center select-text">
                          ﴿ {formatHitText(hit.verse_text)} ﴾
                        </blockquote>
                      </div>

                      {hit.mukhtasar && (
                        <div className="p-2.5 sm:p-3 rounded-xl bg-white/80 dark:bg-[#0A1812] border border-[#E7DFD5] dark:border-[#203D31] space-y-0.5">
                          <span className="text-[11px] font-bold text-[#1B4332] dark:text-[#E5C378] block">
                            التفسير المختصر:
                          </span>
                          <p className="text-xs font-ibm text-[#1D2A24]/90 dark:text-[#D5E2DB] leading-relaxed">
                            {hit.mukhtasar}
                          </p>
                        </div>
                      )}

                      {isOpen && (
                        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#081510] border border-[#C5A059]/45 space-y-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {TAFSIR_TABS.map((tab) => (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTafsirTab(tab.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                  activeTafsirTab === tab.id
                                    ? "bg-[#143628] text-[#E5C378]"
                                    : "bg-[#FAF7F2] dark:bg-[#122820] text-[#52796F] dark:text-[#A1B3A9] border border-[#E7DFD5] dark:border-[#203D31]"
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>

                          {isLoadingTafsir ? (
                            <div className="py-4 flex items-center justify-center gap-2 text-xs text-[#52796F]">
                              <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                              <span>جاري تحميل التفاسير الأربعة...</span>
                            </div>
                          ) : fullTafsir ? (
                            <div className="text-xs sm:text-sm font-ibm leading-relaxed text-[#1D2A24] dark:text-[#D5E2DB] max-h-60 overflow-y-auto whitespace-pre-line">
                              {activeTafsirTab === "french" ? (
                                <div dir="ltr" className="text-left space-y-2">
                                  {fullTafsir.fr_translation && (
                                    <p className="font-semibold text-[#143628] dark:text-[#FAF7F2]">
                                      {fullTafsir.fr_translation}
                                    </p>
                                  )}
                                  {fullTafsir.fr_mokhtasar && (
                                    <p className="text-xs text-[#52796F] dark:text-[#9BB0A5]">
                                      {fullTafsir.fr_mokhtasar}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                fullTafsir[activeTafsirTab] || "غير متوفر لهذه الآية."
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">تعذر جلب التفسير المفصل.</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2.5 border-t border-[#E7DFD5] dark:border-[#203D31] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleHitTafsir(hit)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                            isOpen
                              ? "bg-[#C5A059] text-[#143628]"
                              : "bg-white dark:bg-[#122820] border border-[#C5A059]/45 text-[#143628] dark:text-[#E5C378] hover:bg-[#C5A059]/15"
                          }`}
                        >
                          <BookOpenText className="w-3.5 h-3.5" />
                          <span>{isOpen ? "إخفاء التفاسير" : "التفاسير الأربعة"}</span>
                        </button>

                        {onOpenHizb && (
                          <button
                            type="button"
                            onClick={() => onOpenHizb(hit.hizb_number)}
                            className="px-2.5 py-1.5 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            <BookOpen className="w-3 h-3 text-[#C5A059]" />
                            <span>الحزب {hit.hizb_number}</span>
                            <ExternalLink className="w-3 h-3 opacity-75" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyHit(hit)}
                          className="p-1.5 rounded-lg bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-gray-600 dark:text-gray-300 transition cursor-pointer"
                          title="نسخ الآية والتفسير"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareHitWhatsApp(hit)}
                          className="p-1.5 rounded-lg bg-emerald-600/12 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 transition cursor-pointer"
                          title="مشاركة عبر واتساب"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {mushafHits.length < mushafTotal && (
            <div className="text-center pt-2">
              <button
                type="button"
                disabled={mushafLoadingMore}
                onClick={() => runMushafSearch(searchQuery, mushafScope, mushafHits.length, true)}
                className="px-5 py-2.5 rounded-2xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] border border-[#C5A059]/45 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {mushafLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري جلب المزيد...</span>
                  </>
                ) : (
                  <span>
                    عرض المزيد من الآيات ({toArabicDigits(mushafTotal - mushafHits.length)} متبقية)
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
