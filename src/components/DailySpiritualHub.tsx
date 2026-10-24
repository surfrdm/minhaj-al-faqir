"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Scroll,
  BookOpen,
  Share2,
  Maximize2,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  GraduationCap,
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

export function DailySpiritualHub({ onOpenPortal }: DailySpiritualHubProps) {
  const [dayOfYear, setDayOfYear] = useState(0);
  const [activeHikma, setActiveHikma] = useState<HikmaItem>(HIKAM_LIST[0]);
  const [activeIbnAshirIndex, setActiveIbnAshirIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);

  // Initialize day index in useEffect to prevent hydration or unstable prerender values
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
    const text = `📖 حديث اليوم الشريف (${todayHadith.id}/42 من الأربعين النووية):\n«${todayHadith.title}»\n${todayHadith.source} - ${todayHadith.narrator}\n\nطالع زاد اليوم على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-spiritual`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareHikma = () => {
    const text = `✨ حكمة اليوم العطائية (#${activeHikma.number}):\n"${activeHikma.text_ar}"\n\nالشرح:\n${activeHikma.explanation_ar}\n\nطالع زاد اليوم على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-spiritual`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareIbnAshir = () => {
    const versesText = currentIbnAshir.verses
      .map((v) => `${v.firstHemistich} ... ${v.secondHemistich}`)
      .join("\n");
    const text = `📜 درة اليوم من متن ابن عاشر (${currentIbnAshir.chapter}):\nالأبيات: ${currentIbnAshir.verseNumbers}\n\n${versesText}\n\nالشرح:\n${currentIbnAshir.explanation}\n\nالفائدة:\n${currentIbnAshir.practicalBenefit}\n\nطالع زاد اليوم على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#daily-spiritual`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
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
            <span>الغِذَاءُ الرُّوحِيُّ وَالعِلْمِيُّ اليَوْمِيُّ</span>
          </div>

          <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2] tracking-wide mb-3 leading-relaxed">
            زَادُ اليَوْمِ الرُّوحِيّ
          </h2>

          <p className="font-ibm text-xs sm:text-sm text-[#52796F] dark:text-[#9BB0A5] leading-relaxed max-w-2xl mx-auto">
            محتوى يومي متجدد يجمع بين ثلاث ركائز أصيلة: جواهر التربية والسلوك (الحكم العطائية)، نور الوحي النبوي (الأربعين النووية)، وأصول الفقه والتصوف السني (متن ابن عاشر: المرشد المعين).
          </p>
        </div>

        {/* 3 Main Daily Pillars Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* ======================================================== */}
          {/* 1. HIKMA OF THE DAY (Artwork + Text)                     */}
          {/* ======================================================== */}
          <div className="rounded-2xl bg-white dark:bg-[#0E2019] border border-[#C5A059]/35 shadow-md p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
            <div>
              {/* Pillar Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7DFD5] dark:border-[#203D31]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059]">
                    <Sparkles className="w-4 h-4" />
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

              {/* Artwork Poster with Zoom */}
              <div
                onClick={() =>
                  setZoomImage({
                    src: activeHikma.capsule_image_url,
                    title: `كبسولة الحكمة #${activeHikma.number}: ${activeHikma.text_ar}`,
                  })
                }
                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#081410] cursor-pointer group shadow-inner"
              >
                <img
                  src={activeHikma.capsule_image_url}
                  alt={`حكمة عطائية رقم ${activeHikma.number}`}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                  <Maximize2 className="w-4 h-4 text-[#E5C378]" />
                  <span>انقر للتكبير الكامل</span>
                </div>
              </div>

              {/* Hikma Quote */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] mb-3">
                <span className="text-[11px] font-semibold text-[#C5A059] block mb-1">
                  الموضوع: {activeHikma.topic}
                </span>
                <p className="font-amiri text-base font-bold text-[#143628] dark:text-[#E8F0EC] leading-relaxed">
                  «{activeHikma.text_ar}»
                </p>
              </div>

              {/* Explanation */}
              <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed mb-4 line-clamp-3">
                {activeHikma.explanation_ar}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center gap-2">
              <button
                onClick={shareHikma}
                className="flex-1 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة الحكمة</span>
              </button>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold flex items-center gap-1 transition"
                title="صفحة فيسبوك الرسمية للطريقة بمدينة المحمدية"
              >
                <span>فيسبوك</span>
              </a>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. HADITH OF THE DAY (Artwork + Text)                    */}
          {/* ======================================================== */}
          <div className="rounded-2xl bg-white dark:bg-[#0E2019] border border-[#C5A059]/35 shadow-md p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
            <div>
              {/* Pillar Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7DFD5] dark:border-[#203D31]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059]">
                    <Scroll className="w-4 h-4" />
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

              {/* Artwork Poster with Zoom */}
              <div
                onClick={() =>
                  setZoomImage({
                    src: todayHadith.image,
                    title: `لوحة الحديث (${todayHadith.id}/42): ${todayHadith.title}`,
                  })
                }
                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#081410] cursor-pointer group shadow-inner"
              >
                <img
                  src={todayHadith.image}
                  alt={todayHadith.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                  <Maximize2 className="w-4 h-4 text-[#E5C378]" />
                  <span>انقر للتكبير الكامل</span>
                </div>
              </div>

              {/* Hadith Title & Metadata */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] mb-3">
                <span className="text-[11px] font-semibold text-[#C5A059] block mb-1">
                  الموضوع: {todayHadith.topic}
                </span>
                <h4 className="font-amiri text-base font-bold text-[#143628] dark:text-[#E8F0EC]">
                  «{todayHadith.title}»
                </h4>
              </div>

              {/* Narrator & Source */}
              <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed mb-4">
                <strong>الراوي والمصدر:</strong> {todayHadith.narrator} — {todayHadith.source}.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center gap-2">
              <button
                onClick={shareHadith}
                className="flex-1 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة الحديث</span>
              </button>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold flex items-center gap-1 transition"
                title="صفحة فيسبوك الرسمية للطريقة بمدينة المحمدية"
              >
                <span>فيسبوك</span>
              </a>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. MATN IBN ASHIR OF THE DAY (Requested Replacement)    */}
          {/* ======================================================== */}
          <div className="rounded-2xl bg-white dark:bg-[#0E2019] border border-[#C5A059]/35 shadow-md p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
            <div>
              {/* Pillar Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7DFD5] dark:border-[#203D31]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059]">
                    <BookOpen className="w-4 h-4" />
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
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378]">
                    أبيات {currentIbnAshir.verseNumbers}
                  </span>
                </div>
              </div>

              {/* Chapter Badge & Title */}
              <div className="flex items-center justify-between mb-3 text-xs font-ibm">
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#122820] text-[#84928A] border border-[#E7DFD5] dark:border-[#203D31]">
                  <span>{currentIbnAshir.chapter}</span>
                </span>
                <span className="text-[11px] text-[#C5A059] font-semibold">
                  {currentIbnAshir.theme}
                </span>
              </div>

              {/* Poetic Verses (شطران متقابلان) */}
              <div className="space-y-2 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#F5EFE6] dark:from-[#122820] dark:to-[#0A1813] border border-[#C5A059]/40 mb-3 shadow-inner">
                {currentIbnAshir.verses.map((v, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 px-2 py-1.5 rounded-lg bg-white/70 dark:bg-[#0E2019]/70 text-center font-amiri font-bold text-sm sm:text-base text-[#143628] dark:text-[#FAF7F2] leading-relaxed"
                  >
                    <span className="sm:text-right flex-1">{v.firstHemistich}</span>
                    <span className="text-[#C5A059] text-xs font-mono select-none px-1">❖</span>
                    <span className="sm:text-left flex-1">{v.secondHemistich}</span>
                  </div>
                ))}
              </div>

              {/* Concise Explanation */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] mb-4">
                <span className="text-xs font-bold text-[#1B4332] dark:text-[#E5C378] block mb-1">
                  الشرح:
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
                    title="الدرس السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono px-1.5 text-[#84928A]">
                    {activeIbnAshirIndex + 1}/{IBN_ASHIR_LESSONS.length}
                  </span>
                  <button
                    onClick={handleNextIbnAshir}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#122820] hover:bg-[#C5A059]/15 border border-[#E7DFD5] dark:border-[#203D31] text-[#143628] dark:text-[#FAF7F2] transition"
                    title="الدرس التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* WhatsApp Share */}
                <button
                  onClick={shareIbnAshir}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>مشاركة الأبيات</span>
                </button>

                {/* Notion Table Direct Link */}
                <a
                  href="https://app.notion.com/p/48b99299da334d0c98526ffbb5c94037?v=874bf180be3846c8ba8dbb5fc2986009"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2.5 rounded-xl bg-[#1B4332]/10 dark:bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#1B4332] dark:text-[#E5C378] border border-[#C5A059]/30 text-xs font-semibold flex items-center gap-1 transition"
                  title="فتح قاعدة بيانات متن ابن عاشر في Notion"
                >
                  <span>نوتيون</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Zoom Viewer for Today's Artwork */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setZoomImage(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full max-h-[85vh] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[#C5A059]/40 bg-[#FAF7F2] dark:bg-[#0E2019] p-2 flex flex-col"
          >
            <div className="relative flex-1 w-full h-full">
              <img
                src={zoomImage.src}
                alt={zoomImage.title}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div className="pt-2 text-center text-xs text-[#143628] dark:text-[#FAF7F2] font-semibold">
              {zoomImage.title}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
