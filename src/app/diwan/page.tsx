"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Music,
  BookOpen,
  Mic,
  MicOff,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Radio,
  Share2,
  Copy,
  Check,
  Volume2,
  ListOrdered,
  Layers,
  Sparkle,
  Sliders,
  Compass,
  X,
  Play,
  Bookmark,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import diwaneData from "@/data/diwane_master.json";
import grandQasaidData from "@/data/grand_qasaid_master.json";
import { GrandQasaidModal, GrandQasidaItem } from "@/components/GrandQasaidModal";
import { QuranicEvidencePanel } from "@/components/QuranicEvidencePanel";
import { DualAudioReaderBar } from "@/components/DualAudioReaderBar";
import { getPageVerses } from "@/lib/quran_thematic";

interface DiwanPoem {
  id: string;
  title: string;
  normalizedTitle: string;
  poet: string;
  category: string;
  maqam: string;
  silsilaId: number;
  silsilaName: string;
  orderInSilsila: number;
  allVerses: string[];
  spiritualExplanation?: string;
  keywords?: string[];
  nextPoemInSilsila?: { id: string; title: string; poet: string } | null;
  prevPoemInSilsila?: { id: string; title: string; poet: string } | null;
}

interface DiwanSilsila {
  id: number;
  name: string;
  title: string;
  description: string;
  poemsCount: number;
  poems: { id: string; title: string; poet: string; order: number }[];
}

export default function DiwanMasterPage() {
  const allPoems = useMemo(() => diwaneData.poems as DiwanPoem[], []);
  const allSilsilas = useMemo(() => diwaneData.silsilas as DiwanSilsila[], []);

  // UI State
  const [activeTab, setActiveTab] = useState<"silsilas" | "all" | "shazam">("silsilas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [selectedMaqam, setSelectedMaqam] = useState<string>("الكل");
  const [selectedSilsilaId, setSelectedSilsilaId] = useState<number | null>(null);

  // Active Reader Modal
  const [activePoem, setActivePoem] = useState<DiwanPoem | null>(null);
  const [verseFontSize, setVerseFontSize] = useState<number>(1.25); // in rem
  const [copied, setCopied] = useState(false);

  // Grand Qasaid State (Option 3 Dual-Mode Reader)
  const grandQasaidList = useMemo(() => grandQasaidData as GrandQasidaItem[], []);
  const [activeGrandQasida, setActiveGrandQasida] = useState<GrandQasidaItem | null>(null);
  const [grandInitialTab, setGrandInitialTab] = useState<"matn" | "explanation">("matn");

  // Live Samaa Shazam Recognition State
  const [isLiveListening, setIsLiveListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [listeningSeconds, setListeningSeconds] = useState(0);
  const [recognitionStatus, setRecognitionStatus] = useState("في انتظار بدء الاستماع الحي");
  const [recognizedPoem, setRecognizedPoem] = useState<DiwanPoem | null>(null);
  const [recognizedVerseIdx, setRecognizedVerseIdx] = useState(0);
  const [upcomingChain, setUpcomingChain] = useState<any[]>([]);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const checkIntervalRef = useRef<any>(null);

  // Categories & Maqamat extracted
  const categories = useMemo(() => {
    const set = new Set<string>();
    allPoems.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["الكل", ...Array.from(set)];
  }, [allPoems]);

  const maqamat = useMemo(() => {
    const set = new Set<string>();
    allPoems.forEach((p) => {
      if (p.maqam) set.add(p.maqam);
    });
    return ["الكل", ...Array.from(set)];
  }, [allPoems]);

  // Filtered poems for "All" tab
  const filteredPoems = useMemo(() => {
    return allPoems.filter((p) => {
      // Search
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.normalizedTitle.toLowerCase().includes(q) ||
        p.poet.toLowerCase().includes(q) ||
        p.allVerses.some((v) => v.toLowerCase().includes(q));

      // Category
      const matchesCat = selectedCategory === "الكل" || p.category === selectedCategory;

      // Maqam
      const matchesMaqam = selectedMaqam === "الكل" || p.maqam === selectedMaqam;

      // Silsila filter
      const matchesSilsila = selectedSilsilaId === null || p.silsilaId === selectedSilsilaId;

      return matchesSearch && matchesCat && matchesMaqam && matchesSilsila;
    });
  }, [allPoems, searchQuery, selectedCategory, selectedMaqam, selectedSilsilaId]);

  // Handle Speech Recognition for Shazam of Samaa
  const startLiveListening = () => {
    setIsLiveListening(true);
    setRecognitionStatus("الميكروفون يستمع بشكل مستمر في مجلس السماع والذكر...");
    setLiveTranscript("");

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const reco = new SpeechRecognition();
        reco.lang = "ar-MA";
        reco.continuous = true;
        reco.interimResults = true;

        reco.onresult = (event: any) => {
          let text = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript + " ";
          }
          setLiveTranscript(text.trim());
          queryRecognitionApi(text.trim());
        };

        reco.onerror = (e: any) => {
          console.warn("Speech recognition notice", e);
        };

        reco.onend = () => {
          if (isLiveListening) {
            try {
              reco.start();
            } catch (err) {}
          }
        };

        reco.start();
        recognitionRef.current = reco;
      } catch (err) {
        console.warn("Speech API start error", err);
      }
    } else {
      // Fallback detection simulation
      setTimeout(() => {
        if (isLiveListening) {
          queryRecognitionApi("صلوا يا اهل الفلاح");
        }
      }, 7000);
    }
  };

  const stopLiveListening = () => {
    setIsLiveListening(false);
    setRecognitionStatus("تم إيقاف الاستماع الحي");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // Live timer
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

  // Periodic acoustic checking
  useEffect(() => {
    if (isLiveListening) {
      checkIntervalRef.current = setInterval(() => {
        if (liveTranscript.trim()) {
          queryRecognitionApi(liveTranscript);
        }
      }, 6000);
    } else {
      clearInterval(checkIntervalRef.current);
    }
    return () => clearInterval(checkIntervalRef.current);
  }, [isLiveListening, liveTranscript]);

  const queryRecognitionApi = async (queryText: string) => {
    if (!queryText.trim()) return;
    try {
      const res = await fetch("/api/samaa-recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          previousPoemId: recognizedPoem?.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.poem) {
          setRecognizedPoem(data.poem);
          setRecognizedVerseIdx(data.currentVerseIndex || 0);
          setUpcomingChain(data.upcomingChain || []);
          setRecognitionStatus(`✨ تم رصد إنشاد: «${data.poem.title}» (${data.poem.silsilaName || "السلسلة"})`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sequential Navigation: Move to Next poem in Silsila
  const handleNavigateNext = () => {
    if (!activePoem || !activePoem.nextPoemInSilsila) return;
    const nextObj = allPoems.find((p) => p.id === activePoem.nextPoemInSilsila?.id);
    if (nextObj) {
      setActivePoem(nextObj);
    }
  };

  // Sequential Navigation: Move to Prev poem in Silsila
  const handleNavigatePrev = () => {
    if (!activePoem || !activePoem.prevPoemInSilsila) return;
    const prevObj = allPoems.find((p) => p.id === activePoem.prevPoemInSilsila?.id);
    if (prevObj) {
      setActivePoem(prevObj);
    }
  };

  // Copy Verses to clipboard
  const handleCopyPoem = (poem: DiwanPoem) => {
    const text = `${poem.title}\n${poem.poet}\n${poem.silsilaName} - ${poem.maqam}\n\n` + poem.allVerses.join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC] font-sans antialiased"
      dir="rtl"
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">
        {/* Breadcrumb & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#A1B3A9]">
            <Link href="/" className="hover:text-[#C5A059] transition">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[#143628] dark:text-[#E5C378] font-bold">
              ديوان السماع الصوفي المشهود
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab("shazam");
                if (!isLiveListening) startLiveListening();
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-white border border-[#C5A059] text-xs font-bold flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
              <span>مستمع السماع الصوفي الذكي</span>
            </button>
          </div>
        </div>

        {/* Hero Banner: Spiritual Luxury Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0D241B] p-6 sm:p-10 text-white shadow-xl border border-[#C5A059]/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(197,160,89,0.15)_0%,transparent_70%)] pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-xs font-bold text-[#E5C378]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>✦ الزاوية القادرية البودشيشية ✦</span>
            </div>

            <h1 className="font-amiri text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF7F2] leading-tight">
              دِيوَانُ السَّمَاعِ الصُّوفِيِّ المَشْهُود
            </h1>

            <p className="font-amiri text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl">
              فهرس السلاسل الصوفية الـ 32 المشهودة ومجالس الذكر والسماع؛ مرتبة نسقاً مسلسلاً «واحدة تلو الأخرى» مع الضبط والشكل لبعض القصائد والأبيات المختارة، ونظام التعرف الصوتي الذكي.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 font-bold flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>32 سلسلة صوفية معتمدة</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>155 قصيدة منتقاة ومضبوطة</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>رصد تلقائي للقصيدة وما يليها</span>
              </span>
            </div>
          </div>
        </section>

        {/* VIP Showcase: أُمَّهَاتُ القَصَائِدِ وَالمَدَائِحِ الكُبْرَى (المتون الكاملة والشروح التراثية) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#C5A059]/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C5A059] animate-pulse" />
              <h2 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                أُمَّهَاتُ القَصَائِدِ وَالمَدَائِحِ الكُبْرَى (المتون الكاملة والشروح التراثية)
              </h2>
            </div>
            <span className="text-xs text-[#826122] dark:text-[#E5C378] font-bold font-ibm bg-[#C5A059]/15 px-3 py-1 rounded-full border border-[#C5A059]/35 self-start sm:self-auto">
              5 روائع كبرى مشكولة مع شروح ابن عجيبة وزروق وبنيس
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {grandQasaidList.map((gq) => (
              <div
                key={gq.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border-2 border-[#C5A059]/40 hover:border-[#C5A059] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#143628] text-[#E5C378] font-ibm">
                      {gq.badge}
                    </span>
                    <span className="text-[10px] font-sans font-bold text-gray-400">
                      {gq.versesCount} {gq.id === "dalail_khatm" ? "فقرات" : "بيتاً"}
                    </span>
                  </div>

                  <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] group-hover:text-[#C5A059] transition-colors line-clamp-1">
                    {gq.title}
                  </h3>
                  <p className="text-[11px] text-[#52796F] dark:text-[#9BB0A5] font-ibm line-clamp-1">
                    {gq.poet}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px]">
                  <button
                    onClick={() => {
                      setActiveGrandQasida(gq);
                      setGrandInitialTab("matn");
                    }}
                    className="py-1.5 px-2 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] font-bold text-center transition cursor-pointer"
                  >
                    المتن المشكول
                  </button>

                  <button
                    onClick={() => {
                      setActiveGrandQasida(gq);
                      setGrandInitialTab("explanation");
                    }}
                    className="py-1.5 px-2 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] hover:bg-[#C5A059]/20 text-[#143628] dark:text-[#FAF7F2] border border-[#C5A059]/40 font-bold text-center transition cursor-pointer"
                  >
                    الشرح الصوفي
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quranic Foundations for Spiritual Sama & Praise */}
        <QuranicEvidencePanel
          title="الشواهد القرآنية للسماع الروحي والمديح والقول الحسن"
          subtitle="آيات محققة برواية ورش في استماع القول واتباع أحسنه، وتعظيم مقام النبوة، وخشوع القلوب عند تلاوة الذكر."
          verses={getPageVerses("diwan")}
          variant="grid"
          defaultCollapsed={true}
          initialVisibleCount={3}
        />

        {/* Tab Navigation: 1. السلاسل الصوفية / 2. الفهرس الكامل / 3. شازام السماع */}
        <div className="flex rounded-2xl bg-white dark:bg-[#0E2019] p-1.5 border border-[#E7DFD5] dark:border-[#203D31] shadow-sm max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("silsilas")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "silsilas"
                ? "bg-[#1B4332] text-white shadow-sm"
                : "text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/10"
            }`}
          >
            <ListOrdered className="w-4 h-4 text-[#C5A059]" />
            <span>السلاسل الصوفية (32)</span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "all"
                ? "bg-[#1B4332] text-white shadow-sm"
                : "text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/10"
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C5A059]" />
            <span>الفهرس الأبجدي الكامل</span>
          </button>

          <button
            onClick={() => setActiveTab("shazam")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "shazam"
                ? "bg-[#1B4332] text-white shadow-sm"
                : "text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/10"
            }`}
          >
            <Radio className="w-4 h-4 text-[#C5A059]" />
            <span>شازام السماع 🎙️</span>
          </button>
        </div>

        {/* Search & Global Filter Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
            <input
              type="text"
              placeholder="ابحث بالعنوان، أو مطلع البيت، أو اسم الشاعر (مثال: شربنا، البردة، ابن الفارض، الحراق، الششتري)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-3 text-gray-400 hover:text-gray-600 text-xs"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1 text-gray-500 font-bold">
              <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>تصفية بالمقام:</span>
            </div>
            <select
              value={selectedMaqam}
              onChange={(e) => setSelectedMaqam(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#143628] dark:text-[#E5C378] font-bold focus:outline-none"
            >
              {maqamat.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 text-gray-500 font-bold pr-2">
              <span>بالموضوع:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#143628] dark:text-[#E5C378] font-bold focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {selectedSilsilaId !== null && (
              <button
                onClick={() => setSelectedSilsilaId(null)}
                className="px-2.5 py-1 rounded-lg bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] text-[11px] font-bold flex items-center gap-1 hover:bg-[#C5A059]/25 transition"
              >
                <span>السلسلة {selectedSilsilaId}</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ================================================================ */}
        {/* TAB 1: 32 SILSILAS VIEW (السلاسل الصوفية المشهودة)               */}
        {/* ================================================================ */}
        {activeTab === "silsilas" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-[#C5A059]" />
                <span>فهرس السلاسل الصوفية في مجالس الذكر والسماع (32 سلسلة):</span>
              </h2>
              <span className="text-xs text-gray-500">
                مرتبة بالتتابع كما تنشد في الزوايا
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSilsilas.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-[#143628] text-white text-[11px] font-bold font-mono">
                        {s.name}
                      </span>
                      <span className="text-[11px] font-bold text-[#C5A059]">
                        {s.poemsCount} قصائد
                      </span>
                    </div>

                    <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] group-hover:text-[#C5A059] transition">
                      {s.title}
                    </h3>

                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  {/* Poem chain in this Silsila */}
                  <div className="space-y-1.5 pt-2 border-t border-[#E7DFD5] dark:border-[#203D31]">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      سلسلة القصائد المتتابعة:
                    </span>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {s.poems.map((sp) => {
                        const fullPoem = allPoems.find((p) => p.id === sp.id);
                        return (
                          <button
                            key={sp.id}
                            onClick={() => fullPoem && setActivePoem(fullPoem)}
                            className="w-full text-right p-1.5 rounded-lg hover:bg-[#C5A059]/10 text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition flex items-center justify-between gap-2 group/item cursor-pointer"
                          >
                            <span className="truncate flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378] text-[9px] flex items-center justify-center font-mono">
                                {sp.order}
                              </span>
                              <span className="group-hover/item:text-[#C5A059]">{sp.title}</span>
                            </span>
                            <ChevronLeft className="w-3 h-3 text-gray-400 group-hover/item:text-[#C5A059]" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const firstP = allPoems.find((p) => p.id === s.poems[0]?.id);
                      if (firstP) setActivePoem(firstP);
                    }}
                    className="w-full py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] hover:bg-[#1B4332] hover:text-white text-[#143628] dark:text-[#E5C378] border border-[#C5A059]/40 hover:border-[#C5A059] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>بدء تلاوة وإنشاد السلسلة بالتتابع</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: ALPHABETICAL & SEARCH INDEX VIEW                          */}
        {/* ================================================================ */}
        {activeTab === "all" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">
                عدد القصائد المطابقة: {filteredPoems.length} قصيدة
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPoems.map((poem) => (
                <div
                  key={poem.id}
                  onClick={() => setActivePoem(poem)}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-[#143628]/10 text-[#143628] dark:text-[#E5C378] font-bold">
                      {poem.silsilaName || "الديوان"}
                    </span>
                    <span className="text-gray-400 font-mono text-[10px]">
                      {poem.maqam}
                    </span>
                  </div>

                  <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] group-hover:text-[#C5A059] transition leading-snug">
                    {poem.title}
                  </h3>

                  <p className="text-xs text-[#826122] dark:text-[#E5C378] font-medium truncate">
                    {poem.poet}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5]/60 dark:border-[#203D31] text-[11px] text-gray-600 dark:text-gray-300 font-amiri line-clamp-2">
                    {poem.allVerses[0]}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-[#C5A059] font-bold">
                    <span>{poem.allVerses.length} أبيات</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-[-2px] transition">
                      <span>عرض القصيدة والنسق</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: SHAZAM OF SAMAA (التعرف الصوتي المباشر والنسق القادم)      */}
        {/* ================================================================ */}
        {activeTab === "shazam" && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Shazam Listening Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E2019] border-2 border-[#C5A059] shadow-xl text-center space-y-6">
              <div className="relative inline-flex items-center justify-center">
                {isLiveListening && (
                  <div className="absolute inset-0 rounded-full bg-[#C5A059]/20 animate-ping" />
                )}
                <button
                  onClick={isLiveListening ? stopLiveListening : startLiveListening}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
                    isLiveListening
                      ? "bg-gradient-to-br from-red-600 to-red-800 border-red-300 text-white animate-pulse"
                      : "bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#143628] border-[#C5A059] text-white hover:scale-105"
                  }`}
                >
                  {isLiveListening ? (
                    <>
                      <MicOff className="w-8 h-8 text-white" />
                      <span className="text-[10px] font-bold mt-1">إيقاف</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-8 h-8 text-[#C5A059]" />
                      <span className="text-[10px] font-bold mt-1">بدء الاستماع</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-amiri text-xl font-bold text-[#143628] dark:text-[#E5C378]">
                  شازام السماع
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  ضع الهاتف بالقرب من المنشدين في مجلس السماع أو حلقة الذكر؛ وسيتعرف النظام فورياً على القصيدة المنشدة حالياً ويعرض لك تلقائياً السلاسل والقصائد التي ستأتي بعدها في النسق.
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 text-xs font-mono font-bold text-[#C5A059]">
                  {recognitionStatus}
                </div>
              </div>

              {isLiveListening && (
                <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] text-xs font-mono text-gray-600 dark:text-gray-300">
                  ⏱️ مدة الاستماع المستمر: {Math.floor(listeningSeconds / 60)}:
                  {String(listeningSeconds % 60).padStart(2, "0")} دقيقة
                </div>
              )}
            </div>

            {/* Recognized Poem Card with Upcoming Sequence Chain */}
            {recognizedPoem && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E2019] border border-[#C5A059] shadow-lg space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD5] dark:border-[#203D31]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                      القصيدة المنشدة حالياً في المجلس:
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] text-xs font-bold">
                    {recognizedPoem.silsilaName}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                    {recognizedPoem.title}
                  </h3>
                  <p className="text-xs text-[#826122] dark:text-[#E5C378] font-bold">
                    {recognizedPoem.poet} • {recognizedPoem.maqam}
                  </p>
                </div>

                {/* Active Verses display */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/30 space-y-2">
                  {recognizedPoem.allVerses.map((verse, vIdx) => (
                    <div
                      key={vIdx}
                      className={`p-2 rounded-xl text-center font-amiri text-sm sm:text-base transition-all ${
                        vIdx === recognizedVerseIdx
                          ? "bg-[#C5A059]/20 text-[#143628] dark:text-[#E5C378] font-bold border border-[#C5A059]"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {verse}
                    </div>
                  ))}
                </div>

                {/* UPCOMING SEQUENCE CHAIN ("السلاسل اللي غيجيوا من وراها") */}
                <div className="space-y-3 pt-3 border-t border-[#E7DFD5] dark:border-[#203D31]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4 text-[#C5A059]" />
                      القصائد المتوقع إنشادها تالياً في هذه السلسلة (واحدة تلو الأخرى) :
                    </span>
                    <span className="text-[11px] text-gray-500">
                      تتابع نسق النوبة
                    </span>
                  </div>

                  {upcomingChain.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {upcomingChain.map((up) => {
                        const fullUp = allPoems.find((p) => p.id === up.id);
                        return (
                          <button
                            key={up.id}
                            onClick={() => fullUp && setActivePoem(fullUp)}
                            className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-right transition flex items-center justify-between group cursor-pointer"
                          >
                            <div className="overflow-hidden">
                              <span className="text-xs font-bold block truncate text-[#143628] dark:text-[#FAF7F2] group-hover:text-[#C5A059]">
                                {up.order}. {up.title}
                              </span>
                              <span className="text-[10px] text-gray-500 block truncate">
                                {up.poet}
                              </span>
                            </div>
                            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059] flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic text-center py-2">
                      وصل المجلس لآخر قصيدة في هذه السلسلة المباركة.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================================================================ */}
      {/* MASTER SEQUENTIAL POEM READER MODAL (واحدة ورا واحدة)           */}
      {/* ================================================================ */}
      {activePoem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-3xl max-h-[90vh] bg-[#FAF7F2] dark:bg-[#07130E] rounded-3xl border-2 border-[#C5A059] shadow-2xl flex flex-col justify-between overflow-hidden"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-l from-[#143628] via-[#1B4332] to-[#143628] text-white flex items-center justify-between border-b border-[#C5A059]/40">
              <div className="space-y-0.5">
                <span className="px-2 py-0.5 rounded-md bg-[#C5A059]/20 text-[#E5C378] text-[10px] font-bold font-mono">
                  {activePoem.silsilaName} • رقم {activePoem.orderInSilsila}
                </span>
                <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#FAF7F2]">
                  {activePoem.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Font Size controls */}
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1 text-xs">
                  <button
                    onClick={() => setVerseFontSize((prev) => Math.max(1, prev - 0.1))}
                    className="px-1.5 py-0.5 hover:bg-white/20 rounded font-bold"
                    title="تصغير الخط"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setVerseFontSize((prev) => Math.min(2, prev + 0.1))}
                    className="px-1.5 py-0.5 hover:bg-white/20 rounded font-bold"
                    title="تكبير الخط"
                  >
                    A+
                  </button>
                </div>

                <button
                  onClick={() => handleCopyPoem(activePoem)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#E5C378] transition"
                  title="نسخ الأبيات"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setActivePoem(null)}
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Verses Display with full Tashkeel */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm font-bold text-[#826122] dark:text-[#E5C378]">
                  {activePoem.poet}
                </p>
                <p className="text-[11px] text-gray-500 font-mono">
                  {activePoem.maqam} • {activePoem.category}
                </p>
              </div>

              {/* Verses Container */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-inner space-y-4">
                {activePoem.allVerses.map((verse, idx) => {
                  const parts = verse.split(" ... ");
                  return (
                    <div
                      key={idx}
                      className="py-2.5 px-3 border-b border-[#E7DFD5]/40 dark:border-[#203D31]/40 last:border-b-0"
                    >
                      {parts.length === 2 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center font-amiri leading-loose">
                          <span
                            className="text-[#143628] dark:text-[#FAF7F2] font-semibold"
                            style={{ fontSize: `${verseFontSize}rem` }}
                          >
                            {parts[0]}
                          </span>
                          <span
                            className="text-[#826122] dark:text-[#E5C378] font-semibold"
                            style={{ fontSize: `${verseFontSize}rem` }}
                          >
                            {parts[1]}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="text-center font-amiri text-[#143628] dark:text-[#FAF7F2] font-semibold leading-loose"
                          style={{ fontSize: `${verseFontSize}rem` }}
                        >
                          {verse}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Spiritual Explanation */}
              {activePoem.spiritualExplanation && (
                <div className="p-4 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 space-y-1 text-xs">
                  <span className="font-bold text-[#826122] dark:text-[#E5C378] block">
                    💡 الإشارة والذوق الصوفي للقصيدة:
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-amiri text-sm">
                    {activePoem.spiritualExplanation}
                  </p>
                </div>
              )}

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
            </div>

            {/* Modal Footer: Sequential Chain Navigator ("واحدة ورا واحدة") */}
            <div className="p-4 bg-white dark:bg-[#0E2019] border-t border-[#E7DFD5] dark:border-[#203D31] flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Previous in Silsila */}
              <button
                disabled={!activePoem.prevPoemInSilsila}
                onClick={handleNavigatePrev}
                className="px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] text-[#143628] dark:text-[#E5C378] border border-[#C5A059]/40 hover:border-[#C5A059] font-bold flex items-center gap-1.5 transition disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>
                  السابقة: {activePoem.prevPoemInSilsila?.title || "بداية السلسلة"}
                </span>
              </button>

              <span className="text-[11px] font-mono text-gray-500">
                {activePoem.silsilaName} (رقم {activePoem.orderInSilsila})
              </span>

              {/* Next in Silsila */}
              <button
                disabled={!activePoem.nextPoemInSilsila}
                onClick={handleNavigateNext}
                className="px-3 py-2 rounded-xl bg-[#1B4332] text-white hover:bg-[#143628] border border-[#C5A059] font-bold flex items-center gap-1.5 transition disabled:opacity-30 cursor-pointer"
              >
                <span>
                  التالية: {activePoem.nextPoemInSilsila?.title || "نهاية السلسلة"}
                </span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grand Qasaid Dual-Mode Modal Reader */}
      <GrandQasaidModal
        qasida={activeGrandQasida}
        isOpen={!!activeGrandQasida}
        onClose={() => setActiveGrandQasida(null)}
        initialTab={grandInitialTab}
      />

      <Footer />
    </div>
  );
}
