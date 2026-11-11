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
  BookOpen,
  Sparkles,
  Languages,
  Award,
  UserCheck,
  GraduationCap,
  Scroll,
} from "lucide-react";
import { HadithItem, TOTAL_HADITH } from "@/lib/arbaeen";
import { DualAudioReaderBar } from "@/components/DualAudioReaderBar";

const ZAWIYA_FACEBOOK_URL = "https://www.facebook.com/zaouia.mohammedia";

interface HadithReaderProps {
  hadith: HadithItem;
  prevHadithId?: number;
  nextHadithId?: number;
  isStandalonePage?: boolean;
  onNavigate?: (id: number) => void;
}

type TabKey = "sharh" | "vocab" | "benefits" | "narrator";

export function HadithReader({
  hadith,
  prevHadithId,
  nextHadithId,
  isStandalonePage = false,
  onNavigate,
}: HadithReaderProps) {
  const [fontSize, setFontSize] = useState<"md" | "lg" | "xl">("lg");
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<"ar" | "fr" | "en">("ar");
  const [activeTab, setActiveTab] = useState<TabKey>("sharh");

  // Reset tab to sharh when navigating hadiths
  useEffect(() => {
    setActiveTab("sharh");
  }, [hadith?.id]);

  // Save last read position to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && hadith?.id) {
      try {
        localStorage.setItem("minhaj_last_hadith", String(hadith.id));
      } catch (e) {
        console.error(e);
      }
    }
  }, [hadith?.id]);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/hadith/${hadith.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/hadith/${hadith.id}`;
    const text = `📜 الحديث الشريف #${hadith.id} من الأربعين النووية:\n«${hadith.title}»\n\n${hadith.text_ar}\n\nالمغزى والبعد السلوكي:\n${hadith.suluk_lesson}\n\nالمصدر: ${hadith.source}\n\nطالع الشرح الكامل على منصة منهاج الفقير:\n${url}`;
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

  const hasSharh = Boolean(hadith.ibn_daqiq_sharh);
  const hasVocab = Boolean(hadith.vocabulary && hadith.vocabulary.length > 0);
  const hasBenefits = Boolean(hadith.benefits && hadith.benefits.length > 0);
  const hasNarratorBio = Boolean(hadith.narrator_bio);

  const audioLang: "ar" | "fr" | "en" =
    lang === "fr" && hadith.text_fr
      ? "fr"
      : lang === "en" && hadith.text_en
      ? "en"
      : "ar";

  const activeTabAudioText =
    activeTab === "sharh"
      ? hadith.ibn_daqiq_sharh
        ? [
            hadith.ibn_daqiq_sharh.introduction,
            ...hadith.ibn_daqiq_sharh.sections.map((s) => `${s.title}. ${s.content}`),
            hadith.ibn_daqiq_sharh.conclusion,
          ]
            .filter(Boolean)
            .join(" ")
        : hadith.suluk_lesson
      : activeTab === "vocab" && hadith.vocabulary?.length
      ? `المفردات والتراكيب: ${hadith.vocabulary
          .map((v) => `${v.word}: ${v.meaning}`)
          .join(". ")}`
      : activeTab === "benefits" && hadith.benefits?.length
      ? `مما يستفاد من الحديث: ${hadith.benefits.join(". ")}`
      : activeTab === "narrator"
      ? hadith.narrator_bio || `رواية: ${hadith.narrator}`
      : "";

  const audioText =
    audioLang === "fr"
      ? `${hadith.text_fr}`
      : audioLang === "en"
      ? `${hadith.text_en}`
      : [
          `الحديث رقم ${hadith.id}: ${hadith.title}.`,
          hadith.text_ar,
          activeTabAudioText,
          hadith.suluk_lesson ? `البعد الإحساني والسلوكي: ${hadith.suluk_lesson}` : "",
        ]
          .filter(Boolean)
          .join(" ");

  return (
    <article className="w-full flex flex-col space-y-6">
      {/* 1. Header Toolbar: Sequence, Topic & Font Resize Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E7DFD5] dark:border-[#203D31]">
        {/* Right: Badge & Number */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378] text-xs font-bold font-mono">
            الحديث #{hadith.id} من {TOTAL_HADITH}
          </span>
          {hadith.topic && (
            <span className="px-2.5 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#122820] text-[#52796F] dark:text-[#95B8A8] text-xs font-ibm border border-[#E7DFD5] dark:border-[#203D31]">
              {hadith.topic}
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
                  : "text-[#52796F] dark:text-[#A1B3A9] hover:text-[#1B4332]"
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
                  : "text-[#52796F] dark:text-[#A1B3A9] hover:text-[#1B4332]"
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
                  : "text-[#52796F] dark:text-[#A1B3A9] hover:text-[#1B4332]"
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
              className={`px-2 py-1 text-xs rounded-lg transition font-medium ${
                lang === "ar"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019]"
                  : "text-[#52796F] dark:text-[#A1B3A9] hover:text-[#1B4332]"
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setLang("fr")}
              className={`px-2 py-1 text-xs rounded-lg transition font-medium ${
                lang === "fr"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019]"
                  : "text-[#52796F] dark:text-[#A1B3A9] hover:text-[#1B4332]"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 text-xs rounded-lg transition font-medium ${
                lang === "en"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019]"
                  : "text-[#52796F] dark:text-[#A1B3A9] hover:text-[#1B4332]"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* 2. Title & Narrator Header */}
      <div>
        <span className="text-xs text-[#C5A059] font-bold block mb-1">
          عُنْوَانُ الحَدِيثِ
        </span>
        <h1 className="font-amiri text-2xl sm:text-3xl font-bold text-[#143628] dark:text-[#FAF7F2]">
          {hadith.title}
        </h1>
        {hadith.narrator && (
          <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm mt-1">
            رواية: {hadith.narrator}
          </p>
        )}
      </div>

      {/* 3. Original Sacred Vocalized Text */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#F7F2E8] dark:from-[#122820] dark:to-[#0A1813] border border-[#C5A059]/40 shadow-inner">
        <p className={`font-amiri font-bold text-[#143628] dark:text-[#FAF7F2] text-justify ${textClasses}`}>
          {hadith.text_ar}
        </p>
      </div>

      {/* 4. Translations (if active) */}
      {lang === "fr" && hadith.text_fr && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-1" dir="ltr">
          <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider block">
            Traduction Française:
          </span>
          <p className="font-serif italic text-sm text-[#143628] dark:text-[#FAF7F2] leading-relaxed">
            «{hadith.text_fr}»
          </p>
        </div>
      )}

      {lang === "en" && hadith.text_en && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-1" dir="ltr">
          <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider block">
            English Translation:
          </span>
          <p className="font-serif italic text-sm text-[#143628] dark:text-[#FAF7F2] leading-relaxed">
            "{hadith.text_en}"
          </p>
        </div>
      )}

      {/* Dual Audio Reader Bar */}
      <DualAudioReaderBar
        text={audioText}
        title={hadith.title}
        lang={audioLang}
        variant="bar"
      />

      {/* 5. Interactive Official Curriculum Tabs (Option 1) */}
      <section className="space-y-4">
        {/* Tab Headers */}
        <div className="flex items-center justify-between pb-1 border-b border-[#E7DFD5] dark:border-[#203D31]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveTab("sharh")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-ibm transition whitespace-nowrap ${
                activeTab === "sharh"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019] shadow-sm"
                  : "bg-white dark:bg-[#0E2019] text-[#52796F] dark:text-[#A1B3A9] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>شرح ابن دقيق العيد</span>
            </button>

            <button
              onClick={() => setActiveTab("vocab")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-ibm transition whitespace-nowrap ${
                activeTab === "vocab"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019] shadow-sm"
                  : "bg-white dark:bg-[#0E2019] text-[#52796F] dark:text-[#A1B3A9] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31]"
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>المفردات والتراكيب</span>
              {hasVocab && (
                <span className="w-4 h-4 rounded-full bg-[#C5A059]/25 text-[#1B4332] dark:text-[#E5C378] text-[10px] flex items-center justify-center font-mono">
                  {hadith.vocabulary?.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("benefits")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-ibm transition whitespace-nowrap ${
                activeTab === "benefits"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019] shadow-sm"
                  : "bg-white dark:bg-[#0E2019] text-[#52796F] dark:text-[#A1B3A9] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31]"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>ما يستفاد من الحديث</span>
              {hasBenefits && (
                <span className="w-4 h-4 rounded-full bg-[#C5A059]/25 text-[#1B4332] dark:text-[#E5C378] text-[10px] flex items-center justify-center font-mono">
                  {hadith.benefits?.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("narrator")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-ibm transition whitespace-nowrap ${
                activeTab === "narrator"
                  ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#0E2019] shadow-sm"
                  : "bg-white dark:bg-[#0E2019] text-[#52796F] dark:text-[#A1B3A9] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31]"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>راوي الحديث</span>
            </button>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#C5A059] font-medium font-ibm">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>المقرر العتيق</span>
          </span>
        </div>

        {/* Tab 1: Sharh Ibn Daqiq Al-'Id */}
        {activeTab === "sharh" && (
          <div className="space-y-4">
            {hasSharh ? (
              <div className="space-y-4">
                {/* Introduction Callout */}
                {hadith.ibn_daqiq_sharh?.introduction && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1B4332]/5 to-[#C5A059]/10 dark:from-[#1B4332]/20 dark:to-[#C5A059]/15 border border-[#C5A059]/30 space-y-2">
                    <div className="flex items-center gap-2 text-[#C5A059]">
                      <Scroll className="w-4 h-4" />
                      <h3 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                        مَقَامُ الْحَدِيثِ وَمَنْزِلَتُهُ فِي التَّشْرِيعِ
                      </h3>
                    </div>
                    <p className={`text-[#1D2A24]/90 dark:text-[#D5E2DB] font-ibm text-justify ${sharhClasses}`}>
                      {hadith.ibn_daqiq_sharh.introduction}
                    </p>
                  </div>
                )}

                {/* Thematic Sections */}
                {hadith.ibn_daqiq_sharh?.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-3 shadow-sm hover:border-[#C5A059]/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-[#E7DFD5]/70 dark:border-[#203D31]/70">
                      <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                      <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                        {sec.title}
                      </h3>
                    </div>
                    <div className={`text-[#1D2A24]/90 dark:text-[#D5E2DB] font-ibm text-justify space-y-2 whitespace-pre-line ${sharhClasses}`}>
                      {sec.content}
                    </div>
                  </div>
                ))}

                {/* Conclusion Callout */}
                {hadith.ibn_daqiq_sharh?.conclusion && (
                  <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31]">
                    <p className={`text-[#52796F] dark:text-[#95B8A8] font-ibm text-justify ${sharhClasses}`}>
                      {hadith.ibn_daqiq_sharh.conclusion}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback if sharh not fully ingested yet */
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059]">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                    شَرْحٌ مُبَسَّطٌ مُسْتَفَادٌ مِنْ كُتُبِ التُّرَاثِ
                  </h3>
                </div>
                <p className={`text-[#1D2A24]/90 dark:text-[#D5E2DB] font-ibm text-justify ${sharhClasses}`}>
                  {hadith.suluk_lesson}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Vocabulary & Terms */}
        {activeTab === "vocab" && (
          <div className="space-y-3">
            {hasVocab ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hadith.vocabulary?.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] flex flex-col justify-between space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-amiri font-bold text-base sm:text-lg text-[#1B4332] dark:text-[#E5C378]">
                        «{v.word}»
                      </span>
                      <span className="text-[10px] text-[#C5A059] font-mono px-1.5 py-0.5 rounded bg-[#C5A059]/10">
                        مفردة #{idx + 1}
                      </span>
                    </div>
                    <p className="font-ibm text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
                      {v.meaning}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2019] border border-dashed border-[#E7DFD5] dark:border-[#203D31] text-center text-xs text-[#52796F]">
                جاري إدراج جدول معاني المفردات لهذا الحديث وفق المنهاج المعتمد.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Benefits & Educational Lessons */}
        {activeTab === "benefits" && (
          <div className="space-y-2.5">
            {hasBenefits ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E7DFD5]/70 dark:border-[#203D31]/70 text-[#C5A059]">
                  <Award className="w-4 h-4" />
                  <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                    مِمَّا يُسْتَفَادُ مِنَ الْحَدِيثِ الشَّرِيفِ
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {hadith.benefits?.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/20 text-[#1B4332] dark:text-[#E5C378] text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className={`font-ibm text-[#1D2A24]/90 dark:text-[#D5E2DB] leading-relaxed ${sharhClasses}`}>
                        {benefit}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2019] border border-dashed border-[#E7DFD5] dark:border-[#203D31] text-center text-xs text-[#52796F]">
                جاري إدراج الفوائد التربوية والأحكام المستنبطة لهذا الحديث.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Narrator Biography */}
        {activeTab === "narrator" && (
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E7DFD5]/70 dark:border-[#203D31]/70 text-[#C5A059]">
              <UserCheck className="w-4 h-4" />
              <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                تَرْجَمَةُ الصَّحَابِيِّ رَاوِي الْحَدِيثِ
              </h3>
            </div>
            {hasNarratorBio ? (
              <p className={`font-ibm text-[#1D2A24]/90 dark:text-[#D5E2DB] text-justify leading-relaxed ${sharhClasses}`}>
                {hadith.narrator_bio}
              </p>
            ) : (
              <div className="space-y-1">
                <span className="text-xs text-[#52796F] dark:text-[#A1B3A9] block">راوي الحديث:</span>
                <p className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                  {hadith.narrator}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6. Distinct Spiritual Insight Card: البُعْدُ الإِحْسَانِيُّ وَالسُّلُوكِيُّ */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#FCF9F2] to-[#F5ECE0] dark:from-[#11231B] dark:to-[#0B1A14] border border-[#C5A059]/50 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-[#C5A059]">
          <Sparkles className="w-4 h-4" />
          <h2 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
            البُعْدُ الإِحْسَانِيُّ وَالسُّلُوكِيُّ (مِنْهَاجُ الْفَقِيرِ)
          </h2>
        </div>
        <p className={`text-[#1D2A24]/95 dark:text-[#E8F0EC] font-ibm text-justify ${sharhClasses}`}>
          {hadith.suluk_lesson}
        </p>
      </div>

      {/* 7. Standardized Documentation & Takhrij Metadata Grid */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm">
          <div className="p-2 rounded-lg bg-white/70 dark:bg-[#0E2019]/70 border border-[#E7DFD5]/60 dark:border-[#203D31]/60">
            <span className="text-[11px] text-[#52796F] dark:text-[#A1B3A9] block">النوع:</span>
            <span className="font-semibold text-[#143628] dark:text-[#FAF7F2]">حديث نبوي شريف</span>
          </div>

          <div className="p-2 rounded-lg bg-white/70 dark:bg-[#0E2019]/70 border border-[#E7DFD5]/60 dark:border-[#203D31]/60">
            <span className="text-[11px] text-[#52796F] dark:text-[#A1B3A9] block">المصدر والتخريج:</span>
            <span className="font-semibold text-[#143628] dark:text-[#FAF7F2] line-clamp-1" title={hadith.source}>
              {hadith.source || "متفق عليه"}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-white/70 dark:bg-[#0E2019]/70 border border-[#E7DFD5]/60 dark:border-[#203D31]/60">
            <span className="text-[11px] text-[#52796F] dark:text-[#A1B3A9] block">المرجع والشرح:</span>
            <span className="font-semibold text-[#143628] dark:text-[#FAF7F2]">شرح ابن دقيق العيد</span>
          </div>

          <div className="p-2 rounded-lg bg-white/70 dark:bg-[#0E2019]/70 border border-[#E7DFD5]/60 dark:border-[#203D31]/60">
            <span className="text-[11px] text-[#52796F] dark:text-[#A1B3A9] block">الاعتماد:</span>
            <span className="font-semibold text-[#143628] dark:text-[#FAF7F2]">الأوقاف المغربية</span>
          </div>
        </div>
      </div>

      {/* 8. Action & Share Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="py-2.5 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-xs font-semibold text-[#128C7E] dark:text-[#25D366] transition flex items-center gap-2 shadow-sm"
            title="مشاركة الحديث عبر واتساب"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>مشاركة عبر واتساب</span>
          </button>

          {/* Copy Direct Link */}
          <button
            onClick={handleCopyLink}
            className="py-2.5 px-4 rounded-xl bg-white dark:bg-[#0E2019] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-semibold text-[#143628] dark:text-[#FAF7F2] transition flex items-center gap-2 shadow-sm"
            title="نسخ رابط هذا الحديث"
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
            href={`/hadith/${hadith.id}`}
            className="text-xs text-[#C5A059] hover:underline font-semibold flex items-center gap-1"
          >
            <span>فتح في صفحة مستقلة</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* 9. Clear Navigation: Previous & Next Hadith */}
      <nav aria-label="تصفح الأحاديث" className="pt-6 border-t border-[#E7DFD5] dark:border-[#203D31] grid grid-cols-2 gap-3">
        {prevHadithId ? (
          onNavigate ? (
            <button
              onClick={() => onNavigate(prevHadithId)}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-[#0E2019] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-right transition flex items-center gap-2 group"
            >
              <ChevronRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
              <div>
                <span className="text-xs text-[#52796F] dark:text-[#A1B3A9] block">السابق</span>
                <span className="text-xs sm:text-sm font-bold text-[#143628] dark:text-[#FAF7F2]">
                  الحديث #{prevHadithId}
                </span>
              </div>
            </button>
          ) : (
            <Link
              href={`/hadith/${prevHadithId}`}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-[#0E2019] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-right transition flex items-center gap-2 group"
            >
              <ChevronRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
              <div>
                <span className="text-xs text-[#52796F] dark:text-[#A1B3A9] block">السابق</span>
                <span className="text-xs sm:text-sm font-bold text-[#143628] dark:text-[#FAF7F2]">
                  الحديث #{prevHadithId}
                </span>
              </div>
            </Link>
          )
        ) : (
          <div />
        )}

        {nextHadithId ? (
          onNavigate ? (
            <button
              onClick={() => onNavigate(nextHadithId)}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-[#0E2019] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-left justify-end transition flex items-center gap-2 group"
            >
              <div className="text-left">
                <span className="text-xs text-[#52796F] dark:text-[#A1B3A9] block">التالي</span>
                <span className="text-xs sm:text-sm font-bold text-[#143628] dark:text-[#FAF7F2]">
                  الحديث #{nextHadithId}
                </span>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#C5A059] group-hover:-translate-x-1 transition-transform" />
            </button>
          ) : (
            <Link
              href={`/hadith/${nextHadithId}`}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-[#0E2019] hover:bg-[#FAF7F2] dark:hover:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-left justify-end transition flex items-center gap-2 group"
            >
              <div className="text-left">
                <span className="text-xs text-[#52796F] dark:text-[#A1B3A9] block">التالي</span>
                <span className="text-xs sm:text-sm font-bold text-[#143628] dark:text-[#FAF7F2]">
                  الحديث #{nextHadithId}
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
