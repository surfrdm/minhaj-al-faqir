"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  MapPin,
  ChevronDown,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Compass,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  calculateMoroccanPrayerTimes,
  getNextPrayer,
  MOROCCAN_CITIES,
  PrayerTimesResult,
  NextPrayerInfo,
} from "@/lib/prayer-times";
import { getDailyHizbRatib, DailyHizbRatibResult, HizbInfo } from "@/lib/hizb-ratib";
import { getDualDate, DualDateInfo } from "@/lib/hijri-calendar";
import { QuranHizbReaderModal } from "@/components/QuranHizbReaderModal";

// Fixed initial date for deterministic SSG / Next.js prerender
const INITIAL_DATE = new Date("2026-11-05T12:00:00Z");

export function SpiritualHeaderBar() {
  const [selectedCity, setSelectedCity] = useState<string>("mohammedia");
  const [isShortMonth, setIsShortMonth] = useState<boolean>(false);
  const [showHizbModal, setShowHizbModal] = useState<boolean>(false);
  const [showCityMenu, setShowCityMenu] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(INITIAL_DATE);
  const [readerHizbNumber, setReaderHizbNumber] = useState<number | null>(null);
  const [readerPeriod, setReaderPeriod] = useState<"subh" | "masa" | "custom">("subh");

  // Update clock on mount and every minute
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Persistent settings from localStorage
  useEffect(() => {
    try {
      const savedCity = localStorage.getItem("minhaj_prayer_city");
      if (savedCity) setSelectedCity(savedCity);

      const savedShort = localStorage.getItem("minhaj_hijri_short_month");
      if (savedShort) setIsShortMonth(savedShort === "true");
    } catch (e) {}
  }, []);

  const handleCityChange = (cityKey: string) => {
    setSelectedCity(cityKey);
    setShowCityMenu(false);
    try {
      localStorage.setItem("minhaj_prayer_city", cityKey);
    } catch (e) {}
  };

  const handleShortMonthToggle = () => {
    const newVal = !isShortMonth;
    setIsShortMonth(newVal);
    try {
      localStorage.setItem("minhaj_hijri_short_month", String(newVal));
    } catch (e) {}
  };

  // Calculations: Authentic Moroccan official sighting and mosque timing (GMT)
  const dateInfo: DualDateInfo = useMemo(() => {
    return getDualDate(currentTime);
  }, [currentTime]);

  const hizbRatib: DailyHizbRatibResult = useMemo(() => {
    return getDailyHizbRatib(dateInfo.hijri.day, isShortMonth);
  }, [dateInfo.hijri.day, isShortMonth]);

  const prayerTimes: PrayerTimesResult = useMemo(() => {
    // 0 = GMT standard timing as used in Moroccan Mosques & Adhan (Dhuhr at 12:13)
    return calculateMoroccanPrayerTimes(currentTime, selectedCity, 0);
  }, [currentTime, selectedCity]);

  const nextPrayer: NextPrayerInfo = useMemo(() => {
    return getNextPrayer(prayerTimes, currentTime, 0);
  }, [prayerTimes, currentTime]);

  return (
    <div
      id="spiritual-header-bar"
      className="w-full bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6] dark:from-[#0B1914] dark:to-[#07130E] border-b border-[#E7DFD5] dark:border-[#1E3B2E] transition-colors"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        {/* ROW 1: Dual Dates & Moroccan Mosque Hizb Ratib */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          {/* Right: Dual Dates (Hijri & Gregorian) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white/80 dark:bg-[#122820] p-2.5 rounded-2xl border border-[#C5A059]/30 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center shrink-0">
              <CalendarIcon className="w-4 h-4" />
            </div>

            <div className="space-y-0.5">
              {/* Hijri Date */}
              <div className="flex items-center gap-2">
                <span className="font-amiri text-sm sm:text-base font-bold text-[#143628] dark:text-[#E5C378]">
                  {dateInfo.hijri.fullFormatted}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378]">
                  رؤية المغرب
                </span>
              </div>

              {/* Gregorian Date */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#52796F] dark:text-[#A1B3A9]">
                <span>{dateInfo.gregorian.fullFormatted}</span>
                <span className="text-gray-400">•</span>
                <span className="font-mono text-gray-500">
                  {String(currentTime.getHours()).padStart(2, "0")}:
                  {String(currentTime.getMinutes()).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Left: Moroccan Mosque & Zaouia Daily Hizb Ratib (حزبا اليوم الراتب) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-gradient-to-r from-emerald-950/10 via-[#C5A059]/10 to-transparent dark:from-[#122820] dark:to-[#0B1914] p-2.5 rounded-2xl border border-[#C5A059]/40 shadow-sm flex-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#143628] text-[#C5A059] flex items-center justify-center shrink-0 shadow-sm">
                <BookOpen className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#826122] dark:text-[#E5C378] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    حِزْبَا الرَّاتِبِ المَغْرِبِيِّ لِيَوْمِ {dateInfo.hijri.dayOfWeek}:
                  </span>
                  {hizbRatib.isKhatmaDay && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                      ✨ سلكة الختم المبارك
                    </span>
                  )}
                </div>

                {/* Hizbs summary */}
                <div className="font-amiri text-xs sm:text-sm font-bold text-[#143628] dark:text-[#FAF7F2] flex flex-wrap items-center gap-2 mt-0.5">
                  {hizbRatib.morningHizbs.map((h) => (
                    <button
                      key={`subh-${h.number}`}
                      onClick={() => {
                        setReaderHizbNumber(h.number);
                        setReaderPeriod("subh");
                      }}
                      className="bg-white/90 dark:bg-[#1B4332] hover:bg-[#C5A059]/20 px-2.5 py-1 rounded-xl border border-[#C5A059]/40 flex items-center gap-1.5 transition cursor-pointer text-xs"
                      title="فتح حزب الصباح في المصحف الشريف"
                    >
                      <span>🌅 الصباح: {h.name} ({h.number})</span>
                      <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                    </button>
                  ))}
                  {hizbRatib.eveningHizbs.map((h) => (
                    <button
                      key={`masa-${h.number}`}
                      onClick={() => {
                        setReaderHizbNumber(h.number);
                        setReaderPeriod("masa");
                      }}
                      className="bg-white/90 dark:bg-[#1B4332] hover:bg-[#C5A059]/20 px-2.5 py-1 rounded-xl border border-[#C5A059]/40 flex items-center gap-1.5 transition cursor-pointer text-xs"
                      title="فتح حزب المساء في المصحف الشريف"
                    >
                      <span>🌇 المساء: {h.name} ({h.number})</span>
                      <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mr-auto">
              {/* Short / Full Month Toggle (29 vs 30 days) */}
              <button
                onClick={handleShortMonthToggle}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                  isShortMonth
                    ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200"
                    : "bg-white/60 dark:bg-[#07130E] text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-[#C5A059]"
                }`}
                title="تحديد ما إذا كان الشهر الهجري الحالي 29 يوماً لمضاعفة القراءة في يوم 29 لختم السلكة"
              >
                {isShortMonth ? "الشهر ناقص (29 يوماً)" : "الشهر تام (30 يوماً)"}
              </button>

              {/* View details button */}
              <button
                onClick={() => setShowHizbModal(true)}
                className="px-2.5 py-1 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-[#143628] font-bold text-[11px] transition cursor-pointer shadow-sm flex items-center gap-1"
              >
                <span>مطلع الحزبين</span>
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Prayer Times Bar across Moroccan Zaouias & Mosques */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-white dark:bg-[#0E2019] p-2.5 sm:px-4 rounded-2xl border border-[#E7DFD5] dark:border-[#203D31] shadow-sm">
          {/* City Selector & Next Prayer Countdown */}
          <div className="flex items-center justify-between md:justify-start gap-3 border-b md:border-b-0 pb-2 md:pb-0 border-[#E7DFD5] dark:border-[#203D31]">
            <div className="relative">
              <button
                onClick={() => setShowCityMenu(!showCityMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E5C378] transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{prayerTimes.cityName}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {/* City Dropdown Menu */}
              {showCityMenu && (
                <div className="absolute top-full right-0 mt-1.5 w-52 bg-white dark:bg-[#122820] rounded-2xl shadow-2xl border border-[#C5A059]/40 p-1.5 z-40 space-y-1">
                  <div className="px-2 py-1 text-[10px] text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                    اختر المدينة / الزاوية:
                  </div>
                  {MOROCCAN_CITIES.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => handleCityChange(c.key)}
                      className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                        selectedCity === c.key
                          ? "bg-[#C5A059]/20 text-[#143628] dark:text-[#E5C378] font-bold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-[#C5A059]/10"
                      }`}
                    >
                      <span>{c.name}</span>
                      {selectedCity === c.key && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mosque Timing Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 text-[#143628] dark:text-[#E5C378]">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>توقيت المساجد والزوايا بالمغرب</span>
            </span>

            {/* Next Prayer Countdown Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>
                الصلاة القادمة: {nextPrayer.name} ({nextPrayer.time}) •{" "}
                <span className="text-[#826122] dark:text-[#E5C378]">
                  {nextPrayer.countdown}
                </span>
              </span>
            </div>
          </div>

          {/* The Six Timings */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 flex-1 md:max-w-xl md:mr-4">
            {/* Fajr */}
            <div
              className={`p-1.5 rounded-xl text-center border transition ${
                nextPrayer.key === "fajr"
                  ? "bg-[#C5A059]/20 border-[#C5A059] shadow-sm"
                  : "bg-[#FAF7F2] dark:bg-[#07130E] border-[#E7DFD5] dark:border-[#203D31]"
              }`}
            >
              <div className="text-[10px] text-gray-500 font-bold flex items-center justify-center gap-1">
                <Sunrise className="w-2.5 h-2.5 text-[#C5A059]" />
                <span>الفجر</span>
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-[#143628] dark:text-[#FAF7F2]">
                {prayerTimes.fajr}
              </div>
            </div>

            {/* Shuruk */}
            <div
              className={`p-1.5 rounded-xl text-center border transition ${
                nextPrayer.key === "shuruk"
                  ? "bg-[#C5A059]/20 border-[#C5A059] shadow-sm"
                  : "bg-[#FAF7F2] dark:bg-[#07130E] border-[#E7DFD5] dark:border-[#203D31]"
              }`}
            >
              <div className="text-[10px] text-gray-500 font-bold flex items-center justify-center gap-1">
                <Sun className="w-2.5 h-2.5 text-amber-500" />
                <span>الشروق</span>
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-[#143628] dark:text-[#FAF7F2]">
                {prayerTimes.shuruk}
              </div>
            </div>

            {/* Dhuhr */}
            <div
              className={`p-1.5 rounded-xl text-center border transition ${
                nextPrayer.key === "dhuhr"
                  ? "bg-[#C5A059]/20 border-[#C5A059] shadow-sm"
                  : "bg-[#FAF7F2] dark:bg-[#07130E] border-[#E7DFD5] dark:border-[#203D31]"
              }`}
            >
              <div className="text-[10px] text-gray-500 font-bold flex items-center justify-center gap-1">
                <Sun className="w-2.5 h-2.5 text-yellow-500" />
                <span>الظهر</span>
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-[#143628] dark:text-[#FAF7F2]">
                {prayerTimes.dhuhr}
              </div>
            </div>

            {/* Asr */}
            <div
              className={`p-1.5 rounded-xl text-center border transition ${
                nextPrayer.key === "asr"
                  ? "bg-[#C5A059]/20 border-[#C5A059] shadow-sm"
                  : "bg-[#FAF7F2] dark:bg-[#07130E] border-[#E7DFD5] dark:border-[#203D31]"
              }`}
            >
              <div className="text-[10px] text-gray-500 font-bold flex items-center justify-center gap-1">
                <Sun className="w-2.5 h-2.5 text-orange-400" />
                <span>العصر</span>
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-[#143628] dark:text-[#FAF7F2]">
                {prayerTimes.asr}
              </div>
            </div>

            {/* Maghrib */}
            <div
              className={`p-1.5 rounded-xl text-center border transition ${
                nextPrayer.key === "maghrib"
                  ? "bg-[#C5A059]/20 border-[#C5A059] shadow-sm"
                  : "bg-[#FAF7F2] dark:bg-[#07130E] border-[#E7DFD5] dark:border-[#203D31]"
              }`}
            >
              <div className="text-[10px] text-gray-500 font-bold flex items-center justify-center gap-1">
                <Sunset className="w-2.5 h-2.5 text-rose-500" />
                <span>المغرب</span>
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-[#143628] dark:text-[#FAF7F2]">
                {prayerTimes.maghrib}
              </div>
            </div>

            {/* Isha */}
            <div
              className={`p-1.5 rounded-xl text-center border transition ${
                nextPrayer.key === "isha"
                  ? "bg-[#C5A059]/20 border-[#C5A059] shadow-sm"
                  : "bg-[#FAF7F2] dark:bg-[#07130E] border-[#E7DFD5] dark:border-[#203D31]"
              }`}
            >
              <div className="text-[10px] text-gray-500 font-bold flex items-center justify-center gap-1">
                <Moon className="w-2.5 h-2.5 text-indigo-400" />
                <span>العشاء</span>
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-[#143628] dark:text-[#FAF7F2]">
                {prayerTimes.isha}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Full Moroccan Daily Hizb Ratib Details */}
      {showHizbModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="relative w-full max-w-2xl bg-[#FAF7F2] dark:bg-[#0B1914] rounded-3xl border-2 border-[#C5A059] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-white flex items-center justify-between border-b border-[#C5A059]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#FAF7F2]">
                    الحِزْبُ الرَّاتِبُ المَغْرِبِيُّ • {dateInfo.hijri.dayOfWeek}{" "}
                    {dateInfo.hijri.day} {dateInfo.hijri.monthName}
                  </h3>
                  <p className="text-[11px] text-[#E5C378]">
                    سُنَّة السلكة القرآنية الراتبة بالمساجد والزوايا المغربية
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHizbModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              <div className="p-3.5 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs text-[#826122] dark:text-[#E5C378] leading-relaxed">
                <p className="font-semibold">{hizbRatib.explanation}</p>
              </div>

              {/* Morning Hizbs */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#143628] dark:text-[#E5C378] pb-1 border-b border-gray-200 dark:border-gray-800">
                  <Sunrise className="w-4 h-4 text-[#C5A059]" />
                  <span>حِزْبُ الصَّبَاحِ (يُتلى جماعة بعد صلاة الفجر):</span>
                </div>

                <div className="space-y-2.5">
                  {hizbRatib.morningHizbs.map((hizb) => (
                    <div
                      key={hizb.number}
                      className="p-4 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-amiri font-bold text-base text-[#143628] dark:text-[#FAF7F2]">
                          {hizb.name} (رقم {hizb.number})
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#826122] dark:text-[#E5C378] bg-[#C5A059]/15 px-2.5 py-0.5 rounded-full">
                            {hizb.surahs}
                          </span>
                          <button
                            onClick={() => {
                              setShowHizbModal(false);
                              setReaderHizbNumber(hizb.number);
                              setReaderPeriod("subh");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>اقرأ الحزب بالمصحف</span>
                          </button>
                        </div>
                      </div>
                      <p className="font-amiri text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed bg-[#FAF7F2] dark:bg-[#07130E] p-3 rounded-xl border border-[#C5A059]/20">
                        « {hizb.opening} »
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evening Hizbs */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#143628] dark:text-[#E5C378] pb-1 border-b border-gray-200 dark:border-gray-800">
                  <Sunset className="w-4 h-4 text-[#C5A059]" />
                  <span>حِزْبُ المَسَاءِ (يُتلى جماعة بين صلاتي المغرب والعشاء):</span>
                </div>

                <div className="space-y-2.5">
                  {hizbRatib.eveningHizbs.map((hizb) => (
                    <div
                      key={hizb.number}
                      className="p-4 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-amiri font-bold text-base text-[#143628] dark:text-[#FAF7F2]">
                          {hizb.name} (رقم {hizb.number})
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#826122] dark:text-[#E5C378] bg-[#C5A059]/15 px-2.5 py-0.5 rounded-full">
                            {hizb.surahs}
                          </span>
                          <button
                            onClick={() => {
                              setShowHizbModal(false);
                              setReaderHizbNumber(hizb.number);
                              setReaderPeriod("masa");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>اقرأ الحزب بالمصحف</span>
                          </button>
                        </div>
                      </div>
                      <p className="font-amiri text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed bg-[#FAF7F2] dark:bg-[#07130E] p-3 rounded-xl border border-[#C5A059]/20">
                        « {hizb.opening} »
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Khatma note */}
              {hizbRatib.isKhatmaDay && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-sm">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>دعاء ختم القرآن الكريم (السلكة المغربية):</span>
                  </div>
                  <p className="leading-relaxed">
                    «اللَّهُمَّ ارْحَمْنَا بِالقُرْآنِ، وَاجْعَلْهُ لَنَا إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنَا مِنْهُ مَا نَسِينَا، وَعَلِّمْنَا مِنْهُ مَا جَهِلْنَا، وَارْزُقْنَا تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لَنَا حُجَّةً يَا رَبَّ العَالَمِينَ».
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white/50 dark:bg-[#07130E] border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between">
              <span className="text-[11px] text-gray-500">
                قراءة برواية ورش عن نافع من طريق الأزرق
              </span>
              <button
                onClick={() => setShowHizbModal(false)}
                className="px-4 py-2 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-white text-xs font-bold transition cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quran Hizb Reader Modal */}
      {readerHizbNumber && (
        <QuranHizbReaderModal
          isOpen={true}
          onClose={() => setReaderHizbNumber(null)}
          hizbNumber={readerHizbNumber}
          hizbPeriod={readerPeriod}
        />
      )}
    </div>
  );
}
