"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  Headphones,
  Loader2,
  Lock,
  Pause,
  Play,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";
import { audioBus, pickPreferredSpeechVoice } from "@/lib/audio-bus";
import {
  estimateGeminiTtsCost,
  GEMINI_TTS_VOICES,
  DEFAULT_GEMINI_VOICE,
  sanitizeTextForSpeech,
  sliceTextForPreview,
  type TtsVoiceId,
} from "@/lib/tts-utils";
import {
  openMemberPortal,
  setStoredMemberSession,
  useMemberSession,
} from "@/lib/member-session";

export interface DualAudioReaderBarProps {
  text: string;
  title?: string;
  lang?: "ar" | "fr" | "en";
  variant?: "bar" | "compact";
  defaultPreviewOnly?: boolean;
  preRecordedSrc?: string;
  preRecordedLabel?: string;
  className?: string;
}

type ActiveEngine = "prerecorded" | "free" | "gemini" | null;
type PlaybackStatus = "idle" | "loading" | "playing" | "paused";

interface GeminiErrorState {
  code?: string;
  message: string;
}

export interface InlineSpeakerButtonProps {
  text: string;
  title?: string;
  lang?: "ar" | "fr" | "en";
  preRecordedSrc?: string;
  ariaLabel?: string;
  size?: "sm" | "md";
  className?: string;
  onNotice?: (message: string | null) => void;
}

export function InlineSpeakerButton({
  text,
  title,
  lang = "ar",
  preRecordedSrc,
  ariaLabel = "استماع سريع لهذا المقطع",
  size = "sm",
  className = "",
  onNotice,
}: InlineSpeakerButtonProps) {
  const instanceId = useId();
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const modeRef = useRef<"mp3" | "speech" | null>(null);

  const stopLocally = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {
        // Ignore
      }
      audioRef.current = null;
    }
    modeRef.current = null;
    setStatus("idle");
  };

  useEffect(() => {
    return () => {
      audioBus.release(instanceId);
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {
          // Ignore
        }
        audioRef.current = null;
      }
    };
  }, [instanceId]);

  const cleanText = sanitizeTextForSpeech(text);
  if (!cleanText && !preRecordedSrc) return null;

  const speechPayload = title
    ? `${sanitizeTextForSpeech(title)}. ${cleanText}`
    : cleanText;

  const startSpeechFallback = (fallbackMsg?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onNotice?.("المتصفح الحالي لا يدعم القراءة الصوتية المدمجة.");
      return;
    }
    stopLocally();
    audioBus.claim(instanceId, stopLocally);

    const utterance = new SpeechSynthesisUtterance(speechPayload);
    utterance.lang = lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "ar-SA";
    utterance.rate = 0.96;
    utterance.pitch = 1.0;

    const chosenVoice = pickPreferredSpeechVoice(lang);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang;
    }

    utterance.onend = () => {
      audioBus.release(instanceId);
      stopLocally();
    };
    utterance.onerror = () => {
      audioBus.release(instanceId);
      stopLocally();
    };

    modeRef.current = "speech";
    setStatus("playing");
    if (fallbackMsg) onNotice?.(fallbackMsg);
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      audioBus.release(instanceId);
      stopLocally();
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (status === "playing") {
      if (modeRef.current === "mp3" && audioRef.current) {
        audioRef.current.pause();
        setStatus("paused");
        return;
      }
      if (modeRef.current === "speech" && typeof window !== "undefined") {
        try {
          window.speechSynthesis.pause();
          setStatus("paused");
          return;
        } catch {
          audioBus.release(instanceId);
          stopLocally();
          return;
        }
      }
    }

    if (status === "paused") {
      if (modeRef.current === "mp3" && audioRef.current) {
        await audioRef.current.play();
        setStatus("playing");
        return;
      }
      if (modeRef.current === "speech" && typeof window !== "undefined") {
        try {
          window.speechSynthesis.resume();
          setStatus("playing");
          return;
        } catch {
          audioBus.release(instanceId);
          stopLocally();
        }
      }
    }

    onNotice?.(null);

    if (preRecordedSrc) {
      setStatus("loading");
      try {
        const probe = await fetch(preRecordedSrc, { method: "HEAD" });
        if (probe.ok) {
          stopLocally();
          audioBus.claim(instanceId, stopLocally);
          const audio = new Audio(preRecordedSrc);
          audioRef.current = audio;
          audioBus.registerHtmlAudio(audio);
          modeRef.current = "mp3";

          audio.onended = () => {
            audioBus.release(instanceId);
            stopLocally();
          };
          audio.onerror = () => {
            startSpeechFallback(
              "تعذر تشغيل ملف MP3 المسجل؛ تم التحويل للقراءة الفورية."
            );
          };

          setStatus("playing");
          await audio.play();
          onNotice?.("يشتغل الآن المقطع الصوتي المسجل مسبقاً (0$)");
          return;
        }
      } catch {
        // Fallback smoothly below
      }
      startSpeechFallback(
        "ملف Gemini MP3 المسجل غير مولّد بعد (مفتاح API وصل 402) — يشتغل الآن بالصوت الفوري مؤقتاً."
      );
      return;
    }

    startSpeechFallback();
  };

  const dimClass = size === "md" ? "w-8 h-8" : "w-7 h-7";
  const iconClass = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";

  return (
    <button
      type="button"
      onClick={(e) => void handleToggle(e)}
      aria-label={ariaLabel}
      aria-pressed={status === "playing"}
      title={
        preRecordedSrc
          ? "استماع للمقطع الصوتي المسجل (اضغط للتشغيل أو الإيقاف)"
          : "استماع سريع لهذا المقطع"
      }
      className={`inline-flex items-center justify-center rounded-full border shrink-0 transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] cursor-pointer ${dimClass} ${
        status === "playing"
          ? "bg-[#143628] text-[#E5C378] border-[#C5A059] shadow-xs"
          : status === "paused"
            ? "bg-[#C5A059]/25 text-[#143628] dark:text-[#FAF7F2] border-[#C5A059]"
            : "bg-[#FAF7F2] dark:bg-[#0D2119] text-[#143628] dark:text-[#E5C378] border-[#C5A059]/45 hover:bg-[#C5A059]/15 hover:border-[#C5A059]"
      } ${className}`}
    >
      {status === "loading" ? (
        <Loader2 className={`${iconClass} animate-spin`} />
      ) : status === "playing" ? (
        <Pause className={iconClass} />
      ) : status === "paused" ? (
        <Play className={iconClass} />
      ) : (
        <Volume2 className={iconClass} />
      )}
    </button>
  );
}

export function DualAudioReaderBar({
  text,
  title,
  lang = "ar",
  variant = "bar",
  defaultPreviewOnly = true,
  preRecordedSrc,
  preRecordedLabel = "مقطع مسجل مسبقاً",
  className = "",
}: DualAudioReaderBarProps) {
  const instanceId = useId();
  const { session, isSubscriber } = useMemberSession();

  const [engine, setEngine] = useState<ActiveEngine>(null);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [previewOnly, setPreviewOnly] = useState<boolean>(defaultPreviewOnly);
  const [voiceName, setVoiceName] = useState<TtsVoiceId>(DEFAULT_GEMINI_VOICE);
  const [cacheBadge, setCacheBadge] = useState<string | null>(null);
  const [showGateCard, setShowGateCard] = useState<boolean>(false);
  const [gatePin, setGatePin] = useState<string>("");
  const [gatePinError, setGatePinError] = useState<string | null>(null);
  const [geminiError, setGeminiError] = useState<GeminiErrorState | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stopLocally = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {
        // Ignore
      }
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      try {
        URL.revokeObjectURL(objectUrlRef.current);
      } catch {
        // Ignore
      }
      objectUrlRef.current = null;
    }
    setEngine(null);
    setStatus("idle");
  };

  useEffect(() => {
    return () => {
      audioBus.release(instanceId);
      if (abortRef.current) abortRef.current.abort();
      if (objectUrlRef.current) {
        try {
          URL.revokeObjectURL(objectUrlRef.current);
        } catch {
          // Ignore
        }
      }
    };
  }, [instanceId]);

  const cleanText = sanitizeTextForSpeech(text);
  if (!cleanText) return null;

  const fullTitlePrefix = title ? `${sanitizeTextForSpeech(title)}. ` : "";
  const combinedSpeechText = `${fullTitlePrefix}${cleanText}`;
  const previewCalc = sliceTextForPreview(combinedSpeechText);
  const effectiveGeminiChars = previewOnly
    ? previewCalc.snippet.length
    : Math.min(combinedSpeechText.length, 1600);
  const costEstimate = estimateGeminiTtsCost(effectiveGeminiChars);

  const handleStop = () => {
    audioBus.release(instanceId);
    stopLocally();
  };

  const handlePlayPreRecorded = async () => {
    if (!preRecordedSrc) return;
    setGeminiError(null);
    setShowGateCard(false);

    if (engine === "prerecorded" && status === "playing" && audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
      return;
    }
    if (engine === "prerecorded" && status === "paused" && audioRef.current) {
      await audioRef.current.play();
      setStatus("playing");
      return;
    }

    stopLocally();
    audioBus.claim(instanceId, stopLocally);
    setEngine("prerecorded");
    setStatus("loading");

    try {
      const probe = await fetch(preRecordedSrc, { method: "HEAD" });
      if (!probe.ok) {
        audioBus.release(instanceId);
        stopLocally();
        handlePlayFree();
        setGeminiError({
          code: "BILLING_DEPLETED",
          message:
            "ملف MP3 المسجل مسبقاً بـ Gemini غير مولّد بعد (مفتاح API الحالي وصل لحالة 402). تم تشغيل القراءة المجانية الفورية مؤقتاً؛ أضف مفتاحاً جديداً في .env.local ثم نفّذ: node tools/generate_rijal_demo.mjs",
        });
        return;
      }

      const audio = new Audio(preRecordedSrc);
      audioRef.current = audio;
      audioBus.registerHtmlAudio(audio);

      audio.onended = () => {
        audioBus.release(instanceId);
        stopLocally();
      };
      audio.onerror = () => {
        audioBus.release(instanceId);
        stopLocally();
        setGeminiError({
          code: "AUDIO_PLAY_ERR",
          message: "تعذر فك تشفير المقطع المسجل مسبقاً.",
        });
      };

      setCacheBadge("مسجل مسبقاً (0$)");
      setStatus("playing");
      await audio.play();
    } catch {
      audioBus.release(instanceId);
      stopLocally();
      handlePlayFree();
    }
  };

  const handlePlayFree = () => {
    setGeminiError(null);
    setShowGateCard(false);

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setGeminiError({
        code: "NO_SPEECH_API",
        message: "متصفحك الحالي لا يدعم القراءة الصوتية المدمجة.",
      });
      return;
    }

    // Pause / Resume toggle when already running Free voice
    if (engine === "free" && status === "playing") {
      try {
        window.speechSynthesis.pause();
        setStatus("paused");
        return;
      } catch {
        handleStop();
        return;
      }
    }
    if (engine === "free" && status === "paused") {
      try {
        window.speechSynthesis.resume();
        setStatus("playing");
        return;
      } catch {
        handleStop();
      }
    }

    stopLocally();
    audioBus.claim(instanceId, stopLocally);

    const utterance = new SpeechSynthesisUtterance(combinedSpeechText);
    utterance.lang = lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "ar-SA";
    utterance.rate = 0.96;
    utterance.pitch = 1.0;

    const chosenVoice = pickPreferredSpeechVoice(lang);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang;
    }

    utterance.onend = () => {
      audioBus.release(instanceId);
      setEngine(null);
      setStatus("idle");
    };
    utterance.onerror = () => {
      audioBus.release(instanceId);
      setEngine(null);
      setStatus("idle");
    };

    setEngine("free");
    setStatus("playing");
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      handleStop();
    }
  };

  const playGeminiRequest = async (overridePin?: string) => {
    setGeminiError(null);
    setCacheBadge(null);

    if (engine === "gemini" && status === "playing" && audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
      return;
    }
    if (engine === "gemini" && status === "paused" && audioRef.current) {
      await audioRef.current.play();
      setStatus("playing");
      return;
    }

    stopLocally();
    audioBus.claim(instanceId, stopLocally);

    const controller = new AbortController();
    abortRef.current = controller;

    setEngine("gemini");
    setStatus("loading");

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          text: combinedSpeechText,
          voiceName,
          lang,
          previewOnly,
          memberId: session?.memberId,
          adminPin: overridePin || session?.adminPin,
        }),
      });

      if (!res.ok) {
        let errJson: { code?: string; error?: string } = {};
        try {
          errJson = (await res.json()) as { code?: string; error?: string };
        } catch {
          // Ignore parse errors
        }
        audioBus.release(instanceId);
        stopLocally();

        if (errJson?.code === "SUBSCRIPTION_REQUIRED") {
          setShowGateCard(true);
        } else {
          setGeminiError({
            code: errJson?.code,
            message:
              errJson?.error ||
              "تعذر تشغيل صوت Gemini حالياً. يمكنك استخدام الاستماع المجاني.",
          });
        }
        return;
      }

      const cacheHeader = res.headers.get("X-TTS-Cache") || "";
      if (cacheHeader.startsWith("HIT")) {
        setCacheBadge("من الذاكرة (0$)");
      } else {
        setCacheBadge(previewOnly ? `تجربة ~${costEstimate.estimatedSeconds}ث` : "توليد حي");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;
      audioBus.registerHtmlAudio(audio, url);

      audio.onended = () => {
        audioBus.release(instanceId);
        stopLocally();
      };
      audio.onerror = () => {
        audioBus.release(instanceId);
        stopLocally();
        setGeminiError({
          code: "AUDIO_PLAY_ERR",
          message: "تعذر فك تشفير الملف الصوتي في المتصفح.",
        });
      };

      setStatus("playing");
      await audio.play();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      audioBus.release(instanceId);
      stopLocally();
      setGeminiError({
        code: "NETWORK_ERR",
        message: "تعذر الاتصال بخادم الصوت. يرجى المحاولة أو استعمال الصوت المجاني.",
      });
    }
  };

  const handleGeminiClick = () => {
    setGeminiError(null);
    if (!isSubscriber) {
      setShowGateCard((prev) => !prev);
      return;
    }
    setShowGateCard(false);
    void playGeminiRequest();
  };

  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = gatePin.trim();
    if (pin !== "1447" && pin !== "2026") {
      setGatePinError("رمز اختبار المشرف غير صحيح (أدخل 1447 أو 2026).");
      return;
    }
    setGatePinError(null);
    setStoredMemberSession({
      memberId: "admin-test-mode",
      name: "المشرف (وضع الاختبار)",
      city: "المحمدية",
      monthly: 0,
      paidMonths: 12,
      annualPaid: 1000,
      status: "🟢 اختبار مفعل",
      isAdmin: true,
      adminPin: pin,
    });
    setShowGateCard(false);
    setGatePin("");
    void playGeminiRequest(pin);
  };

  const isCompact = variant === "compact";

  return (
    <div
      className={`space-y-2 ${isCompact ? "" : "rounded-2xl bg-[#FAF7F2] dark:bg-[#0B1B15] border border-[#E7DFD5] dark:border-[#203A2F] p-3"} ${className}`}
      dir="rtl"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* 0. Pre-recorded Book Excerpt Button (when available) */}
          {preRecordedSrc && (
            <button
              type="button"
              onClick={() => void handlePlayPreRecorded()}
              disabled={engine === "prerecorded" && status === "loading"}
              className={`inline-flex items-center gap-1.5 rounded-xl font-bold transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] cursor-pointer disabled:opacity-70 ${
                isCompact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
              } ${
                engine === "prerecorded"
                  ? "bg-[#1B4332] text-[#E5C378] border border-[#C5A059]"
                  : "bg-[#143628]/8 dark:bg-[#1B4332]/40 text-[#143628] dark:text-[#E5C378] border border-[#C5A059]/45 hover:bg-[#C5A059]/15"
              }`}
              title="تشغيل المقطع الصوتي المسجل مسبقاً لهذا الفصل (0$)"
            >
              {engine === "prerecorded" && status === "loading" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
              ) : engine === "prerecorded" && status === "playing" ? (
                <Pause className="w-3.5 h-3.5 text-[#C5A059]" />
              ) : engine === "prerecorded" && status === "paused" ? (
                <Play className="w-3.5 h-3.5 text-[#C5A059]" />
              ) : (
                <Headphones className="w-3.5 h-3.5 text-[#C5A059]" />
              )}
              <span>
                {engine === "prerecorded" && status === "loading"
                  ? "جارٍ الفتح..."
                  : engine === "prerecorded" && status === "playing"
                  ? "إيقاف المقطع المسجل"
                  : engine === "prerecorded" && status === "paused"
                  ? "متابعة المقطع المسجل"
                  : preRecordedLabel}
              </span>
            </button>
          )}

          {/* 1. Free Browser Speech Button */}
          <button
            type="button"
            onClick={handlePlayFree}
            className={`inline-flex items-center gap-1.5 rounded-xl font-bold transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] cursor-pointer ${
              isCompact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
            } ${
              engine === "free"
                ? "bg-[#143628] text-white border border-[#143628]"
                : "bg-white dark:bg-[#122820] text-[#143628] dark:text-[#E8F0EC] border border-[#1B4332]/25 dark:border-[#203D31] hover:border-[#1B4332]"
            }`}
            title="استماع مجاني فوري عبر صوت المتصفح ($0)"
          >
            {engine === "free" && status === "playing" ? (
              <Pause className="w-3.5 h-3.5 text-[#C5A059]" />
            ) : engine === "free" && status === "paused" ? (
              <Play className="w-3.5 h-3.5 text-[#C5A059]" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#C5A059]" />
            )}
            <span>
              {engine === "free" && status === "playing"
                ? "إيقاف مؤقت"
                : engine === "free" && status === "paused"
                ? "متابعة (مجاني)"
                : "استماع مجاني"}
            </span>
          </button>

          {/* 2. Gemini AI Neural Voice Button */}
          <button
            type="button"
            onClick={handleGeminiClick}
            disabled={engine === "gemini" && status === "loading"}
            className={`inline-flex items-center gap-1.5 rounded-xl font-bold transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] cursor-pointer disabled:opacity-70 ${
              isCompact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
            } ${
              engine === "gemini"
                ? "bg-[#C5A059] text-[#143628] border border-[#C5A059]"
                : isSubscriber
                ? "bg-[#C5A059]/15 text-[#7A5B1F] dark:text-[#E5C378] border border-[#C5A059]/45 hover:bg-[#C5A059]/25"
                : "bg-[#F5EFE4] dark:bg-[#12241D] text-[#6B5427] dark:text-[#D9C08B] border border-[#C5A059]/35 hover:border-[#C5A059]"
            }`}
            title={
              isSubscriber
                ? "قراءة طبيعية بالذكاء الاصطناعي عبر Gemini API"
                : "صوت Gemini بالذكاء الاصطناعي مخصص للمشتركين (الأبونمو) أو لوضع اختبار المشرف"
            }
          >
            {engine === "gemini" && status === "loading" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : engine === "gemini" && status === "playing" ? (
              <Pause className="w-3.5 h-3.5" />
            ) : !isSubscriber ? (
              <Lock className="w-3 h-3" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>
              {engine === "gemini" && status === "loading"
                ? "جارٍ التوليد..."
                : engine === "gemini" && status === "playing"
                ? "إيقاف Gemini"
                : engine === "gemini" && status === "paused"
                ? "متابعة Gemini"
                : "صوت Gemini"}
            </span>
            {!isCompact && !isSubscriber && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C5A059]/20 text-[#7A5B1F] dark:text-[#E5C378]">
                للمشتركين
              </span>
            )}
          </button>

          {/* Stop button when active */}
          {engine !== null && (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 text-[11px] font-bold hover:bg-red-100 cursor-pointer"
              title="إيقاف القراءة بالكامل"
            >
              <Square className="w-3 h-3 fill-current" />
              {!isCompact && <span>إيقاف</span>}
            </button>
          )}
        </div>

        {/* Subscriber controls in Bar mode: Test vs Full + Voice selector + Cache badge */}
        {!isCompact && isSubscriber && (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => setPreviewOnly((p) => !p)}
              className={`px-2 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                previewOnly
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                  : "bg-white dark:bg-[#122820] text-[#52796F] dark:text-[#A1B3A9] border-[#E7DFD5] dark:border-[#203D31]"
              }`}
              title="تقليل الاستهلاك إلى ~8 ثوانٍ في الاختبار، أو تشغيل النص كاملاً"
            >
              {previewOnly ? "اختبار (~8 ثوانٍ)" : "قراءة كاملة"}
            </button>

            <select
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value as TtsVoiceId)}
              aria-label="اختيار نبرة صوت Gemini"
              className="px-2 py-1 rounded-lg bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-[#143628] dark:text-[#E8F0EC] font-medium focus:outline-none focus:border-[#C5A059]"
            >
              {GEMINI_TTS_VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} ({v.id})
                </option>
              ))}
            </select>

            {cacheBadge ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                {cacheBadge}
              </span>
            ) : (
              <span className="text-[#52796F] dark:text-[#9BB0A5] font-mono tabular-nums">
                ~{costEstimate.estimatedSeconds}ث
              </span>
            )}
          </div>
        )}
      </div>

      {/* Subscriber Gate Prompt */}
      {showGateCard && !isSubscriber && (
        <div className="p-3 rounded-xl bg-white dark:bg-[#122820] border border-[#C5A059]/45 text-xs space-y-2.5">
          <div className="flex items-start gap-2">
            <Headphones className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-[#143628] dark:text-[#FAF7F2]">
                صوت Gemini AI مخصص للأعضاء المشتركين (الأبونمو)
              </p>
              <p className="text-[#52796F] dark:text-[#95B8A8] leading-relaxed">
                يمكنك الاستماع مجاناً دائماً عبر زر «استماع مجاني»، أو تفعيل عضوية الفقير، أو فتح وضع اختبار المشرف لتجربة مقطع قصير (~8 ثوانٍ).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openMemberPortal("login")}
              className="px-3 py-1.5 rounded-lg bg-[#1B4332] hover:bg-[#143628] text-white font-bold transition cursor-pointer"
            >
              تفعيل / اختيار عضوية فقير
            </button>

            <form
              onSubmit={handleUnlockWithPin}
              className="flex items-center gap-1.5"
            >
              <input
                type="password"
                value={gatePin}
                onChange={(e) => {
                  setGatePin(e.target.value);
                  setGatePinError(null);
                }}
                placeholder="رمز اختبار المشرف (1447)"
                className="w-36 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#143628] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-lg bg-[#C5A059] text-[#143628] font-bold hover:opacity-90 cursor-pointer"
              >
                تفعيل للاختبار
              </button>
            </form>
          </div>

          {gatePinError && (
            <p className="text-red-600 dark:text-red-400 font-semibold">
              {gatePinError}
            </p>
          )}
        </div>
      )}

      {/* Gemini API / Billing Feedback Card */}
      {geminiError && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-[#1A241E] border border-amber-300/70 dark:border-[#C5A059]/45 text-xs space-y-2">
          <div className="flex items-start gap-2 text-[#7A4F0B] dark:text-[#E5C378]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{geminiError.message}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePlayFree}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#143628] text-white font-bold cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>التشغيل بالصوت المجاني الآن</span>
            </button>
            {(geminiError.code === "BILLING_DEPLETED" ||
              geminiError.code === "MISSING_API_KEY") && (
              <>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0B1914] border border-[#C5A059]/40 text-[#143628] dark:text-[#E5C378] font-semibold hover:underline"
                >
                  <span>مفتاح Free Tier (AI Studio)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://developers.google.com/program/my-benefits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0B1914] border border-[#C5A059]/40 text-[#143628] dark:text-[#E5C378] font-semibold hover:underline"
                >
                  <span>تفعيل رصيد $10 (Google AI Pro)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
