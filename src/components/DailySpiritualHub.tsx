"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Scroll,
  BookOpen,
  Share2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Languages,
  Check,
  Copy,
} from "lucide-react";
import { getHikmaOfTheDay, HikmaItem, HIKAM_LIST } from "@/lib/hikam";
import arbaeenData from "@/data/arbaeen.json";
import {
  IBN_ASHIR_LESSONS,
  getIbnAshirLessonOfTheDay,
  IbnAshirVerseLesson,
} from "@/lib/ibn-ashir";

interface DailySpiritualHubProps {
  onOpenPortal?: () => void;
}

const ZAWIYA_FACEBOOK_URL = "https://www.facebook.com/zaouia.mohammedia";

export function DailySpiritualHub({ onOpenPortal }: DailySpiritualHubProps) {
  const [dayOfYear, setDayOfYear] = useState(0);
  const [activeHikma, setActiveHikma] = useState<HikmaItem>(HIKAM_LIST[0]);
  const [activeIbnAshirIndex, setActiveIbnAshirIndex] = useState(0);
  const [hikmaLang, setHikmaLang] = useState<"ar" | "fr" | "en">("ar");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Initialize day index in useEffect to prevent hydration mismatches
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

  // Today's Hadith from Arbaeen
  const todayHadithIndex = dayOfYear % arbaeenData.length;
  const todayHadith = arbaeenData[todayHadithIndex] || arbaeenData[0];

  // Today's Matn Ibn Ashir lesson
  const currentIbnAshir: IbnAshirVerseLesson =
    IBN_ASHIR_LESSONS[activeIbnAshirIndex] || IBN_ASHIR_LESSONS[0];

  const handlePrevIbnAshir = () => {
    setActiveIbnAshirIndex((prev) =>
      prev === 0 ? IBN_ASHIR_LESSONS.length - 1 : prev - 1
    );
  };

  const handleNextIbnAshir = () => {
    setActiveIbnAshirIndex((prev) =>
      prev === IBN_ASHIR_LESSONS.length - 1 ? 0 : prev + 1
    );
  };

  const shareHadith = () => {
    const text = `📖 حديث اليوم الشريف (${todayHadith.id}/42 من الأربعين النووية):\n«${todayHadith.title}»\n\nنص الحديث:\n«${todayHadith.text_ar}»\n\nالراوي والمصدر: ${todayHadith.narrator} — ${todayHadith.source}\nالمدارسة السلوكية: ${todayHadith.suluk_lesson || ""}\n\nطالع زاد اليوم على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-spiritual`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareHikma = () => {
    let text = "";
    if (hikmaLang === "ar") {
      text = `✨ حكمة اليوم العطائية (#${activeHikma.number}):\n«${activeHikma.text_ar}»\n\nالشرح السلوكي:\n${activeHikma.explanation_ar}\n\nطالع زاد اليوم على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-spiritual`;
    } else if (hikmaLang === "fr") {
      text = `✨ Sagesse Al-'Ata'iyya N°${activeHikma.number}:\n« ${activeHikma.text_fr} »\n\nCommentaire:\n${activeHikma.explanation_ar}\n\nPlateforme Minhaj Al-Faqir: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-spiritual`;
    } else {
      text = `✨ Hikma Al-'Ata'iyya #${activeHikma.number}:\n"${activeHikma.text_en}"\n\nCommentary:\n${activeHikma.explanation_ar}\n\nMinhaj Al-Faqir Platform: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-spiritual`;
    }
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareIbnAshir = () => {
    const versesText = currentIbnAshir.verses
      .map((v) => `${v.firstHemistich} ... ${v.secondHemistich}`)
      .join("\n");
    const text = `📜 درة اليوم من متن ابن عاشر (${currentIbnAshir.chapter}):\nالبيت رقم: ${currentIbnAshir.verseNumbers} من 311\n\n${versesText}\n\nالشرح:\n${currentIbnAshir.explanation}\n\nطالع زاد اليوم على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-spiritual`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  return (
    <section
      id="daily-spiritual"
      className="scroll-mt-20 py-12 sm:py-16 bg-[#FAF7F2] dark:bg-[#0B1914] border-t border-[#E7DFD5] dark:border-[#203D31] relative transition-colors duration-300"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 border border-[#1B4332]/20 dark:border-[#C5A059]/30 text-[#1B4332] dark:text-[#E5C378] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>الغِذَاءُ الرُّوحِيُّ وَالعِلْمِيُّ اليَوْمِيُّ • نُصُوصٌ مُحَقَّقَةٌ</span>
          </div>

          <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2] tracking-wide mb-3 leading-relaxed">
            زَادُ اليَوْمِ الرُّوحِيّ
          </h2>

          <p className="font-ibm text-xs sm:text-sm text-[#52796F] dark:text-[#9BB0A5] leading-relaxed max-w-2xl mx-auto">
            محتوى يومي متجدد مستمد من قواعد البيانات العلمية المحققة: جواهر التربية والسلوك (الحكم العطائية بثلاث لغات مع الشرح الأصيل)، نور الوحي النبوي (الأربعين النووية)، وأصول الفقه والتصوف السني (متن ابن عاشر).
          </p>
        </div>

        {/* 3 Main Daily Pillars Bento Grid (Text-First Architecture) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* ======================================================== */}
          {/* 1. HIKMA OF THE DAY (Text-First + Trilingual + Notion)   */}
          {/* ======================================================== */}
          <div className="rounded-3xl bg-white dark:bg-[#0E2019] border border-[#C5A059]/35 shadow-md p-5 sm:p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#C5A059] transition-all duration-300">
            <div>
              {/* Pillar Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7DFD5] dark:border-[#203D31]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                      حكمة اليوم العطائية
                    </h3>
                    <span className="text-[10px] text-[#C5A059] font-medium block">
                      سيدي ابن عطاء الله السكندري
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378]">
                  #{activeHikma.number} / 264
                </span>
              </div>

              {/* Language Switcher Pills */}
              <div className="flex items-center justify-between mb-4 bg-[#FAF7F2] dark:bg-[#122820] p-1 rounded-xl border border-[#E7DFD5] dark:border-[#203D31]">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setHikmaLang("ar")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      hikmaLang === "ar"
                        ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                        : "text-[#52796F] dark:text-[#9BB0A5] hover:text-[#1B4332]"
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => setHikmaLang("fr")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      hikmaLang === "fr"
                        ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                        : "text-[#52796F] dark:text-[#9BB0A5] hover:text-[#1B4332]"
                    }`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => setHikmaLang("en")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      hikmaLang === "en"
                        ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                        : "text-[#52796F] dark:text-[#9BB0A5] hover:text-[#1B4332]"
                    }`}
                  >
                    English
                  </button>
                </div>

                <span className="text-[10px] text-[#C5A059] font-semibold px-2">
                  {activeHikma.topic}
                </span>
              </div>

              {/* Illuminated Manuscript Text Box */}
              <div className="relative rounded-2xl p-5 mb-4 bg-gradient-to-br from-[#FFFDF9] to-[#F7F2E8] dark:from-[#122820] dark:to-[#0A1813] border border-[#C5A059]/40 shadow-inner">
                {/* Decorative quote mark */}
                <span className="absolute top-2 left-3 text-3xl font-amiri text-[#C5A059]/20 select-none">
                  ❝
                </span>

                {/* Text per language */}
                {hikmaLang === "ar" && (
                  <div className="space-y-3">
                    <p className="font-amiri text-lg sm:text-xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-loose text-center sm:text-right">
                      «{activeHikma.text_ar}»
                    </p>
                    <div className="w-12 h-0.5 bg-[#C5A059]/30 mx-auto sm:mr-0" />
                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-[#C5A059] block mb-1">
                        الشَّرْحُ السَّلُوكِيُّ المُحَقَّقُ:
                      </span>
                      <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                        {activeHikma.explanation_ar}
                      </p>
                    </div>
                  </div>
                )}

                {hikmaLang === "fr" && (
                  <div className="space-y-3 text-left" dir="ltr">
                    <p className="font-serif italic text-base sm:text-lg text-[#143628] dark:text-[#FAF7F2] leading-relaxed">
                      « {activeHikma.text_fr || "Traduction en cours de révision..."} »
                    </p>
                    <div className="w-12 h-0.5 bg-[#C5A059]/30" />
                    <div className="pt-1 text-right" dir="rtl">
                      <span className="text-[11px] font-bold text-[#C5A059] block mb-1">
                        الشَّرْحُ السَّلُوكِيُّ:
                      </span>
                      <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                        {activeHikma.explanation_ar}
                      </p>
                    </div>
                  </div>
                )}

                {hikmaLang === "en" && (
                  <div className="space-y-3 text-left" dir="ltr">
                    <p className="font-serif text-base sm:text-lg text-[#143628] dark:text-[#FAF7F2] leading-relaxed">
                      “ {activeHikma.text_en || "English translation under scholarly review..."} ”
                    </p>
                    <div className="w-12 h-0.5 bg-[#C5A059]/30" />
                    <div className="pt-1 text-right" dir="rtl">
                      <span className="text-[11px] font-bold text-[#C5A059] block mb-1">
                        الشَّرْحُ السَّلُوكِيُّ:
                      </span>
                      <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                        {activeHikma.explanation_ar}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: Facebook Poster Link & WhatsApp Share */}
            <div className="pt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex flex-col sm:flex-row items-center gap-2">
              <a
                href={ZAWIYA_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#5B9DF8] border border-[#1877F2]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition group"
                title="مشاهدة اللوحة الفنية والتصميم الكامل على صفحة فيسبوك"
              >
                <span>مشاهدة اللوحة على فيسبوك</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition-transform" />
              </a>

              <button
                onClick={shareHikma}
                className="w-full sm:w-auto py-2 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                title="مشاركة الحكمة مع الشرح عبر واتساب"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. HADITH OF THE DAY (Text-First + Arbaeen + Facebook)    */}
          {/* ======================================================== */}
          <div className="rounded-3xl bg-white dark:bg-[#0E2019] border border-[#C5A059]/35 shadow-md p-5 sm:p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#C5A059] transition-all duration-300">
            <div>
              {/* Pillar Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7DFD5] dark:border-[#203D31]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059]">
                    <Scroll className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                      حديث اليوم النبوي
                    </h3>
                    <span className="text-[10px] text-[#C5A059] font-medium block">
                      الأربعين النووية للإمام النووي
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378]">
                  #{todayHadith.id} / 42
                </span>
              </div>

              {/* Topic & Metadata Banner */}
              <div className="flex items-center justify-between mb-4 bg-[#FAF7F2] dark:bg-[#122820] px-3 py-1.5 rounded-xl border border-[#E7DFD5] dark:border-[#203D31]">
                <span className="text-[11px] font-semibold text-[#1B4332] dark:text-[#E5C378]">
                  {todayHadith.topic}
                </span>
                <span className="text-[10px] text-[#84928A]">
                  {todayHadith.theme}
                </span>
              </div>

              {/* Illuminated Hadith Text Box */}
              <div className="relative rounded-2xl p-5 mb-4 bg-gradient-to-br from-[#FFFDF9] to-[#F7F2E8] dark:from-[#122820] dark:to-[#0A1813] border border-[#C5A059]/40 shadow-inner">
                <span className="absolute top-2 left-3 text-3xl font-amiri text-[#C5A059]/20 select-none">
                  ❝
                </span>

                <div className="space-y-3">
                  <h4 className="font-amiri text-lg font-bold text-[#C5A059] text-center sm:text-right">
                    «{todayHadith.title}»
                  </h4>

                  {/* Full Hadith Text */}
                  <p className="font-amiri text-base sm:text-lg font-bold text-[#143628] dark:text-[#FAF7F2] leading-loose text-center sm:text-right">
                    «{todayHadith.text_ar}»
                  </p>

                  <div className="w-12 h-0.5 bg-[#C5A059]/30 mx-auto sm:mr-0" />

                  <div className="pt-1 text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed space-y-1">
                    <p>
                      <strong className="text-[#143628] dark:text-[#FAF7F2]">الراوي والمخرج:</strong> {todayHadith.narrator} — {todayHadith.source}.
                    </p>
                    <p className="text-[11px] text-[#84928A] dark:text-[#7A9386]">
                      <strong className="text-[#C5A059]">المدارسة السلوكية:</strong> {todayHadith.suluk_lesson}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex flex-col sm:flex-row items-center gap-2">
              <a
                href={ZAWIYA_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#5B9DF8] border border-[#1877F2]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition group"
                title="مشاهدة تصميم الحديث الفني على فيسبوك"
              >
                <span>مشاهدة التصميم على فيسبوك</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition-transform" />
              </a>

              <button
                onClick={shareHadith}
                className="w-full sm:w-auto py-2 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                title="مشاركة الحديث الشريف عبر واتساب"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. MATN IBN ASHIR OF THE DAY (311 Verses + Notion Sharh) */}
          {/* ======================================================== */}
          <div className="rounded-3xl bg-white dark:bg-[#0E2019] border border-[#C5A059]/35 shadow-md p-5 sm:p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#C5A059] transition-all duration-300">
            <div>
              {/* Pillar Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7DFD5] dark:border-[#203D31]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                      دُرَّةُ مَتْنِ ابْنِ عَاشِرٍ
                    </h3>
                    <span className="text-[10px] text-[#C5A059] font-medium block">
                      المُرْشِدُ المُعِينُ عَلَى الضَّرُورِيِّ مِنْ عُلُومِ الدِّينِ
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378]">
                    البيت #{currentIbnAshir.verseNumbers} من 311
                  </span>
                </div>
              </div>

              {/* Chapter Badge & Title */}
              <div className="flex items-center justify-between mb-4 bg-[#FAF7F2] dark:bg-[#122820] px-3 py-1.5 rounded-xl border border-[#E7DFD5] dark:border-[#203D31]">
                <span className="text-[11px] text-[#1B4332] dark:text-[#E5C378] font-bold">
                  {currentIbnAshir.chapter}
                </span>
                <span className="text-[10px] text-[#84928A]">
                  {currentIbnAshir.theme}
                </span>
              </div>

              {/* Poetic Verses (شطران متقابلان مع فاصلة ❖) */}
              <div className="space-y-2 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#F7F2E8] dark:from-[#122820] dark:to-[#0A1813] border border-[#C5A059]/40 mb-3 shadow-inner">
                {currentIbnAshir.verses.map((v, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-[#0E2019]/80 border border-[#C5A059]/20 text-center font-amiri font-bold text-sm sm:text-base text-[#143628] dark:text-[#FAF7F2] leading-relaxed"
                  >
                    <span className="sm:text-right flex-1">{v.firstHemistich}</span>
                    <span className="text-[#C5A059] text-xs font-mono select-none px-1">❖</span>
                    <span className="sm:text-left flex-1">{v.secondHemistich}</span>
                  </div>
                ))}
              </div>

              {/* Concise Scholarly Explanation from Notion */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] mb-4">
                <span className="text-[11px] font-bold text-[#C5A059] block mb-1">
                  الشَّرْحُ الفِقْهِيُّ وَالسَّلُوكِيُّ:
                </span>
                <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                  {currentIbnAshir.explanation}
                </p>
              </div>
            </div>

            {/* Navigation & Action Buttons */}
            <div className="pt-3 border-t border-[#E7DFD5] dark:border-[#203D31] space-y-2">
              <div className="flex items-center justify-between gap-2">
                {/* Prev / Next Verse Navigation */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevIbnAshir}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#122820] hover:bg-[#C5A059]/15 border border-[#E7DFD5] dark:border-[#203D31] text-[#143628] dark:text-[#FAF7F2] transition"
                    title="البيت السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono px-1.5 text-[#84928A]">
                    {activeIbnAshirIndex + 1}/{IBN_ASHIR_LESSONS.length}
                  </span>
                  <button
                    onClick={handleNextIbnAshir}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#122820] hover:bg-[#C5A059]/15 border border-[#E7DFD5] dark:border-[#203D31] text-[#143628] dark:text-[#FAF7F2] transition"
                    title="البيت التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Facebook Link */}
                <a
                  href={ZAWIYA_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#5B9DF8] border border-[#1877F2]/30 text-xs font-semibold flex items-center gap-1 transition"
                  title="صفحة الزاوية بمدينة المحمدية على فيسبوك"
                >
                  <span>فيسبوك</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* WhatsApp Share */}
                <button
                  onClick={shareIbnAshir}
                  className="py-1.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 text-xs font-semibold flex items-center justify-center gap-1 transition"
                  title="مشاركة البيت عبر واتساب"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>مشاركة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
