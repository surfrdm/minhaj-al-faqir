"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Volume2 } from "lucide-react";
import { getTodayAhzabNumbers, getHizbMeta } from "@/lib/quran";
import type { BayanLocale } from "@/lib/bayan-i18n";
import { DICTIONARY } from "@/lib/bayan-i18n";

interface DailyHizbCardProps {
  locale: BayanLocale;
  onOpenHizb: (hizbNumber: number, period: "subh" | "masa") => void;
}

export function DailyHizbCard({ locale, onOpenHizb }: DailyHizbCardProps) {
  const t = DICTIONARY[locale];
  const isAr = locale === "ar";

  // Hydration-safe initial state (avoids new Date() at prerender time)
  const [todayInfo, setTodayInfo] = useState({
    morningHizb: 1,
    eveningHizb: 2,
    dayOfMonth: 1,
  });

  useEffect(() => {
    queueMicrotask(() => {
      setTodayInfo(getTodayAhzabNumbers(new Date()));
    });
  }, []);

  const morningMeta = useMemo(() => {
    return getHizbMeta(todayInfo.morningHizb);
  }, [todayInfo.morningHizb]);

  const eveningMeta = useMemo(() => {
    return getHizbMeta(todayInfo.eveningHizb);
  }, [todayInfo.eveningHizb]);

  return (
    <section
      id="daily"
      className="p-6 sm:p-8 rounded-xl bg-[#FFFFFF] dark:bg-[#121614] border border-[#EAEAEA] dark:border-[#222624] space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#EAEAEA] dark:border-[#202522] pb-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#787774] dark:text-[#8E9290]">
            {isAr ? "الورد القرآني اليومي" : "Daily Quranic Portion"}
          </span>
          <h2
            className={`text-xl sm:text-2xl font-bold text-[#111111] dark:text-[#FAF7F2] ${
              isAr ? "font-amiri" : "font-serif"
            }`}
          >
            {t.dailySection.title}
          </h2>
        </div>
        <div className="text-xs font-mono text-[#787774] dark:text-[#8E9290] bg-[#F7F6F3] dark:bg-[#1A1F1C] px-3 py-1 rounded-md border border-[#EAEAEA] dark:border-[#252B27]">
          {t.dailySection.todayOrder}:{" "}
          <strong className="text-[#111111] dark:text-[#FAF7F2] font-bold">
            {todayInfo.dayOfMonth} / 30
          </strong>
        </div>
      </div>

      {/* Two Ahzab Grid (Morning & Evening) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Morning Hizb Box */}
        <div className="p-5 rounded-lg border border-[#EAEAEA] dark:border-[#202522] bg-[#FAF9F7] dark:bg-[#151917] flex flex-col justify-between space-y-4 hover:border-[#C5A059]/40 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#EDF3EC] dark:bg-[#192A1D] text-[#346538] dark:text-[#78C380] border border-[#346538]/20">
                {t.dailySection.morningHizb}
              </span>
              <span
                className="font-mono text-sm font-bold text-[#111111] dark:text-[#FAF7F2]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                #{todayInfo.morningHizb}
              </span>
            </div>

            <div>
              <div
                className={`text-xl font-bold text-[#143628] dark:text-[#FAF7F2] ${
                  isAr ? "font-amiri" : "font-serif"
                }`}
              >
                {isAr
                  ? `الحِزْبُ ${todayInfo.morningHizb}`
                  : `Hizb ${todayInfo.morningHizb}`}
              </div>
              <p className="text-xs text-[#787774] dark:text-[#8E9290] font-mono mt-0.5">
                {morningMeta.surahs.join(" • ")}
              </p>
            </div>

            <div className="p-3 rounded-md bg-[#FFFFFF] dark:bg-[#0E1210] border border-[#EAEAEA] dark:border-[#1E2320]">
              <span className="text-[10px] font-mono uppercase text-[#787774] dark:text-[#8E9290] block mb-1">
                {t.dailySection.matlaaLabel}
              </span>
              <p className="text-xs sm:text-sm font-amiri text-[#2F3437] dark:text-[#D5D8D6] line-clamp-2 leading-relaxed">
                «{morningMeta.matlaa}»
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenHizb(todayInfo.morningHizb, "subh")}
              className="flex-1 py-2.5 px-4 rounded-md bg-[#111111] hover:bg-[#2A2E2C] dark:bg-[#FAF7F2] dark:hover:bg-[#E5C378] text-[#FFFFFF] dark:text-[#111111] text-xs font-semibold tracking-wide transition-[transform,background-color] active:scale-[0.98] cursor-pointer"
            >
              {t.dailySection.readHizb}
            </button>
            <button
              type="button"
              onClick={() => onOpenHizb(todayInfo.morningHizb, "subh")}
              title={isAr ? "استماع للتلاوة المغربية (ورش)" : "Listen to Moroccan Recitation"}
              aria-label={isAr ? "استماع للتلاوة المغربية" : "Listen to Moroccan Recitation"}
              className="p-2.5 rounded-md border border-[#EAEAEA] dark:border-[#202522] bg-[#FFFFFF] dark:bg-[#0E1210] hover:bg-[#FAF9F7] dark:hover:bg-[#1E2320] text-[#143628] dark:text-[#E5C378] transition-colors cursor-pointer shrink-0"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Evening Hizb Box */}
        <div className="p-5 rounded-lg border border-[#EAEAEA] dark:border-[#202522] bg-[#FAF9F7] dark:bg-[#151917] flex flex-col justify-between space-y-4 hover:border-[#C5A059]/40 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#FBF3DB] dark:bg-[#2A2414] text-[#956400] dark:text-[#E5C378] border border-[#956400]/20">
                {t.dailySection.eveningHizb}
              </span>
              <span
                className="font-mono text-sm font-bold text-[#111111] dark:text-[#FAF7F2]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                #{todayInfo.eveningHizb}
              </span>
            </div>

            <div>
              <div
                className={`text-xl font-bold text-[#143628] dark:text-[#FAF7F2] ${
                  isAr ? "font-amiri" : "font-serif"
                }`}
              >
                {isAr
                  ? `الحِزْبُ ${todayInfo.eveningHizb}`
                  : `Hizb ${todayInfo.eveningHizb}`}
              </div>
              <p className="text-xs text-[#787774] dark:text-[#8E9290] font-mono mt-0.5">
                {eveningMeta.surahs.join(" • ")}
              </p>
            </div>

            <div className="p-3 rounded-md bg-[#FFFFFF] dark:bg-[#0E1210] border border-[#EAEAEA] dark:border-[#1E2320]">
              <span className="text-[10px] font-mono uppercase text-[#787774] dark:text-[#8E9290] block mb-1">
                {t.dailySection.matlaaLabel}
              </span>
              <p className="text-xs sm:text-sm font-amiri text-[#2F3437] dark:text-[#D5D8D6] line-clamp-2 leading-relaxed">
                «{eveningMeta.matlaa}»
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenHizb(todayInfo.eveningHizb, "masa")}
              className="flex-1 py-2.5 px-4 rounded-md bg-[#111111] hover:bg-[#2A2E2C] dark:bg-[#FAF7F2] dark:hover:bg-[#E5C378] text-[#FFFFFF] dark:text-[#111111] text-xs font-semibold tracking-wide transition-[transform,background-color] active:scale-[0.98] cursor-pointer"
            >
              {t.dailySection.readHizb}
            </button>
            <button
              type="button"
              onClick={() => onOpenHizb(todayInfo.eveningHizb, "masa")}
              title={isAr ? "استماع للتلاوة المغربية (ورش)" : "Listen to Moroccan Recitation"}
              aria-label={isAr ? "استماع للتلاوة المغربية" : "Listen to Moroccan Recitation"}
              className="p-2.5 rounded-md border border-[#EAEAEA] dark:border-[#202522] bg-[#FFFFFF] dark:bg-[#0E1210] hover:bg-[#FAF9F7] dark:hover:bg-[#1E2320] text-[#143628] dark:text-[#E5C378] transition-colors cursor-pointer shrink-0"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
