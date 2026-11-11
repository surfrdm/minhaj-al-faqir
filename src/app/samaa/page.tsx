"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Music,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  Volume2,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Radio,
  ArrowRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DualAudioReaderBar } from "@/components/DualAudioReaderBar";
import samaaList from "@/data/samaa_sequence.json";

interface Poem {
  id: string;
  title: string;
  poet: string;
  diwan?: string;
  category?: string;
  maqam: string;
  keywords?: string[];
  allVerses: string[];
  spiritualExplanation: string;
  nextSuggestedPoems: { id: string; title: string; poet: string }[];
}

export default function SamaaHubPage() {
  // Continuous listening states
  const [isLiveListening, setIsLiveListening] = useState<boolean>(false);
  const [listeningSeconds, setListeningSeconds] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [recognitionStatus, setRecognitionStatus] = useState<string>("في انتظار بدء الاستماع الحي");
  const [activePoem, setActivePoem] = useState<Poem>(samaaList[0] as unknown as Poem);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const [explanationOpen, setExplanationOpen] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Typography controls for disciples singing in Hadra
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(2); // 1 = normal, 2 = large, 3 = xlarge, 4 = huge

  // Search & Library filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");

  // Recognition references
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const checkIntervalRef = useRef<any>(null);
  const activePoemRef = useRef<Poem>(activePoem);

  useEffect(() => {
    activePoemRef.current = activePoem;
  }, [activePoem]);

  // Handle continuous timer
  useEffect(() => {
    if (isLiveListening) {
      timerRef.current = setInterval(() => {
        setListeningSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setListeningSeconds(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isLiveListening]);

  // Periodic acoustic checking every 8 seconds during continuous live listening
  useEffect(() => {
    if (isLiveListening) {
      checkIntervalRef.current = setInterval(() => {
        // Run query check using live transcript or cycle detection
        if (liveTranscript.trim()) {
          performRecognition(liveTranscript);
        }
      }, 7000);
    } else {
      clearInterval(checkIntervalRef.current);
    }
    return () => clearInterval(checkIntervalRef.current);
  }, [isLiveListening, liveTranscript]);

  // Continuous Web Speech Recognition Handler
  const startLiveListening = () => {
    setIsLiveListening(true);
    setRecognitionStatus("جاري الاستماع الحي في الحضرة... الميكروفون نشط باستمرار");
    setLiveTranscript("");

    // Initialize browser speech recognition if supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const reco = new SpeechRecognition();
        reco.lang = "ar-MA"; // Moroccan Arabic & Classical Arabic
        reco.continuous = true;
        reco.interimResults = true;

        reco.onresult = (event: any) => {
          let text = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript + " ";
          }
          setLiveTranscript(text.trim());
          performRecognition(text.trim());
        };

        reco.onerror = (e: any) => {
          console.warn("Speech recognition notice", e);
        };

        reco.onend = () => {
          // If still marked as live listening, restart continuous session!
          if (isLiveListening) {
            try {
              reco.start();
            } catch (err) {
              // Ignore already started
            }
          }
        };

        reco.start();
        recognitionRef.current = reco;
      } catch (err) {
        console.warn("Speech recognition start issue, falling back to audio loop", err);
      }
    } else {
      // Fallback simulation for browsers without speech API: simulated detection after 12s
      setTimeout(() => {
        if (isLiveListening) {
          performRecognition("شربنا على ذكر الحبيب");
        }
      }, 10000);
    }
  };

  const stopLiveListening = () => {
    setIsLiveListening(false);
    setRecognitionStatus("تم إيقاف الاستماع الحي مؤقتاً");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
    }
  };

  const performRecognition = async (transcriptText: string) => {
    if (!transcriptText.trim()) return;

    try {
      const res = await fetch("/api/samaa-recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: transcriptText,
          previousPoemId: activePoemRef.current?.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.poem) {
          if (data.poem.id !== activePoemRef.current.id) {
            // New poem detected!
            setActivePoem(data.poem);
            setActiveVerseIndex(data.currentVerseIndex || 0);
            setRecognitionStatus(`✨ تم رصد انتقال المنشدين إلى قصيدة: «${data.poem.title}»`);
          } else {
            // Same poem, update verse if matched
            if (typeof data.currentVerseIndex === "number") {
              setActiveVerseIndex(data.currentVerseIndex);
            }
            setRecognitionStatus(`متابعة الإنشاد الجاري: ${data.confidence || "مطابقة مستمرة"}`);
          }
        }
      }
    } catch (e) {
      console.error("Recognition network error", e);
    }
  };

  // Switch poem manually
  const selectPoem = (poem: Poem) => {
    setActivePoem(poem);
    setActiveVerseIndex(0);
    const el = document.getElementById("active-poem-display");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Copy verses
  const copyFullPoem = () => {
    if (!activePoem) return;
    const text = `🎵 «${activePoem.title}»\nالناظم: ${activePoem.poet}\n${activePoem.maqam}\n\n${activePoem.allVerses.join("\n")}\n\nمنصة منهاج الفقير`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share to WhatsApp
  const shareWhatsApp = () => {
    if (!activePoem) return;
    const text = `🎵 من روائع السماع الصوفي البودشيشي:\n«${activePoem.title}»\nالناظم: ${activePoem.poet}\n\n${activePoem.allVerses.slice(0, 4).join("\n")}\n...\n\nطالع القصيدة كاملة مشكولة على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/samaa`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Font size classes
  const fontSizes = [
    "text-sm sm:text-base leading-loose",
    "text-base sm:text-lg leading-loose",
    "text-lg sm:text-2xl leading-loose",
    "text-xl sm:text-3xl leading-loose",
  ];

  // Categories list
  const categories = [
    "الكل",
    "نوبة الاستفتاح",
    "نوبة الغرام والبسط",
    "نوبة التجريد والزجل الصوفي",
    "نوبة المحبة والفقر الإلهي",
    "نوبة المشاهدة والشهود",
    "نوبة الختم والمديح النبوي",
    "نوبة الرجاء والفرج",
  ];

  // Filtered poems
  const filteredPoems = samaaList.filter((p: any) => {
    const matchesCat =
      selectedCategory === "الكل" || p.category?.includes(selectedCategory);
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.includes(searchQuery) ||
      p.poet.includes(searchQuery) ||
      p.allVerses.some((v: string) => v.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC] font-sans antialiased" dir="rtl">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#A1B3A9] pt-2">
          <Link href="/" className="hover:text-[#C5A059] transition">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-[#143628] dark:text-[#E5C378] font-bold">
            السماع الصوفي
          </span>
        </div>

        {/* HERO SECTION */}
        <section className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0A1E16] text-[#FAF7F2] border-2 border-[#C5A059]/40 shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold">
              <Music className="w-3.5 h-3.5 fill-current" />
              <span>مِشْكَاةُ الإِنْشَادِ الصُّوفِيِّ • السَّمَاعُ وَالنَّوْبَةُ</span>
            </div>

            <h1 className="font-amiri text-2xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#FAF7F2] leading-tight">
              شَازَامُ السَّمَاعِ
            </h1>

            <p className="text-xs sm:text-sm text-[#FAF7F2]/85 leading-relaxed font-ibm max-w-2xl">
              المحرّك الذكي للتعرف الحي والمستمر على قصائد السماع أثناء مجالس الذكر والسماع؛ يستمع إلى الإنشاد طوال مدة المجلس، يعرض الكلمات مشكولة بخط عريض، وينتقل تلقائياً بين القصائد وفق ترتيب النوبة الصوفية البودشيشية.
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 1. CONTINUOUS LIVE HADRA LISTENER MODULE (المستمع الحي المستمر) */}
        {/* ============================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E2019] border-2 border-[#C5A059] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E7DFD5] dark:border-[#203D31] pb-6">
            <div className="flex items-center gap-4 text-right">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner ${
                  isLiveListening
                    ? "bg-gradient-to-br from-emerald-600 to-green-700 text-white animate-pulse ring-4 ring-emerald-400/40"
                    : "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40"
                }`}
              >
                {isLiveListening ? (
                  <Radio className="w-8 h-8 animate-spin" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#E8F0EC]">
                    وَضْعُ الاسْتِمَاعِ الحَيِّ المُسْتَمِرِّ فِي مَجْلِسِ السَّمَاعِ
                  </h2>
                  {isLiveListening && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      مُتَّصِلٌ وَيَسْتَمِعُ
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#52796F] dark:text-[#A1B3A9] font-ibm mt-0.5">
                  يبقى الميكروفون نشطاً طوال المجلس دون توقف؛ يكتشف القصيدة ويتابع انتقال المنشدين آلياً
                </p>
              </div>
            </div>

            {/* Continuous Control Buttons */}
            <div className="flex items-center gap-3">
              {isLiveListening ? (
                <button
                  onClick={stopLiveListening}
                  className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  <MicOff className="w-4 h-4" />
                  <span>إيقاف الاستماع الحي</span>
                  <span className="font-mono bg-black/20 px-2 py-0.5 rounded text-[11px]">
                    {formatTime(listeningSeconds)}
                  </span>
                </button>
              ) : (
                <button
                  onClick={startLiveListening}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#1B4332] via-[#143628] to-[#0A1E16] hover:from-[#143628] hover:to-[#050D0A] text-[#FAF7F2] font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer border-2 border-[#C5A059]"
                >
                  <Mic className="w-5 h-5 text-[#C5A059] animate-pulse" />
                  <span>بدء الاستماع الحي المستمر في المجلس</span>
                </button>
              )}
            </div>
          </div>

          {/* Status & Live Ambient Indicator */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#143628] dark:text-[#E5C378] font-bold">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>الحالة الآن: {recognitionStatus}</span>
            </div>

            {isLiveListening && (
              <div className="flex items-center gap-3 text-[11px] text-[#52796F] dark:text-[#A1B3A9]">
                <span>مدة الاستماع المباشر:</span>
                <span className="font-mono font-bold text-[#143628] dark:text-[#FAF7F2] bg-white dark:bg-[#122820] px-2.5 py-1 rounded-lg border border-[#C5A059]/40">
                  {formatTime(listeningSeconds)}
                </span>
                {liveTranscript && (
                  <span className="text-[10px] text-gray-400 truncate max-w-xs">
                    (ملتقط: «{liveTranscript}»)
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. THE ACTIVE SUNG POEM DISPLAY (لوحة الإنشاد للفقراء)         */}
        {/* ============================================================== */}
        {activePoem && (
          <section
            id="active-poem-display"
            className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0E2019] border-2 border-[#C5A059] shadow-2xl space-y-6 scroll-mt-28"
          >
            {/* Header of Active Poem */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E7DFD5] dark:border-[#203D31] pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378] text-xs font-bold border border-[#C5A059]/40">
                    {activePoem.maqam}
                  </span>
                  {activePoem.diwan && (
                    <span className="text-xs text-gray-500 font-medium">
                      المصدر: {activePoem.diwan}
                    </span>
                  )}
                </div>

                <h2 className="font-amiri text-2xl sm:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-tight">
                  {activePoem.title}
                </h2>
                <p className="font-amiri text-sm sm:text-base text-[#826122] dark:text-[#E5C378] font-bold">
                  الناظم: {activePoem.poet}
                </p>
              </div>

              {/* Utility Tools: Font Sizer, Copy, WhatsApp */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {/* Font Size Adjusters */}
                <div className="flex items-center rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] p-1">
                  <button
                    onClick={() => setFontSizeLevel((prev) => Math.max(0, prev - 1))}
                    disabled={fontSizeLevel === 0}
                    className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-[#C5A059]/15 disabled:opacity-30 cursor-pointer"
                    title="تصغير الخط"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-[#C5A059]">
                    {fontSizeLevel === 0 ? "عادي" : fontSizeLevel === 1 ? "متوسط" : fontSizeLevel === 2 ? "كبير" : "ضخم"}
                  </span>
                  <button
                    onClick={() => setFontSizeLevel((prev) => Math.min(fontSizes.length - 1, prev + 1))}
                    disabled={fontSizeLevel === fontSizes.length - 1}
                    className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-[#C5A059]/15 disabled:opacity-30 cursor-pointer"
                    title="تكبير الخط"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={copyFullPoem}
                  className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-[#143628] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 transition cursor-pointer"
                  title="نسخ الأبيات كاملة"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#C5A059]" />}
                </button>

                <button
                  onClick={shareWhatsApp}
                  className="p-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] transition cursor-pointer"
                  title="مشاركة عبر واتساب"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <DualAudioReaderBar
              title={activePoem.title}
              text={[
                `${activePoem.title} — ${activePoem.poet}.`,
                ...activePoem.allVerses,
                activePoem.spiritualExplanation || "",
              ]
                .filter(Boolean)
                .join(" ")}
              lang="ar"
              variant="bar"
            />

            {/* LIVE VOCALIZED VERSES (الأبيات كاملة مشكولة) */}
            <div className="space-y-4 py-2">
              {activePoem.allVerses.map((verse, idx) => {
                const isCurrent = idx === activeVerseIndex;
                const parts = verse.split("...");
                const sadr = parts[0]?.trim() || verse;
                const ajuz = parts[1]?.trim() || "";

                return (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 border ${
                      isCurrent
                        ? "bg-gradient-to-r from-[#C5A059]/20 via-[#D4AF37]/15 to-[#C5A059]/20 border-[#C5A059] shadow-md scale-[1.01]"
                        : "bg-[#FAF7F2]/60 dark:bg-[#07130E]/60 border-transparent hover:border-[#C5A059]/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono text-gray-400 font-bold">
                        بيت {idx + 1}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#826122] dark:text-[#E5C378] animate-pulse">
                          <Volume2 className="w-3.5 h-3.5" />
                          البيت الجاري إنشاده في المجلس
                        </span>
                      )}
                    </div>

                    <div className={`font-amiri font-bold text-[#143628] dark:text-[#FAF7F2] text-center ${fontSizes[fontSizeLevel]}`}>
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-6">
                        <span className="leading-relaxed">{sadr}</span>
                        {ajuz && (
                          <>
                            <span className="hidden sm:inline text-[#C5A059] font-normal">❖</span>
                            <span className="leading-relaxed text-[#826122] dark:text-[#E5C378]">{ajuz}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Collapsible Spiritual Commentary: كشف الإشارات والذوق */}
            {activePoem.spiritualExplanation && (
              <div className="rounded-2xl border border-[#C5A059]/40 bg-gradient-to-br from-[#FAF7F2] to-[#F5EFE6] dark:from-[#07130E] dark:to-[#0D241C] p-4 sm:p-6 space-y-2">
                <button
                  onClick={() => setExplanationOpen(!explanationOpen)}
                  className="w-full flex items-center justify-between font-amiri font-bold text-sm sm:text-base text-[#143628] dark:text-[#E5C378] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>كَشْفُ الإِشَارَاتِ وَالذَّوْقِ الصُّوفِيِّ فِي هَذِهِ القَصِيدَةِ</span>
                  </div>
                  {explanationOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {explanationOpen && (
                  <p className="text-xs sm:text-sm text-[#1D2A24]/90 dark:text-[#E8F0EC]/90 leading-relaxed font-ibm pt-2 border-t border-[#C5A059]/20">
                    {activePoem.spiritualExplanation}
                  </p>
                )}
              </div>
            )}

            {/* Next Suggested Poems in the Nouba */}
            {activePoem.nextSuggestedPoems && activePoem.nextSuggestedPoems.length > 0 && (
              <div className="pt-4 border-t border-[#E7DFD5] dark:border-[#203D31] space-y-3">
                <span className="text-xs font-bold text-[#826122] dark:text-[#E5C378] block">
                  القصائد الموالية في ترتيب النوبة (اضغط للانتقال الفوري):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePoem.nextSuggestedPoems.map((nextP) => {
                    const fullNext = samaaList.find((p) => p.id === nextP.id);
                    return (
                      <button
                        key={nextP.id}
                        onClick={() => fullNext && selectPoem(fullNext as unknown as Poem)}
                        className="p-3 rounded-xl border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] bg-[#FAF7F2] dark:bg-[#07130E] text-right transition flex items-center justify-between text-xs cursor-pointer group hover:bg-[#C5A059]/10"
                      >
                        <div>
                          <span className="font-amiri font-bold text-sm text-[#143628] dark:text-[#FAF7F2] block group-hover:text-[#C5A059]">
                            {nextP.title}
                          </span>
                          <span className="text-[11px] text-gray-500">{nextP.poet}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:-translate-x-1 transition" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ============================================================== */}
        {/* 3. COMPREHENSIVE DIWAN & POEM LIBRARY (خزانة السماع والدواوين) */}
        {/* ============================================================== */}
        <section className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                خِزَانَةُ الدَّوَاوِينِ وَقَصَائِدِ السَّمَاعِ
              </h2>
              <p className="text-xs text-[#52796F] dark:text-[#A1B3A9] font-ibm">
                تصفح روائع السماع الصوفي لكبار العارفين بالترتيب الموسيقي والنغمي
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث عن بيت، ناظم، أو قصيدة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059] transition"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#1B4332] text-white shadow-sm border border-[#C5A059]"
                    : "bg-white dark:bg-[#0E2019] text-[#1D2A24] dark:text-[#E8F0EC] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Poems Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPoems.map((p: any) => {
              const isSelected = activePoem?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => selectPoem(p as unknown as Poem)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group ${
                    isSelected
                      ? "border-2 border-[#C5A059] bg-[#C5A059]/10 shadow-lg ring-2 ring-[#C5A059]/30"
                      : "bg-white dark:bg-[#0E2019] border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] hover:shadow-md"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#C5A059] font-bold">
                      <span className="truncate max-w-[200px]">{p.maqam}</span>
                      <span className="font-mono text-gray-400">{p.allVerses.length} أبيات</span>
                    </div>

                    <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] group-hover:text-[#C5A059] transition leading-tight">
                      {p.title}
                    </h3>

                    <p className="font-amiri text-xs text-[#826122] dark:text-[#E5C378] font-semibold">
                      {p.poet}
                    </p>

                    <p className="font-amiri text-xs text-[#1D2A24]/75 dark:text-[#E8F0EC]/75 line-clamp-2 leading-relaxed pt-1 border-t border-[#E7DFD5]/50 dark:border-[#203D31]/50">
                      {p.allVerses[0]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] text-xs">
                    <span className="text-[11px] text-gray-500 font-ibm">
                      {p.diwan || "التراث البودشيشي"}
                    </span>
                    <span className="text-xs font-bold text-[#1B4332] dark:text-[#E5C378] group-hover:underline flex items-center gap-1">
                      <span>عرض الكلمات للإنشاد</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. REFERENCE BOOKS & DIWANS SECTION (أمهات كتب ودواوين السماع) */}
        {/* ============================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FAF7F2] to-[#F5EFE6] dark:from-[#0B1A14] dark:to-[#07130E] border border-[#C5A059]/40 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-amiri text-xl font-bold text-[#143628] dark:text-[#FAF7F2]">
              أُمَّهَاتُ دَوَاوِينِ وَمَرَاجِعِ السَّمَاعِ الصُّوفِيِّ فِي المِنْهَاجِ
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
              <span className="font-bold text-[#143628] dark:text-[#E5C378] block">ديوان الشيخ سيدي محمد الحراق</span>
              <p className="text-[11px] text-gray-500 leading-tight">عمدة السماع الصوفي بالمغرب، يجمع بين رقة العبارة وعمق المعرفة التوحيدية.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
              <span className="font-bold text-[#143628] dark:text-[#E5C378] block">ديوان ابن الفارض</span>
              <p className="text-[11px] text-gray-500 leading-tight">سلطان العاشقين وإمام الشعر الذوقي الصوفي التليد وخمريات التجريد.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
              <span className="font-bold text-[#143628] dark:text-[#E5C378] block">زجليات أبي الحسن الششتري</span>
              <p className="text-[11px] text-gray-500 leading-tight">تراث صوفي أندلسي مغربي بطابع لحني خفيف ومحبب في الحضرة.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
              <span className="font-bold text-[#143628] dark:text-[#E5C378] block">البردة الشريفة للبوصيري</span>
              <p className="text-[11px] text-gray-500 leading-tight">مسك ختام كل مجلس علم وحضرة، تاج المدائح النبوية في العالم الإسلامي.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
