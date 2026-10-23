"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Share2,
  Download,
  Copy,
  Check,
  Maximize2,
  X,
  Shuffle,
  Calendar,
  Languages,
  BookOpen,
} from "lucide-react";
import { HikmaItem, getHikmaOfTheDay, getHikmaByNumber, TOTAL_HIKAM, HIKAM_LIST } from "@/lib/hikam";

export function HikmaOfTheDay() {
  const [currentHikma, setCurrentHikma] = useState<HikmaItem>(HIKAM_LIST[0]);
  const [todayHikma, setTodayHikma] = useState<HikmaItem>(HIKAM_LIST[0]);
  const [activeLang, setActiveLang] = useState<"ar" | "fr" | "en">("ar");
  const [copied, setCopied] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    const today = getHikmaOfTheDay(new Date());
    setTodayHikma(today);
    setCurrentHikma(today);
  }, []);

  const isToday = currentHikma.number === todayHikma.number;

  const handlePrev = () => {
    const prevNum = currentHikma.number > 1 ? currentHikma.number - 1 : TOTAL_HIKAM;
    const found = getHikmaByNumber(prevNum);
    if (found) setCurrentHikma(found);
  };

  const handleNext = () => {
    const nextNum = currentHikma.number < TOTAL_HIKAM ? currentHikma.number + 1 : 1;
    const found = getHikmaByNumber(nextNum);
    if (found) setCurrentHikma(found);
  };

  const handleRandom = () => {
    const randNum = Math.floor(Math.random() * TOTAL_HIKAM) + 1;
    const found = getHikmaByNumber(randNum);
    if (found) setCurrentHikma(found);
  };

  const handleResetToday = () => {
    setCurrentHikma(todayHikma);
  };

  const handleCopyText = async () => {
    let textToCopy = "";
    if (activeLang === "ar") {
      textToCopy = `الحكمة العطائية رقم (${currentHikma.number}):\n\n"${currentHikma.text_ar}"\n\nالشرح:\n${currentHikma.explanation_ar}\n\n— مسار السالك`;
    } else if (activeLang === "fr") {
      textToCopy = `Hikma Al-'Ata'iyya N°${currentHikma.number}:\n\n« ${currentHikma.text_fr} »\n\n— Chemin du Salik`;
    } else {
      textToCopy = `Hikma Al-'Ata'iyya #${currentHikma.number}:\n\n"${currentHikma.text_en}"\n\n— Path of the Salik`;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  const handleWhatsAppShare = () => {
    const shareText = encodeURIComponent(
      `✨ *حكمة اليوم من الحِكَم العطائية (#${currentHikma.number})* ✨\n\n` +
      `"${currentHikma.text_ar}"\n\n` +
      `*الشرح:* ${currentHikma.explanation_ar}\n\n` +
      `🌱 *منصة التكوين الروحي - مسار السالك*`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank");
  };

  return (
    <section id="hikma-today" className="scroll-mt-24 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#E7DFD5] dark:border-[#203A2F] pb-8">
        <div>
          <div className="flex items-center gap-2.5 text-[#C5A059] text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>غِذَاءُ الرُّوحِ اليَوْمِي</span>
          </div>
          <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2]">
            حِكْمَةُ اليَوْمِ مِنَ الحِكَمِ العَطَائِيَّةِ
          </h2>
          <p className="text-sm sm:text-base text-[#596B62] dark:text-[#9BB0A5] font-ibm mt-1">
            كبسولة بصرية متجددة تلقائياً كل ٢٤ ساعة، مع الشرح والترجمة بثلاث لغات.
          </p>
        </div>

        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!isToday && (
            <button
              onClick={handleResetToday}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378] text-xs font-semibold hover:bg-[#C5A059]/25 transition"
              title="العودة لحكمة اليوم"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>اليوم</span>
            </button>
          )}

          <button
            onClick={handleRandom}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#12241D] border border-[#E7DFD5] dark:border-[#203A2F] text-xs text-[#1D2A24] dark:text-[#E8F0EC] hover:border-[#C5A059] transition"
            title="حكمة عشوائية"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>عشوائية</span>
          </button>

          <div className="flex items-center gap-1 bg-white dark:bg-[#12241D] p-1 rounded-lg border border-[#E7DFD5] dark:border-[#203A2F]">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded hover:bg-[#FAF7F2] dark:hover:bg-[#1B4332] text-[#1B4332] dark:text-[#E8F0EC]"
              title="الحكمة السابقة"
              aria-label="الحكمة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono font-medium text-[#C5A059]">
              #{currentHikma.number} / {TOTAL_HIKAM}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 rounded hover:bg-[#FAF7F2] dark:hover:bg-[#1B4332] text-[#1B4332] dark:text-[#E8F0EC]"
              title="الحكمة التالية"
              aria-label="الحكمة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Card */}
      <div className="bg-white dark:bg-[#12241D] rounded-3xl border border-[#E7DFD5] dark:border-[#203A2F] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* Left/Capsule Column: The Visual Capsule (Illustrator export) */}
        <div className="lg:col-span-5 relative bg-[#143628]/5 dark:bg-[#0B1914] p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-l border-[#E7DFD5] dark:border-[#203A2F]">
          {/* Badge */}
          <div className="w-full flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4332] text-[#E5C378] text-xs font-medium">
              <span>حكمة رقم</span>
              <strong className="font-mono text-sm">{currentHikma.number}</strong>
            </span>

            <span className="text-xs px-2.5 py-1 rounded-full bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378] border border-[#C5A059]/30">
              {currentHikma.topic}
            </span>
          </div>

          {/* Capsule Image Viewer with Aspect Ratio & Zoom Overlay */}
          <div
            onClick={() => setZoomOpen(true)}
            className="group relative w-full max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-[#C5A059]/30 bg-black cursor-pointer hover:shadow-2xl transition-all duration-300"
          >
            <Image
              src={currentHikma.capsule_image_url}
              alt={`الكبسولة البصرية للحكمة رقم ${currentHikma.number}`}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              priority
              className="object-contain group-hover:scale-[1.02] transition-transform duration-500"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-medium">
              <Maximize2 className="w-5 h-5 text-[#E5C378]" />
              <span>اضغط للتكبير الكامل</span>
            </div>
          </div>

          {/* Action Bar below Image */}
          <div className="w-full max-w-[380px] mt-4 flex items-center justify-between gap-2">
            <a
              href={currentHikma.capsule_image_url}
              download={`Hikma_${currentHikma.number}.jpg`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white dark:bg-[#172D24] border border-[#E7DFD5] dark:border-[#203A2F] text-xs font-medium text-[#1D2A24] dark:text-[#E8F0EC] hover:border-[#C5A059] hover:text-[#C5A059] transition"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>تحميل الكبسولة</span>
            </a>

            <button
              onClick={handleWhatsAppShare}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-xs font-semibold text-[#1B4332] dark:text-[#25D366] transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </button>
          </div>
        </div>

        {/* Right Column: Multi-language Text & Spiritual Commentary */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Language Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-[#E7DFD5] dark:border-[#203A2F] pb-4 mb-6">
              <div className="flex items-center gap-1 bg-[#FAF7F2] dark:bg-[#0B1914] p-1 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F]">
                <button
                  onClick={() => setActiveLang("ar")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeLang === "ar"
                      ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                      : "text-[#596B62] dark:text-[#9BB0A5] hover:text-[#1B4332]"
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => setActiveLang("fr")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeLang === "fr"
                      ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                      : "text-[#596B62] dark:text-[#9BB0A5] hover:text-[#1B4332]"
                  }`}
                >
                  Français
                </button>
                <button
                  onClick={() => setActiveLang("en")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeLang === "en"
                      ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                      : "text-[#596B62] dark:text-[#9BB0A5] hover:text-[#1B4332]"
                  }`}
                >
                  English
                </button>
              </div>

              {/* Copy Quote Button */}
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7DFD5] dark:border-[#203A2F] text-xs text-[#596B62] dark:text-[#9BB0A5] hover:text-[#C5A059] hover:border-[#C5A059] transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>نسخ النص</span>
                  </>
                )}
              </button>
            </div>

            {/* Dynamic Content by Language */}
            {activeLang === "ar" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Arabic Vocalized Text in Amiri */}
                <div className="relative p-6 sm:p-7 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1914] border-r-4 border-[#C5A059]">
                  <p className="font-amiri text-2xl sm:text-3xl lg:text-3xl leading-[1.8] sm:leading-[1.8] font-bold text-[#143628] dark:text-[#FAF7F2] text-right">
                    «{currentHikma.text_ar}»
                  </p>
                </div>

                {/* Explanation */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059]">
                    <BookOpen className="w-4 h-4" />
                    <span>الشَّرْحُ وَالبَيَانُ المَنْهَجِي</span>
                  </div>
                  <p className="text-base sm:text-lg text-[#1D2A24]/90 dark:text-[#C5D5CC] font-ibm leading-relaxed text-right">
                    {currentHikma.explanation_ar}
                  </p>
                </div>
              </div>
            )}

            {activeLang === "fr" && (
              <div className="space-y-6 text-left animate-in fade-in duration-300" dir="ltr">
                {/* French Translation in Cormorant */}
                <div className="p-6 sm:p-7 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1914] border-l-4 border-[#C5A059]">
                  <p className="font-cormorant text-2xl sm:text-3xl italic leading-relaxed text-[#143628] dark:text-[#FAF7F2]">
                    « {currentHikma.text_fr} »
                  </p>
                </div>

                {/* French Reflection / Notes */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Méditation & Commentaire Spirituel</span>
                  </div>
                  <p className="text-base sm:text-lg text-[#1D2A24]/90 dark:text-[#C5D5CC] font-jakarta leading-relaxed">
                    Cette parole lumineuse de Shaykh Ibn &apos;Ata Allah As-Sakandari
                    rappelle au cheminant la subtilité des illusions de l&apos;ego et
                    l&apos;importance vitale de la sincérité, du lâcher-prise intérieur
                    et de la confiance inébranlable en la grâce divine.
                  </p>
                </div>
              </div>
            )}

            {activeLang === "en" && (
              <div className="space-y-6 text-left animate-in fade-in duration-300" dir="ltr">
                {/* English Translation */}
                <div className="p-6 sm:p-7 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1914] border-l-4 border-[#C5A059]">
                  <p className="font-cormorant text-2xl sm:text-3xl italic leading-relaxed text-[#143628] dark:text-[#FAF7F2]">
                    &ldquo;{currentHikma.text_en}&rdquo;
                  </p>
                </div>

                {/* English Reflection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Spiritual Reflection</span>
                  </div>
                  <p className="text-base sm:text-lg text-[#1D2A24]/90 dark:text-[#C5D5CC] font-jakarta leading-relaxed">
                    This sacred aphorism from the Hikam invites the seeker to look
                    beyond outer causes and rest their trust purely in the timeless
                    grace and mercy of the Creator.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer note inside card */}
          <div className="mt-8 pt-4 border-t border-[#E7DFD5] dark:border-[#203A2F] flex flex-wrap items-center justify-between text-xs text-[#596B62] dark:text-[#9BB0A5]">
            <span className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>مقتطف من كتاب الحكم العطائية لسيدي أحمد بن عطاء الله السكندري</span>
            </span>
            <span className="font-mono text-[#C5A059]">#Tariqa_Boutchichiyya</span>
          </div>
        </div>
      </div>

      {/* Modal Zoom Viewer */}
      {zoomOpen && (
        <div
          onClick={() => setZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[#C5A059]/40"
          >
            <Image
              src={currentHikma.capsule_image_url}
              alt={`تكبير الكبسولة رقم ${currentHikma.number}`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
