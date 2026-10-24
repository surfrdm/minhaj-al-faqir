"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
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
  Bookmark,
} from "lucide-react";
import { HadithReader } from "@/components/HadithReader";
import { HadithItem, TOTAL_HADITH } from "@/lib/arbaeen";

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
  const [lastReadId, setLastReadId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("minhaj_last_hadith");
        if (saved) {
          const num = parseInt(saved, 10);
          if (!isNaN(num) && num >= 1 && num <= 42) {
            setLastReadId(num);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

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

        {/* Embedded Mode Banner linking to dedicated /hadith page */}
        {isEmbedded && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#1B4332]/10 via-[#C5A059]/15 to-[#1B4332]/10 border border-[#C5A059]/35 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-right">
              <Scroll className="w-5 h-5 text-[#C5A059] shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#143628] dark:text-[#FAF7F2] block">
                  الأربعين النووية متاحة أيضاً في صفحة مستقلة كاملة
                </span>
                <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8] font-ibm">
                  لقراءة أهدأ ورابط مباشر لكل حديث مع تكبير الخط وحفظ التقدم
                </span>
              </div>
            </div>
            <Link
              href="/hadith"
              className="px-4 py-2 rounded-xl bg-[#1B4332] text-white hover:bg-[#143628] dark:bg-[#C5A059] dark:text-[#0E2019] text-xs font-bold transition flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <span>فتح صفحة الأربعين المستقلة</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
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

            {/* Total Badge & Resume Reading */}
            <div className="flex flex-wrap items-center gap-3">
              {lastReadId && (
                <button
                  onClick={() => {
                    const found = (arbaeenData as Hadith[]).find((h) => h.id === lastReadId);
                    if (found) setSelectedHadith(found);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#8C6D23] dark:text-[#E5C378] border border-[#C5A059]/30 text-xs font-semibold transition shadow-sm"
                  title="متابعة القراءة من حيث توقفت"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>متابعة القراءة (الحديث #{lastReadId})</span>
                </button>
              )}
              <div className="text-xs font-semibold text-[#52796F] dark:text-[#95B8A8]">
                عرض <span className="font-mono text-[#1B4332] dark:text-[#E5C378] font-bold">{filteredHadiths.length}</span> من 42 حديثاً شريفاً
              </div>
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
              onClick={() => setSelectedHadith(h)}
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

      {/* Hadith Reader Modal */}
      {selectedHadith && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedHadith(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#FAF7F2] dark:bg-[#0B1914] rounded-3xl border border-[#C5A059]/40 shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-6"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <button
              onClick={() => setSelectedHadith(null)}
              className="absolute top-5 left-5 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#596B62] dark:text-[#9BB0A5] transition z-10"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <HadithReader
              hadith={selectedHadith as HadithItem}
              prevHadithId={selectedHadith.id > 1 ? selectedHadith.id - 1 : undefined}
              nextHadithId={selectedHadith.id < TOTAL_HADITH ? selectedHadith.id + 1 : undefined}
              onNavigate={(id) => {
                const found = (arbaeenData as Hadith[]).find((h) => h.id === id);
                if (found) setSelectedHadith(found);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
