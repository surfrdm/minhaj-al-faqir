"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { HikmaItem, TOTAL_HIKAM } from "@/lib/hikam";

const ZAWIYA_FACEBOOK_URL = "https://www.facebook.com/zaouia.mohammedia";

interface HikmaReaderProps {
  hikma: HikmaItem;
  prevHikmaNum?: number;
  nextHikmaNum?: number;
  isStandalonePage?: boolean;
  onNavigate?: (num: number) => void;
}

export function HikmaReader({
  hikma,
  prevHikmaNum,
  nextHikmaNum,
  isStandalonePage = false,
  onNavigate,
}: HikmaReaderProps) {
  const [fontSize, setFontSize] = useState<"md" | "lg" | "xl">("lg");
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<"ar" | "fr" | "en">("ar");

  // Save last read position to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && hikma?.number) {
      try {
        localStorage.setItem("minhaj_last_hikma", String(hikma.number));
      } catch (e) {
        console.error(e);
      }
    }
  }, [hikma?.number]);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/hikma/${hikma.number}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/hikma/${hikma.number}`;
    const text = `✨ الحكمة العطائية رقم #${hikma.number}:\n«${hikma.text_ar}»\n\nالمعنى والبعد التربوي:\n${hikma.explanation_ar}\n\nطالع الحكمة على منصة منهاج الفقير:\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const textClasses = {
    md: "text-lg sm:text-xl leading-loose",
    lg: "text-xl sm:text-2xl leading-[2.3]",
    xl: "text-2xl sm:text-3xl leading-[2.5]",
  }[fontSize];

  const sharhClasses = {
    md: "text-xs sm:text-sm leading-relaxed",
    lg: "text-sm sm:text-base leading-relaxed",
    xl: "text-base sm:text-lg leading-relaxed",
  }[fontSize];

  return (
    <article className="w-full flex flex-col space-y-6">
      {/* 1. Header Toolbar: Sequence, Topic & Font Resize Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E7DFD5] dark:border-[#203D31]">
        {/* Right: Badge & Number */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378] text-xs font-bold font-mono">
            الدرة #{hikma.number} من {TOTAL_HIKAM}
          </span>
          {hikma.topic && (
            <span className="px-2.5 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#122820] text-[#52796F] dark:text-[#95B8A8] text-xs font-ibm border border-[#E7DFD5] dark:border-[#203D31]">
              {hikma.topic}
            </span>
          )}
        </div>

        {/* Left: Font Size & Language Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#FAF7F2] dark:bg-[#122820] rounded-xl border border-[#E7DFD5] dark:border-[#203D31] p-0.5">
            <button
              onClick={() => setFontSize("md")}
              className={`px-2 py-1 text-xs rounded-lg transition font-medium ${
                fontSize === "md"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019]"
                  : "text-[#84928A] hover:text-[#1B4332]"
              }`}
              title="تصغير الخط"
            >
              أ-
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={`px-2 py-1 text-xs rounded-lg transition font-medium ${
                fontSize === "lg"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019]"
                  : "text-[#84928A] hover:text-[#1B4332]"
              }`}
              title="الخط الافتراضي"
            >
              أ
            </button>
            <button
              onClick={() => setFontSize("xl")}
              className={`px-2 py-1 text-xs rounded-lg transition font-medium ${
                fontSize === "xl"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019]"
                  : "text-[#84928A] hover:text-[#1B4332]"
              }`}
              title="تكبير الخط"
            >
              أ+
            </button>
          </div>

          {/* Translation Lang Toggle */}
          <div className="flex items-center bg-[#FAF7F2] dark:bg-[#122820] rounded-xl border border-[#E7DFD5] dark:border-[#203D31] p-0.5">
            <button
              onClick={() => setLang("ar")}
              className={`px-2 py-1 text-[11px] rounded-lg transition font-medium ${
                lang === "ar"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019]"
                  : "text-[#84928A] hover:text-[#1B4332]"
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setLang("fr")}
              className={`px-2 py-1 text-[11px] rounded-lg transition font-medium ${
                lang === "fr"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019]"
                  : "text-[#84928A] hover:text-[#1B4332]"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 text-[11px] rounded-lg transition font-medium ${
                lang === "en"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019]"
                  : "text-[#84928A] hover:text-[#1B4332]"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* 2. Small Title & Heading */}
      <div>
        <span className="text-[11px] text-[#C5A059] font-bold block mb-1">
          سِيدِي ابْنُ عَطَاءِ اللهِ السَّكَنْدَرِيُّ رَضِيَ اللهُ عَنْهُ
        </span>
        <h1 className="font-amiri text-2xl sm:text-3xl font-bold text-[#143628] dark:text-[#FAF7F2]">
          {hikma.title || `الحكمة العطائية رقم ${hikma.number}`}
        </h1>
      </div>

      {/* 3. Original Sacred Vocalized Text */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#F7F2E8] dark:from-[#122820] dark:to-[#0A1813] border border-[#C5A059]/40 shadow-inner">
        <p className={`font-amiri font-bold text-[#143628] dark:text-[#FAF7F2] text-center ${textClasses}`}>
          «{hikma.text_ar}»
        </p>
      </div>

      {/* 4. Spiritual Sharh (المعنى والبعد التربوي) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-2">
        <div className="flex items-center gap-2 text-[#C5A059]">
          <Sparkles className="w-4 h-4" />
          <h2 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
            المَغْزَى وَالبُعْدُ التَّرْبَوِيُّ وَالسُّلُوكِيُّ
          </h2>
        </div>
        <p className={`text-[#1D2A24]/90 dark:text-[#D5E2DB] font-ibm text-justify ${sharhClasses}`}>
          {hikma.explanation_ar}
        </p>
      </div>

      {/* 5. Translations & Source */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
        {lang === "fr" && hikma.text_fr && (
          <div className="space-y-1" dir="ltr">
            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">
              Traduction Française:
            </span>
            <p className="font-serif italic text-sm text-[#143628] dark:text-[#FAF7F2] leading-relaxed">
              «{hikma.text_fr}»
            </p>
          </div>
        )}

        {lang === "en" && hikma.text_en && (
          <div className="space-y-1" dir="ltr">
            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">
              English Translation:
            </span>
            <p className="font-serif italic text-sm text-[#143628] dark:text-[#FAF7F2] leading-relaxed">
              "{hikma.text_en}"
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-[#E7DFD5]/60 dark:border-[#203D31]/60 flex flex-wrap items-center justify-between gap-2 text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm">
          <span>
            <strong className="text-[#143628] dark:text-[#FAF7F2]">المصدر:</strong> كِتَابُ الحِكَمِ العَطَائِيَّةِ
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31]">
            قيد المراجعة العلمية
          </span>
        </div>
      </div>

      {/* 6. Action & Share Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="py-2.5 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-xs font-semibold text-[#128C7E] dark:text-[#25D366] transition flex items-center gap-2 shadow-sm"
            title="مشاركة الحكمة عبر واتساب"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>مشاركة عبر واتساب</span>
          </button>

          {/* Copy Direct Link */}
          <button
            onClick={handleCopyLink}
            className="py-2.5 px-4 rounded-xl bg-white dark:bg-[#0E2019] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-semibold text-[#143628] dark:text-[#FAF7F2] transition flex items-center gap-2 shadow-sm"
            title="نسخ رابط هذه الحكمة"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
            <span>{copied ? "تم نسخ الرابط!" : "نسخ الرابط المباشر"}</span>
          </button>

          {/* Zawiya Facebook Page */}
          <a
            href={ZAWIYA_FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-xs font-semibold text-[#1877F2] dark:text-[#5B9DF8] transition flex items-center gap-2 shadow-sm"
            title="زيارة صفحة الزاوية على فيسبوك"
          >
            <span>زيارة صفحة الزاوية</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Standalone Page Link (if in modal) */}
        {!isStandalonePage && (
          <Link
            href={`/hikma/${hikma.number}`}
            className="text-xs text-[#C5A059] hover:underline font-semibold flex items-center gap-1"
          >
            <span>فتح في صفحة مستقلة</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* 7. Clear Navigation: Previous & Next Hikma */}
      <nav aria-label="تصفح الحِكم" className="pt-6 border-t border-[#E7DFD5] dark:border-[#203D31] grid grid-cols-2 gap-3">
        {prevHikmaNum ? (
          onNavigate ? (
            <button
              onClick={() => onNavigate(prevHikmaNum)}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-[#0E2019] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-right transition flex items-center gap-2 group"
            >
              <ChevronRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
              <div>
                <span className="text-[10px] text-[#84928A] block">السابق</span>
                <span className="text-xs sm:text-sm font-bold text-[#143628] dark:text-[#FAF7F2]">
                  الحكمة #{prevHikmaNum}
                </span>
              </div>
            </button>
          ) : (
            <Link
              href={`/hikma/${prevHikmaNum}`}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-[#0E2019] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-right transition flex items-center gap-2 group"
            >
              <ChevronRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
              <div>
                <span className="text-[10px] text-[#84928A] block">السابق</span>
                <span className="text-xs sm:text-sm font-bold text-[#143628] dark:text-[#FAF7F2]">
                  الحكمة #{prevHikmaNum}
                </span>
              </div>
            </Link>
          )
        ) : (
          <div />
        )}

        {nextHikmaNum ? (
          onNavigate ? (
            <button
              onClick={() => onNavigate(nextHikmaNum)}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-[#0E2019] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-left justify-end transition flex items-center gap-2 group"
            >
              <div className="text-left">
                <span className="text-[10px] text-[#84928A] block">التالي</span>
                <span className="text-xs sm:text-sm font-bold text-[#143628] dark:text-[#FAF7F2]">
                  الحكمة #{nextHikmaNum}
                </span>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#C5A059] group-hover:-translate-x-1 transition-transform" />
            </button>
          ) : (
            <Link
              href={`/hikma/${nextHikmaNum}`}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-[#0E2019] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-left justify-end transition flex items-center gap-2 group"
            >
              <div className="text-left">
                <span className="text-[10px] text-[#84928A] block">التالي</span>
                <span className="text-xs sm:text-sm font-bold text-[#143628] dark:text-[#FAF7F2]">
                  الحكمة #{nextHikmaNum}
                </span>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#C5A059] group-hover:-translate-x-1 transition-transform" />
            </Link>
          )
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
