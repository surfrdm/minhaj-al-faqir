"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Sparkles,
  BookOpen,
  X,
  Download,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { HIKAM_LIST, HikmaItem, getAllTopics } from "@/lib/hikam";

interface HikamArchiveProps {
  isEmbedded?: boolean;
}

export function HikamArchive({ isEmbedded = false }: HikamArchiveProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedHikma, setSelectedHikma] = useState<HikmaItem | null>(null);
  const [modalLang, setModalLang] = useState<"ar" | "fr" | "en">("ar");
  const [modalCopied, setModalCopied] = useState(false);
  const [displayCount, setDisplayCount] = useState(24);

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
          h.text_fr.toLowerCase().includes(q) ||
          h.text_en.toLowerCase().includes(q) ||
          h.explanation_ar.toLowerCase().includes(q) ||
          h.topic.toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [searchQuery, selectedTopic]);

  const visibleHikam = useMemo(() => {
    return filteredHikam.slice(0, displayCount);
  }, [filteredHikam, displayCount]);

  const handleCopyModalText = async () => {
    if (!selectedHikma) return;
    let text = "";
    if (modalLang === "ar") {
      text = `الحكمة (${selectedHikma.number}):\n"${selectedHikma.text_ar}"\n\nالشرح:\n${selectedHikma.explanation_ar}`;
    } else if (modalLang === "fr") {
      text = `Hikma N°${selectedHikma.number}:\n« ${selectedHikma.text_fr} »`;
    } else {
      text = `Hikma #${selectedHikma.number}:\n"${selectedHikma.text_en}"`;
    }

    try {
      await navigator.clipboard.writeText(text);
      setModalCopied(true);
      setTimeout(() => setModalCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleWhatsAppModalShare = () => {
    if (!selectedHikma) return;
    const text = encodeURIComponent(
      `✨ *الحكمة العطائية (#${selectedHikma.number})* ✨\n\n"${selectedHikma.text_ar}"\n\n*الشرح:* ${selectedHikma.explanation_ar}\n\n🌱 *منصة مسار السالك*`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div id="archive" className={`scroll-mt-24 ${isEmbedded ? "py-4 w-full" : "py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}>
      {/* Title (Standalone only) */}
      {!isEmbedded && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C5A059] mb-2 px-3.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30">
            <Layers className="w-4 h-4" />
            <span>المَعْرِضُ التَّفَاعُلِي الشَّامِل</span>
          </div>
          <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2]">
            أَرْشِيفُ الحِكَمِ العَطَائِيَّةِ (264 كَبْسُولَة)
          </h2>
          <p className="text-sm text-[#596B62] dark:text-[#9BB0A5] font-ibm mt-1">
            ابحث وفلتر جميع الحكم المصممة حسب الموضوع أو اللغة وتأمل دقائق أسرارها.
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

        <div className="text-xs font-semibold text-[#52796F] dark:text-[#95B8A8]">
          عرض <span className="font-mono text-[#1B4332] dark:text-[#E5C378] font-bold">{filteredHikam.length}</span> من 264 درة عطائية
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

      {/* Grid of Capsules */}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visibleHikam.map((hikma) => (
            <div
              key={hikma.id}
              onClick={() => {
                setSelectedHikma(hikma);
                setModalLang("ar");
              }}
              className="group bg-white dark:bg-[#12241D] rounded-2xl border border-[#E7DFD5] dark:border-[#203A2F] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C5A059] transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Capsule Image Thumbnail */}
              <div className="relative aspect-[4/5] bg-black overflow-hidden">
                <Image
                  src={hikma.capsule_image_url}
                  alt={`حكمة عطائية رقم ${hikma.number}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-mono text-[#E5C378] border border-[#C5A059]/40">
                  #{hikma.number}
                </span>
              </div>

              {/* Card Meta */}
              <div className="p-3 text-right">
                <span className="text-[10px] text-[#C5A059] font-medium block truncate mb-1">
                  {hikma.topic}
                </span>
                <p className="font-amiri text-xs font-bold text-[#143628] dark:text-[#FAF7F2] line-clamp-2 leading-relaxed">
                  {hikma.text_ar}
                </p>
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
            className="px-8 py-3 rounded-xl bg-white dark:bg-[#12241D] border border-[#C5A059] text-xs font-semibold text-[#143628] dark:text-[#E8F0EC] hover:bg-[#C5A059] hover:text-[#143628] shadow-sm transition"
          >
            عرض المزيد من الحكم (+24)
          </button>
        </div>
      )}

      {/* Interactive Detail Modal */}
      {selectedHikma && (
        <div
          onClick={() => setSelectedHikma(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7F2] dark:bg-[#0B1914] rounded-3xl border border-[#C5A059]/40 shadow-2xl max-w-4xl w-full overflow-hidden my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#12241D]">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#1B4332] text-[#E5C378] text-xs font-mono font-bold">
                  حكمة رقم #{selectedHikma.number}
                </span>
                <span className="text-xs text-[#C5A059] font-semibold">
                  {selectedHikma.topic}
                </span>
              </div>
              <button
                onClick={() => setSelectedHikma(null)}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#596B62] dark:text-[#9BB0A5]"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
              {/* Capsule Image in Modal */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-[#C5A059]/30 bg-black">
                  <Image
                    src={selectedHikma.capsule_image_url}
                    alt={`حكمة رقم ${selectedHikma.number}`}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="w-full flex items-center gap-2 mt-3">
                  <a
                    href={selectedHikma.capsule_image_url}
                    download={`Hikma_${selectedHikma.number}.jpg`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-[#12241D] border border-[#E7DFD5] dark:border-[#203A2F] text-xs font-medium text-[#1D2A24] dark:text-[#E8F0EC] hover:border-[#C5A059]"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>تحميل</span>
                  </a>

                  <button
                    onClick={handleWhatsAppModalShare}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-xs font-semibold text-[#1B4332] dark:text-[#25D366]"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>واتساب</span>
                  </button>
                </div>
              </div>

              {/* Text & Explanations in Modal */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Language Selector */}
                  <div className="flex items-center justify-between border-b border-[#E7DFD5] dark:border-[#203A2F] pb-3 mb-4">
                    <div className="flex items-center gap-1 bg-white dark:bg-[#12241D] p-1 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F]">
                      <button
                        onClick={() => setModalLang("ar")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          modalLang === "ar"
                            ? "bg-[#1B4332] text-white"
                            : "text-[#596B62] dark:text-[#9BB0A5]"
                        }`}
                      >
                        العربية
                      </button>
                      <button
                        onClick={() => setModalLang("fr")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          modalLang === "fr"
                            ? "bg-[#1B4332] text-white"
                            : "text-[#596B62] dark:text-[#9BB0A5]"
                        }`}
                      >
                        Français
                      </button>
                      <button
                        onClick={() => setModalLang("en")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          modalLang === "en"
                            ? "bg-[#1B4332] text-white"
                            : "text-[#596B62] dark:text-[#9BB0A5]"
                        }`}
                      >
                        English
                      </button>
                    </div>

                    <button
                      onClick={handleCopyModalText}
                      className="flex items-center gap-1 text-xs text-[#596B62] dark:text-[#9BB0A5] hover:text-[#C5A059]"
                    >
                      {modalCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Content per language */}
                  {modalLang === "ar" && (
                    <div className="space-y-4 text-right">
                      <div className="p-4 rounded-xl bg-white dark:bg-[#12241D] border-r-4 border-[#C5A059]">
                        <p className="font-amiri text-xl sm:text-2xl font-bold leading-relaxed text-[#143628] dark:text-[#FAF7F2]">
                          «{selectedHikma.text_ar}»
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#C5A059] block">
                          الشرح والتوجيه السلوكي:
                        </span>
                        <p className="text-sm font-ibm text-[#1D2A24]/90 dark:text-[#C5D5CC] leading-relaxed">
                          {selectedHikma.explanation_ar}
                        </p>
                      </div>
                    </div>
                  )}

                  {modalLang === "fr" && (
                    <div className="space-y-4 text-left" dir="ltr">
                      <div className="p-4 rounded-xl bg-white dark:bg-[#12241D] border-l-4 border-[#C5A059]">
                        <p className="font-cormorant text-xl sm:text-2xl italic leading-relaxed text-[#143628] dark:text-[#FAF7F2]">
                          « {selectedHikma.text_fr} »
                        </p>
                      </div>
                      <p className="text-sm font-jakarta text-[#596B62] dark:text-[#9BB0A5] leading-relaxed">
                        Parole de sagesse transmise par Shaykh Ibn &apos;Ata Allah.
                        Elle souligne la lucidité spirituelle face aux épreuves et
                        la conformité du cœur avec la volonté divine.
                      </p>
                    </div>
                  )}

                  {modalLang === "en" && (
                    <div className="space-y-4 text-left" dir="ltr">
                      <div className="p-4 rounded-xl bg-white dark:bg-[#12241D] border-l-4 border-[#C5A059]">
                        <p className="font-cormorant text-xl sm:text-2xl italic leading-relaxed text-[#143628] dark:text-[#FAF7F2]">
                          &ldquo;{selectedHikma.text_en}&rdquo;
                        </p>
                      </div>
                      <p className="text-sm font-jakarta text-[#596B62] dark:text-[#9BB0A5] leading-relaxed">
                        Wisdom of Shaykh Ibn &apos;Ata Allah, pointing towards spiritual
                        clarity, shedding ego attachment and finding contentment in the Divine.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-[#E7DFD5] dark:border-[#203A2F] text-left">
                  <span className="text-[11px] font-mono text-[#596B62] dark:text-[#9BB0A5]">
                    Al-Hikam Al-&apos;Ata&apos;iyya • Capsule #{selectedHikma.number}
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
