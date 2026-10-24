"use client";

import React, { useState, useMemo } from "react";
import arbaeenData from "@/data/arbaeen.json";
import {
  Search,
  BookOpen,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Scroll,
  ExternalLink,
  Copy,
  Check,
  Languages,
} from "lucide-react";

interface Hadith {
  id: number;
  title: string;
  topic: string;
  theme: string;
  narrator: string;
  source: string;
  image?: string;
  text_ar: string;
  text_fr?: string;
  text_en?: string;
  suluk_lesson?: string;
}

interface ArbaeenSectionProps {
  isEmbedded?: boolean;
}

const ZAWIYA_FACEBOOK_URL = "https://www.facebook.com/zaouia.mohammedia";

export function ArbaeenSection({ isEmbedded = false }: ArbaeenSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);
  const [modalLang, setModalLang] = useState<"ar" | "fr" | "en">("ar");
  const [copied, setCopied] = useState(false);

  // Extract themes
  const themes = useMemo(() => {
    const list = Array.from(new Set(arbaeenData.map((h) => h.theme)));
    return ["all", ...list];
  }, []);

  // Filtered Hadiths
  const filteredHadiths = useMemo(() => {
    return (arbaeenData as Hadith[]).filter((h) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        h.id.toString() === q ||
        h.title.toLowerCase().includes(q) ||
        h.topic.toLowerCase().includes(q) ||
        h.narrator.toLowerCase().includes(q) ||
        (h.text_ar && h.text_ar.toLowerCase().includes(q)) ||
        (h.text_fr && h.text_fr.toLowerCase().includes(q)) ||
        (h.text_en && h.text_en.toLowerCase().includes(q));

      const matchesTheme = selectedTheme === "all" || h.theme === selectedTheme;

      return matchesSearch && matchesTheme;
    });
  }, [searchQuery, selectedTheme]);

  // Navigate in modal
  const handleNext = () => {
    if (!selectedHadith) return;
    const currentIndex = arbaeenData.findIndex((h) => h.id === selectedHadith.id);
    const nextIndex = (currentIndex + 1) % arbaeenData.length;
    setSelectedHadith(arbaeenData[nextIndex] as Hadith);
  };

  const handlePrev = () => {
    if (!selectedHadith) return;
    const currentIndex = arbaeenData.findIndex((h) => h.id === selectedHadith.id);
    const prevIndex = (currentIndex - 1 + arbaeenData.length) % arbaeenData.length;
    setSelectedHadith(arbaeenData[prevIndex] as Hadith);
  };

  const shareOnWhatsApp = (h: Hadith) => {
    let hadithText = h.text_ar;
    if (modalLang === "fr" && h.text_fr) hadithText = h.text_fr;
    if (modalLang === "en" && h.text_en) hadithText = h.text_en;

    const text = `📖 حديث شريف (#${h.id}/42 من الأربعين النووية):\n«${h.title}»\n\nنص الحديث:\n${hadithText}\n\nالراوي والمصدر: ${h.narrator} — ${h.source}\n\nطالع زاد المنهاج كاملاً: ${typeof window !== "undefined" ? window.location.origin : ""}/#arbaeen`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const copyHadith = (h: Hadith) => {
    let hadithText = h.text_ar;
    if (modalLang === "fr" && h.text_fr) hadithText = h.text_fr;
    if (modalLang === "en" && h.text_en) hadithText = h.text_en;

    const text = `الحديث الشريف (#${h.id}/42 من الأربعين النووية):\n«${h.title}»\n\nنص الحديث الشريف:\n${hadithText}\n\nعن: ${h.narrator}\nالمصدر: ${h.source}\nالموضوع: ${h.topic}\nالمدارسة السلوكية: ${h.suluk_lesson || ""}\n\n— منصة منهاج الفقير`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="arbaeen" className={`${isEmbedded ? "py-4" : "py-24 bg-[#FAF7F2] dark:bg-[#081410]"} relative transition-colors duration-300`} dir="rtl">
      {!isEmbedded && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C5A059]/5 to-transparent pointer-events-none" />
      )}

      <div className={`${isEmbedded ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"} relative`}>
        {/* Section Header (Standalone only) */}
        {!isEmbedded && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 border border-[#1B4332]/20 dark:border-[#C5A059]/30 text-[#1B4332] dark:text-[#E5C378] text-xs sm:text-sm font-semibold mb-4">
              <Scroll className="w-4 h-4 text-[#C5A059]" />
              <span>مَسَاقُ الحَدِيثِ النَّبَوِيِّ الشَّرِيفِ • نُصُوصٌ مُحَقَّقَةٌ كَامِلَةٌ</span>
            </div>

            <h2 className="font-amiri text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143628] dark:text-[#FAF7F2] tracking-wide mb-4 leading-tight">
              الأَرْبَعُونَ النَّوَوِيَّةُ • مَسَارُ التَّزْكِيَةِ وَالسُّلُوكِ
            </h2>

            <p className="font-ibm text-sm sm:text-base text-[#1D2A24]/80 dark:text-[#C5D5CC] leading-relaxed">
              42 حديثاً شريفاً مكتوبة بكامل المتن والسند والتخريج، مع الترجمات الفرنسية والإنجليزية والمدارسة السلوكية الأصيلة، وروابط مباشرة لمشاهدة التصاميم الفنية على فيسبوك.
            </p>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="ابحث برقم الحديث (1-42)، بكلمة من نصه، أو بموضوعه..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-white dark:bg-[#12241D] border border-[#E7DFD5] dark:border-[#203D31] text-[#143628] dark:text-[#FAF7F2] text-xs sm:text-sm placeholder-[#9AA5A0] focus:outline-none focus:border-[#C5A059] shadow-sm transition-all"
              />
              <Search className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Total Badge */}
            <div className="text-xs font-semibold text-[#52796F] dark:text-[#95B8A8]">
              عرض <span className="font-mono text-[#1B4332] dark:text-[#E5C378] font-bold">{filteredHadiths.length}</span> من 42 حديثاً شريفاً بكامل المتن
            </div>
          </div>

          {/* Theme Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTheme(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTheme === t
                    ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm border border-[#C5A059]/40"
                    : "bg-white dark:bg-[#12241D] text-[#52796F] dark:text-[#95B8A8] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
                }`}
              >
                {t === "all" ? "كافة الأحاديث (42)" : t}
              </button>
            ))}
          </div>
        </div>

        {/* Hadith Illuminated Manuscript Tiles Grid (Text-First Architecture) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredHadiths.map((h) => (
            <div
              key={h.id}
              onClick={() => {
                setSelectedHadith(h);
                setModalLang("ar");
              }}
              className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#FAF5ED] dark:from-[#0E2019] dark:to-[#081410] border border-[#E7DFD5] dark:border-[#203D31] p-5 shadow-sm hover:shadow-lg hover:border-[#C5A059] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Tile Bar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378]">
                    #{h.id} / 42
                  </span>
                  <span className="text-[10px] font-semibold text-[#C5A059] truncate max-w-[130px]">
                    {h.topic}
                  </span>
                </div>

                {/* Hadith Calligraphic Title */}
                <div className="py-1">
                  <h3 className="font-amiri text-base sm:text-lg font-bold text-[#143628] dark:text-[#FAF7F2] leading-snug text-right mb-2">
                    «{h.title}»
                  </h3>
                </div>

                {/* Hadith Text Snippet Preview */}
                <p className="font-amiri text-xs text-[#1D2A24]/75 dark:text-[#C5D5CC] line-clamp-3 leading-relaxed text-right mb-2">
                  {h.text_ar}
                </p>
              </div>

              {/* Bottom Tile Info */}
              <div className="pt-3 mt-2 border-t border-[#E7DFD5]/80 dark:border-[#203D31]/80 space-y-1 text-right">
                <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8] font-ibm block truncate">
                  عن: {h.narrator}
                </span>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#84928A]">{h.source}</span>
                  <span className="text-[#C5A059] font-medium group-hover:translate-x-[-2px] transition-transform">
                    اقرأ المتن كاملاً ↗
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Illuminated Details Modal with Complete Text */}
      {selectedHadith && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedHadith(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#FAF7F2] dark:bg-[#0B1914] rounded-3xl border border-[#C5A059]/40 shadow-2xl overflow-hidden my-6"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#12241D]">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#1B4332] text-[#E5C378] text-xs font-mono font-bold">
                  الحديث الشريف #{selectedHadith.id} من 42
                </span>
                <span className="text-xs text-[#C5A059] font-semibold">
                  {selectedHadith.topic} • {selectedHadith.theme}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Prev / Next controls in modal */}
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#0E2019] hover:bg-[#C5A059]/20 text-[#143628] dark:text-[#FAF7F2] transition"
                  title="الحديث السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#0E2019] hover:bg-[#C5A059]/20 text-[#143628] dark:text-[#FAF7F2] transition"
                  title="الحديث التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedHadith(null)}
                  className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#596B62] dark:text-[#9BB0A5]"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
              {/* Left Column: Illuminated Seal & Social Action */}
              <div className="md:col-span-4 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] dark:from-[#0E2019] dark:to-[#081410] border border-[#C5A059]/30 p-5 shadow-inner">
                <div className="text-center py-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#C5A059]/15 flex items-center justify-center mx-auto mb-3 border border-[#C5A059]/30">
                    <Scroll className="w-7 h-7 text-[#C5A059]" />
                  </div>
                  <span className="font-amiri text-xs text-[#C5A059] font-bold block mb-1">
                    الأَرْبَعُونَ النَّوَوِيَّةُ لِلْإِمَامِ النَّوَوِيِّ
                  </span>
                  <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                    «{selectedHadith.title}»
                  </h4>
                  <span className="text-xs font-mono font-bold text-[#1B4332] dark:text-[#E5C378]">
                    #{selectedHadith.id} • {selectedHadith.theme}
                  </span>
                </div>

                {/* Takhrij summary card */}
                <div className="my-4 p-3 rounded-xl bg-white/70 dark:bg-[#12241D]/70 border border-[#E7DFD5] dark:border-[#203D31] text-xs font-ibm space-y-1 text-right">
                  <p className="text-[#143628] dark:text-[#FAF7F2]">
                    <strong>الراوي:</strong> {selectedHadith.narrator}
                  </p>
                  <p className="text-[#52796F] dark:text-[#95B8A8]">
                    <strong>المصدر:</strong> {selectedHadith.source}
                  </p>
                </div>

                <div className="w-full space-y-2">
                  <a
                    href={ZAWIYA_FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-xs font-semibold text-[#1877F2] dark:text-[#5B9DF8] transition group shadow-sm"
                    title="مشاهدة اللوحة الفنية والتصميم الكامل على فيسبوك"
                  >
                    <span>مشاهدة التصميم على فيسبوك</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition-transform" />
                  </a>

                  <button
                    onClick={() => shareOnWhatsApp(selectedHadith)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-xs font-semibold text-[#128C7E] dark:text-[#25D366] transition shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>مشاركة عبر واتساب</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Complete Hadith Text & Spiritual Commentary */}
              <div className="md:col-span-8 flex flex-col justify-between space-y-5">
                <div className="space-y-5">
                  {/* Language Selector & Copy Action */}
                  <div className="flex items-center justify-between border-b border-[#E7DFD5] dark:border-[#203A2F] pb-3">
                    <div className="flex items-center gap-1 bg-white dark:bg-[#12241D] p-1 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F]">
                      <button
                        onClick={() => setModalLang("ar")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          modalLang === "ar"
                            ? "bg-[#1B4332] text-white"
                            : "text-[#52796F] dark:text-[#9BB0A5] hover:text-[#1B4332]"
                        }`}
                      >
                        العربية (المتن كاملاً)
                      </button>
                      <button
                        onClick={() => setModalLang("fr")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          modalLang === "fr"
                            ? "bg-[#1B4332] text-white"
                            : "text-[#52796F] dark:text-[#9BB0A5] hover:text-[#1B4332]"
                        }`}
                      >
                        Français
                      </button>
                      <button
                        onClick={() => setModalLang("en")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          modalLang === "en"
                            ? "bg-[#1B4332] text-white"
                            : "text-[#52796F] dark:text-[#9BB0A5] hover:text-[#1B4332]"
                        }`}
                      >
                        English
                      </button>
                    </div>

                    <button
                      onClick={() => copyHadith(selectedHadith)}
                      className="flex items-center gap-1 text-xs text-[#52796F] dark:text-[#9BB0A5] hover:text-[#C5A059]"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ المتن</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Complete Hadith Text by Language */}
                  {modalLang === "ar" && (
                    <div className="space-y-4 text-right animate-in fade-in duration-200">
                      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#12241D] border-r-4 border-[#C5A059] shadow-sm">
                        <span className="text-[11px] font-bold text-[#C5A059] block mb-2">
                          نَصُّ الحَدِيثِ الشَّرِيفِ كَامِلاً:
                        </span>
                        <p className="font-amiri text-lg sm:text-xl font-bold leading-loose text-[#143628] dark:text-[#FAF7F2]">
                          «{selectedHadith.text_ar}»
                        </p>
                      </div>
                    </div>
                  )}

                  {modalLang === "fr" && (
                    <div className="space-y-4 text-left animate-in fade-in duration-200" dir="ltr">
                      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#12241D] border-l-4 border-[#C5A059] shadow-sm">
                        <span className="text-[11px] font-bold text-[#C5A059] block mb-2 uppercase tracking-wider">
                          Texte Intégral du Hadith (Français):
                        </span>
                        <p className="font-serif text-base sm:text-lg leading-relaxed text-[#143628] dark:text-[#FAF7F2]">
                          {selectedHadith.text_fr || "Traduction en cours..."}
                        </p>
                      </div>
                    </div>
                  )}

                  {modalLang === "en" && (
                    <div className="space-y-4 text-left animate-in fade-in duration-200" dir="ltr">
                      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#12241D] border-l-4 border-[#C5A059] shadow-sm">
                        <span className="text-[11px] font-bold text-[#C5A059] block mb-2 uppercase tracking-wider">
                          Complete Hadith Text (English):
                        </span>
                        <p className="font-serif text-base sm:text-lg leading-relaxed text-[#143628] dark:text-[#FAF7F2]">
                          {selectedHadith.text_en || "Translation under scholarly review..."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Spiritual Lesson / المدارسة السلوكية والقواعد الكلية */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#F5EFE6] dark:from-[#0E2019] dark:to-[#0A1813] border border-[#C5A059]/40 text-right space-y-1.5 shadow-inner">
                    <span className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>المَدَارَسَةُ السَّلُوكِيَّةُ وَالقَوَاعِدُ الكُلِّيَّةُ لِأَهْلِ الطَّرِيقِ:</span>
                    </span>
                    <p className="text-xs sm:text-sm font-ibm text-[#1D2A24]/90 dark:text-[#C5D5CC] leading-relaxed">
                      {selectedHadith.suluk_lesson}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E7DFD5] dark:border-[#203D31] text-left">
                  <span className="text-[11px] font-mono text-[#596B62] dark:text-[#9BB0A5]">
                    Al-Arba&apos;in An-Nawawiyya • Hadith #{selectedHadith.id} • Tariqa Qadiriyya Boutchichiyya
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
