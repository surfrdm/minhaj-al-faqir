"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Sun,
  Moon,
  Infinity as InfinityIcon,
  Minus,
} from "lucide-react";
import { MisbahaIcon } from "@/components/MisbahaIcon";

export type TasbeehMode = "sabahan" | "masaan" | "mutlaq";

interface StepConfig {
  target: number;
  label: string;
}

const MORNING_STEPS: StepConfig[] = [
  { target: 11, label: "11 مَرَّةً" },
  { target: 100, label: "100 مَرَّةً" },
  { target: 645, label: "645 مَرَّةً" },
  { target: 100, label: "100 مَرَّةً" },
  { target: 120, label: "120 مَرَّةً" },
  { target: 50, label: "50 مَرَّةً" },
];

const EVENING_STEPS: StepConfig[] = [
  { target: 11, label: "11 مَرَّةً" },
  { target: 100, label: "100 مَرَّةً" },
  { target: 100, label: "100 مَرَّةً" },
  { target: 120, label: "120 مَرَّةً" },
  { target: 50, label: "50 مَرَّةً" },
];

interface TasbeehModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TasbeehModal({ isOpen, onClose }: TasbeehModalProps) {
  const [mode, setMode] = useState<TasbeehMode>("sabahan");
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [stepCount, setStepCount] = useState<number>(0);
  const [mutlaqCount, setMutlaqCount] = useState<number>(0);
  const [mutlaqTarget, setMutlaqTarget] = useState<number>(5000); // 5000 by default as requested

  // Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [celebrating, setCelebrating] = useState<boolean>(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play synthesized pleasant bell / chime via Web Audio API
  const playChime = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const now = ctx.currentTime;
      // Tone 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.7);

      // Harmonious harmonic
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1174.66, now); // D6
      gain2.gain.setValueAtTime(0.12, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.5);
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  // Subtle tap click sound
  const playClickSound = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  // Trigger Haptic Vibration (Supported on Android Chrome/Firefox/Samsung Internet)
  const triggerHaptic = useCallback(
    (pattern: number | number[]) => {
      if (!vibrationEnabled || typeof window === "undefined") return;
      try {
        if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
          navigator.vibrate(pattern);
        }
      } catch {
        // Ignore
      }
    },
    [vibrationEnabled]
  );

  // Active steps list
  const currentSteps = mode === "sabahan" ? MORNING_STEPS : mode === "masaan" ? EVENING_STEPS : [];
  const activeStep = currentSteps[currentStepIdx] || currentSteps[0];
  const totalSteps = currentSteps.length;

  // Primary Increment Handler (Tap anywhere on the large counter disc)
  const handleIncrement = () => {
    if (mode === "mutlaq") {
      playClickSound();
      triggerHaptic(15);
      const nextVal = mutlaqCount + 1;
      setMutlaqCount(nextVal);
      // Milestone check
      if (mutlaqTarget > 0 && nextVal % mutlaqTarget === 0) {
        playChime();
        triggerHaptic([120, 60, 200]);
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 1200);
      }
      return;
    }

    if (!activeStep) return;

    playClickSound();
    triggerHaptic(15);

    const nextCount = stepCount + 1;

    // Check if current step milestone reached!
    if (nextCount >= activeStep.target) {
      playChime();
      triggerHaptic([120, 60, 200]);
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 1200);

      // Advance to next step or complete sequence
      if (currentStepIdx < totalSteps - 1) {
        setCurrentStepIdx((prev) => prev + 1);
        setStepCount(0);
      } else {
        // Sequence completely finished!
        setStepCount(activeStep.target);
      }
    } else {
      setStepCount(nextCount);
    }
  };

  const handleIncrementRef = useRef(handleIncrement);
  useEffect(() => {
    handleIncrementRef.current = handleIncrement;
  });

  // Decrement Handler (-1)
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === "mutlaq") {
      setMutlaqCount((prev) => Math.max(0, prev - 1));
      triggerHaptic(10);
      return;
    }
    if (stepCount > 0) {
      setStepCount((prev) => prev - 1);
      triggerHaptic(10);
    }
  };

  // Reset current step
  const handleResetCurrent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === "mutlaq") {
      setMutlaqCount(0);
    } else {
      setStepCount(0);
    }
    triggerHaptic(25);
  };

  // Switch Mode
  const handleModeChange = (newMode: TasbeehMode) => {
    setMode(newMode);
    setCurrentStepIdx(0);
    setStepCount(0);
    triggerHaptic(20);
  };

  // Keyboard Space / Enter to increment
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        handleIncrementRef.current();
      } else if (e.code === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentStepTarget = mode === "mutlaq" ? mutlaqTarget : activeStep?.target || 100;
  const currentDisplayCount = mode === "mutlaq" ? mutlaqCount : stepCount;
  const stepPercent = currentStepTarget > 0 ? Math.min(100, Math.round((currentDisplayCount / currentStepTarget) * 100)) : 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      dir="rtl"
    >
      <div className="relative w-full max-w-md bg-[#FAF7F2] dark:bg-[#07130E] border-2 border-[#C5A059] rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* ============================================================== */}
        {/* HEADER: MODE TABS (صباحاً • مساءً • الذكر المطلق) + CONTROLS   */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-5 border-b border-[#E7DFD5] dark:border-[#203D31] bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-white flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378]">
                <MisbahaIcon className="w-5 h-5 text-[#C5A059]" />
              </span>
              <div>
                <h3 className="font-amiri font-bold text-lg sm:text-xl text-[#FAF7F2] leading-none">
                  السُّبْحَةُ الإِلِكْتُرُونِيَّةُ
                </h3>
                <span className="text-[10px] text-[#C5A059] font-mono mt-0.5 block">
                  وِرْدُ الأَوْقَاتِ • رِعَايَةُ الذِّكْرِ بِالاهْتِزَازِ
                </span>
              </div>
            </div>

            {/* Quick Actions (Sound, Vibrate, Close) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                  soundEnabled
                    ? "bg-[#C5A059]/20 text-[#E5C378] border-[#C5A059]/40"
                    : "bg-white/10 text-white/50 border-transparent"
                }`}
                title={soundEnabled ? "كتم الصوت" : "تشغيل الصوت"}
                aria-label={soundEnabled ? "كتم الصوت" : "تشغيل الصوت"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setVibrationEnabled(!vibrationEnabled)}
                className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                  vibrationEnabled
                    ? "bg-[#C5A059]/20 text-[#E5C378] border-[#C5A059]/40"
                    : "bg-white/10 text-white/50 border-transparent"
                }`}
                title={vibrationEnabled ? "تعطيل الاهتزاز" : "تفعيل الاهتزاز في الهاتف"}
                aria-label={vibrationEnabled ? "تعطيل الاهتزاز" : "تفعيل الاهتزاز في الهاتف"}
              >
                <Vibrate className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 transition cursor-pointer"
                title="إغلاق السبحة"
                aria-label="إغلاق السبحة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3 MODE TABS AT THE TOP: صباحاً • مساءً • الذكر المطلق */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/30 border border-[#C5A059]/30 text-xs font-bold text-center">
            <button
              type="button"
              onClick={() => handleModeChange("sabahan")}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "sabahan"
                  ? "bg-[#C5A059] text-[#143628] shadow-md font-extrabold"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>صَبَاحاً</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("masaan")}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "masaan"
                  ? "bg-[#C5A059] text-[#143628] shadow-md font-extrabold"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>مَسَاءً</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("mutlaq")}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "mutlaq"
                  ? "bg-[#C5A059] text-[#143628] shadow-md font-extrabold"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <InfinityIcon className="w-3.5 h-3.5" />
              <span>الذِّكْرُ المُطْلَقُ</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BODY: STEP NAVIGATION & PURE COUNTER DISC                      */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 flex flex-col justify-between">
          {/* Step Sequence Pills (الترتيب: 11 -> 100 -> 645 -> ...) */}
          {mode !== "mutlaq" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#52796F] dark:text-[#A1B3A9]">
                <span className="font-bold flex items-center gap-1">
                  <span>المرحلة {currentStepIdx + 1} من {totalSteps}</span>
                  <span className="text-[#C5A059]">❖</span>
                  <span className="font-mono text-[#143628] dark:text-[#E5C378] font-bold">{activeStep.target} مَرَّةً</span>
                </span>
                <span className="text-[11px] font-ibm text-[#826122] dark:text-[#E5C378]">
                  تنبيه بالاهتزاز عند كل مرحلة
                </span>
              </div>

              {/* Step Sequence Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {currentSteps.map((step, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isCur = idx === currentStepIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentStepIdx(idx);
                        setStepCount(0);
                        triggerHaptic(15);
                      }}
                      className={`flex-1 min-w-[50px] py-1.5 px-2 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                        isCur
                          ? "bg-[#143628] text-[#E5C378] border-[#C5A059] shadow-sm ring-2 ring-[#C5A059]/40"
                          : isDone
                          ? "bg-[#C5A059]/20 text-[#143628] dark:text-[#E5C378] border-[#C5A059]/40"
                          : "bg-white dark:bg-[#12241D] text-gray-500 border-[#E7DFD5] dark:border-[#203D31]"
                      }`}
                    >
                      <span className="font-mono text-xs font-bold">{step.target}</span>
                      <span className="text-[9px] truncate max-w-[55px]">
                        {isDone ? "✓ تم" : isCur ? "جارٍ" : `#${idx + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Mutlaq Target Selector: 5000, 10000, 15000, مفتوح */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#52796F] dark:text-[#A1B3A9]">
                <span className="font-bold">حد التنبيه والاهتزاز:</span>
                <span className="font-mono text-[#C5A059] font-bold">
                  {mutlaqTarget > 0 ? `${mutlaqTarget.toLocaleString()} مَرَّةً` : "مفتوح"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[5000, 10000, 15000, 0].map((tgt) => (
                  <button
                    key={tgt}
                    type="button"
                    onClick={() => {
                      setMutlaqTarget(tgt);
                      triggerHaptic(15);
                    }}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                      mutlaqTarget === tgt
                        ? "bg-[#143628] text-[#E5C378] border-[#C5A059] shadow-sm ring-2 ring-[#C5A059]/30"
                        : "bg-white dark:bg-[#12241D] text-gray-700 dark:text-gray-300 border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
                    }`}
                  >
                    {tgt === 0 ? "مفتوح" : `${tgt.toLocaleString()}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* THE PURE GIANT TOUCH DISC (الدوارة الصافية للتسبيح)             */}
          {/* ============================================================== */}
          <div className="flex flex-col items-center justify-center py-4">
            <button
              type="button"
              onClick={handleIncrement}
              className={`group relative w-64 h-64 sm:w-72 sm:h-72 rounded-full flex flex-col items-center justify-center text-center transition-all duration-150 select-none shadow-2xl active:scale-95 cursor-pointer border-4 ${
                celebrating
                  ? "bg-gradient-to-br from-emerald-600 to-green-700 text-white border-yellow-300 ring-8 ring-emerald-400/50 scale-105 animate-pulse"
                  : "bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0A1E16] text-[#FAF7F2] border-[#C5A059] hover:border-[#E5C378] ring-4 ring-[#C5A059]/25 hover:ring-[#C5A059]/50"
              }`}
              title="اضغط في أي مكان هنا للتسبيح"
              aria-label="اضغط للتسبيح والعد"
            >
              {/* Outer Progress Ring Track */}
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#C5A059]/35 pointer-events-none group-hover:rotate-45 transition-transform duration-700" />

              {/* Progress Percentage Indicator */}
              <span className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider mb-1">
                {mode === "mutlaq"
                  ? mutlaqTarget > 0
                    ? `${stepPercent}% من الهدف`
                    : "تسبيح حر"
                  : `${stepPercent}% من الهدف`}
              </span>

              {/* Main Giant Number */}
              <span
                className="font-mono text-6xl sm:text-7xl font-extrabold tracking-tight text-[#FAF7F2] drop-shadow-md"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {currentDisplayCount}
              </span>

              {/* Target Goal Display */}
              <span className="text-xs text-[#E5C378] font-amiri font-bold mt-2 flex items-center gap-1.5">
                <span>الهدف:</span>
                <span className="font-mono font-bold text-sm">
                  {mode === "mutlaq"
                    ? mutlaqTarget > 0
                      ? mutlaqTarget.toLocaleString()
                      : "مفتوح"
                    : activeStep?.target}
                </span>
              </span>

              <span className="text-[10px] text-white/60 font-ibm mt-2 opacity-80 group-hover:opacity-100 transition">
                اضغط هنا للعد والاهتزاز
              </span>
            </button>
          </div>

          {/* ============================================================== */}
          {/* FOOTER CONTROLS: -1, RESET                                      */}
          {/* ============================================================== */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E7DFD5] dark:border-[#203D31]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={currentDisplayCount <= 0}
                className="p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203D31] bg-white dark:bg-[#12241D] text-gray-700 dark:text-gray-300 hover:border-[#C5A059] disabled:opacity-40 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="إنقاص واحد (-1)"
                aria-label="إنقاص واحد"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>1-</span>
              </button>

              <button
                type="button"
                onClick={handleResetCurrent}
                className="p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203D31] bg-white dark:bg-[#12241D] text-gray-700 dark:text-gray-300 hover:border-[#C5A059] transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="تصفير العداد"
                aria-label="تصفير العداد"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تصفير</span>
              </button>
            </div>

            <span className="text-[11px] text-[#52796F] dark:text-[#A1B3A9] font-mono">
              المسافة / Enter للعد
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
