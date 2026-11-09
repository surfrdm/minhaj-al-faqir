"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Users,
  HeartHandshake,
  Heart,
  GraduationCap,
  ShieldCheck,
  Search,
  BookOpen,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Filter,
} from "lucide-react";
import {
  ALL_THEMATIC_TOPICS,
  ThematicTopic,
  ThematicVerse,
  getTotalThematicVersesCount,
} from "@/lib/quran_thematic";
import { toArabicDigits } from "@/lib/quran";

interface QuranThematicExplorerProps {
  onOpenHizb?: (hizbNumber: number) => void;
}

const TOPIC_ICONS: Record<string, React.ElementType> = {
  Sparkles,
  Users,
  HeartHandshake,
  Heart,
  GraduationCap,
  ShieldCheck,
};

export function QuranThematicExplorer({ onOpenHizb }: QuranThematicExplorerProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalVerses = useMemo(() => getTotalThematicVersesCount(), []);

  // Filtered verses based on selected topic and search query
  const filteredList = useMemo(() => {
    const cleanQ = searchQuery.trim().toLowerCase();

    const list: Array<{ topic: ThematicTopic; verse: ThematicVerse }> = [];

    for (const topic of ALL_THEMATIC_TOPICS) {
      if (selectedTopicId !== "all" && topic.id !== selectedTopicId) {
        continue;
      }

      for (const verse of topic.verses) {
        if (!cleanQ) {
          list.push({ topic, verse });
        } else {
          const match =
            verse.verse_text.toLowerCase().includes(cleanQ) ||
            verse.surah_name.toLowerCase().includes(cleanQ) ||
            verse.ishari_benefit.toLowerCase().includes(cleanQ) ||
            topic.title.toLowerCase().includes(cleanQ) ||
            verse.keywords.some((k) => k.toLowerCase().includes(cleanQ));

          if (match) {
            list.push({ topic, verse });
          }
        }
      }
    }

    return list;
  }, [selectedTopicId, searchQuery]);

  const handleCopy = (verse: ThematicVerse, topic: ThematicTopic) => {
    const text = `﴿ ${verse.verse_text} ﴾\n[سورة ${verse.surah_name}، الآية ${verse.verse_number} - الحزب ${verse.hizb_number}]\n\n📜 اللطيفة الإشارية التربوية:\n${verse.ishari_benefit}\n\nطالع الكشاف القرآني لمقامات السلوك: ${typeof window !== "undefined" ? window.location.origin : ""}/quran#thematic`;

    navigator.clipboard.writeText(text);
    setCopiedId(verse.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShareWhatsApp = (verse: ThematicVerse, topic: ThematicTopic) => {
    const text = `📖 شواهد القرآن الكريم في فقه الطريق:\n\n*${topic.title}*\n\n﴿ ${verse.verse_text} ﴾\n[سورة ${verse.surah_name}، آية ${verse.verse_number} - الحزب ${verse.hizb_number}]\n\n💡 *اللطيفة الإشارية السلوكية:*\n${verse.ishari_benefit}\n\nطالع المزيد على منصة منهاج الفقير:\n${typeof window !== "undefined" ? window.location.origin : ""}/quran#thematic`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="thematic" className="space-y-6 pt-4 text-right" dir="rtl">
      {/* SECTION HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-white to-[#F5EFE6] dark:from-[#0E2019] dark:via-[#091811] dark:to-[#050E0A] border-2 border-[#C5A059]/40 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#826122] dark:text-[#E5C378] text-xs font-bold font-ibm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>فِقْهُ الطَّرِيقِ مِنْ آيَاتِ الذِّكْرِ الحَكِيمِ</span>
            </div>

            <h2 className="font-amiri text-2xl sm:text-3xl lg:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2]">
              الكَشَّافُ القُرْآنِيُّ لِمَقَامَاتِ السُّلُوكِ وَالثَّوَابِتِ
            </h2>

            <p className="text-xs sm:text-sm text-[#52796F] dark:text-[#9BB0A5] font-ibm max-w-2xl leading-relaxed">
              جمعٌ مؤصّل للآيات القرآنية الشريفة الدالة على أركان الطريق (الذِّكْر الكَثِير، صُحْبَة الصَّادِقِينَ، النَّفَقَة، المَحَبَّة، التَّزَاوُر، التَّزْكِيَة)، مشفوعةً بلطائف إشارية مستفادة من تفسير البحر المديد لابن عجيبة الحسني ولطائف الإشارات للقشيري.
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div className="px-4 py-2.5 rounded-2xl bg-[#143628] text-[#FAF7F2] border border-[#C5A059]/40 flex items-center gap-3 shrink-0">
            <BookOpen className="w-5 h-5 text-[#C5A059]" />
            <div className="text-right">
              <div className="text-xs text-[#E8F0EC]/80 font-ibm">مجموع الآيات المفهرسة</div>
              <div className="font-amiri text-lg font-bold text-[#E5C378]">
                {toArabicDigits(totalVerses)} شواهد قرآنية
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH INPUT */}
        <div className="mt-6 relative z-10">
          <div className="relative max-w-xl">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#826122] dark:text-[#C5A059]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بكلمة من الآية، اسم السورة، أو الموضوع (مثلاً: ذكرا كثيرا، ينفقون، الصادقين، ألفة)..."
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white dark:bg-[#122820] border-2 border-[#E7DFD5] dark:border-[#203D31] focus:border-[#C5A059] text-xs sm:text-sm font-ibm text-[#1D2A24] dark:text-[#FAF7F2] placeholder-[#826122]/60 focus:outline-hidden transition shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                مسح
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TOPIC FILTER TABS (PILLS) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedTopicId("all")}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold font-amiri transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer ${
            selectedTopicId === "all"
              ? "bg-[#143628] text-[#FAF7F2] shadow-sm border border-[#C5A059]"
              : "bg-[#FAF7F2] dark:bg-[#0E2019] text-[#52796F] dark:text-[#9BB0A5] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
          }`}
        >
          <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>كُلُّ المَوْضُوعَاتِ ({toArabicDigits(totalVerses)})</span>
        </button>

        {ALL_THEMATIC_TOPICS.map((topic) => {
          const Icon = TOPIC_ICONS[topic.icon] || Sparkles;
          const isSelected = selectedTopicId === topic.id;

          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold font-amiri transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? "bg-[#143628] text-[#FAF7F2] shadow-sm border border-[#C5A059]"
                  : "bg-[#FAF7F2] dark:bg-[#0E2019] text-[#52796F] dark:text-[#9BB0A5] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{topic.title}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10 font-sans">
                {topic.verses.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* VERSES CARDS GRID */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#FAF7F2] dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
          <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
          <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
            لم نعثر على آيات تطابق بحثك
          </h4>
          <p className="text-xs text-[#52796F] dark:text-[#9BB0A5] font-ibm">
            جرّب البحث بكلمة عامة مثل «ذكر» أو «نفقة» أو اختر أحد الموضوعات في الأعلى.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredList.map(({ topic, verse }) => {
            const isCopied = copiedId === verse.id;

            return (
              <div
                key={verse.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#0E2019] border-2 border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition-all duration-300 space-y-4 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                {/* Card Top: Topic Tag & Verse Coordinates */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#826122] dark:text-[#E5C378] font-bold font-ibm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                      <span>{topic.title}</span>
                    </span>

                    <span className="text-xs font-amiri font-bold text-[#143628] dark:text-[#E5C378]">
                      سُورَةُ {verse.surah_name} • الآيَةُ {verse.verse_number} (الحِزْبُ {toArabicDigits(verse.hizb_number)})
                    </span>
                  </div>

                  {/* VERSE TEXT */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5]/80 dark:border-[#203D31]/80 shadow-2xs">
                    <blockquote className="font-amiri text-lg sm:text-xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-loose text-center select-text">
                      « {verse.verse_text} »
                    </blockquote>
                  </div>

                  {/* ISHARI SUFI BENEFIT */}
                  <div className="p-3.5 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/25 space-y-1 text-right">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#826122] dark:text-[#E5C378] font-ibm">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>اللَّطِيفَةُ الإِشَارِيَّةُ السُّلُوكِيَّةُ:</span>
                    </div>
                    <p className="text-xs text-[#2A4B3C] dark:text-[#C8DED4] font-ibm leading-relaxed pt-0.5">
                      {verse.ishari_benefit}
                    </p>
                  </div>
                </div>

                {/* Card Actions: Open in Mushaf, Copy, WhatsApp */}
                <div className="pt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between gap-2">
                  {onOpenHizb && (
                    <button
                      onClick={() => onOpenHizb(verse.hizb_number)}
                      className="px-3 py-1.5 rounded-xl bg-[#143628] hover:bg-[#1E4A37] text-white text-xs font-bold font-ibm flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                      title="فتح الحزب في المصحف الشريف"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>طَالِعِ الحِزْبَ {toArabicDigits(verse.hizb_number)}</span>
                      <ExternalLink className="w-3 h-3 text-white/70" />
                    </button>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(verse, topic)}
                      className="p-2 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-gray-600 dark:text-gray-300 transition cursor-pointer"
                      title="نسخ الشاهد القرآني مع لطيفتها الإشارية"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleShareWhatsApp(verse, topic)}
                      className="p-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                      title="مشاركة الآية ولطيفتها عبر واتساب"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
