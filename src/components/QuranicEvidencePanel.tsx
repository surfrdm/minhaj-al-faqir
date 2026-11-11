"use client";

import React, { useState } from "react";
import {
  BookOpen,
  BookOpenText,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Copy,
  ExternalLink,
  Loader2,
  Share2,
  Sparkles,
} from "lucide-react";
import type { VerifiedQuranVerse } from "@/types/quran-evidence";
import { formatQuranTextForMashriqiDots, toArabicDigits } from "@/lib/quran";
import { QuranHizbReaderModal } from "@/components/QuranHizbReaderModal";

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

const TAFSIR_CACHE = new Map<string, ClassicalTafsirVerse>();

const TAFSIR_TABS: Array<{ id: ClassicalTafsirSource; label: string }> = [
  { id: "mukhtasar", label: "المختصر" },
  { id: "qurtubi", label: "القرطبي" },
  { id: "ibn_atiyyah", label: "ابن عطية" },
  { id: "ibn_ashur", label: "ابن عاشور" },
  { id: "french", label: "Français" },
];

interface QuranicEvidencePanelProps {
  title?: string;
  subtitle?: string;
  verses: VerifiedQuranVerse[];
  topicLabel?: string;
  variant?: "grid" | "compact" | "inline";
  defaultCollapsed?: boolean;
  initialVisibleCount?: number;
  onOpenHizb?: (hizbNumber: number) => void;
  showScriptToggle?: boolean;
}

export function QuranicEvidencePanel({
  title,
  subtitle,
  verses,
  topicLabel,
  variant = "grid",
  defaultCollapsed = false,
  initialVisibleCount,
  onOpenHizb,
  showScriptToggle = true,
}: QuranicEvidencePanelProps) {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const [useDottedScript, setUseDottedScript] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalHizb, setModalHizb] = useState<number | null>(null);

  // Per-verse classical tafsir drawer state
  const [openTafsirVerseId, setOpenTafsirVerseId] = useState<string | null>(null);
  const [loadingVerseId, setLoadingVerseId] = useState<string | null>(null);
  const [tafsirByKey, setTafsirByKey] = useState<Record<string, ClassicalTafsirVerse>>({});
  const [activeTafsirTab, setActiveTafsirTab] =
    useState<ClassicalTafsirSource>("mukhtasar");

  if (!verses || verses.length === 0) return null;

  const cap = initialVisibleCount && !showAll ? initialVisibleCount : verses.length;
  const visibleVerses = verses.slice(0, cap);
  const hiddenCount = Math.max(0, verses.length - visibleVerses.length);

  const openHizbTarget = (hizbNumber: number) => {
    if (onOpenHizb) {
      onOpenHizb(hizbNumber);
    } else {
      setModalHizb(hizbNumber);
    }
  };

  const toggleClassicalTafsir = async (verse: VerifiedQuranVerse) => {
    if (openTafsirVerseId === verse.id) {
      setOpenTafsirVerseId(null);
      return;
    }

    setOpenTafsirVerseId(verse.id);
    const cacheKey = `${verse.hizb_number}:${verse.verse_key}`;
    if (tafsirByKey[cacheKey]) return;

    const cached = TAFSIR_CACHE.get(cacheKey);
    if (cached) {
      setTafsirByKey((prev) => ({ ...prev, [cacheKey]: cached }));
      return;
    }

    try {
      setLoadingVerseId(verse.id);
      const res = await fetch(
        `/api/quran/tafsir/${verse.hizb_number}?verse=${encodeURIComponent(verse.verse_key)}`
      );
      if (res.ok) {
        const json = await res.json();
        if (json?.found && json.verse) {
          TAFSIR_CACHE.set(cacheKey, json.verse);
          setTafsirByKey((prev) => ({ ...prev, [cacheKey]: json.verse }));
        }
      }
    } catch (err) {
      console.error("[QuranicEvidencePanel] Tafsir fetch error:", err);
    } finally {
      setLoadingVerseId(null);
    }
  };

  const formatVerseText = (raw: string) =>
    useDottedScript ? formatQuranTextForMashriqiDots(raw, { stripHabti: true }) : raw;

  const handleCopyVerse = (v: VerifiedQuranVerse) => {
    const parts = [
      `﴿ ${formatVerseText(v.verse_text)} ﴾`,
      `[سورة ${v.surah_name} • الآية ${v.verse_number} (الحزب ${v.hizb_number})${
        v.hafs_note ? ` — ${v.hafs_note}` : ""
      }]`,
    ];
    if (v.tafsir_summary) {
      parts.push(`\n📖 البيان التفسيري:\n${v.tafsir_summary}`);
    }
    parts.push(`\n✨ اللطيفة الإشارية التربوية:\n${v.ishari_benefit}`);
    if (v.practical_amal) {
      parts.push(`\n🌿 العمل التطبيقي للسالك:\n${v.practical_amal}`);
    }
    parts.push("\n— منصة منهاج الفقير (الكشاف القرآني الموثق)");

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(parts.join("\n"));
      setCopiedId(v.id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const handleShareWhatsApp = (v: VerifiedQuranVerse) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const text =
      `📖 شاهد قرآني موثق${topicLabel ? ` (${topicLabel})` : ""}:\n\n` +
      `﴿ ${formatVerseText(v.verse_text)} ﴾\n` +
      `[سورة ${v.surah_name}، الآية ${v.verse_number} — الحزب ${v.hizb_number}]\n\n` +
      (v.tafsir_summary ? `📘 المعنى التفسيري:\n${v.tafsir_summary}\n\n` : "") +
      `💡 اللطيفة الإشارية والسلوكية:\n${v.ishari_benefit}\n\n` +
      `طالع الشواهد والتفسير المقارن على منصة منهاج الفقير:\n${origin}/quran?view=thematic`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const renderClassicalTafsirBox = (v: VerifiedQuranVerse) => {
    const cacheKey = `${v.hizb_number}:${v.verse_key}`;
    const entry = tafsirByKey[cacheKey];
    const isLoading = loadingVerseId === v.id;

    return (
      <div className="mt-3 p-3.5 rounded-2xl bg-white dark:bg-[#081510] border border-[#C5A059]/45 space-y-3 shadow-inner text-right">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7DFD5] dark:border-[#203D31] pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#143628] dark:text-[#E5C378]">
            <BookOpenText className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>التفسير المقارن من الأمهات المعتمدة ({v.surah_name}: {v.verse_key.split(":")[1]})</span>
          </div>
          {v.hafs_note && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] font-medium">
              {v.hafs_note}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {TAFSIR_TABS.map((tab) => {
            const active = activeTafsirTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTafsirTab(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  active
                    ? "bg-[#143628] text-[#E5C378] shadow-xs"
                    : "bg-[#FAF7F2] dark:bg-[#122820] text-[#52796F] dark:text-[#A1B3A9] hover:border-[#C5A059] border border-[#E7DFD5] dark:border-[#203D31]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="py-5 flex items-center justify-center gap-2 text-xs text-[#52796F] dark:text-[#9BB0A5]">
            <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
            <span>جاري استحضار التفسير من الخزانة القرآنية...</span>
          </div>
        ) : entry ? (
          <div className="text-xs sm:text-sm font-ibm leading-relaxed text-[#1D2A24] dark:text-[#D5E2DB] max-h-64 overflow-y-auto pl-1 whitespace-pre-line">
            {activeTafsirTab === "french" ? (
              <div dir="ltr" className="text-left space-y-2">
                {entry.fr_translation && (
                  <p className="font-semibold text-[#143628] dark:text-[#FAF7F2]">
                    {entry.fr_translation}
                  </p>
                )}
                {entry.fr_mokhtasar && (
                  <p className="text-xs text-[#52796F] dark:text-[#9BB0A5]">
                    {entry.fr_mokhtasar}
                  </p>
                )}
              </div>
            ) : (
              entry[activeTafsirTab] || "غير متوفر لهذه الآية."
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500">تعذر تحميل النص الكامل للتفسير، يمكنكم مطالعة الحزب مباشرة بالمصحف.</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3" dir="rtl">
      {/* Header Strip (when title/controls are requested) */}
      {(title || defaultCollapsed || showScriptToggle) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {title && (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#143628] dark:text-[#E5C378]">
                <BookOpen className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{title}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] text-[11px] font-mono tabular-nums">
                  {verses.length} آيات موثقة
                </span>
              </div>
            )}
            {subtitle && (
              <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8]">
                {subtitle}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {showScriptToggle && !collapsed && (
              <button
                type="button"
                onClick={() => setUseDottedScript((prev) => !prev)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-[11px] font-bold text-[#143628] dark:text-[#E5C378] transition cursor-pointer"
                title="التبديل بين النقط الواضحة ورسم المصحف المغربي الأصيل"
              >
                {useDottedScript ? "الخط: بالنقط الواضحة" : "الخط: المغربي الأصيل"}
              </button>
            )}

            {defaultCollapsed && (
              <button
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#143628] text-[#E5C378] border border-[#C5A059]/40 text-[11px] font-bold transition cursor-pointer"
              >
                <span>{collapsed ? `عرض الشواهد القرآنية (${verses.length})` : "طيّ الشواهد"}</span>
                {collapsed ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      {!collapsed && (
        <>
          <div
            className={
              variant === "grid"
                ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
                : variant === "inline"
                  ? "space-y-3"
                  : "space-y-2.5"
            }
          >
            {visibleVerses.map((v) => {
              const isTafsirOpen = openTafsirVerseId === v.id;
              const isCopied = copiedId === v.id;

              return (
                <article
                  key={v.id}
                  className={`rounded-2xl border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]/70 transition-all text-right flex flex-col justify-between ${
                    variant === "compact"
                      ? "p-3.5 bg-[#FAF7F2]/85 dark:bg-[#0B1B14] space-y-2.5"
                      : "p-4 sm:p-5 bg-[#FAF7F2] dark:bg-[#0E2019] space-y-3 shadow-xs"
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Reference Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-amiri font-bold text-[#143628] dark:text-[#E5C378]">
                        سُورَةُ {v.surah_name} • الآيَةُ {v.verse_number}
                      </span>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {v.hafs_note && !v.hafs_note.includes(`الآية ${v.verse_number}`) && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-[#52796F] dark:text-[#A1B3A9]">
                            {v.hafs_note}
                          </span>
                        )}
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] font-bold font-mono tabular-nums">
                          الحزب {toArabicDigits(v.hizb_number)}
                        </span>
                      </div>
                    </div>

                    {/* Quran Verse Box */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#122820] border border-[#C5A059]/30 shadow-2xs">
                      <blockquote
                        className={`${
                          variant === "compact" ? "text-base sm:text-lg" : "text-lg sm:text-xl"
                        } font-maghribi-quran font-bold text-[#143628] dark:text-[#FAF7F2] leading-loose text-center select-text`}
                      >
                        ﴿ {formatVerseText(v.verse_text)} ﴾
                      </blockquote>
                    </div>

                    {/* Layered Tafsir & Suluk Details */}
                    <div className="space-y-2">
                      {v.tafsir_summary && (
                        <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#0A1812] border border-[#E7DFD5] dark:border-[#203D31] space-y-0.5">
                          <span className="text-[11px] font-bold text-[#1B4332] dark:text-[#E5C378] block">
                            البيان التفسيري وسياق الآية:
                          </span>
                          <p className="text-xs font-ibm text-[#1D2A24]/90 dark:text-[#D5E2DB] leading-relaxed">
                            {v.tafsir_summary}
                          </p>
                        </div>
                      )}

                      <div className="p-2.5 sm:p-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/25 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#826122] dark:text-[#E5C378]">
                          <Sparkles className="w-3 h-3 text-[#C5A059]" />
                          <span>اللطيفة الإشارية والسلوكية:</span>
                        </div>
                        <p className="text-xs font-ibm text-[#2A4B3C] dark:text-[#C8DED4] leading-relaxed">
                          {v.ishari_benefit}
                        </p>
                      </div>

                      {v.practical_amal && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/8 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2 text-xs font-ibm text-[#143628] dark:text-[#D5E2DB]">
                          <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>ثمرة العمل:</strong> {v.practical_amal}
                          </span>
                        </div>
                      )}
                    </div>

                    {isTafsirOpen && renderClassicalTafsirBox(v)}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-2.5 border-t border-[#E7DFD5] dark:border-[#203D31] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleClassicalTafsir(v)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                          isTafsirOpen
                            ? "bg-[#C5A059] text-[#143628]"
                            : "bg-white dark:bg-[#122820] border border-[#C5A059]/45 text-[#143628] dark:text-[#E5C378] hover:bg-[#C5A059]/15"
                        }`}
                      >
                        <BookOpenText className="w-3.5 h-3.5" />
                        <span>
                          {isTafsirOpen ? "إخفاء التفاسير الأربعة" : "التفاسير الأربعة (المختصر والقرطبي...)"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openHizbTarget(v.hizb_number)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                        title="قراءة الحزب في المصحف المحمدي"
                      >
                        <BookOpen className="w-3 h-3 text-[#C5A059]" />
                        <span>الحزب {toArabicDigits(v.hizb_number)}</span>
                        <ExternalLink className="w-3 h-3 opacity-75" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopyVerse(v)}
                        className="p-1.5 rounded-lg bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-gray-600 dark:text-gray-300 transition cursor-pointer"
                        title="نسخ الآية والتفاصيل"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShareWhatsApp(v)}
                        className="p-1.5 rounded-lg bg-emerald-600/12 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 transition cursor-pointer"
                        title="مشاركة الآية والشرح عبر واتساب"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {hiddenCount > 0 && (
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#143628]/10 hover:bg-[#143628]/15 dark:bg-[#C5A059]/15 dark:hover:bg-[#C5A059]/25 text-[#143628] dark:text-[#E5C378] border border-[#C5A059]/35 text-xs font-bold transition cursor-pointer"
              >
                <span>عرض بقية الآيات والشواهد ({hiddenCount} شواهد إضافية)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      )}

      {modalHizb !== null && !onOpenHizb && (
        <QuranHizbReaderModal
          isOpen={true}
          onClose={() => setModalHizb(null)}
          hizbNumber={modalHizb}
          hizbPeriod="custom"
        />
      )}
    </div>
  );
}
