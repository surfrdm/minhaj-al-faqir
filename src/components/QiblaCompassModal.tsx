"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Compass,
  MapPin,
  Navigation,
  X,
  Sun,
  Sparkles,
  CheckCircle2,
  RotateCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { MOROCCAN_CITIES } from "@/lib/prayer-times";
import {
  getQiblaInfo,
  calculateSolarAzimuth,
  getSunQiblaRelationText,
} from "@/lib/qibla";

interface QiblaCompassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCityKey?: string;
  onCityChange?: (cityKey: string) => void;
}

// Fixed deterministic initial date for Next.js 16 prerender compatibility
const INITIAL_DATE = new Date("2026-11-05T12:00:00Z");

export function QiblaCompassModal({
  isOpen,
  onClose,
  initialCityKey = "mohammedia",
  onCityChange,
}: QiblaCompassModalProps) {
  const [selectedCityKey, setSelectedCityKey] = useState<string>(initialCityKey);
  const [customCoords, setCustomCoords] = useState<{
    lat: number;
    lng: number;
    label: string;
  } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Live Compass State
  const [compassActive, setCompassActive] = useState(false);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [sensorStatus, setSensorStatus] = useState<
    "idle" | "active" | "unsupported" | "denied"
  >("idle");
  const [nowTime, setNowTime] = useState<Date>(INITIAL_DATE);

  // Sync initialCityKey prop
  useEffect(() => {
    if (initialCityKey) {
      setSelectedCityKey(initialCityKey);
    }
  }, [initialCityKey]);

  // Update solar clock while modal is open
  useEffect(() => {
    if (!isOpen) return;
    setNowTime(new Date());
    const timer = setInterval(() => setNowTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Active coordinates (either custom GPS or chosen Moroccan city)
  const activeLocation = useMemo(() => {
    if (customCoords) {
      return customCoords;
    }
    const city =
      MOROCCAN_CITIES.find((c) => c.key === selectedCityKey) || MOROCCAN_CITIES[0];
    return {
      lat: city.lat,
      lng: city.lng,
      label: city.name,
    };
  }, [customCoords, selectedCityKey]);

  const qiblaInfo = useMemo(
    () => getQiblaInfo(activeLocation.lat, activeLocation.lng),
    [activeLocation]
  );

  const solarInfo = useMemo(
    () => calculateSolarAzimuth(nowTime, activeLocation.lat, activeLocation.lng),
    [nowTime, activeLocation]
  );

  const sunRelationText = useMemo(
    () => getSunQiblaRelationText(qiblaInfo.bearing, solarInfo),
    [qiblaInfo.bearing, solarInfo]
  );

  // Difference between current device heading and Qibla
  const angleDifference = useMemo(() => {
    if (!compassActive) return null;
    let diff = qiblaInfo.bearing - deviceHeading;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return Math.round(diff);
  }, [compassActive, qiblaInfo.bearing, deviceHeading]);

  const isAligned =
    compassActive && angleDifference !== null && Math.abs(angleDifference) <= 5;

  // Device Orientation Handler
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const ev = event as DeviceOrientationEvent & {
      webkitCompassHeading?: number;
      absolute?: boolean;
    };
    let heading: number | null = null;

    if (typeof ev.webkitCompassHeading === "number") {
      // iOS Safari provides direct clockwise degrees from North
      heading = ev.webkitCompassHeading;
    } else if (ev.alpha !== null) {
      // Standard W3C orientation (alpha is counter-clockwise)
      heading = (360 - ev.alpha) % 360;
    }

    if (heading !== null && !isNaN(heading)) {
      setDeviceHeading(Math.round(heading));
      setSensorStatus("active");
    }
  }, []);

  // Cleanup orientation listeners on unmount/close
  useEffect(() => {
    if (!isOpen) {
      setCompassActive(false);
      return;
    }
    if (!compassActive) return;

    const win = window as Window & {
      ondeviceorientationabsolute?: unknown;
    };

    if ("ondeviceorientationabsolute" in win) {
      window.addEventListener(
        "deviceorientationabsolute" as keyof WindowEventMap,
        handleOrientation as EventListener
      );
    }
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      if ("ondeviceorientationabsolute" in win) {
        window.removeEventListener(
          "deviceorientationabsolute" as keyof WindowEventMap,
          handleOrientation as EventListener
        );
      }
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [isOpen, compassActive, handleOrientation]);

  // Trigger Live Compass (handles iOS permission request)
  const activateLiveCompass = async () => {
    setGpsError(null);
    if (typeof window === "undefined") return;

    const DevOrient = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    if (!DevOrient) {
      setSensorStatus("unsupported");
      return;
    }

    try {
      if (typeof DevOrient.requestPermission === "function") {
        const response = await DevOrient.requestPermission();
        if (response === "granted") {
          setCompassActive(true);
          setSensorStatus("active");
        } else {
          setSensorStatus("denied");
        }
      } else {
        setCompassActive(true);
        // If no orientation event fires within 1.5s, keep active or inform desktop users
        setTimeout(() => {
          setSensorStatus((prev) => (prev === "idle" ? "unsupported" : prev));
        }, 1500);
      }
    } catch {
      setSensorStatus("denied");
    }
  };

  // Trigger GPS Geolocation
  const handleUseGPS = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError("المتصفح لا يدعم تحديد الموقع الجغرافي GPS.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCustomCoords({
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
          label: `موقعي الحالي GPS (${pos.coords.latitude.toFixed(2)}° , ${pos.coords.longitude.toFixed(2)}°)`,
        });
        setGpsLoading(false);
      },
      () => {
        setGpsError("تعذر الوصول للموقع الجغرافي. يمكنك اختيار مدينتك من القائمة.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleCitySelect = (cityKey: string) => {
    setCustomCoords(null);
    setSelectedCityKey(cityKey);
    try {
      localStorage.setItem("minhaj_prayer_city", cityKey);
    } catch {
      // ignore
    }
    if (onCityChange) onCityChange(cityKey);
  };

  if (!isOpen) return null;

  // When compass is active, the compass rose rotates by -deviceHeading so North stays aligned with real North
  const dialRotation = compassActive ? -deviceHeading : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] dark:bg-[#07130E] rounded-3xl border-2 border-[#C5A059] shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-[#1D2A24] dark:text-[#E8F0EC]">
        {/* HEADER */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-white flex items-center justify-between border-b-2 border-[#C5A059]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#E5C378] shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#FAF7F2]">
                بَوْصَلَةُ القِبْلَةِ الشَّرِيفَةِ لِلصَّلَاةِ وَالذِّكْرِ
              </h3>
              <p className="text-[11px] sm:text-xs text-[#E5C378] font-ibm">
                تحديد دقيق لسمت الكعبة المشرفة • {activeLocation.label}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition cursor-pointer"
            title="إغلاق نافذة القبلة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Location & GPS Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white dark:bg-[#0E2019] p-3 rounded-2xl border border-[#C5A059]/30 shadow-xs">
            <div className="flex items-center gap-2 flex-1">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
              <select
                value={customCoords ? "gps" : selectedCityKey}
                onChange={(e) => {
                  if (e.target.value !== "gps") handleCitySelect(e.target.value);
                }}
                className="w-full bg-[#FAF7F2] dark:bg-[#122820] border border-[#C5A059]/40 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-amiri font-bold text-[#143628] dark:text-[#FAF7F2] cursor-pointer focus:outline-none focus:border-[#C5A059]"
              >
                {customCoords && (
                  <option value="gps">{customCoords.label}</option>
                )}
                {MOROCCAN_CITIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleUseGPS}
              disabled={gpsLoading}
              className="px-3.5 py-2 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] border border-[#C5A059]/50 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-60"
            >
              {gpsLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
              <span>تحديد موقعي بالـ GPS</span>
            </button>
          </div>

          {gpsError && (
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* MAIN ASTROLABE COMPASS DIAL + STATS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Visual Astrolabe SVG Dial */}
            <div className="md:col-span-6 flex flex-col items-center justify-center">
              <div
                className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isAligned
                    ? "ring-4 ring-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.45)]"
                    : "ring-4 ring-[#C5A059]/40 shadow-xl"
                } bg-gradient-to-b from-[#FFFDF9] to-[#F3ECE0] dark:from-[#0C2118] dark:to-[#07130E]`}
              >
                {/* Fixed Top Pointer (Where user is facing) */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                  <div
                    className={`w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] ${
                      isAligned ? "border-t-emerald-500" : "border-t-[#C5A059]"
                    }`}
                  />
                </div>

                {/* Rotating Compass Plate */}
                <div
                  className="w-full h-full relative transition-transform duration-150 ease-out"
                  style={{ transform: `rotate(${dialRotation}deg)` }}
                >
                  <svg
                    viewBox="0 0 240 240"
                    className="w-full h-full"
                    aria-label="بوصلة القبلة"
                  >
                    {/* Outer Gold & Emerald Rings */}
                    <circle
                      cx="120"
                      cy="120"
                      r="110"
                      fill="none"
                      stroke="#C5A059"
                      strokeWidth="1.5"
                      strokeOpacity="0.6"
                    />
                    <circle
                      cx="120"
                      cy="120"
                      r="96"
                      fill="none"
                      stroke="#143628"
                      strokeWidth="0.75"
                      strokeDasharray="3 3"
                      strokeOpacity="0.35"
                    />
                    <circle
                      cx="120"
                      cy="120"
                      r="65"
                      fill="none"
                      stroke="#C5A059"
                      strokeWidth="0.75"
                      strokeOpacity="0.4"
                    />

                    {/* Degree Ticks every 15 deg */}
                    {Array.from({ length: 24 }).map((_, i) => {
                      const angle = i * 15;
                      const isMajor = angle % 90 === 0;
                      const r1 = isMajor ? 102 : 106;
                      const r2 = 112;
                      const rad = ((angle - 90) * Math.PI) / 180;
                      const x1 = 120 + r1 * Math.cos(rad);
                      const y1 = 120 + r1 * Math.sin(rad);
                      const x2 = 120 + r2 * Math.cos(rad);
                      const y2 = 120 + r2 * Math.sin(rad);
                      return (
                        <line
                          key={angle}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={isMajor ? "#C5A059" : "#826122"}
                          strokeWidth={isMajor ? "2.5" : "1"}
                          strokeOpacity={isMajor ? "0.95" : "0.45"}
                        />
                      );
                    })}

                    {/* Cardinal Letters (Arabic) */}
                    <text
                      x="120"
                      y="24"
                      textAnchor="middle"
                      fill="#C5A059"
                      fontSize="13"
                      fontWeight="bold"
                    >
                      ش
                    </text>
                    <text
                      x="217"
                      y="124"
                      textAnchor="middle"
                      fill="#143628"
                      className="dark:fill-[#FAF7F2]"
                      fontSize="13"
                      fontWeight="bold"
                    >
                      ق
                    </text>
                    <text
                      x="120"
                      y="224"
                      textAnchor="middle"
                      fill="#826122"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      ج
                    </text>
                    <text
                      x="23"
                      y="124"
                      textAnchor="middle"
                      fill="#826122"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      غ
                    </text>

                    {/* Solar Position Dot (if Daylight) */}
                    {solarInfo.isDaylight && (
                      <g
                        transform={`rotate(${solarInfo.azimuth}, 120, 120)`}
                      >
                        <circle
                          cx="120"
                          cy="36"
                          r="6.5"
                          fill="#F59E0B"
                          stroke="#FFF"
                          strokeWidth="1.5"
                        />
                      </g>
                    )}

                    {/* QIBLA NEEDLE & KAABA MARKER */}
                    <g transform={`rotate(${qiblaInfo.bearing}, 120, 120)`}>
                      {/* Glowing Line toward Qibla */}
                      <line
                        x1="120"
                        y1="120"
                        x2="120"
                        y2="34"
                        stroke={isAligned ? "#10B981" : "#C5A059"}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      {/* Counter tail */}
                      <line
                        x1="120"
                        y1="120"
                        x2="120"
                        y2="160"
                        stroke="#143628"
                        strokeOpacity="0.35"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />
                      {/* Arrow Head */}
                      <polygon
                        points="120,22 112,38 128,38"
                        fill={isAligned ? "#10B981" : "#143628"}
                        stroke="#C5A059"
                        strokeWidth="1.5"
                      />
                      {/* Kaaba Mini Icon at tip */}
                      <rect
                        x="112"
                        y="41"
                        width="16"
                        height="16"
                        rx="3"
                        fill="#111827"
                        stroke="#C5A059"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="112"
                        y1="46"
                        x2="128"
                        y2="46"
                        stroke="#FBBF24"
                        strokeWidth="2"
                      />
                    </g>

                    {/* Center Pin */}
                    <circle
                      cx="120"
                      cy="120"
                      r="8"
                      fill="#143628"
                      stroke="#C5A059"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Alignment / Live Sensor Button */}
              <div className="mt-4 w-full flex flex-col items-center gap-2">
                {isAligned ? (
                  <div className="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md animate-pulse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>أَنْتَ مُتَوَجِّهٌ نَحْوَ القِبْلَةِ تَمَاماً ✓</span>
                  </div>
                ) : !compassActive ? (
                  <button
                    onClick={activateLiveCompass}
                    className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#143628] to-[#1B4332] hover:from-[#1B4332] hover:to-[#143628] text-[#E5C378] border border-[#C5A059] text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>تَفْعِيلُ البَوْصَلَةِ الحَيَّةِ (لِلهَاتِفِ)</span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="px-3.5 py-1.5 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/50 text-xs font-bold text-[#143628] dark:text-[#E5C378]">
                      {angleDifference !== null && angleDifference > 0
                        ? `أَدِرِ الهَاتِفَ يَمِيناً بـ ${Math.abs(angleDifference)}° ↻`
                        : angleDifference !== null && angleDifference < 0
                        ? `أَدِرِ الهَاتِفَ يَسَاراً بـ ${Math.abs(angleDifference)}° ↺`
                        : "جَارٍ المَعَايَرَةُ..."}
                    </div>
                    {sensorStatus === "unsupported" && (
                      <span className="text-[11px] text-amber-700 dark:text-amber-300">
                        الحاسوب لا يحتوي على حساس بوصلة مغناطيسي — استعن بزاوية الشرق أو الشمس.
                      </span>
                    )}
                  </div>
                )}

                {/* Manual calibration slider for desktop preview/testing */}
                <div className="w-full max-w-[230px] pt-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-0.5">
                    <span className="flex items-center gap-1">
                      <RotateCw className="w-2.5 h-2.5" /> معايرة الاتجاه يدوياً
                    </span>
                    <span className="font-mono">{deviceHeading}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="359"
                    value={deviceHeading}
                    onChange={(e) => {
                      setCompassActive(true);
                      setDeviceHeading(Number(e.target.value));
                    }}
                    className="w-full accent-[#C5A059] h-1.5 bg-[#C5A059]/20 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Stats & Solar Alignment Guide */}
            <div className="md:col-span-6 space-y-3">
              {/* Bearing Degree Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#52796F] dark:text-[#A1B3A9]">
                    زَاوِيَةُ القِبْلَةِ مِنَ الشَّمَالِ:
                  </span>
                  <span className="font-mono text-2xl font-extrabold text-[#143628] dark:text-[#E5C378]">
                    {qiblaInfo.bearing}°
                  </span>
                </div>
                <div className="text-sm font-amiri font-bold text-[#826122] dark:text-[#E5C378]">
                  الاتِّجَاهُ: {qiblaInfo.cardinalAr} ({qiblaInfo.cardinalFr})
                </div>
                <div className="text-xs text-[#52796F] dark:text-[#9BB0A5] pt-1 border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between">
                  <span>المَسَافَةُ إِلَى الكَعْبَةِ المُشَرَّفَةِ:</span>
                  <span className="font-bold text-[#143628] dark:text-[#FAF7F2]">
                    {qiblaInfo.distanceKm.toLocaleString("en-US")} كم 🕋
                  </span>
                </div>
              </div>

              {/* Sun Alignment Helper (Essential for Laptops & Desktops) */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>الاسْتِدْلَالُ بِمَوْقِعِ الشَّمْسِ الآنَ:</span>
                </div>
                <p className="text-xs text-[#1D2A24] dark:text-[#E8F0EC] leading-relaxed font-ibm">
                  {sunRelationText}
                </p>
              </div>

              {/* Spiritual Note: Qibla in Salat & Hizb */}
              <div className="p-3.5 rounded-2xl bg-[#143628]/5 dark:bg-[#122820] border border-[#C5A059]/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#143628] dark:text-[#E5C378]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>آدَابُ القِبْلَةِ فِي الصَّلَاةِ وَتِلَاوَةِ الحِزْبِ:</span>
                </div>
                <p className="text-[11px] text-[#52796F] dark:text-[#A1B3A9] leading-relaxed font-ibm">
                  • <strong>فِي الصَّلَاةِ:</strong> «فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ» — استقبالُ جهة الكعبة شرطُ صحّةٍ على المذهب المالكي.<br />
                  • <strong>فِي الحِزْبِ وَالذِّكْرِ:</strong> يُستحب للفقير السالك أن يستقبل القبلة أثناء قراءة الحزب الراتب والأوراد لجمع الهمّة وحضور القلب.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3.5 bg-white/80 dark:bg-[#0A1A13] border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between text-xs shrink-0">
          <span className="text-[#52796F] dark:text-[#9BB0A5] font-ibm text-[11px]">
            الإحداثيات المعتمدة: {activeLocation.lat}° N ، {activeLocation.lng}° E
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
