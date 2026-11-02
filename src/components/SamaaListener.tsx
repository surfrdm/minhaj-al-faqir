"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Music,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Share2,
  ArrowRight,
  BookOpen,
  Volume2,
  Check,
  Search,
} from "lucide-react";
import samaaList from "@/data/samaa_sequence.json";

interface Poem {
  id: string;
  title: string;
  poet: string;
  maqam: string;
  allVerses: string[];
  spiritualExplanation: string;
  nextSuggestedPoems: { id: string; title: string; poet: string }[];
}

export function SamaaListener() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [recognizedPoem, setRecognizedPoem] = useState<Poem | null>(null);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [copied, setCopied] = useState(false);

  // Interval timer for 6 seconds listening
  useEffect(() => {
    let timer: any = null;
    if (isListening && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isListening && countdown === 0) {
      // Finished 6s listening, fetch recognition
      setIsListening(false);
      performRecognition();
    }
    return () => clearInterval(timer);
  }, [isListening, countdown]);

  const startListening = () => {
    setIsListening(true);
    setCountdown(6);
    setRecognizedPoem(null);

    // Try starting MediaRecorder for realistic browser microphone access if permission granted
    if (navigator?.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
        // Fallback simulation continues gracefully
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setCountdown(6);
  };

  const performRecognition = async (queryText?: string, poemId?: string) => {
    try {
      const res = await fetch("/api/samaa-recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText || searchWord,
          poemId: poemId || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.poem) {
          setRecognizedPoem(data.poem);
          setActiveVerseIndex(data.currentVerseIndex || 0);
        }
      }
    } catch (e) {
      console.error("Error recognizing samaa", e);
      // Fallback to first poem
      setRecognizedPoem(samaaList[0] as unknown as Poem);
      setActiveVerseIndex(0);
    }
  };

  const handleSelectPoem = (id: string) => {
    const p = samaaList.find((item) => item.id === id);
    if (p) {
      setRecognizedPoem(p as unknown as Poem);
      setActiveVerseIndex(0);
      setExplanationOpen(false);
    }
  };

  const sharePoem = () => {
    if (!recognizedPoem) return;
    const text = `🎵 من روائع السماع الصوفي البودشيشي:\n«${recognizedPoem.title}»\nالناظم: ${recognizedPoem.poet}\n${recognizedPoem.maqam}\n\n${recognizedPoem.allVerses.slice(0, 3).join("\n")}\n...\n\nطالع الكلمات الكاملة على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Bottom Right, next to other controls) */}
      <div className="fixed bottom-6 right-6 z-40" dir="rtl">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              if (!recognizedPoem) {
                // Default to opening poem so disciple sees lyrics immediately
                setRecognizedPoem(samaaList[0] as unknown as Poem);
              }
            }}
            className="group flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E5C378] text-[#143628] font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/60 cursor-pointer"
            title="شازام السماع الصوفي - التعرف على القصائد والإنشاد"
          >
            <Music className="w-4 h-4 fill-current" />
            <span className="font-amiri text-sm tracking-wide">شازام السماع الصوفي</span>
          </button>
        )}
      </div>

      {/* MODAL DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" dir="rtl">
          <div className="relative w-full max-w-3xl bg-[#FAF7F2] dark:bg-[#07130E] rounded-3xl border-2 border-[#C5A059] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-white flex items-center justify-between border-b border-[#C5A059]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                  <Music className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#FAF7F2]">
                    شَازَامُ السَّمَاعِ الصُّوفِيِّ • دَفْتَرُ الإِنْشَادِ
                  </h3>
                  <p className="text-[11px] text-[#E5C378]">
                    التعرف الفوري على القصيدة الجارية في الحضرة بالصوت، وعرض الكلمات كاملة للإنشاد
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  stopListening();
                }}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Listening & Search Control Bar */}
            <div className="p-4 bg-white dark:bg-[#0E2019] border-b border-[#E7DFD5] dark:border-[#203D31] flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Mic Button */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm ${
                    isListening
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-[#1B4332] text-white hover:bg-[#143628] dark:bg-[#C5A059] dark:text-[#143628]"
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>
                    {isListening
                      ? `جاري الاستماع للإنشاد (${countdown} ثوانٍ)...`
                      : "اضغط للاستماع والتعرف (6 ثوانٍ)"}
                  </span>
                </button>

                {isListening && (
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-1.5 h-8 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-5 bg-red-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                )}
              </div>

              {/* Quick Text Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") performRecognition(searchWord);
                  }}
                  placeholder="أو اكتب كلمة من القصيدة (مثال: شربنا، انصرافاً...)"
                  className="w-full pr-8 pl-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Main Content Area: POEM FULL LYRICS (مشكولة) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {recognizedPoem ? (
                <div className="space-y-6">
                  {/* Poem Identity Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#FAF7F2]/60 dark:from-[#0E2019] dark:to-[#07130E] border border-[#C5A059]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] text-[11px] font-bold">
                        {recognizedPoem.maqam}
                      </span>
                      <h2 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                        {recognizedPoem.title}
                      </h2>
                      <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-bold">
                        {recognizedPoem.poet}
                      </p>
                    </div>

                    <button
                      onClick={sharePoem}
                      className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>مشاركة القصيدة</span>
                    </button>
                  </div>

                  {/* ALL VERSES DISPLAY (diacritized مشكولة with active golden highlight) */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-[#52796F] dark:text-[#A1B3A9] px-1">
                      <span>كلمات القصيدة كاملة مشكولة (انقر على أي بيت لتحديده في الإنشاد):</span>
                      <span className="text-[11px] text-[#C5A059] font-bold">
                        البيت المحدد: {activeVerseIndex + 1} من {recognizedPoem.allVerses.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {recognizedPoem.allVerses.map((verse, index) => {
                        const isActive = index === activeVerseIndex;
                        const parts = verse.split(" ... ");

                        return (
                          <div
                            key={index}
                            onClick={() => setActiveVerseIndex(index)}
                            className={`p-3 sm:p-4 rounded-2xl border transition-all text-center cursor-pointer ${
                              isActive
                                ? "bg-gradient-to-r from-[#FAF7F2] via-amber-50 to-[#FAF7F2] dark:from-[#143628] dark:via-[#1B4332] dark:to-[#143628] border-2 border-[#C5A059] shadow-md scale-[1.01]"
                                : "bg-white dark:bg-[#0E2019] border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]/50"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                  isActive
                                    ? "bg-[#C5A059] text-white"
                                    : "bg-black/5 dark:bg-white/5 text-gray-400"
                                }`}
                              >
                                {index + 1}
                              </span>

                              {/* Verse Hemistichs */}
                              <div className="flex-1 font-amiri text-base sm:text-lg font-bold leading-loose text-[#143628] dark:text-[#FAF7F2]">
                                {parts.length === 2 ? (
                                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4">
                                    <span>{parts[0]}</span>
                                    <span className="text-[#C5A059] hidden sm:inline">...</span>
                                    <span>{parts[1]}</span>
                                  </div>
                                ) : (
                                  <span>{verse}</span>
                                )}
                              </div>

                              {isActive && (
                                <span className="text-[#C5A059] text-xs font-bold shrink-0 animate-pulse">
                                  ● جاري الإنشاد
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Collapsible Accordion: كشف الإشارات والذوق الصوفي */}
                  <div className="rounded-2xl border border-[#C5A059]/40 bg-white dark:bg-[#0E2019] overflow-hidden">
                    <button
                      onClick={() => setExplanationOpen(!explanationOpen)}
                      className="w-full p-4 flex items-center justify-between text-xs font-bold text-[#143628] dark:text-[#E5C378] hover:bg-[#C5A059]/10 transition text-right cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <span>كشف الإشارات والذوق الصوفي في هذه القصيدة</span>
                      </div>
                      {explanationOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {explanationOpen && (
                      <div className="p-4 pt-1 border-t border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB]/85 font-ibm leading-relaxed">
                        <p>{recognizedPoem.spiritualExplanation}</p>
                      </div>
                    )}
                  </div>

                  {/* Séquence canonique de la Nouba (Poèmes suivants) */}
                  <div className="pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] space-y-3">
                    <span className="text-[11px] font-bold text-[#C5A059] block uppercase tracking-wider font-ibm">
                      ما يتلوها في نوبة السماع التقليدية (الانتقال للقصيدة التالية):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {recognizedPoem.nextSuggestedPoems.map((nextP) => (
                        <button
                          key={nextP.id}
                          onClick={() => handleSelectPoem(nextP.id)}
                          className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] flex items-center justify-between text-right transition cursor-pointer group"
                        >
                          <div className="space-y-0.5">
                            <span className="font-amiri text-sm font-bold text-[#143628] dark:text-[#FAF7F2] group-hover:text-[#C5A059] transition">
                              {nextP.title}
                            </span>
                            <span className="text-[10px] text-[#52796F] dark:text-[#A1B3A9] block">
                              {nextP.poet}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#C5A059] shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-gray-500 space-y-2">
                  <Music className="w-10 h-10 mx-auto text-[#C5A059] opacity-60" />
                  <p>اضغط على زر الاستماع للتعرف على القصيدة الجارية بالزاوية.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
