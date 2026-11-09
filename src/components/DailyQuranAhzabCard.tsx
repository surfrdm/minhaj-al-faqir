"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Sun,
  Sunset,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Compass,
} from "lucide-react";
import {
  getTodayAhzabNumbers,
  getHizbMeta,
  toArabicDigits,
  ALL_AHZAB_INDEX,
  HizbIndexItem,
} from "@/lib/quran";
import { QuranHizbReaderModal } from "@/components/QuranHizbReaderModal";
import { QiblaCompassModal } from "@/components/QiblaCompassModal";

interface DailyQuranAhzabCardProps {
  compact?: boolean;
  showAllHizbsLink?: boolean;
}

export function DailyQuranAhzabCard({
  compact = false,
  showAllHizbsLink = true,
}: DailyQuranAhzabCardProps) {
  const [morningHizb, setMorningHizb] = useState<number>(1);
  const [eveningHizb, setEveningHizb] = useState<number>(2);
  const [isMorningCompleted, setIsMorningCompleted] = useState<boolean>(false);
  const [isEveningCompleted, setIsEveningCompleted] = useState<boolean>(false);
  const [activeReaderHizb, setActiveReaderHizb] = useState<number | null>(null);
  const [readerPeriod, setReaderPeriod] = useState<"subh" | "masa" | "custom">("subh");
  const [showAllDropdown, setShowAllDropdown] = useState<boolean>(false);
  const [showQiblaModal, setShowQiblaModal] = useState<boolean>(false);
  const [savedCity, setSavedCity] = useState<string>("mohammedia");

  // Initialize today's Ahzab and completion status
  const checkStatus = () => {
    if (typeof window === "undefined") return;
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const { morningHizb: mH, eveningHizb: eH } = getTodayAhzabNumbers(today);
    setMorningHizb(mH);
    setEveningHizb(eH);

    try {
      const city = localStorage.getItem("minhaj_prayer_city");
      if (city) setSavedCity(city);

      const savedChecksStr = localStorage.getItem("minhaj_faqir_checks");
      if (savedChecksStr) {
        const savedChecks = JSON.parse(savedChecksStr);
        const dayChecks = savedChecks[todayKey] || {};
        setIsMorningCompleted(Boolean(dayChecks["h1_subh"]));
        setIsEveningCompleted(Boolean(dayChecks["h1_masa"]));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkStatus();

    // Listen to custom event when reader completes a Hizb
    const handleUpdate = () => {
      checkStatus();
    };

    window.addEventListener("faqir-checks-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("faqir-checks-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const openReader = (hNum: number, period: "subh" | "masa") => {
    setActiveReaderHizb(hNum);
    setReaderPeriod(period);
  };

  const toggleCheck = (period: "subh" | "masa") => {
    try {
      const today = new Date();
      const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const savedChecksStr = localStorage.getItem("minhaj_faqir_checks") || "{}";
      const savedChecks = JSON.parse(savedChecksStr);
      if (!savedChecks[todayKey]) savedChecks[todayKey] = {};

      const key = period === "subh" ? "h1_subh" : "h1_masa";
      const current = Boolean(savedChecks[todayKey][key]);
      savedChecks[todayKey][key] = !current;

      localStorage.setItem("minhaj_faqir_checks", JSON.stringify(savedChecks));

      if (period === "subh") setIsMorningCompleted(!current);
      else setIsEveningCompleted(!current);

      window.dispatchEvent(
        new CustomEvent("faqir-checks-updated", {
          detail: { dateKey: todayKey, period, checked: !current },
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  const morningMeta = getHizbMeta(morningHizb);
  const eveningMeta = getHizbMeta(eveningHizb);

  if (compact) {
    return (
      <>
        <div className="flex flex-wrap items-center gap-2" dir="rtl">
          {/* Morning Hizb Button */}
          <button
            onClick={() => openReader(morningHizb, "subh")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              isMorningCompleted
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                : "bg-white/80 dark:bg-[#143628] border-[#C5A059]/40 text-[#143628] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15"
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>حِزْبُ الصَّبَاحِ ({toArabicDigits(morningHizb)})</span>
            {isMorningCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
            )}
          </button>

          {/* Evening Hizb Button */}
          <button
            onClick={() => openReader(eveningHizb, "masa")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              isEveningCompleted
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                : "bg-white/80 dark:bg-[#143628] border-[#C5A059]/40 text-[#143628] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15"
            }`}
          >
            <Sunset className="w-3.5 h-3.5 text-orange-500" />
            <span>حِزْبُ المَسَاءِ ({toArabicDigits(eveningHizb)})</span>
            {isEveningCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
            )}
          </button>
        </div>

        {/* Modal Reader */}
        {activeReaderHizb && (
          <QuranHizbReaderModal
            isOpen={true}
            onClose={() => setActiveReaderHizb(null)}
            hizbNumber={activeReaderHizb}
            hizbPeriod={readerPeriod}
            onCompleted={() => checkStatus()}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E2019] border-2 border-[#C5A059]/40 shadow-md space-y-4 text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E7DFD5] dark:border-[#203D31]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#143628] text-[#C5A059] flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                  حِزْبَا القُرْآنِ الكَرِيمِ لِليَوْمِ
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378] text-[11px] font-bold">
                  سلكة الراتب المغربي
                </span>
              </div>
              <p className="text-xs text-[#52796F] dark:text-[#9BB0A5] font-ibm">
                المصحف المحمدي الشريف برواية ورش عن نافع (حزبان كل يوم لختم 60 حزباً في الشهر)
              </p>
            </div>
          </div>

          {/* Quick Actions: Qibla Compass & All Ahzab Link */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowQiblaModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] border border-[#C5A059]/60 text-xs font-bold transition shadow-xs cursor-pointer"
              title="تحديد اتجاه القبلة الشريفة للصلاة وقراءة الحزب"
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>اتِّجَاهُ القِبْلَةِ لِلصَّلَاةِ</span>
            </button>

            {showAllHizbsLink && (
              <Link
                href="/quran"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1B4332] border border-[#C5A059]/30 text-xs font-bold text-[#143628] dark:text-[#FAF7F2] hover:bg-[#C5A059]/15 transition"
              >
                <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>فهرس الـ 60 حزباً</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Cards Grid: Subh & Masa' */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. MORNING HIZB */}
          <div
            className={`p-4 rounded-2xl border transition-all space-y-3 ${
              isMorningCompleted
                ? "bg-emerald-500/10 border-emerald-500/40"
                : "bg-[#FAF7F2] dark:bg-[#122820] border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    وِرْدُ الصَّبَاحِ (بَعْدَ الفَجْرِ)
                  </span>
                  <h4 className="font-amiri text-base sm:text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                    الحِزْبُ {toArabicDigits(morningHizb)}: {morningMeta.surahs.slice(0, 2).join("، ")}
                  </h4>
                </div>
              </div>

              {/* Checkbox */}
              <button
                onClick={() => toggleCheck("subh")}
                className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer"
                title={isMorningCompleted ? "إلغاء التأشير" : "تأشير الحزب كمقروء"}
              >
                {isMorningCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                )}
              </button>
            </div>

            <p className="text-xs text-[#52796F] dark:text-[#9BB0A5] font-ibm line-clamp-1">
              مَطْلَعُ الحِزْبِ: «{morningMeta.matlaa}»
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-500 font-ibm">
                {toArabicDigits(morningMeta.page_count)} صفحات (من ص {toArabicDigits(morningMeta.start_page)} إلى {toArabicDigits(morningMeta.end_page)})
              </span>

              <button
                onClick={() => openReader(morningHizb, "subh")}
                className="px-3.5 py-1.5 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>اقْرَأْ حِزْبَ الصَّبَاحِ</span>
              </button>
            </div>
          </div>

          {/* 2. EVENING HIZB */}
          <div
            className={`p-4 rounded-2xl border transition-all space-y-3 ${
              isEveningCompleted
                ? "bg-emerald-500/10 border-emerald-500/40"
                : "bg-[#FAF7F2] dark:bg-[#122820] border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Sunset className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                    وِرْدُ المَسَاءِ (بَعْدَ المَغْرِبِ)
                  </span>
                  <h4 className="font-amiri text-base sm:text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                    الحِزْبُ {toArabicDigits(eveningHizb)}: {eveningMeta.surahs.slice(0, 2).join("، ")}
                  </h4>
                </div>
              </div>

              {/* Checkbox */}
              <button
                onClick={() => toggleCheck("masa")}
                className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer"
                title={isEveningCompleted ? "إلغاء التأشير" : "تأشير الحزب كمقروء"}
              >
                {isEveningCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                )}
              </button>
            </div>

            <p className="text-xs text-[#52796F] dark:text-[#9BB0A5] font-ibm line-clamp-1">
              مَطْلَعُ الحِزْبِ: «{eveningMeta.matlaa}»
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-500 font-ibm">
                {toArabicDigits(eveningMeta.page_count)} صفحات (من ص {toArabicDigits(eveningMeta.start_page)} إلى {toArabicDigits(eveningMeta.end_page)})
              </span>

              <button
                onClick={() => openReader(eveningHizb, "masa")}
                className="px-3.5 py-1.5 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>اقْرَأْ حِزْبَ المَسَاءِ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Modal */}
      {activeReaderHizb && (
        <QuranHizbReaderModal
          isOpen={true}
          onClose={() => setActiveReaderHizb(null)}
          hizbNumber={activeReaderHizb}
          hizbPeriod={readerPeriod}
          onCompleted={() => checkStatus()}
        />
      )}

      {/* Qibla Compass Modal */}
      <QiblaCompassModal
        isOpen={showQiblaModal}
        onClose={() => setShowQiblaModal(false)}
        initialCityKey={savedCity}
        onCityChange={(cityKey) => setSavedCity(cityKey)}
      />
    </>
  );
}
