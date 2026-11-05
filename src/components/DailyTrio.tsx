"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Scroll,
  BookOpen,
  Share2,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Flame,
  ArrowUpRight,
  X,
  BookMarked,
  Info,
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
  const [expandedType, setExpandedType] = useState<"hikma" | "hadith" | "ibn-ashir" | null>(null);

  const toggleExpand = (type: "hikma" | "hadith" | "ibn-ashir") => {
    setExpandedType((prev) => (prev === type ? null : type));
  };

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
    const text = `📖 حديث اليوم النبوي السلوكي (${todayHadith.id}/42 من الأربعين):\n«${todayHadith.title}»\n\n${todayHadith.text_ar}\n\nالراوي: ${todayHadith.narrator}\nالمصدر: ${todayHadith.source}\n\nطالع التكوين اليومي للفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-trio`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareHikma = () => {
    const text = `✨ حكمة اليوم العطائية (#${activeHikma.number}):\n«${activeHikma.text_ar}»\n\nالشرح المختصر:\n${activeHikma.explanation_ar}\n\nطالع التكوين اليومي للفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-trio`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareIbnAshir = () => {
    const versesText = currentIbnAshir.verses
      .map((v) => `${v.firstHemistich} ... ${v.secondHemistich}`)
      .join("\n");
    const text = `📜 فقه اليوم من متن ابن عاشر (${currentIbnAshir.chapter}):\nالأبيات (${currentIbnAshir.verseNumbers}/${IBN_ASHIR_TOTAL_COUNT}):\n${versesText}\n\nالشرح:\n${currentIbnAshir.explanation}\n\nطالع التكوين اليومي للفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-trio`;
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
                التَّكْوِينُ اليَوْمِيُّ لِلفَقِيرِ
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378] text-[11px] font-bold">
                تحديث يومي
              </span>
            </div>
            <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm">
              زاد معرفي وروحي جامع: حكمة عطائية • حديث نبوي في السلوك • فقه العبادات من ابن عاشر
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
            <button
              type="button"
              onClick={() => toggleExpand("hikma")}
              className="text-[#143628] dark:text-[#E5C378] font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{expandedType === "hikma" ? "إخفاء الشرح" : "قراءة الشرح والفوائد"}</span>
              {expandedType === "hikma" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

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
            <button
              type="button"
              onClick={() => toggleExpand("hadith")}
              className="text-[#143628] dark:text-[#E5C378] font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{expandedType === "hadith" ? "إخفاء الشرح" : "قراءة الشرح والمدارسة"}</span>
              {expandedType === "hadith" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

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
            <button
              type="button"
              onClick={() => toggleExpand("ibn-ashir")}
              className="text-[#143628] dark:text-[#E5C378] font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{expandedType === "ibn-ashir" ? "إخفاء الشرح" : "قراءة الشرح الفقهي"}</span>
              {expandedType === "ibn-ashir" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

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

      {/* INLINE DETAILED EXPLANATION PANEL */}
      {expandedType && (
        <div className="mt-5 p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#0A1C14] border-2 border-[#C5A059] shadow-lg animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between border-b border-[#E7DFD5] dark:border-[#1E3A2F] pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378]">
                {expandedType === "hikma" ? (
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                ) : expandedType === "hadith" ? (
                  <BookOpen className="w-5 h-5 text-[#C5A059]" />
                ) : (
                  <Scroll className="w-5 h-5 text-[#C5A059]" />
                )}
              </span>
              <div>
                <span className="text-xs font-bold text-[#C5A059] block">
                  {expandedType === "hikma"
                    ? "الشرح المفصل للحكمة العطائية"
                    : expandedType === "hadith"
                    ? "الشرح والمدارسة السلوكية للحديث النبوي"
                    : "الشرح الفقهي لمتن ابن عاشر"}
                </span>
                <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                  {expandedType === "hikma"
                    ? `الحكمة رقم #${activeHikma.number}`
                    : expandedType === "hadith"
                    ? todayHadith.title
                    : `باب: ${currentIbnAshir.chapter}`}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExpandedType(null)}
              className="p-2 rounded-full bg-[#FAF7F2] dark:bg-[#12241D] text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
              title="إغلاق الشرح"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* DETAIL CONTENT: HIKMA */}
          {expandedType === "hikma" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#143628]/5 dark:bg-[#143628]/30 border border-[#C5A059]/30">
                <span className="text-xs text-[#C5A059] font-bold block mb-1">نص الحكمة المباركة:</span>
                <p className="font-amiri text-lg sm:text-xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-relaxed">
                  «{activeHikma.text_ar}»
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#52796F] dark:text-[#E5C378]">المعنى والبعد الروحي:</h4>
                <p className="font-ibm text-sm text-[#1D2A24]/90 dark:text-[#D5E2DB] leading-relaxed">
                  {activeHikma.explanation_ar}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href={`/hikma/${activeHikma.number}`}
                  className="px-4 py-2 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#FAF7F2] text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>فتح صفحة الحكمة المستقلة مع الشروح المقارنة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setExpandedType(null)}
                  className="text-xs text-gray-500 hover:text-[#C5A059] font-bold"
                >
                  إغلاق ✕
                </button>
              </div>
            </div>
          )}

          {/* DETAIL CONTENT: HADITH */}
          {expandedType === "hadith" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#143628]/5 dark:bg-[#143628]/30 border border-[#C5A059]/30">
                <span className="text-xs text-[#C5A059] font-bold block mb-1">نص الحديث الشريف:</span>
                <p className="font-amiri text-lg sm:text-xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-relaxed">
                  «{todayHadith.text_ar}»
                </p>
                <div className="text-xs text-[#52796F] dark:text-[#A1B3A9] mt-2 pt-2 border-t border-[#C5A059]/20 flex flex-wrap gap-4">
                  <span>الراوي: <strong>{todayHadith.narrator}</strong></span>
                  <span>المصدر: <strong>{todayHadith.source}</strong></span>
                </div>
              </div>

              {todayHadith.suluk_lesson && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-[#C5A059]/40 space-y-1.5">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block">
                    المدارسة السلوكية والتربوية للطريقة:
                  </span>
                  <p className="font-ibm text-sm text-[#1D2A24] dark:text-[#E8F0EC] leading-relaxed">
                    {todayHadith.suluk_lesson}
                  </p>
                </div>
              )}

              {todayHadith.vocabulary && todayHadith.vocabulary.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#52796F] dark:text-[#E5C378]">غريب الألفاظ والبيان:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {todayHadith.vocabulary.map((vocab: any, vIdx: number) => (
                      <div key={vIdx} className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#12241D] border border-[#E7DFD5] dark:border-[#203D31] text-xs">
                        <strong className="text-[#C5A059] block">{vocab.word}:</strong>
                        <span className="text-[#1D2A24]/85 dark:text-[#D5E2DB]">{vocab.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href={`/hadith/${todayHadith.id}`}
                  className="px-4 py-2 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#FAF7F2] text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>فتح قارئ الأربعين النووية بـ 4 تبويبات تفصيلية</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setExpandedType(null)}
                  className="text-xs text-gray-500 hover:text-[#C5A059] font-bold"
                >
                  إغلاق ✕
                </button>
              </div>
            </div>
          )}

          {/* DETAIL CONTENT: IBN ASHIR */}
          {expandedType === "ibn-ashir" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#143628]/5 dark:bg-[#143628]/30 border border-[#C5A059]/30">
                <span className="text-xs text-[#C5A059] font-bold block mb-2">أبيات المنظومة:</span>
                <div className="space-y-2 text-center">
                  {currentIbnAshir.verses.map((verse, idx) => (
                    <div key={idx} className="font-amiri text-base sm:text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                      <span>{verse.firstHemistich}</span>
                      <span className="text-[#C5A059] mx-2">...</span>
                      <span>{verse.secondHemistich}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#52796F] dark:text-[#E5C378]">الشرح الفقهي الميسر:</h4>
                <p className="font-ibm text-sm text-[#1D2A24]/90 dark:text-[#D5E2DB] leading-relaxed">
                  {currentIbnAshir.explanation}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setExpandedType(null)}
                  className="text-xs text-gray-500 hover:text-[#C5A059] font-bold mr-auto"
                >
                  إغلاق ✕
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
