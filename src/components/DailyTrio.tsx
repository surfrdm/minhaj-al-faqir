"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Scroll,
  BookOpen,
  Share2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import { getHikmaOfTheDay, HikmaItem, HIKAM_LIST } from "@/lib/hikam";
import arbaeenData from "@/data/arbaeen.json";
import {
  IBN_ASHIR_LESSONS,
  IbnAshirVerseLesson,
  IBN_ASHIR_TOTAL_COUNT,
} from "@/lib/ibn-ashir";

export function DailyTrio() {
  const [dayOfYear, setDayOfYear] = useState(0);
  const [activeHikma, setActiveHikma] = useState<HikmaItem>(HIKAM_LIST[0]);
  const [activeIbnAshirIndex, setActiveIbnAshirIndex] = useState(0);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    setDayOfYear(day);
    setActiveHikma(getHikmaOfTheDay(today));
    setActiveIbnAshirIndex(Math.abs(day) % IBN_ASHIR_LESSONS.length);
  }, []);

  const todayHadithIndex = dayOfYear % arbaeenData.length;
  const todayHadith = arbaeenData[todayHadithIndex] || arbaeenData[0];
  const currentIbnAshir: IbnAshirVerseLesson =
    IBN_ASHIR_LESSONS[activeIbnAshirIndex] || IBN_ASHIR_LESSONS[0];

  const handleCopy = (text: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };

  const shareHadith = () => {
    const text = `📖 حديث اليوم النبوي السلوكي (${todayHadith.id}/42 من الأربعين):\n«${todayHadith.title}»\n\n${todayHadith.text_ar}\n\nالراوي: ${todayHadith.narrator}\nالمصدر: ${todayHadith.source}\n\nطالع الثلاثية اليومية: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-trio`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareHikma = () => {
    const text = `✨ حكمة اليوم العطائية (#${activeHikma.number}):\n«${activeHikma.text_ar}»\n\nالشرح المختصر:\n${activeHikma.explanation_ar}\n\nطالع الثلاثية اليومية: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-trio`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareIbnAshir = () => {
    const versesText = currentIbnAshir.verses
      .map((v) => `${v.firstHemistich} ... ${v.secondHemistich}`)
      .join("\n");
    const text = `📜 فقه اليوم من متن ابن عاشر (${currentIbnAshir.chapter}):\nالأبيات (${currentIbnAshir.verseNumbers}/${IBN_ASHIR_TOTAL_COUNT}):\n${versesText}\n\nالشرح:\n${currentIbnAshir.explanation}\n\nطالع الثلاثية اليومية: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-trio`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="daily-trio" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#E7DFD5] dark:border-[#203D31]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#E8F0EC]">
                الثُّلاَثِيَّةُ اليَوْمِيَّةُ • زَادُ الفَقِيرِ السَّرِيعُ
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378] text-[11px] font-bold">
                تحديث يومي
              </span>
            </div>
            <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm">
              زاد معرفي وروحي مكثف في 3 دقائق: حكمة عطائية • حديث نبوي سلوكي • بيت فقهي من ابن عاشر
            </p>
          </div>
        </div>

        <Link
          href="/#daily-spiritual"
          className="text-xs font-bold text-[#143628] dark:text-[#E5C378] hover:text-[#C5A059] flex items-center gap-1 transition"
        >
          <span>عرض الشروح الموسعة والتراجم</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: HIKMA */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#C5A059]/35 hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] text-xs font-bold font-amiri">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>حِكْمَةُ اليَوْمِ #{activeHikma.number}</span>
              </span>
              <span className="text-[11px] text-[#52796F] dark:text-[#A1B3A9]">الحكم العطائية</span>
            </div>

            <Link href={`/hikma/${activeHikma.number}`} className="block group-hover:text-[#C5A059] transition">
              <p className="font-amiri text-base sm:text-lg font-bold text-[#143628] dark:text-[#FAF7F2] leading-relaxed line-clamp-3">
                «{activeHikma.text_ar}»
              </p>
            </Link>

            <p className="text-xs text-[#1D2A24]/75 dark:text-[#D5E2DB]/80 font-ibm leading-relaxed line-clamp-2">
              {activeHikma.explanation_ar}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between text-xs">
            <Link
              href={`/hikma/${activeHikma.number}`}
              className="text-[#143628] dark:text-[#E5C378] font-bold flex items-center gap-1 hover:underline"
            >
              <span>قراءة الحكمة كاملة</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCopy(activeHikma.text_ar, "hikma")}
                className="p-1.5 rounded-lg text-gray-500 hover:text-[#C5A059] hover:bg-[#C5A059]/10 transition"
                title="نسخ الحكمة"
              >
                {copiedItem === "hikma" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={shareHikma}
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                title="مشاركة عبر واتساب"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: HADITH */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#1B4332]/25 dark:border-[#203D31] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1B4332]/10 dark:bg-[#1B4332]/30 text-[#1B4332] dark:text-[#E8F0EC] text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>حَدِيثُ اليَوْمِ ({todayHadith.id}/42)</span>
              </span>
              <span className="text-[11px] text-[#52796F] dark:text-[#A1B3A9]">الأربعون النووية</span>
            </div>

            <Link href={`/hadith/${todayHadith.id}`} className="block group-hover:text-[#C5A059] transition">
              <h3 className="font-amiri text-base sm:text-lg font-bold text-[#143628] dark:text-[#FAF7F2] line-clamp-1">
                {todayHadith.title}
              </h3>
            </Link>

            <p className="font-amiri text-sm sm:text-base text-[#143628]/90 dark:text-[#FAF7F2]/90 leading-relaxed line-clamp-3">
              «{todayHadith.text_ar}»
            </p>

            <div className="text-[11px] text-[#52796F] dark:text-[#A1B3A9] flex items-center justify-between">
              <span>{todayHadith.narrator}</span>
              <span>{todayHadith.source}</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between text-xs">
            <Link
              href={`/hadith/${todayHadith.id}`}
              className="text-[#143628] dark:text-[#E5C378] font-bold flex items-center gap-1 hover:underline"
            >
              <span>قراءة الحديث والمدارسة</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCopy(todayHadith.text_ar, "hadith")}
                className="p-1.5 rounded-lg text-gray-500 hover:text-[#C5A059] hover:bg-[#C5A059]/10 transition"
                title="نسخ الحديث"
              >
                {copiedItem === "hadith" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={shareHadith}
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                title="مشاركة عبر واتساب"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CARD 3: IBN ASHIR */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#C5A059]/35 hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] text-xs font-bold font-amiri">
                <Scroll className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>فِقْهُ ابْنِ عَاشِرٍ ({currentIbnAshir.verseNumbers}/{IBN_ASHIR_TOTAL_COUNT})</span>
              </span>
              <span className="text-[11px] text-[#52796F] dark:text-[#A1B3A9]">{currentIbnAshir.chapter}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/20 space-y-1.5 text-center">
              {currentIbnAshir.verses.slice(0, 2).map((verse, idx) => (
                <div key={idx} className="font-amiri text-sm sm:text-base font-bold text-[#143628] dark:text-[#FAF7F2] leading-relaxed">
                  <span>{verse.firstHemistich}</span>
                  <span className="text-[#C5A059] mx-1">...</span>
                  <span>{verse.secondHemistich}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#1D2A24]/75 dark:text-[#D5E2DB]/80 font-ibm leading-relaxed line-clamp-2">
              {currentIbnAshir.explanation}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between text-xs">
            <a
              href="/#ibn-ashir"
              className="text-[#143628] dark:text-[#E5C378] font-bold flex items-center gap-1 hover:underline"
            >
              <span>فتح المتن الكامل</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  handleCopy(
                    currentIbnAshir.verses
                      .map((v) => `${v.firstHemistich} ... ${v.secondHemistich}`)
                      .join("\n"),
                    "ibn-ashir"
                  )
                }
                className="p-1.5 rounded-lg text-gray-500 hover:text-[#C5A059] hover:bg-[#C5A059]/10 transition"
                title="نسخ الأبيات"
              >
                {copiedItem === "ibn-ashir" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={shareIbnAshir}
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                title="مشاركة عبر واتساب"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
