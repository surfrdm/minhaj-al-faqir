"use client";

import React from "react";
import type { BayanLocale } from "@/lib/bayan-i18n";
import { DICTIONARY } from "@/lib/bayan-i18n";

interface BayanHeaderProps {
  locale: BayanLocale;
  onToggleLocale: () => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export function BayanHeader({
  locale,
  onToggleLocale,
  onNavigateSection,
}: BayanHeaderProps) {
  const t = DICTIONARY[locale];
  const isAr = locale === "ar";

  const handleNav = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 dark:bg-[#0A0D0B]/90 backdrop-blur-md border-b border-[#EAEAEA] dark:border-[#202522]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Typographic Identity (Zero Logo, Pure Typography) */}
        <div className="flex items-center gap-3">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              handleNav("top");
            }}
            className="group flex items-baseline gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-[#FFFFFF] rounded-sm"
          >
            <span
              className="font-serif tracking-tight text-2xl font-bold text-[#111111] dark:text-[#FFFFFF] group-hover:opacity-80 transition-opacity"
              style={{ letterSpacing: "-0.03em" }}
            >
              BAYAN
            </span>
            <span className="text-[#C5A059] font-light text-base select-none">
              •
            </span>
            <span className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#E5C378] group-hover:opacity-80 transition-opacity">
              بَيَان
            </span>
          </a>
          <span className="hidden lg:inline-block text-[11px] font-mono tracking-wider text-[#787774] dark:text-[#8E9290] border-s border-[#EAEAEA] dark:border-[#202522] ps-3 uppercase">
            {isAr ? "قرآن • حديث • صلاة" : "Quran • Hadith • Prayer"}
          </span>
        </div>

        {/* Clean Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 sm:gap-2 text-xs font-medium"
        >
          <button
            type="button"
            onClick={() => handleNav("daily")}
            className="px-3 py-1.5 rounded-md text-[#2F3437] dark:text-[#D5D8D6] hover:bg-[#F7F6F3] dark:hover:bg-[#151917] transition-colors cursor-pointer"
          >
            {t.nav.daily}
          </button>
          <button
            type="button"
            onClick={() => handleNav("prayer")}
            className="px-3 py-1.5 rounded-md text-[#2F3437] dark:text-[#D5D8D6] hover:bg-[#F7F6F3] dark:hover:bg-[#151917] transition-colors cursor-pointer"
          >
            {t.nav.prayer}
          </button>
          <button
            type="button"
            onClick={() => handleNav("quran")}
            className="px-3 py-1.5 rounded-md text-[#2F3437] dark:text-[#D5D8D6] hover:bg-[#F7F6F3] dark:hover:bg-[#151917] transition-colors cursor-pointer"
          >
            {t.nav.quran}
          </button>
          <button
            type="button"
            onClick={() => handleNav("hadith")}
            className="px-3 py-1.5 rounded-md text-[#2F3437] dark:text-[#D5D8D6] hover:bg-[#F7F6F3] dark:hover:bg-[#151917] transition-colors cursor-pointer"
          >
            {t.nav.hadith}
          </button>
        </nav>

        {/* Language Switcher Pill */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLocale}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold border border-[#EAEAEA] dark:border-[#222624] bg-[#FFFFFF] dark:bg-[#121614] text-[#111111] dark:text-[#FAF7F2] hover:bg-[#F7F6F3] dark:hover:bg-[#1A1F1C] active:scale-[0.98] transition-[transform,background-color] duration-150 cursor-pointer"
            aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
          >
            <span
              className={
                isAr
                  ? "font-bold text-[#143628] dark:text-[#E5C378]"
                  : "text-[#787774]"
              }
            >
              عربي
            </span>
            <span className="text-[#C5A059] opacity-60">/</span>
            <span
              className={
                !isAr
                  ? "font-bold text-[#143628] dark:text-[#E5C378]"
                  : "text-[#787774]"
              }
            >
              EN
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
