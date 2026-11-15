"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MOROCCAN_CITIES,
  calculateMoroccanPrayerTimes,
  calculateQiblaBearing,
  getNextPrayer,
  type MoroccanCity,
} from "@/lib/prayer-times";
import type { BayanLocale } from "@/lib/bayan-i18n";
import { DICTIONARY } from "@/lib/bayan-i18n";

interface PrayerQiblaCardProps {
  locale: BayanLocale;
}

const STATIC_FALLBACK_DATE = new Date("2026-01-01T12:00:00Z");

export function PrayerQiblaCard({ locale }: PrayerQiblaCardProps) {
  const t = DICTIONARY[locale];
  const isAr = locale === "ar";

  const [selectedCityKey, setSelectedCityKey] = useState<string>("casablanca");
  const [now, setNow] = useState<Date | null>(null);

  // Ticking clock for countdown (deferred to client to keep prerender deterministic)
  useEffect(() => {
    queueMicrotask(() => {
      setNow(new Date());
    });
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const effectiveDate = now ?? STATIC_FALLBACK_DATE;

  const currentCity = useMemo<MoroccanCity>(() => {
    return (
      MOROCCAN_CITIES.find((c) => c.key === selectedCityKey) ||
      MOROCCAN_CITIES[0]
    );
  }, [selectedCityKey]);

  const prayerTimes = useMemo(() => {
    return calculateMoroccanPrayerTimes(effectiveDate, selectedCityKey, 0);
  }, [effectiveDate, selectedCityKey]);

  const nextPrayer = useMemo(() => {
    return getNextPrayer(prayerTimes, effectiveDate, 0);
  }, [prayerTimes, effectiveDate]);

  const qiblaBearing = useMemo(() => {
    return calculateQiblaBearing(currentCity.lat, currentCity.lng);
  }, [currentCity]);

  const prayerList = [
    { key: "fajr", label: t.prayerSection.prayers.fajr, time: prayerTimes.fajr },
    {
      key: "shuruk",
      label: t.prayerSection.prayers.shuruk,
      time: prayerTimes.shuruk,
    },
    { key: "dhuhr", label: t.prayerSection.prayers.dhuhr, time: prayerTimes.dhuhr },
    { key: "asr", label: t.prayerSection.prayers.asr, time: prayerTimes.asr },
    {
      key: "maghrib",
      label: t.prayerSection.prayers.maghrib,
      time: prayerTimes.maghrib,
    },
    { key: "isha", label: t.prayerSection.prayers.isha, time: prayerTimes.isha },
  ];

  return (
    <section
      id="prayer"
      className="p-6 sm:p-8 rounded-xl bg-[#FFFFFF] dark:bg-[#121614] border border-[#EAEAEA] dark:border-[#222624] space-y-6"
    >
      {/* Header & City Selector */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#EAEAEA] dark:border-[#202522] pb-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#787774] dark:text-[#8E9290]">
            {isAr ? "المواقيت والقبلة" : "Prayer Times & Qibla"}
          </span>
          <h2
            className={`text-xl sm:text-2xl font-bold text-[#111111] dark:text-[#FAF7F2] ${
              isAr ? "font-amiri" : "font-serif"
            }`}
          >
            {t.prayerSection.title}
          </h2>
        </div>

        {/* City Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="city-select" className="sr-only">
            {t.prayerSection.selectCity}
          </label>
          <select
            id="city-select"
            value={selectedCityKey}
            onChange={(e) => setSelectedCityKey(e.target.value)}
            className="px-3 py-1.5 rounded-md text-xs font-mono font-semibold bg-[#F7F6F3] dark:bg-[#1A1F1C] border border-[#EAEAEA] dark:border-[#252B27] text-[#111111] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059] cursor-pointer"
          >
            {MOROCCAN_CITIES.map((c) => (
              <option key={c.key} value={c.key}>
                {isAr ? c.name : c.name_en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bento Grid: 2 Columns (Prayer Times List + Qibla Compass Widget) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left / Top: Prayer Times (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          {/* Next Prayer Highlight Banner */}
          <div className="p-4 rounded-lg bg-[#FAF9F7] dark:bg-[#151917] border border-[#EAEAEA] dark:border-[#202522] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#787774] dark:text-[#8E9290] block">
                {t.prayerSection.nextPrayerLabel}
              </span>
              <div
                className={`text-lg font-bold text-[#143628] dark:text-[#E5C378] ${
                  isAr ? "font-amiri" : "font-serif"
                }`}
              >
                {nextPrayer.name}
              </div>
            </div>
            <div className="text-end">
              <span className="font-mono text-xl font-bold text-[#111111] dark:text-[#FAF7F2] block">
                {nextPrayer.time}
              </span>
              <span className="text-[11px] font-mono text-[#346538] dark:text-[#78C380]">
                {nextPrayer.countdown}
              </span>
            </div>
          </div>

          {/* 6 Prayers Minimal Row Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {prayerList.map((p) => {
              const isCurrentNext = nextPrayer.key === p.key;
              return (
                <div
                  key={p.key}
                  className={`p-3 rounded-lg border transition-all ${
                    isCurrentNext
                      ? "bg-[#111111] dark:bg-[#FAF7F2] text-[#FFFFFF] dark:text-[#111111] border-[#111111] dark:border-[#FAF7F2]"
                      : "bg-[#FFFFFF] dark:bg-[#0E1210] border-[#EAEAEA] dark:border-[#1E2320] text-[#2F3437] dark:text-[#D5D8D6]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isAr ? "font-amiri text-sm" : "font-sans"
                      }`}
                    >
                      {p.label}
                    </span>
                    {isCurrentNext && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                    )}
                  </div>
                  <div
                    className="font-mono text-base font-bold mt-1 tracking-tight"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {p.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right / Bottom: Interactive Qibla Compass Widget (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-lg border border-[#EAEAEA] dark:border-[#202522] bg-[#FAF9F7] dark:bg-[#151917] flex flex-col items-center justify-between text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#787774] dark:text-[#8E9290] block">
              {t.prayerSection.qiblaDirection}
            </span>
            <div className="font-mono text-2xl font-bold text-[#111111] dark:text-[#FAF7F2]">
              {qiblaBearing}°
            </div>
            <span className="text-[10px] font-mono text-[#787774] dark:text-[#8E9290] block">
              {t.prayerSection.degreesFromNorth}
            </span>
          </div>

          {/* Compass Visual (SVG) */}
          <div className="relative w-36 h-36 flex items-center justify-center my-1 select-none">
            <svg
              viewBox="0 0 140 140"
              className="w-full h-full text-[#787774] dark:text-[#8E9290]"
              aria-hidden="true"
            >
              {/* Outer dial */}
              <circle
                cx="70"
                cy="70"
                r="64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.4"
              />
              <circle
                cx="70"
                cy="70"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.2"
              />

              {/* Cardinal directions */}
              <text
                x="70"
                y="18"
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
                fill="#C5A059"
              >
                N
              </text>
              <text
                x="126"
                y="73"
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                fill="currentColor"
                opacity="0.6"
              >
                E
              </text>
              <text
                x="70"
                y="130"
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                fill="currentColor"
                opacity="0.6"
              >
                S
              </text>
              <text
                x="14"
                y="73"
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                fill="currentColor"
                opacity="0.6"
              >
                W
              </text>

              {/* Qibla Needle (rotated to qiblaBearing) */}
              <g transform={`rotate(${qiblaBearing} 70 70)`}>
                {/* Pointer to Qibla (Golden arrowhead) */}
                <polygon
                  points="70,22 75,68 70,64 65,68"
                  fill="#C5A059"
                  stroke="#C5A059"
                  strokeWidth="1"
                />
                {/* Tail pointer (opposite) */}
                <polygon
                  points="70,118 74,72 70,76 66,72"
                  fill="#787774"
                  opacity="0.4"
                />
                <circle cx="70" cy="70" r="4" fill="#143628" />
                <circle cx="70" cy="70" r="2" fill="#E5C378" />
              </g>
            </svg>
          </div>

          <p className="text-[10px] font-mono text-[#787774] dark:text-[#8E9290] leading-relaxed">
            {t.prayerSection.compassFaceQibla}
          </p>
        </div>
      </div>
    </section>
  );
}
