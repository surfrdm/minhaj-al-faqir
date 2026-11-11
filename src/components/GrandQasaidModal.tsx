"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  Sparkles,
  Share2,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Layers,
  Scroll,
  HeartHandshake,
  ShieldCheck,
  Flame,
  ArrowRight,
  Music,
} from "lucide-react";
import { DualAudioReaderBar } from "@/components/DualAudioReaderBar";

export interface GrandQasidaItem {
  id: string;
  title: string;
  fullTitle: string;
  poet: string;
  poetDeath?: string;
  bahr?: string;
  theme?: string;
  badge?: string;
  tier: number;
  versesCount: number;
  scholars?: string;
  intro?: string;
  verses: Array<{
    num: number;
    sadr: string;
    ajuz: string;
    chapter?: string;
  }>;
  explanationMarkdown: string;
}

interface GrandQasaidModalProps {
  qasida: GrandQasidaItem | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "matn" | "explanation";
}

export function GrandQasaidModal({
  qasida,
  isOpen,
  onClose,
  initialTab = "matn",
}: GrandQasaidModalProps) {
  const [activeTab, setActiveTab] = useState<"matn" | "explanation">(initialTab);
  const [fontSize, setFontSize] = useState<number>(22);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedVerseNum, setCopiedVerseNum] = useState<number | null>(null);

  // Sync tab with initialTab when opened
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen || !qasida) return null;

  // Copy full text
  const handleCopyAll = () => {
    let text = `${qasida.fullTitle}\n${qasida.poet}\n\n`;
    if (activeTab === "matn") {
      qasida.verses.forEach((v) => {
        if (v.ajuz) {
          text += `${v.num}. ${v.sadr}  ***  ${v.ajuz}\n`;
        } else {
          text += `${v.sadr}\n\n`;
        }
      });
    } else {
      text += qasida.explanationMarkdown;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Copy single verse
  const handleCopyVerse = (v: { num: number; sadr: string; ajuz: string }) => {
    const text = `« ${v.sadr} ${v.ajuz ? `* ${v.ajuz}` : ""} »\n— ${qasida.title} (${qasida.poet})`;
    navigator.clipboard.writeText(text);
    setCopiedVerseNum(v.num);
    setTimeout(() => setCopiedVerseNum(null), 2000);
  };

  // WhatsApp share
  const handleShareWhatsApp = () => {
    const text = `🌹 *${qasida.fullTitle}*\n${qasida.poet}\n\n` +
      `طالع المتن الكامل والشرح الصوفي المعتمد في منصة «مِنْهَاجُ الفَقِير»:\n` +
      `${typeof window !== "undefined" ? window.location.origin : ""}/diwan`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md transition-all duration-300"
      dir="rtl"
    >
      <div className="relative w-full max-w-4xl h-[94vh] max-h-[920px] bg-[#FAF7F2] dark:bg-[#07130E] border-2 border-[#C5A059]/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1D2A24] dark:text-[#E8F0EC]">
        {/* HEADER BAR */}
        <div className="p-4 bg-[#143628] border-b-2 border-[#C5A059]/50 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C378] shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-amiri text-lg sm:text-2xl font-bold text-[#FAF7F2]">
                  {qasida.title}
                </h3>
                {qasida.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/25 border border-[#C5A059]/50 text-[#E5C378] text-xs font-bold">
                    {qasida.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#E8F0EC]/80 font-ibm line-clamp-1">
                {qasida.poet} {qasida.poetDeath ? `(ت ${qasida.poetDeath})` : ""} • {qasida.bahr || qasida.theme}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Zoom (Matn mode) */}
            {activeTab === "matn" && (
              <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-xl p-1 border border-white/15">
                <button
                  onClick={() => setFontSize((f) => Math.min(32, f + 2))}
                  className="p-1 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"
                  title="تكبير الخط"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setFontSize((f) => Math.max(16, f - 2))}
                  className="p-1 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"
                  title="تصغير الخط"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Share WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="p-2 bg-emerald-600/70 hover:bg-emerald-600 text-white rounded-xl border border-emerald-400/30 transition cursor-pointer"
              title="مشاركة عبر واتساب"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Copy All */}
            <button
              onClick={handleCopyAll}
              className="p-2 bg-white/10 hover:bg-white/20 text-[#E5C378] rounded-xl border border-[#C5A059]/40 transition cursor-pointer"
              title="نسخ النص كاملاً"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-xl border border-white/20 transition cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DUAL-MODE TAB SWITCHER */}
        <div className="px-4 py-2.5 bg-[#FAF7F2] dark:bg-[#0B1F17] border-b border-[#C5A059]/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("matn")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === "matn"
                  ? "bg-[#143628] text-[#E5C378] shadow-xs border border-[#C5A059]/50"
                  : "bg-white dark:bg-[#122820] text-[#52796F] dark:text-[#A1B3A9] hover:bg-[#C5A059]/15 border border-transparent"
              }`}
            >
              <Scroll className="w-4 h-4" />
              <span>المتن الإنشادي الكامل ({qasida.versesCount} {qasida.id === "dalail_khatm" ? "فقرات" : "بيتاً"})</span>
            </button>

            <button
              onClick={() => setActiveTab("explanation")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === "explanation"
                  ? "bg-[#143628] text-[#E5C378] shadow-xs border border-[#C5A059]/50"
                  : "bg-white dark:bg-[#122820] text-[#52796F] dark:text-[#A1B3A9] hover:bg-[#C5A059]/15 border border-transparent"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>الشرح الصوفي واللغوي التحليلي</span>
            </button>
          </div>

          <div className="hidden md:block text-[11px] text-[#52796F] dark:text-[#9BB0A5] font-ibm">
            {qasida.scholars ? `المراجع: ${qasida.scholars}` : ""}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6] dark:from-[#091811] dark:to-[#050D09]">
          {/* TAB 1: MATN VIEW */}
          {activeTab === "matn" && (
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Introduction Card */}
              {qasida.intro && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#C5A059]/15 via-[#C5A059]/10 to-transparent border border-[#C5A059]/40 text-xs sm:text-sm text-[#143628] dark:text-[#E8F0EC] leading-relaxed font-ibm mb-6">
                  <div className="font-bold text-[#826122] dark:text-[#E5C378] flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>مدخل ومقام القصيدة الشريفة:</span>
                  </div>
                  <p>{qasida.intro}</p>
                </div>
              )}

              <DualAudioReaderBar
                title={qasida.fullTitle}
                text={[
                  qasida.fullTitle,
                  qasida.intro || "",
                  ...qasida.verses.map((v) => `${v.sadr} ${v.ajuz || ""}`),
                ]
                  .filter(Boolean)
                  .join(". ")}
                lang="ar"
                variant="bar"
              />

              {/* Special Prose view for Dalail al-Khayrat Khatm */}
              {qasida.id === "dalail_khatm" ? (
                <div
                  className="space-y-4 font-amiri selection:bg-[#C5A059]/30 text-justify leading-loose"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {qasida.verses.map((v) => (
                    <div
                      key={v.num}
                      className="p-5 rounded-2xl bg-white dark:bg-[#0B1F17] border border-[#C5A059]/40 shadow-xs relative group hover:border-[#C5A059] transition"
                    >
                      <p className="text-[#143628] dark:text-[#FAF7F2] leading-loose">
                        {v.sadr}
                      </p>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleCopyVerse(v)}
                          className="text-[11px] font-sans px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-[#122820] text-[#52796F] dark:text-[#E5C378] border border-[#C5A059]/30 hover:bg-[#C5A059]/20 transition flex items-center gap-1"
                        >
                          {copiedVerseNum === v.num ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span>تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>نسخ المقطع</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Poetic Table / Card View */
                <div
                  className="space-y-3 font-amiri selection:bg-[#C5A059]/30"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {qasida.verses.map((v, idx) => {
                    // Check if new chapter banner
                    const showChapter =
                      v.chapter &&
                      (idx === 0 || qasida.verses[idx - 1].chapter !== v.chapter);

                    return (
                      <React.Fragment key={v.num}>
                        {showChapter && (
                          <div className="my-6 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059]/35 to-[#C5A059]/20 border-2 border-[#C5A059] text-center shadow-xs">
                            <span className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                              ⚜️ {v.chapter}
                            </span>
                          </div>
                        )}

                        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0B1F17] border border-[#E7DFD5] dark:border-[#1E382B] hover:border-[#C5A059] shadow-xs hover:shadow-md transition-all group relative">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-6 text-center md:text-right">
                            {/* Verse Number Badge */}
                            <span className="w-7 h-7 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/50 text-xs font-sans font-bold text-[#826122] dark:text-[#E5C378] flex items-center justify-center shrink-0 self-start md:self-center">
                              {v.num}
                            </span>

                            {/* Sadr (First Hemistich) */}
                            <div className="flex-1 text-[#143628] dark:text-[#FAF7F2] font-semibold text-center md:text-right">
                              {v.sadr}
                            </div>

                            {/* Divider Ornament */}
                            <span className="text-[#C5A059] text-sm shrink-0 select-none">
                              ❦
                            </span>

                            {/* Ajuz (Second Hemistich) */}
                            <div className="flex-1 text-[#143628] dark:text-[#FAF7F2] font-semibold text-center md:text-left">
                              {v.ajuz}
                            </div>

                            {/* Copy Single Verse Button */}
                            <button
                              onClick={() => handleCopyVerse(v)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#122820] text-[#52796F] dark:text-[#E5C378] hover:bg-[#C5A059]/20 transition shrink-0 cursor-pointer"
                              title="نسخ هذا البيت"
                            >
                              {copiedVerseNum === v.num ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPLANATION VIEW */}
          {activeTab === "explanation" && (
            <div className="max-w-3xl mx-auto space-y-6 text-[#143628] dark:text-[#E8F0EC]">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#143628] to-[#1B4332] text-white border-2 border-[#C5A059]/40 shadow-sm">
                <div className="flex items-center gap-2 text-[#E5C378] font-bold text-sm mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>الشرح الصوفي واللغوي المعتمد لـ {qasida.title}</span>
                </div>
                <p className="text-xs text-[#E8F0EC]/80 font-ibm">
                  مستمد من أمهات شروح علماء الغرب الإسلامي: {qasida.scholars || "ابن عجيبة، أحمد زروق، وبنيس الفاسي"}
                </p>
              </div>

              <DualAudioReaderBar
                title={`الشرح التحليلي: ${qasida.title}`}
                text={qasida.explanationMarkdown
                  .replace(/###\s*[🔹⚜️]?/g, "")
                  .replace(/^>\s*/gm, "")
                  .replace(/\*\*/g, "")}
                lang="ar"
                variant="bar"
              />

              {/* Rendered Explanation Markdown Content */}
              <div className="bg-white dark:bg-[#0B1F17] rounded-2xl border-2 border-[#C5A059]/40 p-5 sm:p-8 shadow-md space-y-6 font-ibm leading-relaxed">
                <div className="prose prose-emerald dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
                  {qasida.explanationMarkdown.split("\n\n").map((para, pIdx) => {
                    if (para.startsWith("### 🔹") || para.startsWith("### ⚜️")) {
                      return (
                        <div
                          key={pIdx}
                          className="pt-4 pb-2 border-b-2 border-[#C5A059]/30 text-sm sm:text-base font-amiri font-bold text-[#826122] dark:text-[#E5C378]"
                        >
                          {para.replace(/### 🔹|### ⚜️/g, "").trim()}
                        </div>
                      );
                    }
                    if (para.startsWith(">")) {
                      return (
                        <blockquote
                          key={pIdx}
                          className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border-r-4 border-[#C5A059] font-amiri text-base sm:text-lg text-[#143628] dark:text-[#FAF7F2] my-2"
                        >
                          {para.replace(/^>\s*/, "")}
                        </blockquote>
                      );
                    }
                    return (
                      <p key={pIdx} className="text-[#1D2A24] dark:text-[#E8F0EC]">
                        {para}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BAR */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#0A1A13] border-t-2 border-[#C5A059]/40 flex items-center justify-between text-xs font-ibm text-[#52796F] dark:text-[#9BB0A5] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>منصة منهاج الفقير • ديوان أمهات القصائد والأوراد الجامعة</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] font-bold transition cursor-pointer"
          >
            إغلاق المطالعة
          </button>
        </div>
      </div>
    </div>
  );
}
