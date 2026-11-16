"use client";

import React, { useState, useMemo } from "react";
import { InlineSpeakerButton } from "@/components/DualAudioReaderBar";
import arbaeenData from "@/data/arbaeen.json";
import bukhariIndexData from "@/data/turath/bukhari_index.json";
import shifaIndexData from "@/data/turath/shifa_index.json";
import type { BayanLocale } from "@/lib/bayan-i18n";
import { DICTIONARY } from "@/lib/bayan-i18n";

type HadithTab = "bukhari" | "shifa" | "arbaeen";

interface HadithSectionProps {
  locale: BayanLocale;
}

interface ArbaeenItem {
  id: number;
  title: string;
  topic: string;
  theme?: string;
  narrator: string;
  source: string;
  text_ar: string;
  text_en?: string;
  suluk_lesson?: string;
}

interface BukhariBookItem {
  bookNumber: number;
  title_ar: string;
  title_translit?: string;
  hadithCount?: number;
  hadithsCount?: number;
  slug?: string;
}

interface ShifaChapterItem {
  chapterNumber: number;
  partNumber: number;
  part_ar: string;
  part_fr?: string;
  title_ar: string;
  title_fr?: string;
  maliki_focus_ar: string;
  faslCount?: number;
}

export function HadithSection({ locale }: HadithSectionProps) {
  const t = DICTIONARY[locale];
  const isAr = locale === "ar";

  const [activeTab, setActiveTab] = useState<HadithTab>("arbaeen");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedHadith, setSelectedHadith] = useState<ArbaeenItem | null>(null);
  const [selectedShifaChapter, setSelectedShifaChapter] = useState<ShifaChapterItem | null>(null);

  // Arbaeen Search Filter
  const filteredArbaeen = useMemo(() => {
    const list = arbaeenData as ArbaeenItem[];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.topic.toLowerCase().includes(q) ||
        h.narrator.toLowerCase().includes(q) ||
        h.text_ar.toLowerCase().includes(q) ||
        (h.text_en && h.text_en.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Bukhari Books Search Filter
  const filteredBukhari = useMemo(() => {
    const list = bukhariIndexData as BukhariBookItem[];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (b) =>
        b.title_ar.toLowerCase().includes(q) ||
        (b.title_translit && b.title_translit.toLowerCase().includes(q)) ||
        String(b.bookNumber) === q
    );
  }, [searchQuery]);

  // Shifa Chapters
  const shifaChapters = shifaIndexData as ShifaChapterItem[];

  return (
    <section
      id="hadith"
      className="p-6 sm:p-8 rounded-xl bg-[#FFFFFF] dark:bg-[#121614] border border-[#EAEAEA] dark:border-[#222624] space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#EAEAEA] dark:border-[#202522] pb-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#787774] dark:text-[#8E9290]">
            {isAr ? "مكتبة الحديث والسنة" : "Hadith & Prophetic Heritage"}
          </span>
          <h2
            className={`text-xl sm:text-2xl font-bold text-[#111111] dark:text-[#FAF7F2] ${
              isAr ? "font-amiri" : "font-serif"
            }`}
          >
            {t.hadithSection.title}
          </h2>
          <p className="text-xs text-[#787774] dark:text-[#8E9290] mt-0.5">
            {t.hadithSection.subtitle}
          </p>
        </div>
      </div>

      {/* Tabs Switcher (Bukhari / Shifa / Arbaeen) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#FAF9F7] dark:bg-[#151917] border border-[#EAEAEA] dark:border-[#202522]">
        <button
          type="button"
          onClick={() => {
            setActiveTab("arbaeen");
            setSearchQuery("");
          }}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-mono font-semibold transition-all ${
            activeTab === "arbaeen"
              ? "bg-[#FFFFFF] dark:bg-[#202522] text-[#111111] dark:text-[#FAF7F2] shadow-xs border border-[#EAEAEA] dark:border-[#2E3530]"
              : "text-[#787774] dark:text-[#8E9290] hover:text-[#111111] dark:hover:text-[#FAF7F2]"
          }`}
        >
          {t.hadithSection.tabs.arbaeen}
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("bukhari");
            setSearchQuery("");
          }}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-mono font-semibold transition-all ${
            activeTab === "bukhari"
              ? "bg-[#FFFFFF] dark:bg-[#202522] text-[#111111] dark:text-[#FAF7F2] shadow-xs border border-[#EAEAEA] dark:border-[#2E3530]"
              : "text-[#787774] dark:text-[#8E9290] hover:text-[#111111] dark:hover:text-[#FAF7F2]"
          }`}
        >
          {t.hadithSection.tabs.bukhari}
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("shifa");
            setSearchQuery("");
          }}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-mono font-semibold transition-all ${
            activeTab === "shifa"
              ? "bg-[#FFFFFF] dark:bg-[#202522] text-[#111111] dark:text-[#FAF7F2] shadow-xs border border-[#EAEAEA] dark:border-[#2E3530]"
              : "text-[#787774] dark:text-[#8E9290] hover:text-[#111111] dark:hover:text-[#FAF7F2]"
          }`}
        >
          {t.hadithSection.tabs.shifa}
        </button>
      </div>

      {/* TAB 1: ARBA'EEN NAWAWIYYA */}
      {activeTab === "arbaeen" && (
        <div className="space-y-4">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.hadithSection.arbaeen.searchPlaceholder}
            className="w-full px-4 py-2.5 rounded-lg border border-[#EAEAEA] dark:border-[#252B27] bg-[#FAF9F7] dark:bg-[#151917] text-xs font-mono text-[#111111] dark:text-[#FAF7F2] placeholder-[#787774] focus:outline-none focus:border-[#C5A059] transition-colors"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredArbaeen.map((h) => (
              <div
                key={h.id}
                className="p-4 rounded-lg border border-[#EAEAEA] dark:border-[#202522] bg-[#FAF9F7] dark:bg-[#151917] hover:border-[#C5A059]/50 transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#FFFFFF] dark:bg-[#0E1210] border border-[#EAEAEA] dark:border-[#1E2320] text-[#111111] dark:text-[#FAF7F2]">
                      #{h.id}
                    </span>
                    <span className="text-[11px] font-mono text-[#346538] dark:text-[#78C380] bg-[#EDF3EC] dark:bg-[#192A1D] px-2 py-0.5 rounded">
                      {h.topic}
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold text-[#143628] dark:text-[#FAF7F2] ${
                      isAr ? "font-amiri" : "font-serif"
                    }`}
                  >
                    {h.title}
                  </h3>

                  <p className="text-xs font-amiri text-[#787774] dark:text-[#8E9290] line-clamp-2 leading-relaxed">
                    «{h.text_ar}»
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EAEAEA] dark:border-[#202522] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <InlineSpeakerButton
                      text={h.text_ar}
                      title={h.title}
                      lang="ar"
                      size="sm"
                      preRecordedSrc={h.id === 1 ? "/audio/hadith/hadith-01.mp3" : undefined}
                      ariaLabel={isAr ? "استماع للحديث" : "Listen to Hadith"}
                    />
                    <span className="text-[10px] font-mono text-[#787774] dark:text-[#8E9290]">
                      {h.source}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedHadith(h)}
                    className="text-xs font-mono font-medium text-[#111111] dark:text-[#FAF7F2] hover:text-[#C5A059] cursor-pointer"
                  >
                    {t.hadithSection.arbaeen.viewFullHadith} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SAHIH AL-BUKHARI */}
      {activeTab === "bukhari" && (
        <div className="space-y-4">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.hadithSection.bukhari.searchPlaceholder}
            className="w-full px-4 py-2.5 rounded-lg border border-[#EAEAEA] dark:border-[#252B27] bg-[#FAF9F7] dark:bg-[#151917] text-xs font-mono text-[#111111] dark:text-[#FAF7F2] placeholder-[#787774] focus:outline-none focus:border-[#C5A059] transition-colors"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBukhari.map((b) => (
              <div
                key={b.bookNumber}
                className="p-4 rounded-lg border border-[#EAEAEA] dark:border-[#202522] bg-[#FAF9F7] dark:bg-[#151917] hover:border-[#C5A059]/50 transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#FFFFFF] dark:bg-[#0E1210] border border-[#EAEAEA] dark:border-[#1E2320] text-[#111111] dark:text-[#FAF7F2]">
                      {t.hadithSection.bukhari.bookPrefix} {b.bookNumber}
                    </span>
                    {(b.hadithsCount || b.hadithCount) && (
                      <span className="text-[10px] font-mono text-[#787774] dark:text-[#8E9290]">
                        {b.hadithsCount || b.hadithCount}{" "}
                        {t.hadithSection.bukhari.hadithsCount}
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-base font-bold text-[#143628] dark:text-[#FAF7F2] ${
                      isAr ? "font-amiri" : "font-serif"
                    }`}
                  >
                    {b.title_ar}
                  </h3>
                  {b.title_translit && (
                    <p className="text-[11px] font-mono text-[#787774] dark:text-[#8E9290]">
                      {b.title_translit}
                    </p>
                  )}
                </div>

                <a
                  href={`/turath?source=bukhari&book=${b.bookNumber}`}
                  className="w-full py-2 px-3 text-center rounded-md bg-[#FFFFFF] dark:bg-[#1E2320] hover:bg-[#111111] hover:text-[#FFFFFF] dark:hover:bg-[#FAF7F2] dark:hover:text-[#111111] border border-[#EAEAEA] dark:border-[#2A312C] text-xs font-mono font-medium transition-[background-color,color] cursor-pointer"
                >
                  {t.hadithSection.bukhari.openBook} →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: KITAB ASH-SHIFA */}
      {activeTab === "shifa" && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[#FAF9F7] dark:bg-[#151917] border border-[#EAEAEA] dark:border-[#202522] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#787774] dark:text-[#8E9290] block">
                {t.hadithSection.shifa.author}
              </span>
              <div
                className={`text-lg font-bold text-[#143628] dark:text-[#FAF7F2] ${
                  isAr ? "font-amiri" : "font-serif"
                }`}
              >
                {t.hadithSection.shifa.title}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#787774] dark:text-[#8E9290]">
              <span className="px-2.5 py-1 rounded bg-[#FFFFFF] dark:bg-[#0E1210] border border-[#EAEAEA] dark:border-[#1E2320]">
                {t.hadithSection.shifa.partsCount}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#FFFFFF] dark:bg-[#0E1210] border border-[#EAEAEA] dark:border-[#1E2320]">
                {t.hadithSection.shifa.chaptersCount}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shifaChapters.map((ch) => (
              <div
                key={ch.chapterNumber}
                className="p-4 rounded-lg border border-[#EAEAEA] dark:border-[#202522] bg-[#FAF9F7] dark:bg-[#151917] hover:border-[#C5A059]/50 transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#FFFFFF] dark:bg-[#0E1210] border border-[#EAEAEA] dark:border-[#1E2320] text-[#111111] dark:text-[#FAF7F2]">
                      {isAr ? `الباب ${ch.chapterNumber}` : `Chapter ${ch.chapterNumber}`}
                    </span>
                    {ch.faslCount && (
                      <span className="text-[10px] font-mono text-[#787774] dark:text-[#8E9290]">
                        {ch.faslCount} {isAr ? "فصول" : "sections"}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-[#956400] dark:text-[#E5C378] block">
                    {ch.part_ar}
                  </span>

                  <h3
                    className={`text-base font-bold text-[#143628] dark:text-[#FAF7F2] ${
                      isAr ? "font-amiri" : "font-serif"
                    }`}
                  >
                    {ch.title_ar}
                  </h3>

                  <p className="text-xs font-amiri text-[#787774] dark:text-[#8E9290] line-clamp-2 leading-relaxed">
                    {ch.maliki_focus_ar}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EAEAEA] dark:border-[#202522] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedShifaChapter(ch)}
                    className="text-xs font-mono font-medium text-[#111111] dark:text-[#FAF7F2] hover:text-[#C5A059] cursor-pointer"
                  >
                    {t.hadithSection.shifa.viewChapter} →
                  </button>
                  <a
                    href={`/turath?source=shifa&chapter=${ch.chapterNumber}`}
                    className="text-xs font-mono text-[#787774] hover:text-[#C5A059]"
                  >
                    {isAr ? "قراءة في التراث" : "Read in Heritage"} ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: FULL ARBA'EEN HADITH VIEWER */}
      {selectedHadith && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#FFFFFF] dark:bg-[#121614] border border-[#EAEAEA] dark:border-[#222624] rounded-xl shadow-xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#EAEAEA] dark:border-[#202522] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#F7F6F3] dark:bg-[#1A1F1C] border border-[#EAEAEA] dark:border-[#252B27]">
                  #{selectedHadith.id}
                </span>
                <span className="font-mono text-xs text-[#346538] dark:text-[#78C380]">
                  {selectedHadith.topic}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHadith(null)}
                className="px-2.5 py-1 rounded-md text-xs font-mono text-[#787774] hover:text-[#111111] dark:hover:text-[#FFFFFF] cursor-pointer"
              >
                ✕ {isAr ? "إغلاق" : "Close"}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <h3
                className={`text-xl font-bold text-[#143628] dark:text-[#FAF7F2] ${
                  isAr ? "font-amiri text-2xl" : "font-serif"
                }`}
              >
                {selectedHadith.title}
              </h3>

              {/* Arabic Text */}
              <div className="p-4 rounded-lg bg-[#FAF9F7] dark:bg-[#151917] border border-[#EAEAEA] dark:border-[#202522]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase text-[#787774]">
                    {isAr ? "النص العربي المسند" : "Arabic Text"}
                  </span>
                  <InlineSpeakerButton
                    text={selectedHadith.text_ar}
                    title={selectedHadith.title}
                    lang="ar"
                    size="sm"
                    preRecordedSrc={selectedHadith.id === 1 ? "/audio/hadith/hadith-01.mp3" : undefined}
                    ariaLabel={isAr ? "استماع للحديث الشريف" : "Listen to Hadith"}
                  />
                </div>
                <p className="font-amiri text-base sm:text-lg text-[#111111] dark:text-[#FAF7F2] leading-loose text-justify">
                  {selectedHadith.text_ar}
                </p>
              </div>

              {/* English Translation */}
              {selectedHadith.text_en && (
                <div
                  dir="ltr"
                  className="p-4 rounded-lg bg-[#FAF9F7] dark:bg-[#151917] border border-[#EAEAEA] dark:border-[#202522] text-left"
                >
                  <span className="text-[10px] font-mono uppercase text-[#787774] block mb-2">
                    English Translation
                  </span>
                  <p className="text-sm font-sans text-[#2F3437] dark:text-[#D5D8D6] leading-relaxed">
                    {selectedHadith.text_en}
                  </p>
                </div>
              )}

              {/* Lesson / Benefit */}
              {selectedHadith.suluk_lesson && (
                <div className="p-4 rounded-lg bg-[#EDF3EC] dark:bg-[#142318] border border-[#346538]/20">
                  <span className="text-[10px] font-mono uppercase text-[#346538] dark:text-[#78C380] block mb-1">
                    {isAr ? "اللطيفة والفوائد السلوكية" : "Spiritual Lesson & Key Benefit"}
                  </span>
                  <p className="text-xs sm:text-sm font-amiri text-[#1F4424] dark:text-[#A7DEAE] leading-relaxed">
                    {selectedHadith.suluk_lesson}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#787774] pt-2 border-t border-[#EAEAEA] dark:border-[#202522]">
                <span>{selectedHadith.narrator}</span>
                <span>{selectedHadith.source}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SHIFA CHAPTER DETAILS */}
      {selectedShifaChapter && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-xl max-h-[85vh] bg-[#FFFFFF] dark:bg-[#121614] border border-[#EAEAEA] dark:border-[#222624] rounded-xl shadow-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#EAEAEA] dark:border-[#202522] flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#956400] dark:text-[#E5C378]">
                {selectedShifaChapter.part_ar}
              </span>
              <button
                type="button"
                onClick={() => setSelectedShifaChapter(null)}
                className="px-2.5 py-1 rounded-md text-xs font-mono text-[#787774] hover:text-[#111111] dark:hover:text-[#FFFFFF] cursor-pointer"
              >
                ✕ {isAr ? "إغلاق" : "Close"}
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <h3
                className={`text-xl font-bold text-[#143628] dark:text-[#FAF7F2] ${
                  isAr ? "font-amiri text-2xl" : "font-serif"
                }`}
              >
                {selectedShifaChapter.title_ar}
              </h3>

              <div className="p-4 rounded-lg bg-[#FAF9F7] dark:bg-[#151917] border border-[#EAEAEA] dark:border-[#202522] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#787774] block">
                    {isAr ? "التحقيق المالكي والأصولي" : "Maliki Jurisprudential Exposition"}
                  </span>
                  <InlineSpeakerButton
                    text={selectedShifaChapter.maliki_focus_ar}
                    title={selectedShifaChapter.title_ar}
                    lang="ar"
                    size="sm"
                    ariaLabel={isAr ? "استماع للتحقيق" : "Listen to exposition"}
                  />
                </div>
                <p className="text-xs sm:text-sm font-amiri text-[#111111] dark:text-[#FAF7F2] leading-relaxed">
                  {selectedShifaChapter.maliki_focus_ar}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-mono text-[#787774]">
                  {selectedShifaChapter.faslCount} {isAr ? "فصول محررة" : "sections"}
                </span>
                <a
                  href={`/turath?source=shifa&chapter=${selectedShifaChapter.chapterNumber}`}
                  className="px-3 py-1.5 rounded-md bg-[#111111] dark:bg-[#FAF7F2] text-white dark:text-[#111111] text-xs font-mono font-medium hover:opacity-90"
                >
                  {isAr ? "فتح النص التراثي الكامل" : "Open Full Text"} →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
