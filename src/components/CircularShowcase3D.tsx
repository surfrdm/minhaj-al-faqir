"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Share2,
  ZoomIn,
  X,
  RotateCw,
  Compass,
  Scroll,
  Layers,
  Volume2
} from "lucide-react";
import { getHikmaOfTheDay, HIKAM_LIST } from "@/lib/hikam";
import arbaeenData from "@/data/arbaeen.json";

export interface ShowcaseCard {
  uid: string;
  type: "hadith" | "hikma";
  number: number;
  title: string;
  categoryBadge: string;
  subtitle: string;
  imageUrl: string;
  narratorOrAuthor: string;
  source: string;
}

export function CircularShowcase3D() {
  const [activeMode, setActiveMode] = useState<"featured" | "arbaeen" | "hikam">("featured");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [zoomCard, setZoomCard] = useState<ShowcaseCard | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch/Mouse drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentTranslate = useRef(0);

  const [dayOfYear, setDayOfYear] = useState(0);

  useEffect(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    setDayOfYear(Math.floor(diff / oneDay));
  }, []);

  // 1. Prepare items based on mode
  const cards: ShowcaseCard[] = useMemo(() => {
    const todayHadithIndex = dayOfYear % arbaeenData.length;
    const hikmaIndex = ((dayOfYear - 1) % HIKAM_LIST.length + HIKAM_LIST.length) % HIKAM_LIST.length;
    const todayHikma = HIKAM_LIST[hikmaIndex] || HIKAM_LIST[0];

    if (activeMode === "featured") {
      // Curated daily ring alternating Hikma & Hadith
      const list: ShowcaseCard[] = [
        {
          uid: "feat-hikma-today",
          type: "hikma",
          number: todayHikma.number,
          title: todayHikma.title || `الحكمة ${todayHikma.number}`,
          categoryBadge: "✨ حكمة اليوم المباركة",
          subtitle: "سيدي ابن عطاء الله السكندري",
          imageUrl: todayHikma.capsule_image_url || `/images/hikam/Hikma_${String(todayHikma.number).padStart(3, "0")}.jpg`,
          narratorOrAuthor: "الإمام أحمد بن عطاء الله السكندري",
          source: "كتاب الحِكَم العطائية"
        },
        {
          uid: "feat-hadith-today",
          type: "hadith",
          number: arbaeenData[todayHadithIndex].id,
          title: arbaeenData[todayHadithIndex].title,
          categoryBadge: "📿 حديث اليوم الشريف",
          subtitle: "الأربعين النووية",
          imageUrl: arbaeenData[todayHadithIndex].image,
          narratorOrAuthor: arbaeenData[todayHadithIndex].narrator,
          source: arbaeenData[todayHadithIndex].source
        },
        // Yesterday's Hikma
        {
          uid: "feat-hikma-prev",
          type: "hikma",
          number: todayHikma.number > 1 ? todayHikma.number - 1 : HIKAM_LIST.length,
          title: HIKAM_LIST[todayHikma.number > 1 ? todayHikma.number - 2 : HIKAM_LIST.length - 1]?.title || "حكمة سابقة",
          categoryBadge: "📜 حكمة الأمس",
          subtitle: "سيدي ابن عطاء الله السكندري",
          imageUrl: `/images/hikam/Hikma_${String(todayHikma.number > 1 ? todayHikma.number - 1 : HIKAM_LIST.length).padStart(3, "0")}.jpg`,
          narratorOrAuthor: "ابن عطاء الله السكندري",
          source: "الحِكَم العطائية"
        },
        // Tomorrow's Hadith / Next Hadith
        {
          uid: "feat-hadith-next",
          type: "hadith",
          number: arbaeenData[(todayHadithIndex + 1) % arbaeenData.length].id,
          title: arbaeenData[(todayHadithIndex + 1) % arbaeenData.length].title,
          categoryBadge: "🌟 الحديث التالي",
          subtitle: "الأربعين النووية",
          imageUrl: arbaeenData[(todayHadithIndex + 1) % arbaeenData.length].image,
          narratorOrAuthor: arbaeenData[(todayHadithIndex + 1) % arbaeenData.length].narrator,
          source: arbaeenData[(todayHadithIndex + 1) % arbaeenData.length].source
        },
        // Hadith 1 : Fondement de la religion
        {
          uid: "feat-hadith-1",
          type: "hadith",
          number: 1,
          title: "إنما الأعمال بالنيات",
          categoryBadge: "💎 جوامع الكلم (الأصل الأول)",
          subtitle: "الأربعين النووية",
          imageUrl: "/images/arbaeen/Hadith_01.png",
          narratorOrAuthor: "أمير المؤمنين عمر بن الخطاب",
          source: "رواه البخاري ومسلم"
        }
      ];
      return list;
    } else if (activeMode === "arbaeen") {
      return arbaeenData.map((h) => ({
        uid: `arbaeen-${h.id}`,
        type: "hadith",
        number: h.id,
        title: h.title,
        categoryBadge: `الحديث ${h.id}`,
        subtitle: h.theme,
        imageUrl: h.image,
        narratorOrAuthor: h.narrator,
        source: h.source
      }));
    } else {
      // All hikam (sample of 40 for seamless performance)
      return HIKAM_LIST.slice(0, 40).map((hk) => ({
        uid: `hikam-${hk.number}`,
        type: "hikma",
        number: hk.number,
        title: hk.title || `الحكمة ${hk.number}`,
        categoryBadge: `الحكمة ${hk.number}`,
        subtitle: hk.topic || "الحِكَم العطائية",
        imageUrl: hk.capsule_image_url || `/images/hikam/Hikma_${String(hk.number).padStart(3, "0")}.jpg`,
        narratorOrAuthor: "ابن عطاء الله السكندري",
        source: "الحِكَم العطائية"
      }));
    }
  }, [activeMode, dayOfYear]);

  const total = cards.length;

  // Reset active index when mode changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeMode]);

  // Handlers for next / prev (RTL aware)
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (zoomCard) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNext, handlePrev, zoomCard]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay, handleNext]);

  // Drag/Touch handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = endX - startX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        // Dragged left -> in RTL, next is left
        handleNext();
      } else {
        // Dragged right -> prev
        handlePrev();
      }
    }
  };

  const shareWhatsApp = (card: ShowcaseCard) => {
    const text = `✨ *${card.categoryBadge}* ✨\n\n«${card.title}»\n${card.subtitle} — ${card.source}\n\nطالع اللوحة الشريفة ثلاثية الأبعاد على منصة منهاج الفقير: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="showcase-3d" className="relative pt-2 sm:pt-4 pb-12 lg:pb-16 overflow-hidden bg-gradient-to-b from-transparent via-[#C5A059]/5 to-transparent select-none scroll-mt-20" dir="rtl">
      {/* 3D Stage Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C5A059]/15 dark:bg-[#1B4332]/25 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#9E7B35] dark:text-[#E5C378] text-xs font-semibold mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>معرض اللوحات الشريفة ثلاثي الأبعاد • 3D Circular Stage</span>
          </div>
          <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#143628] dark:text-[#FAF7F2] tracking-tight">
            المَعْرِضُ الدَّائِرِيُّ لِلحِكَمِ وَالأَحَادِيثِ الشَّرِيفَةِ
          </h2>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-white/85 dark:bg-[#12241D]/90 border border-[#E7DFD5] dark:border-[#203A2F] shadow-sm mt-3 gap-1">
            <button
              onClick={() => setActiveMode("featured")}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeMode === "featured"
                  ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                  : "text-[#596B62] dark:text-[#9BB0A5] hover:text-[#1B4332] dark:hover:text-[#FAF7F2]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>مختارات اليوم (حكمة + حديث)</span>
            </button>

            <button
              onClick={() => setActiveMode("arbaeen")}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeMode === "arbaeen"
                  ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                  : "text-[#596B62] dark:text-[#9BB0A5] hover:text-[#1B4332] dark:hover:text-[#FAF7F2]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>الأربعين النووية (42 لوحة)</span>
            </button>

            <button
              onClick={() => setActiveMode("hikam")}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeMode === "hikam"
                  ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                  : "text-[#596B62] dark:text-[#9BB0A5] hover:text-[#1B4332] dark:hover:text-[#FAF7F2]"
              }`}
            >
              <Scroll className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>الحِكَم العطائية المصورة</span>
            </button>
          </div>
        </div>

        {/* 3D Carousel Stage */}
        <div
          ref={containerRef}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[470px] sm:h-[530px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            perspective: "1300px",
            perspectiveOrigin: "50% 48%",
          }}
        >
          {/* Circular Stage Floor Pedestal */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[420px] sm:w-[580px] h-[90px] bg-gradient-to-t from-[#C5A059]/20 via-[#C5A059]/5 to-transparent rounded-[100%] blur-xl pointer-events-none -z-10" />

          {/* Cards Render */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {cards.map((card, idx) => {
              // Calculate circular offset distance (-2, -1, 0, 1, 2)
              let offset = idx - activeIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isCenter = offset === 0;
              const absOffset = Math.abs(offset);

              // Don't render cards that are too far behind in the ring to keep 60fps smoothness
              if (absOffset > 2) return null;

              // 3D Circular Cylinder Transforms
              // In RTL: positive offset = card is to the right
              const rotateY = offset * -34; // curved inwards
              const translateX = offset * 230; // horizontal spacing in pixels
              const translateZ = -absOffset * 150; // depth into screen
              const scale = 1 - absOffset * 0.12;
              const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.78 : 0.45;
              const zIndex = 30 - absOffset * 8;

              return (
                <div
                  key={card.uid}
                  onClick={() => {
                    if (!isCenter) {
                      setActiveIndex(idx);
                    }
                  }}
                  className={`absolute w-[220px] sm:w-[280px] aspect-[4/5] rounded-2xl transition-all duration-500 ease-out select-none ${
                    isCenter
                      ? "ring-2 ring-[#C5A059] shadow-2xl shadow-[#C5A059]/30"
                      : "cursor-pointer hover:opacity-90 shadow-lg"
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Poster Image Container */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-[#12241D] border border-[#E7DFD5]/80 dark:border-[#203A2F]/80">
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 240px, 310px"
                      className="object-contain p-1.5 transition-transform duration-300 hover:scale-[1.02]"
                      priority={isCenter}
                    />

                    {/* Gradient Overlay for side cards to give 3D depth shadows */}
                    {!isCenter && (
                      <div className="absolute inset-0 bg-black/25 dark:bg-black/40 backdrop-blur-[0.5px] rounded-2xl transition-opacity" />
                    )}

                    {/* Top Floating Badge on Active Card */}
                    {isCenter && (
                      <div className="absolute top-3 right-3 left-3 flex items-center justify-between pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143628]/90 text-[#E5C378] text-xs sm:text-xs font-semibold backdrop-blur-md shadow-md border border-[#C5A059]/30">
                          {card.categoryBadge}
                        </span>

                        <span className="w-7 h-7 rounded-full bg-[#C5A059]/90 text-white flex items-center justify-center text-xs font-bold shadow-md">
                          #{card.number}
                        </span>
                      </div>
                    )}

                    {/* Quick Action Overlay on Center Card Hover */}
                    {isCenter && (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomCard(card);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#143628]/95 hover:bg-[#1B4332] text-[#FAF7F2] text-xs font-semibold backdrop-blur-md shadow-md border border-[#C5A059]/30 transition-all hover:scale-105"
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>معاينة مكبرة</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareWhatsApp(card);
                          }}
                          className="w-9 h-9 rounded-xl bg-white/95 dark:bg-[#12241D]/95 hover:bg-[#C5A059]/20 text-[#143628] dark:text-[#E8F0EC] flex items-center justify-center shadow-md border border-[#E7DFD5] dark:border-[#203A2F] transition-all hover:scale-105"
                          title="مشاركة عبر واتساب"
                        >
                          <Share2 className="w-4 h-4 text-[#C5A059]" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reflection Mirror effect below */}
                  {isCenter && (
                    <div
                      className="absolute -bottom-14 left-0 right-0 h-12 rounded-2xl opacity-20 pointer-events-none blur-[1px] overflow-hidden"
                      style={{
                        transform: "scaleY(-1)",
                        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
                        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
                      }}
                    >
                      <Image
                        src={card.imageUrl}
                        alt="reflection"
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows: Right Arrow (Next) & Left Arrow (Prev) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 dark:bg-[#12241D]/90 text-[#143628] dark:text-[#FAF7F2] hover:bg-[#C5A059] hover:text-white flex items-center justify-center shadow-xl border border-[#E7DFD5] dark:border-[#203A2F] z-40 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="التالي"
            title="التالي (سويفون)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 dark:bg-[#12241D]/90 text-[#143628] dark:text-[#FAF7F2] hover:bg-[#C5A059] hover:text-white flex items-center justify-center shadow-xl border border-[#E7DFD5] dark:border-[#203A2F] z-40 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="السابق"
            title="السابق"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Card Meta Footer */}
        {cards[activeIndex] && (
          <div className="max-w-xl mx-auto text-center mt-3 p-4 rounded-2xl bg-white/70 dark:bg-[#12241D]/70 border border-[#E7DFD5]/60 dark:border-[#203A2F]/60 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#9E7B35] dark:text-[#E5C378] mb-1">
              <span>{cards[activeIndex].categoryBadge}</span>
              <span>•</span>
              <span>{cards[activeIndex].narratorOrAuthor}</span>
            </div>
            <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
              « {cards[activeIndex].title} »
            </h3>
            <p className="text-xs text-[#596B62] dark:text-[#9BB0A5]">
              {cards[activeIndex].source}
            </p>

            {/* Indicator Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {cards.slice(0, Math.min(total, 12)).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex % Math.min(total, 12)
                      ? "w-6 bg-[#C5A059]"
                      : "w-1.5 bg-[#E7DFD5] dark:bg-[#203A2F]"
                  }`}
                  aria-label={`شريحة ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal Zoom Fullscreen */}
      {zoomCard && (
        <div
          onClick={() => setZoomCard(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full max-h-[92vh] flex flex-col items-center"
          >
            <button
              onClick={() => setZoomCard(null)}
              className="absolute -top-12 left-0 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#FAF7F2] dark:bg-[#081410]">
              <Image
                src={zoomCard.imageUrl}
                alt={zoomCard.title}
                fill
                className="object-contain p-2"
                priority
              />
            </div>

            <div className="text-center text-white mt-4">
              <h4 className="font-amiri text-xl font-bold text-[#E5C378]">
                {zoomCard.categoryBadge} — « {zoomCard.title} »
              </h4>
              <p className="text-xs text-white/70 mt-1">
                {zoomCard.source} • {zoomCard.narratorOrAuthor}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
