"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Share2,
  Copy,
  Check,
  Shuffle,
  Calendar,
  Languages,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { HikmaItem, getHikmaOfTheDay, getHikmaByNumber, TOTAL_HIKAM, HIKAM_LIST } from "@/lib/hikam";

const ZAWIYA_FACEBOOK_URL = "https://www.facebook.com/zaouia.mohammedia";

export function HikmaOfTheDay() {
  const [currentHikma, setCurrentHikma] = useState<HikmaItem>(HIKAM_LIST[0]);
  const [todayHikma, setTodayHikma] = useState<HikmaItem>(HIKAM_LIST[0]);
  const [activeLang, setActiveLang] = useState<"ar" | "fr" | "en">("ar");
  const [copied, setCopied] = useState(false);

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
      textToCopy = `الحكمة العطائية رقم (${currentHikma.number}):\n\n"${currentHikma.text_ar}"\n\nالشرح السلوكي:\n${currentHikma.explanation_ar}\n\n— منصة منهاج الفقير`;
    } else if (activeLang === "fr") {
      textToCopy = `Sagesse Al-'Ata'iyya N°${currentHikma.number}:\n\n« ${currentHikma.text_fr} »\n\n— Plateforme Minhaj Al-Faqir`;
    } else {
      textToCopy = `Hikma Al-'Ata'iyya #${currentHikma.number}:\n\n"${currentHikma.text_en}"\n\n— Minhaj Al-Faqir Platform`;
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
    let shareText = "";
    if (activeLang === "ar") {
      shareText =
        `✨ *حكمة اليوم من الحِكَم العطائية (#${currentHikma.number})* ✨\n\n` +
        `"${currentHikma.text_ar}"\n\n` +
        `*الشرح السلوكي:* ${currentHikma.explanation_ar}\n\n` +
        `🌱 *منصة منهاج الفقير - الزاوية البودشيشية*`;
    } else if (activeLang === "fr") {
      shareText =
        `✨ *Sagesse Al-'Ata'iyya (#${currentHikma.number})* ✨\n\n` +
        `« ${currentHikma.text_fr} »\n\n` +
        `*Explication:* ${currentHikma.explanation_ar}\n\n` +
        `🌱 *Plateforme Minhaj Al-Faqir*`;
    } else {
      shareText =
        `✨ *Hikma Al-'Ata'iyya (#${currentHikma.number})* ✨\n\n` +
        `"${currentHikma.text_en}"\n\n` +
        `*Commentary:* ${currentHikma.explanation_ar}\n\n` +
        `🌱 *Minhaj Al-Faqir Platform*`;
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  return (
    <section id="hikma-today" className="scroll-mt-24 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#E7DFD5] dark:border-[#203A2F] pb-8">
        <div>
          <div className="flex items-center gap-2.5 text-[#C5A059] text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>غِذَاءُ الرُّوحِ اليَوْمِي • تَجَلِّيَاتُ الحِكْمَةِ</span>
          </div>
          <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2]">
            حِكْمَةُ اليَوْمِ مِنَ الحِكَمِ العَطَائِيَّةِ
          </h2>
          <p className="text-sm sm:text-base text-[#596B62] dark:text-[#9BB0A5] font-ibm mt-1">
            نصوص محققة متجددة تلقائياً كل 24 ساعة، مع الشرح السلوكي والترجمة الأدبية بثلاث لغات.
          </p>
        </div>

        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!isToday && (
            <button
              onClick={handleResetToday}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378] text-xs font-semibold hover:bg-[#C5A059]/25 transition"
              title="العودة لحكمة اليوم"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>اليوم</span>
            </button>
          )}

          <button
            onClick={handleRandom}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#12241D] border border-[#E7DFD5] dark:border-[#203A2F] text-xs text-[#1D2A24] dark:text-[#E8F0EC] hover:border-[#C5A059] transition"
            title="حكمة عشوائية"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>عشوائية</span>
          </button>

          <div className="flex items-center gap-1 bg-white dark:bg-[#12241D] p-1 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F]">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg hover:bg-[#FAF7F2] dark:hover:bg-[#1B4332] text-[#1B4332] dark:text-[#E8F0EC] transition"
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
              className="p-1.5 rounded-lg hover:bg-[#FAF7F2] dark:hover:bg-[#1B4332] text-[#1B4332] dark:text-[#E8F0EC] transition"
              title="الحكمة التالية"
              aria-label="الحكمة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Card (Illuminated Manuscript Layout) */}
      <div className="bg-white dark:bg-[#12241D] rounded-3xl border border-[#C5A059]/40 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* Left Column: Illuminated Manuscript Emblem & Facebook Action */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-[#FAF7F2] via-[#F4EFE6] to-[#EBE4D5] dark:from-[#0B1914] dark:via-[#0F221B] dark:to-[#081410] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-[#E7DFD5] dark:border-[#203A2F]">
          <div>
            {/* Badges */}
            <div className="w-full flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4332] text-[#E5C378] text-xs font-medium shadow-sm">
                <span>حكمة رقم</span>
                <strong className="font-mono text-sm">#{currentHikma.number}</strong>
              </span>

              <span className="text-xs px-2.5 py-1 rounded-full bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378] border border-[#C5A059]/30 font-semibold">
                {currentHikma.topic}
              </span>
            </div>

            {/* Illuminated Center Seal */}
            <div className="relative aspect-square max-w-[280px] mx-auto rounded-3xl border-2 border-[#C5A059]/40 bg-white/60 dark:bg-[#0E2019]/60 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center shadow-inner group">
              {/* Outer decorative ring */}
              <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/15 flex items-center justify-center mb-4 border border-[#C5A059]/30 shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-8 h-8 text-[#C5A059]" />
              </div>

              <span className="font-amiri text-xs text-[#C5A059] font-bold block mb-1">
                سَيِّدِي ابْنُ عَطَاءِ اللَّهِ السَّكَنْدَرِيُّ
              </span>

              <h3 className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-2 leading-relaxed">
                الحِكَمُ العَطَائِيَّةُ
              </h3>

              <div className="w-12 h-0.5 bg-[#C5A059]/40 mb-2" />

              <span className="text-[11px] font-mono font-bold text-[#1B4332] dark:text-[#E5C378]">
                الدُّرَّةُ #{currentHikma.number}
              </span>
            </div>
          </div>

          {/* Social Links: Facebook Poster & WhatsApp Share */}
          <div className="w-full mt-6 space-y-2">
            <a
              href={ZAWIYA_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-xs font-semibold text-[#1877F2] dark:text-[#5B9DF8] transition group shadow-sm"
              title="مشاهدة اللوحة الفنية والتصميم الكامل على فيسبوك"
            >
              <span>مشاهدة اللوحة الفنية على فيسبوك</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition-transform" />
            </a>

            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-xs font-semibold text-[#128C7E] dark:text-[#25D366] transition shadow-sm"
              title="مشاركة نص الحكمة مع الشرح عبر واتساب"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة الحكمة عبر واتساب</span>
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
                  <p className="font-amiri text-2xl sm:text-3xl leading-[1.8] sm:leading-[1.8] font-bold text-[#143628] dark:text-[#FAF7F2] text-right">
                    «{currentHikma.text_ar}»
                  </p>
                </div>

                {/* Explanation from Notion */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059]">
                    <BookOpen className="w-4 h-4" />
                    <span>الشَّرْحُ السَّلُوكِيُّ المُحَقَّقُ</span>
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
                  <p className="font-serif italic text-xl sm:text-2xl leading-relaxed text-[#143628] dark:text-[#FAF7F2]">
                    « {currentHikma.text_fr || "Traduction en cours de révision..."} »
                  </p>
                </div>

                {/* Arabic Commentary alongside French */}
                <div className="space-y-3 text-right" dir="rtl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059]">
                    <BookOpen className="w-4 h-4" />
                    <span>الشَّرْحُ السَّلُوكِيُّ (العربية)</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#1D2A24]/90 dark:text-[#C5D5CC] font-ibm leading-relaxed">
                    {currentHikma.explanation_ar}
                  </p>
                </div>
              </div>
            )}

            {activeLang === "en" && (
              <div className="space-y-6 text-left animate-in fade-in duration-300" dir="ltr">
                {/* English Translation */}
                <div className="p-6 sm:p-7 rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1914] border-l-4 border-[#C5A059]">
                  <p className="font-serif text-xl sm:text-2xl leading-relaxed text-[#143628] dark:text-[#FAF7F2]">
                    “ {currentHikma.text_en || "English translation under scholarly review..."} ”
                  </p>
                </div>

                {/* Arabic Commentary alongside English */}
                <div className="space-y-3 text-right" dir="rtl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059]">
                    <BookOpen className="w-4 h-4" />
                    <span>الشَّرْحُ السَّلُوكِيُّ (العربية)</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#1D2A24]/90 dark:text-[#C5D5CC] font-ibm leading-relaxed">
                    {currentHikma.explanation_ar}
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
    </section>
  );
}
