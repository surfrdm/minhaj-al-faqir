"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Video,
  Search,
  Sparkles,
  Play,
  Clock,
  Share2,
  ChevronLeft,
  Filter,
  X,
  ExternalLink,
  BookOpen,
  Award,
  Calendar,
  Check,
  Copy,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DualAudioReaderBar } from "@/components/DualAudioReaderBar";
import dourousData from "@/data/dourous_sidi_mounir.json";

interface KeyMoment {
  second: number;
  timestamp_label: string;
  topic: string;
  excerpt: string;
}

interface Dars {
  id: string;
  number: number;
  title: string;
  youtube_id: string;
  date: string;
  category: string;
  summary: string;
  key_moments: KeyMoment[];
}

const CATEGORIES = ["الكل", "الصدق", "المحبة", "الذكر", "الصحبة", "التزكية", "التأصيل", "الأخلاق", "المقامات"];

export default function DourousSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [activeVideo, setActiveVideo] = useState<{
    dars: Dars;
    startSecond: number;
    momentTitle?: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Search logic: matches title, summary, or any key moment excerpt/topic
  const filteredDourous = useMemo(() => {
    return (dourousData as Dars[]).filter((d) => {
      const matchCat = selectedCategory === "الكل" || d.category === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = d.title.toLowerCase().includes(q);
      const inSummary = d.summary.toLowerCase().includes(q);
      const inMoments = d.key_moments.some(
        (m) => m.topic.toLowerCase().includes(q) || m.excerpt.toLowerCase().includes(q)
      );

      return inTitle || inSummary || inMoments;
    });
  }, [searchQuery, selectedCategory]);

  const totalMomentsFound = useMemo(() => {
    let count = 0;
    filteredDourous.forEach((d) => {
      if (!searchQuery.trim()) {
        count += d.key_moments.length;
      } else {
        const q = searchQuery.toLowerCase().trim();
        count += d.key_moments.filter(
          (m) => m.topic.toLowerCase().includes(q) || m.excerpt.toLowerCase().includes(q)
        ).length;
      }
    });
    return count;
  }, [filteredDourous, searchQuery]);

  const handlePlayMoment = (dars: Dars, second: number, topic: string) => {
    setActiveVideo({
      dars,
      startSecond: second,
      momentTitle: topic,
    });
  };

  const shareMoment = (dars: Dars, moment: KeyMoment) => {
    const videoUrl = `https://www.youtube.com/watch?v=${dars.youtube_id}&t=${moment.second}s`;
    const text = `🎥 مقطع مبارك من دروس السبت لفضيلة الشيخ الدكتور سيدي منير القادري بودشيش:\n«${moment.topic}»\n\nنص المقطع:\n«${moment.excerpt}»\n\nشاهد المقطع مباشرة عند الدقيقة ${moment.timestamp_label}:\n${videoUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC] font-sans antialiased" dir="rtl">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#A1B3A9]">
            <Link href="/" className="hover:text-[#C5A059] transition">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <Link href="/shaykh" className="hover:text-[#C5A059] transition">
              شيخ الطريقة
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[#143628] dark:text-[#E5C378] font-bold">
              محرك البحث في دروس ومحاضرات السبت
            </span>
          </div>

          <Link
            href="/shaykh"
            className="text-xs font-bold text-[#143628] dark:text-[#E5C378] hover:text-[#C5A059] flex items-center gap-1 transition"
          >
            <span>سيرة ومسار فضيلة الشيخ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0E2019] text-[#FAF7F2] border border-[#C5A059]/40 shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold">
              <Video className="w-3.5 h-3.5" />
              <span>مكتبة الصوتيات والمرئيات • محرك البحث الدقيق بالفيديو</span>
            </div>
            <h1 className="font-amiri text-2xl sm:text-4xl font-bold tracking-wide text-[#FAF7F2]">
              دُرُوسُ السَّبْتِ المَشْهُودَةِ لِفَضِيلَةِ الشَّيْخِ سِيدِي مُنِير
            </h1>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed font-ibm">
              ابحث عن أي معنى روحي (الصدق، المحبة، الإخلاص، الذكر، العمارة، التزكية...) وشاهد فوراً كلام الشيخ بالصوت والصورة عند الثانية المحددة بدقة.
            </p>
          </div>
        </section>

        {/* Search Bar & Categories Filter */}
        <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute right-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بكلمة أو عبارة (مثال: الصدق، المحبة، 15000، العمارة، إغلاق العينين، بر الوالدين...)"
              className="w-full pr-12 pl-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs sm:text-sm text-[#1D2A24] dark:text-[#E8F0EC] focus:outline-none focus:border-[#C5A059] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition"
                title="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm dark:bg-[#C5A059] dark:text-[#143628]"
                    : "bg-[#FAF7F2] dark:bg-[#07130E] text-[#52796F] dark:text-[#A1B3A9] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#52796F] dark:text-[#A1B3A9] pt-1">
            <span>
              النتائج المعروضة: <strong>{filteredDourous.length}</strong> درس ({totalMomentsFound} مقطعاً دقيقاً)
            </span>
            {searchQuery && (
              <span className="text-[#826122] dark:text-[#E5C378]">
                نتائج مطابقة لكلمة: «{searchQuery}»
              </span>
            )}
          </div>
        </section>

        {/* Results List */}
        <div className="space-y-6">
          {filteredDourous.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
              <Video className="w-10 h-10 mx-auto text-gray-400" />
              <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                لم يتم العثور على نتائج مطابقة
              </h3>
              <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                جرب البحث بكلمات عامة مثل: الصدق، الذكر، الصحبة، المحبة.
              </p>
            </div>
          ) : (
            filteredDourous.map((dars) => (
              <div
                key={dars.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-4 hover:border-[#C5A059] transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7DFD5] dark:border-[#203D31]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] font-amiri font-bold text-sm">
                      {dars.number}
                    </div>
                    <div>
                      <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                        {dars.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-[#52796F] dark:text-[#A1B3A9]">
                        <span>{dars.date}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] font-bold">
                          {dars.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayMoment(dars, 0, dars.title)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm self-start sm:self-auto"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>مشاهدة الدرس كاملاً</span>
                  </button>
                </div>

                <p className="text-xs text-[#1D2A24]/80 dark:text-[#D5E2DB]/80 font-ibm leading-relaxed">
                  {dars.summary}
                </p>

                {/* Key Moments Timeline */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[11px] font-bold text-[#C5A059] block uppercase tracking-wider font-ibm">
                    المقاطع المسجلة بالاقتباس الزمني الدقيق:
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dars.key_moments.map((moment, idx) => {
                      const isMatch =
                        searchQuery &&
                        (moment.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          moment.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                            isMatch
                              ? "bg-amber-50/60 dark:bg-amber-950/30 border-[#C5A059] ring-2 ring-[#C5A059]/30"
                              : "bg-[#FAF7F2] dark:bg-[#07130E] border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]/60"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1B4332]/10 dark:bg-[#1B4332]/30 text-[#1B4332] dark:text-[#E8F0EC] text-[10px] font-bold font-mono">
                                <Clock className="w-3 h-3 text-[#C5A059]" />
                                <span>{moment.timestamp_label}</span>
                              </span>
                              <button
                                onClick={() => shareMoment(dars, moment)}
                                className="text-emerald-600 hover:text-emerald-700 p-1"
                                title="مشاركة المقطع عبر واتساب"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <h4 className="font-amiri text-sm font-bold text-[#143628] dark:text-[#FAF7F2]">
                              {moment.topic}
                            </h4>

                            <p className="text-[11px] text-[#52796F] dark:text-[#A1B3A9] font-ibm leading-relaxed line-clamp-3">
                              «{moment.excerpt}»
                            </p>
                          </div>

                          <DualAudioReaderBar
                            title={moment.topic}
                            text={`${moment.topic}. ${moment.excerpt}`}
                            lang="ar"
                            variant="compact"
                          />

                          <button
                            onClick={() => handlePlayMoment(dars, moment.second, moment.topic)}
                            className="w-full py-1.5 rounded-xl bg-white dark:bg-[#122820] hover:bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#143628] dark:text-[#E5C378] text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current text-[#C5A059]" />
                            <span>تشغيل عند {moment.timestamp_label}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Video Player Modal with Precise Start Timestamp */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-[#FAF7F2] dark:bg-[#07130E] rounded-3xl border-2 border-[#C5A059] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="p-4 bg-gradient-to-r from-[#143628] to-[#1B4332] text-white flex items-center justify-between border-b border-[#C5A059]/40">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <h3 className="font-amiri text-base sm:text-lg font-bold text-[#FAF7F2] truncate max-w-lg">
                      {activeVideo.momentTitle || activeVideo.dars.title}
                    </h3>
                    <span className="text-[10px] text-[#E5C378]">
                      بدء التشغيل عند الثانية: {activeVideo.startSecond} ثانية
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="إغلاق الفيديو"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* YouTube Player iframe with ?start=XXX */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.dars.youtube_id}?start=${activeVideo.startSecond}&autoplay=1`}
                  title={activeVideo.dars.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Modal Footer / Other Timestamps */}
              <div className="p-4 bg-white dark:bg-[#0E2019] border-t border-[#E7DFD5] dark:border-[#203D31] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-bold">الانتقال السريع في هذا الدرس:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeVideo.dars.key_moments.map((km, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setActiveVideo({
                            dars: activeVideo.dars,
                            startSecond: km.second,
                            momentTitle: km.topic,
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          activeVideo.startSecond === km.second
                            ? "bg-[#C5A059] text-white"
                            : "bg-[#FAF7F2] dark:bg-[#07130E] border border-gray-300 dark:border-gray-700"
                        }`}
                      >
                        {km.timestamp_label}
                      </button>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.dars.youtube_id}&t=${activeVideo.startSecond}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#143628] dark:text-[#E5C378] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>فتح في تطبيق YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
