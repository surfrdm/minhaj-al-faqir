"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Scroll,
  BookOpen,
  ShieldCheck,
  HeartHandshake,
  Sun,
  Flame,
  Award,
  ChevronLeft,
  ArrowUpRight,
  Music,
} from "lucide-react";
import grandQasaidData from "@/data/grand_qasaid_master.json";
import { GrandQasaidModal, GrandQasidaItem } from "@/components/GrandQasaidModal";

export function GrandQasaidHomeSection() {
  const [activeQasida, setActiveQasida] = useState<GrandQasidaItem | null>(null);
  const [initialTab, setInitialTab] = useState<"matn" | "explanation">("matn");

  const tier1Items = (grandQasaidData as GrandQasidaItem[]).filter(
    (q) => q.tier === 1
  );
  const tier2Items = (grandQasaidData as GrandQasidaItem[]).filter(
    (q) => q.tier === 2
  );

  const openReader = (qasida: GrandQasidaItem, tab: "matn" | "explanation") => {
    setActiveQasida(qasida);
    setInitialTab(tab);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-[#C5A059]/30 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/35 text-[#826122] dark:text-[#E5C378] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>مَـفَاتِيـحُ الفَرَجِ وَأُمَّهَاتُ المَدَائِحِ الكُبْرَى</span>
          </div>

          <h2 className="font-amiri text-2xl sm:text-3xl lg:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2] tracking-wide">
            أُمَّهَاتُ الأَوْرَادِ وَالقَصَائِدِ الجَامِعَةِ
          </h2>

          <p className="text-xs sm:text-sm text-[#52796F] dark:text-[#9BB0A5] font-ibm mt-1">
            القصائد الروحية الكبرى وأوراد الاستنصار والختم المعتمدة في التربية والسلوك، مع متونها المشكولة وشروحها التراثية.
          </p>
        </div>

        <Link
          href="/diwan"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#122820] border border-[#C5A059]/40 hover:border-[#C5A059] text-xs font-bold text-[#826122] dark:text-[#E5C378] hover:bg-[#C5A059]/15 transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <span>تصفح الديوان الكامل (155 قصيدة)</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* TIER 1: THE THREE IMMEDIATE INVOCATION & KHATM PILLARS */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#143628] dark:text-[#E5C378] font-ibm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
          <span>أَوْرَادُ الفَرَجِ وَالِاعْتِصَامِ وَالخَتْمِ المُبَارَكِ (الأوراد الاستغاثية الثلاثة)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tier1Items.map((item) => {
            const isMunf = item.id === "munfarijah";
            const isNasir = item.id === "nasiri";
            const isDalail = item.id === "dalail_khatm";

            return (
              <div
                key={item.id}
                className="group relative p-5 rounded-3xl bg-white dark:bg-[#0B1F17] border-2 border-[#E7DFD5] dark:border-[#1E382B] hover:border-[#C5A059] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                {/* Decorative Top Accent */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#143628] to-[#1B4332] text-[#E5C378] flex items-center justify-center border border-[#C5A059]/40 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    {isMunf ? (
                      <Sun className="w-6 h-6" />
                    ) : isNasir ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : (
                      <HeartHandshake className="w-6 h-6" />
                    )}
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-ibm bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] border border-[#C5A059]/30">
                    {item.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] group-hover:text-[#C5A059] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#52796F] dark:text-[#9BB0A5] font-ibm">
                    {item.poet} {item.poetDeath ? `(ت ${item.poetDeath})` : ""}
                  </p>

                  {/* Sample Verse / Matlaa */}
                  <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#C5A059]/20 font-amiri text-xs sm:text-sm text-[#143628] dark:text-[#E8F0EC] leading-relaxed line-clamp-2">
                    « {item.verses[0]?.sadr} {item.verses[0]?.ajuz ? `• ${item.verses[0].ajuz}` : ""} »
                  </div>
                </div>

                {/* Action Buttons: Matn vs Explanation */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <button
                    onClick={() => openReader(item, "matn")}
                    className="py-2.5 px-3 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Scroll className="w-3.5 h-3.5" />
                    <span>تلاوة المتن</span>
                  </button>

                  <button
                    onClick={() => openReader(item, "explanation")}
                    className="py-2.5 px-3 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] hover:bg-[#C5A059]/20 text-[#143628] dark:text-[#FAF7F2] border border-[#C5A059]/40 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>الشرح الصوفي</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TIER 2: BURDA & HAMZIYYA (THE TWO GRAND PROPHETIC ODES) */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#143628] dark:text-[#E5C378] font-ibm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
          <span>أُمَّهَاتُ المَدَائِحِ النَّبَوِيَّةِ البُوصِيرِيَّةِ (البردة الكبرى والهمزية الغراء)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tier2Items.map((item) => {
            const isBurda = item.id === "burda";

            return (
              <div
                key={item.id}
                className="group relative p-6 rounded-3xl bg-gradient-to-br from-white via-[#FFFDF9] to-[#FAF7F2] dark:from-[#0B1F17] dark:via-[#0E261D] dark:to-[#07130E] border-2 border-[#C5A059]/50 hover:border-[#C5A059] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 border-2 border-[#C5A059] text-[#C5A059] flex items-center justify-center shrink-0">
                      {isBurda ? <Award className="w-6 h-6" /> : <Scroll className="w-6 h-6" />}
                    </div>

                    <div>
                      <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] group-hover:text-[#C5A059] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#52796F] dark:text-[#9BB0A5] font-ibm">
                        {item.poet} • {item.versesCount} بيتاً تاماً
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold font-ibm bg-[#143628] text-[#E5C378] border border-[#C5A059]/50">
                    {item.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#1D2A24] dark:text-[#E8F0EC]/90 font-ibm leading-relaxed line-clamp-2">
                  {item.intro}
                </p>

                {/* Opening Verse */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#122820] border border-[#C5A059]/30 font-amiri text-xs sm:text-sm text-[#826122] dark:text-[#E5C378] font-bold text-center">
                  « {item.verses[0]?.sadr} • {item.verses[0]?.ajuz} »
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C5A059]/25 text-xs">
                  <button
                    onClick={() => openReader(item, "matn")}
                    className="py-2.5 px-3 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-[#E5C378] font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>مطالعة المتن المشكول</span>
                  </button>

                  <button
                    onClick={() => openReader(item, "explanation")}
                    className="py-2.5 px-3 rounded-xl bg-white dark:bg-[#122820] hover:bg-[#C5A059]/20 text-[#143628] dark:text-[#FAF7F2] border border-[#C5A059]/50 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>الشرح الصوفي واللغوي</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL VIEWER */}
      <GrandQasaidModal
        qasida={activeQasida}
        isOpen={!!activeQasida}
        onClose={() => setActiveQasida(null)}
        initialTab={initialTab}
      />
    </section>
  );
}
