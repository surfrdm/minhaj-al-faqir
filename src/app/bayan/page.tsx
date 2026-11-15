"use client";

import React, { useState, useEffect } from "react";
import type { BayanLocale } from "@/lib/bayan-i18n";
import { DICTIONARY } from "@/lib/bayan-i18n";
import { BayanHeader } from "@/components/bayan/BayanHeader";
import { DailyHizbCard } from "@/components/bayan/DailyHizbCard";
import { PrayerQiblaCard } from "@/components/bayan/PrayerQiblaCard";
import { QuranSection } from "@/components/bayan/QuranSection";
import { HadithSection } from "@/components/bayan/HadithSection";
import { QuranHizbReaderModal } from "@/components/QuranHizbReaderModal";

export default function BayanHomePage() {
  const [locale, setLocale] = useState<BayanLocale>("ar");
  const [selectedHizb, setSelectedHizb] = useState<number | null>(null);
  const [hizbPeriod, setHizbPeriod] = useState<"subh" | "masa" | "custom">("custom");

  // Restore preferred locale from localStorage on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem("bayan_locale");
        if (saved === "ar" || saved === "en") {
          setLocale(saved);
        }
      } catch {
        // Ignore
      }
    });
  }, []);

  const handleToggleLocale = () => {
    const next: BayanLocale = locale === "ar" ? "en" : "ar";
    setLocale(next);
    try {
      localStorage.setItem("bayan_locale", next);
    } catch {
      // Ignore
    }
  };

  const handleOpenHizb = (hNum: number, period: "subh" | "masa" | "custom" = "custom") => {
    setSelectedHizb(hNum);
    setHizbPeriod(period);
  };

  const t = DICTIONARY[locale];
  const isAr = locale === "ar";

  return (
    <div
      id="top"
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#FBFBFA] dark:bg-[#0C0E0D] text-[#111111] dark:text-[#FAF7F2] font-sans selection:bg-[#C5A059]/25 transition-colors duration-200"
    >
      {/* Editorial Header */}
      <BayanHeader
        locale={locale}
        onToggleLocale={handleToggleLocale}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Minimal Hero Statement (No Logo, Pure Typographic Identity) */}
        <section className="text-center py-6 sm:py-10 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#EDF3EC] dark:bg-[#152418] text-[#346538] dark:text-[#78C380] border border-[#346538]/20">
            <span>{isAr ? "منصة رقمية وقفية" : "Digital Islamic Endowment"}</span>
            <span>•</span>
            <span>{isAr ? "عربي / English" : "AR / EN"}</span>
          </div>

          <h1
            className="text-4xl sm:text-6xl font-bold tracking-tight text-[#111111] dark:text-[#FFFFFF]"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="font-serif">BAYAN</span>{" "}
            <span className="text-[#C5A059] font-light">/</span>{" "}
            <span className="font-amiri text-5xl sm:text-7xl text-[#143628] dark:text-[#E5C378]">
              بَيَان
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#787774] dark:text-[#8E9290] font-mono leading-relaxed max-w-2xl mx-auto">
            {t.brandTagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#787774] dark:text-[#8E9290]">
            <span>✓ {isAr ? "60 حزباً برواية ورش" : "60 Ahzab (Warsh)"}</span>
            <span>✓ {isAr ? "مواقيت الصلاة والقبلة" : "Prayer Times & Qibla"}</span>
            <span>✓ {isAr ? "صحيح البخاري كاملاً" : "Sahih Al-Bukhari"}</span>
            <span>✓ {isAr ? "الشفا للقاضي عياض" : "Kitab Ash-Shifa"}</span>
            <span>✓ {isAr ? "الأربعون النووية" : "An-Nawawi's 40"}</span>
          </div>
        </section>

        {/* BENTO ROW 1: Daily Ahzab & Prayer/Qibla Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <DailyHizbCard
            locale={locale}
            onOpenHizb={(hNum, period) => handleOpenHizb(hNum, period)}
          />
          <PrayerQiblaCard locale={locale} />
        </div>

        {/* BENTO ROW 2: The Complete Holy Quran (60 Ahzab) */}
        <QuranSection
          locale={locale}
          onOpenHizb={(hNum) => handleOpenHizb(hNum, "custom")}
        />

        {/* BENTO ROW 3: Hadith & Sunnah Repository (Bukhari, Shifa, Arbaeen) */}
        <HadithSection locale={locale} />

        {/* Editorial Minimal Footer */}
        <footer className="pt-8 border-t border-[#EAEAEA] dark:border-[#202522] text-center text-xs font-mono text-[#787774] dark:text-[#8E9290] space-y-2 pb-12">
          <div className="flex items-center justify-center gap-2 font-bold text-[#111111] dark:text-[#FAF7F2]">
            <span className="font-serif">BAYAN</span>
            <span>•</span>
            <span className="font-amiri text-base">بَيَان</span>
          </div>
          <p>{t.footer.description}</p>
          <p className="text-[10px] opacity-70">
            {t.footer.rights} • 1447 AH / 2026 CE
          </p>
        </footer>
      </main>

      {/* Complete Holy Quran Reader Modal (Reused seamlessly with all features) */}
      {selectedHizb !== null && (
        <QuranHizbReaderModal
          isOpen={true}
          hizbNumber={selectedHizb}
          hizbPeriod={hizbPeriod}
          onClose={() => setSelectedHizb(null)}
        />
      )}
    </div>
  );
}
