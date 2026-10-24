"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Sparkles,
  BookOpen,
  X,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  ExternalLink,
  Bookmark,
} from "lucide-react";
import { HIKAM_LIST, HikmaItem, getAllTopics, TOTAL_HIKAM } from "@/lib/hikam";
import { HikmaReader } from "@/components/HikmaReader";

interface HikamArchiveProps {
  isEmbedded?: boolean;
}

const ZAWIYA_FACEBOOK_URL = "https://www.facebook.com/zaouia.mohammedia";

export function HikamArchive({ isEmbedded = false }: HikamArchiveProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedHikma, setSelectedHikma] = useState<HikmaItem | null>(null);
  const [lastReadHikmaNum, setLastReadHikmaNum] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(24);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("minhaj_last_hikma");
        if (saved) {
          const num = parseInt(saved, 10);
          if (!isNaN(num) && num >= 1 && num <= TOTAL_HIKAM) {
            setLastReadHikmaNum(num);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const topics = useMemo(() => ["all", ...getAllTopics()], []);

  const filteredHikam = useMemo(() => {
    let list = HIKAM_LIST;

    if (selectedTopic !== "all") {
      list = list.filter((h) => h.topic === selectedTopic);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((h) => {
        return (
          h.number.toString() === q ||
          h.text_ar.toLowerCase().includes(q) ||
          (h.text_fr && h.text_fr.toLowerCase().includes(q)) ||
          (h.text_en && h.text_en.toLowerCase().includes(q)) ||
          (h.explanation_ar && h.explanation_ar.toLowerCase().includes(q)) ||
          (h.topic && h.topic.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [searchQuery, selectedTopic]);

  const visibleHikam = useMemo(() => {
    return filteredHikam.slice(0, displayCount);
  }, [filteredHikam, displayCount]);



  return (
    <div id="archive" className={`scroll-mt-24 ${isEmbedded ? "py-4 w-full" : "py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}>
      {/* Title (Standalone only) */}
      {!isEmbedded && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C5A059] mb-2 px-3.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30">
            <Layers className="w-4 h-4" />
            <span>المَعْرِضُ التَّفَاعُلِي الشَّامِل • نُصُوصٌ مُحَقَّقَةٌ</span>
          </div>
          <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2]">
            أَرْشِيفُ الحِكَمِ العَطَائِيَّةِ (264 دُرَّة)
          </h2>
          <p className="text-sm text-[#596B62] dark:text-[#9BB0A5] font-ibm mt-1">
            الأرشيف العلمي التفاعلي الكامل المصنف بالمقامات الروحية، مع الشرح السلوكي والترجمات الفرنسية والإنجليزية.
          </p>
        </div>
      )}

      {/* Search Bar Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الحكمة (1-264)، نصها، أو الكلمة..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white dark:bg-[#12241D] border border-[#E7DFD5] dark:border-[#203A2F] text-sm text-[#1D2A24] dark:text-[#E8F0EC] placeholder-[#596B62]/60 focus:outline-none focus:border-[#C5A059] transition shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#596B62] hover:text-[#1D2A24]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {lastReadHikmaNum && (
            <button
              onClick={() => {
                const found = HIKAM_LIST.find((h) => h.number === lastReadHikmaNum);
                if (found) setSelectedHikma(found);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#8C6D23] dark:text-[#E5C378] border border-[#C5A059]/30 text-xs font-semibold transition shadow-sm"
              title="متابعة القراءة من حيث توقفت"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>متابعة القراءة (الحكمة #{lastReadHikmaNum})</span>
            </button>
          )}
          <div className="text-xs font-semibold text-[#52796F] dark:text-[#95B8A8]">
            عرض <span className="font-mono text-[#1B4332] dark:text-[#E5C378] font-bold">{filteredHikam.length}</span> من 264 درة عطائية
          </div>
        </div>
      </div>

      {/* Topics Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        <Filter className="w-4 h-4 text-[#C5A059] shrink-0 ml-1" />
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => {
              setSelectedTopic(t);
              setDisplayCount(24);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedTopic === t
                ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm font-semibold"
                : "bg-white dark:bg-[#12241D] text-[#596B62] dark:text-[#9BB0A5] border border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]"
            }`}
          >
            {t === "all" ? "كافة الحكم (264)" : t}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#596B62] dark:text-[#9BB0A5] mb-6">
        <span>
          عرض <strong className="text-[#C5A059]">{visibleHikam.length}</strong> من أصل{" "}
          <strong className="text-[#143628] dark:text-[#FAF7F2]">{filteredHikam.length}</strong> حكمة مطابقة
        </span>
      </div>

      {/* Grid of Illuminated Typographic Tiles */}
      {visibleHikam.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#12241D] rounded-3xl border border-[#E7DFD5] dark:border-[#203A2F] p-8">
          <BookOpen className="w-12 h-12 text-[#C5A059] mx-auto mb-4 opacity-50" />
          <p className="font-amiri text-xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
            لم نجد حكمة مطابقة لبحثك
          </p>
          <p className="text-xs text-[#596B62] dark:text-[#9BB0A5]">
            جرب كلمة بحث أخرى أو أزل الفلترة لرؤية كافة الحكم.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleHikam.map((hikma) => (
            <div
              key={hikma.id}
              onClick={() => setSelectedHikma(hikma)}
              className="group bg-gradient-to-br from-[#FFFDF9] to-[#FAF5ED] dark:from-[#0E2019] dark:to-[#081410] rounded-2xl border border-[#E7DFD5] dark:border-[#203D31] p-5 hover:border-[#C5A059] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top Card Bar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378]">
                    #{hikma.number}
                  </span>
                  <span className="text-xs font-semibold text-[#C5A059] truncate max-w-[150px]">
                    {hikma.topic}
                  </span>
                </div>

                {/* Vocalized Quote */}
                <div className="relative py-2">
                  <span className="text-2xl font-amiri text-[#C5A059]/30 select-none block mb-1">
                    ❝
                  </span>
                  <p className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2] line-clamp-3 leading-relaxed text-right">
                    «{hikma.text_ar}»
                  </p>
                </div>
              </div>

              {/* Bottom Card Bar: Languages Available & Click Hint */}
              <div className="pt-3 mt-3 border-t border-[#E7DFD5]/80 dark:border-[#203D31]/80 flex items-center justify-between text-xs">
                <span className="text-[#52796F] dark:text-[#A1B3A9] flex items-center gap-1 font-mono">
                  <span>AR</span>
                  <span>•</span>
                  <span>FR</span>
                  <span>•</span>
                  <span>EN</span>
                </span>
                <span className="text-[#C5A059] font-medium group-hover:translate-x-[-2px] transition-transform">
                  طالع الشرح ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleHikam.length < filteredHikam.length && (
        <div className="text-center mt-12">
          <button
            onClick={() => setDisplayCount((prev) => prev + 24)}
            className="px-8 py-3 rounded-2xl bg-white dark:bg-[#12241D] border border-[#C5A059] text-xs font-semibold text-[#143628] dark:text-[#E8F0EC] hover:bg-[#C5A059] hover:text-[#143628] shadow-sm transition"
          >
            عرض المزيد من الحكم (+24)
          </button>
        </div>
      )}

      {/* Interactive Detail Modal (HikmaReader) */}
      {selectedHikma && (
        <div
          onClick={() => setSelectedHikma(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7F2] dark:bg-[#0B1914] rounded-3xl border border-[#C5A059]/40 shadow-2xl max-w-4xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative my-8"
            dir="rtl"
          >
            <button
              onClick={() => setSelectedHikma(null)}
              className="absolute top-5 left-5 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#596B62] dark:text-[#9BB0A5] transition z-10"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <HikmaReader
              hikma={selectedHikma}
              prevHikmaNum={selectedHikma.number > 1 ? selectedHikma.number - 1 : undefined}
              nextHikmaNum={selectedHikma.number < TOTAL_HIKAM ? selectedHikma.number + 1 : undefined}
              onNavigate={(num) => {
                const found = HIKAM_LIST.find((h) => h.number === num);
                if (found) setSelectedHikma(found);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
