"use client";

import React, { useState, useMemo } from "react";
import arbaeenData from "@/data/arbaeen.json";
import {
  Search,
  BookOpen,
  Download,
  Share2,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Scroll
} from "lucide-react";

interface Hadith {
  id: number;
  title: string;
  topic: string;
  theme: string;
  narrator: string;
  source: string;
  image: string;
}

interface ArbaeenSectionProps {
  isEmbedded?: boolean;
}

export function ArbaeenSection({ isEmbedded = false }: ArbaeenSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);

  // Extract themes
  const themes = useMemo(() => {
    const list = Array.from(new Set(arbaeenData.map((h) => h.theme)));
    return ["all", ...list];
  }, []);

  // Filtered Hadiths
  const filteredHadiths = useMemo(() => {
    return arbaeenData.filter((h) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        h.id.toString() === searchQuery.trim() ||
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.narrator.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTheme = selectedTheme === "all" || h.theme === selectedTheme;

      return matchesSearch && matchesTheme;
    });
  }, [searchQuery, selectedTheme]);

  // Navigate in modal
  const handleNext = () => {
    if (!selectedHadith) return;
    const currentIndex = arbaeenData.findIndex((h) => h.id === selectedHadith.id);
    const nextIndex = (currentIndex + 1) % arbaeenData.length;
    setSelectedHadith(arbaeenData[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedHadith) return;
    const currentIndex = arbaeenData.findIndex((h) => h.id === selectedHadith.id);
    const prevIndex = (currentIndex - 1 + arbaeenData.length) % arbaeenData.length;
    setSelectedHadith(arbaeenData[prevIndex]);
  };

  const shareOnWhatsApp = (h: Hadith) => {
    const text = `📖 الحديث ${h.id} من الأربعين النووية:\n«${h.title}»\n${h.source} - ${h.narrator}\n\nطالع اللوحة الشريفة على منصة منهاج الفقير: ${window.location.origin}/#arbaeen`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
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
              <span>السلك العلمي والأكاديمي • زاوية مدينة المحمدية</span>
            </div>

            <h2 className="font-amiri text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143628] dark:text-[#FAF7F2] tracking-wide mb-4 leading-tight">
              الأَرْبَعُونَ النَّوَوِيَّةُ • مَسَاقُ التَّرْبِيَةِ وَالسُّلُوكِ
            </h2>

            <p className="font-ibm text-sm sm:text-base text-[#1D2A24]/80 dark:text-[#C5D5CC] leading-relaxed">
              42 لوحة فنية عالية الدقة تجمع جوامع كِلم المصطفى ﷺ، مؤطرة بشعار وهوية الطريقة القادرية البودشيشية (مدينة المحمدية)؛
              تُمثّل القواعد الكلية لدين الإسلام ومقامات الإحسان لسالك طريق الله.
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
                placeholder="ابحث برقم الحديث (1-42) أو بموضوعه (النيات، الورع، الإحسان)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-[#143628] dark:text-[#FAF7F2] text-xs sm:text-sm placeholder-[#9AA5A0] focus:outline-none focus:border-[#C5A059] shadow-sm transition-all"
              />
              <Search className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Total Badge */}
            <div className="text-xs font-semibold text-[#52796F] dark:text-[#95B8A8]">
              عرض <span className="font-mono text-[#1B4332] dark:text-[#E5C378] font-bold">{filteredHadiths.length}</span> من 42 حديثاً
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
                    : "bg-white dark:bg-[#122820] text-[#52796F] dark:text-[#95B8A8] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
                }`}
              >
                {t === "all" ? "كافة الأحاديث (42)" : t}
              </button>
            ))}
          </div>
        </div>

        {/* Hadith Posters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {filteredHadiths.map((h) => (
            <div
              key={h.id}
              onClick={() => setSelectedHadith(h)}
              className="group cursor-pointer rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] p-2 sm:p-2.5 shadow-sm hover:shadow-xl hover:border-[#C5A059] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Poster Image Container */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#F4EFE6] dark:bg-[#0E2019] mb-3 border border-[#C5A059]/20 shadow-inner">
                <img
                  src={h.image}
                  alt={h.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-white/90 text-[#1B4332] flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-300">
                    <ZoomIn className="w-4 h-4 text-[#C5A059]" />
                  </div>
                </div>

                {/* Number Badge */}
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#1B4332]/90 text-[#FAF7F2] font-mono text-[11px] font-bold shadow border border-[#C5A059]/40">
                  #{h.id}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="text-right px-1">
                <span className="text-[10px] text-[#C5A059] dark:text-[#D4AF37] font-semibold block mb-1">
                  {h.topic}
                </span>
                <h3 className="font-amiri text-sm sm:text-base font-bold text-[#143628] dark:text-[#E8F0EC] line-clamp-1 leading-snug mb-1">
                  {h.title}
                </h3>
                <span className="text-[10px] text-[#718279] dark:text-[#8D9F95] block">
                  {h.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Poster Zoom & Details Modal */}
      {selectedHadith && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedHadith(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF7F2] dark:bg-[#0E2019] rounded-2xl border border-[#C5A059]/40 shadow-2xl overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedHadith(null)}
              className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster Image (Left/Top) */}
            <div className="md:w-3/5 bg-[#122820] flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
              <img
                src={selectedHadith.image}
                alt={selectedHadith.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl border border-[#C5A059]/30"
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all shadow"
                title="الحديث السابق"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all shadow"
                title="الحديث التالي"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Info & Actions (Right/Bottom) */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#C5A059]/20 text-[#9E7B35] dark:text-[#E5C378] text-xs font-mono font-bold">
                    الحديث رقم {selectedHadith.id} من 42
                  </span>
                  <span className="text-xs text-[#52796F] dark:text-[#95B8A8] font-semibold">
                    • {selectedHadith.theme}
                  </span>
                </div>

                <h3 className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-3 leading-snug">
                  {selectedHadith.title}
                </h3>

                <div className="space-y-2 text-xs text-[#52796F] dark:text-[#A7C2B5] font-ibm pb-4 mb-4 border-b border-[#E7DFD5] dark:border-[#203D31]">
                  <p>
                    <strong className="text-[#143628] dark:text-[#FAF7F2]">الراوي:</strong> {selectedHadith.narrator}
                  </p>
                  <p>
                    <strong className="text-[#143628] dark:text-[#FAF7F2]">المصدر:</strong> {selectedHadith.source}
                  </p>
                  <p>
                    <strong className="text-[#143628] dark:text-[#FAF7F2]">الموضوع السلوكي:</strong> {selectedHadith.topic}
                  </p>
                </div>

                <p className="text-xs text-[#718279] dark:text-[#8D9F95] leading-relaxed">
                  هذه اللوحة الشريفة مصممة ومعتمدة بهوية الطريقة القادرية البودشيشية (مدينة المحمدية)،
                  قابلة للتحميل والمشاركة بهدف نشر جوامع كلم الحبيب المصطفى ﷺ وتربية القلوب.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2.5">
                <a
                  href={selectedHadith.image}
                  download={`Hadith_${selectedHadith.id}_Minhaj_Al_Faqir.png`}
                  className="w-full py-3 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all border border-[#C5A059]/40"
                >
                  <Download className="w-4 h-4 text-[#C5A059]" />
                  <span>تحميل اللوحة بدقة الطباعة (PNG)</span>
                </a>

                <button
                  onClick={() => shareOnWhatsApp(selectedHadith)}
                  className="w-full py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة عبر واتساب</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
