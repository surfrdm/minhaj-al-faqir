"use client";

import React, { useState, useMemo } from "react";
import { Volume2 } from "lucide-react";
import { ALL_AHZAB_INDEX, type HizbIndexItem } from "@/lib/quran";
import type { BayanLocale } from "@/lib/bayan-i18n";
import { DICTIONARY } from "@/lib/bayan-i18n";

interface QuranSectionProps {
  locale: BayanLocale;
  onOpenHizb: (hizbNumber: number) => void;
}

function normalizeSearch(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .toLowerCase()
    .trim();
}

export function QuranSection({ locale, onOpenHizb }: QuranSectionProps) {
  const t = DICTIONARY[locale];
  const isAr = locale === "ar";

  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredAhzab = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return ALL_AHZAB_INDEX;

    const normQ = normalizeSearch(q);
    const isNum = /^\d+$/.test(q);
    const targetHizb = isNum ? parseInt(q, 10) : null;

    return ALL_AHZAB_INDEX.filter((h: HizbIndexItem) => {
      if (targetHizb !== null) {
        if (h.hizb_number === targetHizb) return true;
        if (targetHizb >= h.start_page && targetHizb <= h.end_page) return true;
      }
      const surahsNorm = h.surahs.map(normalizeSearch).join(" ");
      const matlaaNorm = normalizeSearch(h.matlaa);
      return surahsNorm.includes(normQ) || matlaaNorm.includes(normQ);
    });
  }, [searchQuery]);

  return (
    <section
      id="quran"
      className="p-6 sm:p-8 rounded-xl bg-[#FFFFFF] dark:bg-[#121614] border border-[#EAEAEA] dark:border-[#222624] space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#EAEAEA] dark:border-[#202522] pb-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#787774] dark:text-[#8E9290]">
            {isAr ? "المصحف الشريف" : "The Holy Quran"}
          </span>
          <h2
            className={`text-xl sm:text-2xl font-bold text-[#111111] dark:text-[#FAF7F2] ${
              isAr ? "font-amiri" : "font-serif"
            }`}
          >
            {t.quranSection.title}
          </h2>
          <p className="text-xs text-[#787774] dark:text-[#8E9290] mt-0.5">
            {t.quranSection.subtitle}
          </p>
        </div>
        <div className="text-[11px] font-mono text-[#346538] dark:text-[#78C380] bg-[#EDF3EC] dark:bg-[#192A1D] px-3 py-1 rounded-md border border-[#346538]/20 shrink-0">
          {t.quranSection.moroccanWarshAudio}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.quranSection.searchPlaceholder}
            className="w-full px-4 py-2.5 rounded-lg border border-[#EAEAEA] dark:border-[#252B27] bg-[#FAF9F7] dark:bg-[#151917] text-xs font-mono text-[#111111] dark:text-[#FAF7F2] placeholder-[#787774] focus:outline-none focus:border-[#C5A059] transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-[#787774] dark:text-[#8E9290] shrink-0">
          {filteredAhzab.length} / 60
        </div>
      </div>

      {/* 60 Ahzab Grid */}
      {filteredAhzab.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#EAEAEA] dark:border-[#222624] rounded-lg">
          <p className="text-xs font-mono text-[#787774] dark:text-[#8E9290]">
            {t.quranSection.noResults}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredAhzab.map((h: HizbIndexItem) => (
            <div
              key={h.hizb_number}
              className="p-4 rounded-lg border border-[#EAEAEA] dark:border-[#202522] bg-[#FAF9F7] dark:bg-[#151917] hover:border-[#C5A059]/50 transition-[border-color,transform] flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#FFFFFF] dark:bg-[#0E1210] border border-[#EAEAEA] dark:border-[#1E2320] text-[#111111] dark:text-[#FAF7F2]">
                    {t.quranSection.hizbPrefix} {h.hizb_number}
                  </span>
                  <span className="text-[10px] font-mono text-[#787774] dark:text-[#8E9290]">
                    {t.quranSection.pageRange} {h.start_page}-{h.end_page}
                  </span>
                </div>

                <div>
                  <div
                    className={`text-base font-bold text-[#143628] dark:text-[#FAF7F2] ${
                      isAr ? "font-amiri" : "font-serif"
                    }`}
                  >
                    {h.surahs.slice(0, 3).join(" • ")}
                  </div>
                  <p className="text-xs font-amiri text-[#787774] dark:text-[#8E9290] line-clamp-1 mt-1">
                    «{h.matlaa}»
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenHizb(h.hizb_number)}
                  className="flex-1 py-2 px-3 rounded-md bg-[#FFFFFF] dark:bg-[#1E2320] hover:bg-[#111111] hover:text-[#FFFFFF] dark:hover:bg-[#FAF7F2] dark:hover:text-[#111111] border border-[#EAEAEA] dark:border-[#2A312C] text-xs font-mono font-medium transition-[background-color,color,transform] active:scale-[0.98] cursor-pointer"
                >
                  {t.quranSection.openReader} →
                </button>
                <button
                  type="button"
                  onClick={() => onOpenHizb(h.hizb_number)}
                  title={isAr ? `استماع للحزب ${h.hizb_number}` : `Listen to Hizb ${h.hizb_number}`}
                  aria-label={isAr ? `استماع للحزب ${h.hizb_number}` : `Listen to Hizb ${h.hizb_number}`}
                  className="p-2 rounded-md border border-[#EAEAEA] dark:border-[#2A312C] bg-[#FFFFFF] dark:bg-[#1E2320] hover:bg-[#FAF9F7] text-[#143628] dark:text-[#E5C378] transition-colors cursor-pointer shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
