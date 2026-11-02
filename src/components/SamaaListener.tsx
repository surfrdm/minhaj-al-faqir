"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  ExternalLink,
  Radio,
} from "lucide-react";
import samaaList from "@/data/samaa_sequence.json";

interface Poem {
  id: string;
  title: string;
  poet: string;
  diwan?: string;
  maqam: string;
  allVerses: string[];
  spiritualExplanation: string;
  nextSuggestedPoems: { id: string; title: string; poet: string }[];
}

export function SamaaListener() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContinuousListening, setIsContinuousListening] = useState(false);
  const [listeningDuration, setListeningDuration] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [recognizedPoem, setRecognizedPoem] = useState<Poem | null>(null);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [upcomingChain, setUpcomingChain] = useState<any[]>([]);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const periodicCheckRef = useRef<any>(null);
  const activePoemIdRef = useRef<string>("");

  useEffect(() => {
    activePoemIdRef.current = recognizedPoem?.id || "";
  }, [recognizedPoem]);

  // Handle continuous timer
  useEffect(() => {
    if (isContinuousListening) {
      timerRef.current = setInterval(() => {
        setListeningDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setListeningDuration(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isContinuousListening]);

  // Periodic check during live listening (checks every 7 seconds)
  useEffect(() => {
    if (isContinuousListening) {
      periodicCheckRef.current = setInterval(() => {
        if (liveTranscript.trim()) {
          querySamaa(liveTranscript);
        }
      }, 7000);
    } else {
      clearInterval(periodicCheckRef.current);
    }
    return () => clearInterval(periodicCheckRef.current);
  }, [isContinuousListening, liveTranscript]);

  const startContinuousListening = () => {
    setIsContinuousListening(true);
    setStatusMessage("الميكروفون يستمع بشكل مستمر في الحضرة...");

    // Speech Recognition
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
          querySamaa(text.trim());
        };

        reco.onerror = (e: any) => {
          console.warn("Speech recognition notice", e);
        };

        reco.onend = () => {
          if (isContinuousListening) {
            try {
              reco.start();
            } catch (err) {
              // Ignore
            }
          }
        };

        reco.start();
        recognitionRef.current = reco;
      } catch (err) {
        console.warn("Speech API start error", err);
      }
    } else {
      // Fallback: detect opening poem after 10 seconds
      setTimeout(() => {
        if (isContinuousListening && !recognizedPoem) {
          querySamaa("شربنا على ذكر الحبيب");
        }
      }, 8000);
    }
  };

  const stopContinuousListening = () => {
    setIsContinuousListening(false);
    setStatusMessage("تم إيقاف الاستماع الحي");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
    }
  };

  const querySamaa = async (queryText: string) => {
    if (!queryText.trim()) return;

    try {
      const res = await fetch("/api/samaa-recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          previousPoemId: activePoemIdRef.current,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.upcomingChain) {
          setUpcomingChain(data.upcomingChain);
        }
        if (data.poem) {
          if (data.poem.id !== activePoemIdRef.current) {
            setRecognizedPoem(data.poem);
            setActiveVerseIndex(data.currentVerseIndex || 0);
            setStatusMessage(`✨ تم رصد إنشاد: «${data.poem.title}» (${data.poem.silsilaName || "السلسلة"})`);
          } else {
            if (typeof data.currentVerseIndex === "number") {
              setActiveVerseIndex(data.currentVerseIndex);
            }
            setStatusMessage(`متابعة الإنشاد: ${data.confidence || "مطابقة مستمرة"}`);
          }
        }
      }
    } catch (e) {
      console.error("Error recognizing samaa", e);
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
    const text = `🎵 من روائع السماع الصوفي البودشيشي:\n«${recognizedPoem.title}»\nالناظم: ${recognizedPoem.poet}\n${recognizedPoem.maqam}\n\n${recognizedPoem.allVerses.slice(0, 3).join("\n")}\n...\n\nطالع الكلمات كاملة: ${typeof window !== "undefined" ? window.location.origin : ""}/samaa`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const formatSecs = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40" dir="rtl">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              if (!recognizedPoem) {
                setRecognizedPoem(samaaList[0] as unknown as Poem);
              }
            }}
            className="group flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E5C378] text-[#143628] font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/60 cursor-pointer"
            title="شازام السماع الصوفي - الاستماع الحي المستمر في الحضرة"
          >
            <Music className="w-4 h-4 fill-current" />
            <span className="font-amiri text-sm tracking-wide">السماع الصوفي الحي</span>
          </button>
        )}
      </div>

      {/* MODAL DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200" dir="rtl">
          <div className="relative w-full max-w-3xl bg-[#FAF7F2] dark:bg-[#07130E] rounded-3xl border-2 border-[#C5A059] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-white flex items-center justify-between border-b border-[#C5A059]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                  <Music className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#FAF7F2]">
                    السَّمَاعُ الصُّوفِيُّ • الاسْتِمَاعُ الحَيُّ المُسْتَمِرُّ
                  </h3>
                  <p className="text-[11px] text-[#E5C378]">
                    يستمع باستمرار في الحضرة، يعرض الأبيات مشكولة، وينتقل آلياً عند تحول المنشدين
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/samaa"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#E5C378] text-[11px] font-bold border border-[#C5A059]/40 flex items-center gap-1.5 transition"
                >
                  <span>صفحة السماع الكاملة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    stopContinuousListening();
                  }}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Listening & Control Bar */}
            <div className="p-4 bg-white dark:bg-[#0E2019] border-b border-[#E7DFD5] dark:border-[#203D31] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={isContinuousListening ? stopContinuousListening : startContinuousListening}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md ${
                    isContinuousListening
                      ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                      : "bg-[#1B4332] text-white hover:bg-[#143628] dark:bg-[#C5A059] dark:text-[#143628]"
                  }`}
                >
                  {isContinuousListening ? <Radio className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                  <span>
                    {isContinuousListening
                      ? `الميكروفون يستمع بالاستمرار (${formatSecs(listeningDuration)})...`
                      : "بدء الاستماع الحي المستمر"}
                  </span>
                </button>
              </div>

              {/* Status Note */}
              <div className="text-[11px] text-[#52796F] dark:text-[#A1B3A9] font-medium text-center sm:text-left truncate max-w-sm">
                {statusMessage || "جاهز للاستماع في الحضرة"}
              </div>
            </div>

            {/* Content Area: Active Vocalized Verses */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {recognizedPoem && (
                <div className="space-y-4">
                  {/* Meta */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#122820] border border-[#C5A059]/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378] border border-[#C5A059]/30 mb-1">
                        {recognizedPoem.maqam}
                      </div>
                      <h4 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-tight">
                        {recognizedPoem.title}
                      </h4>
                      <p className="font-amiri text-xs text-[#826122] dark:text-[#E5C378] font-bold">
                        الناظم: {recognizedPoem.poet}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={sharePoem}
                        className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-[#1B4332] dark:text-[#E5C378] hover:bg-[#C5A059]/15 transition cursor-pointer"
                        title="مشاركة عبر واتساب"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Vocalized Verses List */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] block">
                      الكلمات كاملة مشكولة (للإنشاد في الحضرة):
                    </span>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {recognizedPoem.allVerses.map((verse, idx) => {
                        const isCurrent = idx === activeVerseIndex;
                        const parts = verse.split("...");
                        const sadr = parts[0]?.trim() || verse;
                        const ajuz = parts[1]?.trim() || "";

                        return (
                          <div
                            key={idx}
                            className={`p-3 sm:p-4 rounded-xl transition-all duration-300 border ${
                              isCurrent
                                ? "bg-gradient-to-r from-[#C5A059]/25 via-[#D4AF37]/20 to-[#C5A059]/25 border-[#C5A059] shadow-sm font-bold scale-[1.01]"
                                : "bg-white/80 dark:bg-[#0E2019]/80 border-[#E7DFD5] dark:border-[#203D31]"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                              <span>بيت {idx + 1}</span>
                              {isCurrent && (
                                <span className="font-bold text-[#826122] dark:text-[#E5C378] flex items-center gap-1 animate-pulse">
                                  <Volume2 className="w-3 h-3" />
                                  البيت الجاري
                                </span>
                              )}
                            </div>

                            <div className="font-amiri text-base sm:text-lg text-[#143628] dark:text-[#FAF7F2] leading-relaxed text-center">
                              <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-4">
                                <span>{sadr}</span>
                                {ajuz && (
                                  <>
                                    <span className="hidden sm:inline text-[#C5A059]">❖</span>
                                    <span className="text-[#826122] dark:text-[#E5C378]">{ajuz}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Accordion: Spiritual Interpretation */}
                  {recognizedPoem.spiritualExplanation && (
                    <div className="rounded-2xl border border-[#C5A059]/40 bg-white dark:bg-[#0E2019] p-3.5 space-y-1.5">
                      <button
                        onClick={() => setExplanationOpen(!explanationOpen)}
                        className="w-full flex items-center justify-between font-amiri font-bold text-xs sm:text-sm text-[#143628] dark:text-[#E5C378] cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>كشف الإشارات والذوق الصوفي في هذه القصيدة</span>
                        </div>
                        {explanationOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {explanationOpen && (
                        <p className="text-xs text-[#1D2A24]/90 dark:text-[#E8F0EC]/90 leading-relaxed font-ibm pt-1.5 border-t border-[#E7DFD5] dark:border-[#203D31]">
                          {recognizedPoem.spiritualExplanation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Upcoming sequence chain in the Silsila */}
                  {upcomingChain.length > 0 && (
                    <div className="pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] space-y-2">
                      <span className="text-[11px] font-bold text-[#826122] dark:text-[#E5C378] flex items-center justify-between">
                        <span>القصائد المتوقع إنشادها تالياً في هذه السلسلة:</span>
                        <span className="text-[10px] text-gray-400">تتابع السلسلة</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {upcomingChain.slice(0, 4).map((up) => (
                          <div
                            key={up.id}
                            className="p-2 rounded-xl border border-[#E7DFD5] dark:border-[#203D31] bg-white dark:bg-[#0E2019] text-right text-xs"
                          >
                            <span className="font-amiri font-bold text-xs text-[#143628] dark:text-[#FAF7F2] block truncate">
                              {up.order}. {up.title}
                            </span>
                            <span className="text-[10px] text-gray-400 block truncate">{up.poet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next suggested poems fallback */}
                  {(!upcomingChain || upcomingChain.length === 0) && recognizedPoem.nextSuggestedPoems && recognizedPoem.nextSuggestedPoems.length > 0 && (
                    <div className="pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] space-y-2">
                      <span className="text-[11px] font-bold text-[#826122] dark:text-[#E5C378] block">
                        القصيدة التالية في نوبة الحضرة:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {recognizedPoem.nextSuggestedPoems.map((nextP) => (
                          <button
                            key={nextP.id}
                            onClick={() => handleSelectPoem(nextP.id)}
                            className="p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] bg-white dark:bg-[#0E2019] text-right transition flex items-center justify-between text-xs cursor-pointer group"
                          >
                            <div>
                              <span className="font-amiri font-bold text-xs text-[#143628] dark:text-[#FAF7F2] block group-hover:text-[#C5A059]">
                                {nextP.title}
                              </span>
                              <span className="text-[10px] text-gray-400">{nextP.poet}</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover:-translate-x-1 transition" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Bar with Link to Full Diwan Hub */}
            <div className="p-3.5 bg-gradient-to-r from-[#FAF7F2] to-[#F4EFE6] dark:from-[#0E2019] dark:to-[#07130E] border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between text-xs">
              <span className="text-gray-500 font-ibm text-[11px]">
                💡 للمكتبة الكاملة لجميع القصائد والـ 32 سلسلة مسلسلة:
              </span>
              <Link
                href="/diwan"
                onClick={() => setIsOpen(false)}
                className="font-bold text-[#143628] dark:text-[#E5C378] hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>فتح ديوان السماع الكامل</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
