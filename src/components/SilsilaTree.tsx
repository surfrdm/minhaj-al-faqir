"use client";

import React, { useState, useId } from "react";
import {
  Sparkles,
  Scroll,
  GitMerge,
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Award,
  Crown,
  Share2,
  ExternalLink,
} from "lucide-react";
import silsilaData from "@/data/silsila_boutchichiya.json";

interface Master {
  order: number;
  name: string;
  name_fr: string;
  dates: string;
  dates_hijri: string;
  location: string;
  title: string;
  phase: string;
  phase_name: string;
  role: string;
}

export function SilsilaTree() {
  const [activeTab, setActiveTab] = useState<"tree" | "streams" | "table" | "prompts">("tree");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [expandedMaster, setExpandedMaster] = useState<number | null>(38); // Sidi Mounir expanded by default
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const masters = silsilaData.masters as Master[];

  // Filter masters
  const filteredMasters = masters.filter((m) => {
    const matchesPhase = selectedPhase === "all" || m.phase === selectedPhase;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      m.name.toLowerCase().includes(query) ||
      m.name_fr.toLowerCase().includes(query) ||
      m.title.toLowerCase().includes(query) ||
      m.location.toLowerCase().includes(query) ||
      m.role.toLowerCase().includes(query);
    return matchesPhase && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(id);
    setTimeout(() => setCopiedPrompt(null), 2500);
  };

  // Prompts for AI Image Generators
  const chatGptPrompt = `A majestic, ultra-luxurious Islamic illuminated manuscript folio (Tazhib) depicting the grand genealogical spiritual lineage tree (Shajarah / Silsila) of the Tariqa Qadiriya Boutchichiya. 
Vertical royal poster format (aspect ratio 9:16).
Intricate Andalusian-Moroccan arabesque illumination with 24-karat embossed gold leaf foil, royal emerald green (#1B4332), deep lapis lazuli navy blue, and rich warm cream parchment vellum background (#FAF7F2).
At the top: An exquisite royal golden dome arch (Mihrab / Taj) framing the holy illumination with a radiant golden medallion cartouche for the Prophet Muhammad ﷺ.
Throughout the center: A magnificent, twisting golden vine and illuminated family tree trunk adorned with 38 circular and oval golden floral medallions (cartouches), each bordered with fine geometric Islamic micro-patterns.
Two elegant tributary branches gently converge from the left and right sides (representing the Darqawi and Tijani streams) merging smoothly into the central medallion of Sidi Boumedien ben al-Mnawwar, before leading down to the grand masters of Madagh (Sidi Abbas, Sidi Hamza, Sidi Jamal, and culminating at the bottom in a regal focal cartouche for Sidi Mounir).
Hyper-detailed gold filigree, micro-calligraphic textures, authentic Moroccan illuminated border trim (Hachiya), masterpiece resolution, Museum of Islamic Art exhibition quality, no modern artifacts, flat archival lighting.`;

  const geminiPrompt = `Masterpiece photograph of an authentic Moroccan royal illuminated manuscript on aged cream sheepskin vellum, displaying the spiritual lineage tree (Silsila) of the Qadiriya Boutchichiya Sufi order.
Format: Vertical ornate archival folio.
Style: Royal Moroccan Tazhib gilding with genuine raised gold leaf, turquoise and dark emerald mineral pigments, intricate micro-arabesques, and geometric zellige-inspired borders.
Composition: Central vertical genealogical tree with 38 symmetrical golden cartouches linked by delicate gilded flowering vines. Two lateral tributary illuminated streams join into a central focal medallion in the lower third, flowing down to a grand crowned oval cartouche at the base.
Lighting: Soft museum gallery illumination highlighting the tactile metallic sheen and embossing of the gold foil against the warm textured vellum.
Quality: Extremely sharp details, museum conservation archive quality, 8k resolution, timeless sacred Islamic art aesthetic.`;

  const goldLeafPatternId = useId();

  return (
    <section className="bg-gradient-to-b from-white via-[#FCFAF7] to-white dark:from-[#0E221B] dark:via-[#091712] dark:to-[#0E221B] rounded-3xl p-6 sm:p-10 border-2 border-[#C5A059]/40 shadow-xl space-y-8 relative overflow-hidden" id="silsila">
      {/* Decorative Traditional Islamic Arches Watermark (SVG) */}
      <div className="absolute -top-16 -left-16 w-72 h-72 text-[#C5A059]/5 pointer-events-none -z-0">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="100,10 125,75 190,100 125,125 100,190 75,125 10,100 75,75" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="100,25 120,80 175,100 120,120 100,175 80,120 25,100 80,80" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* HEADER SECTION: Title & Description */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E7DFD5] dark:border-[#1F3D2F] pb-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#9E7B35] dark:text-[#E5C378] text-xs font-semibold">
            <Crown className="w-4 h-4 text-[#C5A059]" />
            <span>السند الروحي المتصل كابراً عن كابر</span>
          </div>

          <h2 className="font-amiri text-2xl sm:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-tight">
            السلسلة الصوفية الشريفة للطريقة القادرية البودشيشية
          </h2>

          <p className="font-ibm text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8] max-w-3xl leading-relaxed">
            {silsilaData.description}
          </p>
        </div>

        {/* Official source button */}
        <a
          href={silsilaData.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/50 text-xs font-ibm font-semibold text-[#9E7B35] dark:text-[#E5C378] hover:bg-[#C5A059]/10 transition-colors shrink-0 self-start md:self-auto"
        >
          <span>المصدر الرسمي (soufisme.org)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* NAVIGATION TABS */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#F4EDE2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1C362A]">
        <button
          onClick={() => setActiveTab("tree")}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-ibm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "tree"
              ? "bg-[#1B4332] text-white shadow-md"
              : "text-[#52796F] dark:text-[#95B8A8] hover:text-[#1B4332] dark:hover:text-[#E5C378]"
          }`}
        >
          <Scroll className="w-4 h-4 text-[#C5A059]" />
          <span>شجرة السلسلة التفاعلية (38 شيخاً)</span>
        </button>

        <button
          onClick={() => setActiveTab("streams")}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-ibm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "streams"
              ? "bg-[#1B4332] text-white shadow-md"
              : "text-[#52796F] dark:text-[#95B8A8] hover:text-[#1B4332] dark:hover:text-[#E5C378]"
          }`}
        >
          <GitMerge className="w-4 h-4 text-[#C5A059]" />
          <span>مخطط الروافد الثلاثة (السر المستعاد)</span>
        </button>

        <button
          onClick={() => setActiveTab("table")}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-ibm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "table"
              ? "bg-[#1B4332] text-white shadow-md"
              : "text-[#52796F] dark:text-[#95B8A8] hover:text-[#1B4332] dark:hover:text-[#E5C378]"
          }`}
        >
          <Award className="w-4 h-4 text-[#C5A059]" />
          <span>الجدول المخطوطي المحقق</span>
        </button>

        <button
          onClick={() => setActiveTab("prompts")}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-ibm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "prompts"
              ? "bg-[#C5A059] text-[#143628] shadow-md font-black"
              : "text-[#9E7B35] dark:text-[#E5C378] hover:bg-[#C5A059]/10"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>برومبتات التوليد الفني (IA Prompts)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INTERACTIVE ILLUMINATED SILSILA TREE                                */}
      {/* ========================================================================= */}
      {activeTab === "tree" && (
        <div className="space-y-6">
          {/* Controls: Search & Phase Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في السلسلة (مثال: الجيلاني، بومدين، حمزة، منير، بغداد، 1918...)"
                className="w-full pr-10 pl-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] focus:outline-none focus:border-[#C5A059] font-ibm"
              />
            </div>

            {/* Quick phase pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-ibm">
              <button
                onClick={() => setSelectedPhase("all")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPhase === "all"
                    ? "bg-[#1B4332] text-white"
                    : "bg-[#FAF7F2] dark:bg-[#07130E] text-[#52796F] dark:text-[#95B8A8]"
                }`}
              >
                الكل ({masters.length})
              </button>
              <button
                onClick={() => setSelectedPhase("nabawi")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPhase === "nabawi"
                    ? "bg-[#1B4332] text-white"
                    : "bg-[#FAF7F2] dark:bg-[#07130E] text-[#52796F] dark:text-[#95B8A8]"
                }`}
              >
                المنبع النبوي (1-2)
              </button>
              <button
                onClick={() => setSelectedPhase("tabieen_iraq")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPhase === "tabieen_iraq"
                    ? "bg-[#1B4332] text-white"
                    : "bg-[#FAF7F2] dark:bg-[#07130E] text-[#52796F] dark:text-[#95B8A8]"
                }`}
              >
                صدر العراق (3-13)
              </button>
              <button
                onClick={() => setSelectedPhase("qadiriyya_foundation")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPhase === "qadiriyya_foundation"
                    ? "bg-[#1B4332] text-white"
                    : "bg-[#FAF7F2] dark:bg-[#07130E] text-[#52796F] dark:text-[#95B8A8]"
                }`}
              >
                القطب الجيلاني (14)
              </button>
              <button
                onClick={() => setSelectedPhase("snassen_trunk")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPhase === "snassen_trunk"
                    ? "bg-[#1B4332] text-white"
                    : "bg-[#FAF7F2] dark:bg-[#07130E] text-[#52796F] dark:text-[#95B8A8]"
                }`}
              >
                بني سناسن (15-33)
              </button>
              <button
                onClick={() => setSelectedPhase("renewal_madagh")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPhase === "renewal_madagh"
                    ? "bg-[#1B4332] text-white"
                    : "bg-[#FAF7F2] dark:bg-[#07130E] text-[#52796F] dark:text-[#95B8A8]"
                }`}
              >
                مرشدو مداغ (34-38)
              </button>
            </div>
          </div>

          {/* Central Vertical Flow Line */}
          <div className="relative pt-4 pb-8">
            <div className="absolute right-6 sm:right-8 top-8 bottom-8 w-1 bg-gradient-to-b from-[#C5A059] via-[#1B4332] to-[#C5A059] rounded-full hidden sm:block opacity-60" />

            <div className="space-y-4">
              {filteredMasters.map((m) => {
                const isExpanded = expandedMaster === m.order;
                const isSpecial = m.order === 1 || m.order === 14 || m.order === 28 || m.order === 34 || m.order === 36 || m.order === 38;

                return (
                  <div
                    key={m.order}
                    className={`relative rounded-2xl transition-all duration-300 border ${
                      isSpecial
                        ? "bg-gradient-to-r from-white via-[#FCFAF5] to-white dark:from-[#0E2019] dark:via-[#132A21] dark:to-[#0E2019] border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/30"
                        : "bg-white dark:bg-[#0B1A14] border-[#E7DFD5] dark:border-[#1F3D2F] hover:border-[#C5A059]/60"
                    } sm:mr-16 p-4 sm:p-5`}
                  >
                    {/* Badge number circle for large screens */}
                    <div
                      className={`hidden sm:flex absolute -right-[4.25rem] top-5 w-9 h-9 rounded-full items-center justify-center font-mono text-xs font-bold shadow-md z-10 ${
                        isSpecial
                          ? "bg-gradient-to-tr from-[#9E7B35] to-[#D4AF37] text-[#143628] ring-4 ring-white dark:ring-[#07130E]"
                          : "bg-[#1B4332] text-[#E5C378] border border-[#C5A059]/60"
                      }`}
                    >
                      {m.order}
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="sm:hidden font-mono text-xs px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#9E7B35] font-bold">
                            #{m.order}
                          </span>
                          <span className="text-[11px] font-ibm px-2.5 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1E382C] text-[#52796F] dark:text-[#95B8A8]">
                            {m.phase_name}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#6B7D74] dark:text-[#95B8A8]">
                            <MapPin className="w-3 h-3 text-[#C5A059]" />
                            <span>{m.location}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#6B7D74] dark:text-[#95B8A8]">
                            <Calendar className="w-3 h-3 text-[#C5A059]" />
                            <span dir="ltr">{m.dates}</span>
                          </span>
                        </div>

                        <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#143628] dark:text-[#FAF7F2] flex items-center gap-2">
                          <span>{m.name}</span>
                          {isSpecial && <Crown className="w-4 h-4 text-[#C5A059] shrink-0 inline" />}
                        </h3>

                        <p className="font-ibm text-xs sm:text-sm text-[#C5A059] font-medium">
                          {m.role}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => setExpandedMaster(isExpanded ? null : m.order)}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] hover:bg-[#C5A059]/15 border border-[#E7DFD5] dark:border-[#1F3D2F] text-xs font-ibm font-medium text-[#1B4332] dark:text-[#E5C378] flex items-center gap-1.5 transition-colors"
                        >
                          <span>{isExpanded ? "إخفاء البيان" : "تفاصيل السند"}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-[#E7DFD5] dark:border-[#1F3D2F] space-y-2.5 font-ibm text-xs sm:text-sm text-[#1D2A24]/90 dark:text-[#D5E2DB] leading-relaxed">
                        <p className="font-amiri text-base text-[#143628] dark:text-[#E5C378] font-bold">
                          {m.title}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[#6B7D74] dark:text-[#95B8A8] pt-1">
                          <span>الاسم باللاتينية: <em>{m.name_fr}</em></span>
                          {m.dates_hijri && <span>التاريخ الهجري: {m.dates_hijri}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CONFLUENT STREAMS DIAGRAM (SCHÉMA DES 3 RIVIÈRES)                  */}
      {/* ========================================================================= */}
      {activeTab === "streams" && (
        <div className="space-y-8 py-4">
          <div className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#C5A059]/50 space-y-3">
            <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] flex items-center gap-2">
              <GitMerge className="w-6 h-6 text-[#C5A059]" />
              <span>النسب الثلاثي واجتماع الروافد في «سيدي بومدين بن المنور»</span>
            </h3>
            <p className="font-ibm text-sm sm:text-base text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
              تستمد الطريقة القادرية البودشيشية اسمها من القطب مولاي عبد القادر الجيلاني، غير أن السر الروحي فيها استُعيد كاملاً تاماً بعد أن تلقى شيخ الوصل <strong>سيدي بومدين بن المنور (1873-1957 م)</strong> رافدين جليلين إلى جانب نسبه القادري الأسري: الرافد الشاذلي الدرقاوي عبر <strong>سيدي محمد لحلو الفاسي</strong>، والرافد التجاني عبر <strong>سيدي محمد بن موسى</strong> ثم <strong>سيدي المهدي بن العريان</strong>. ثم أودع السر في يوم واحد عند مريديه: سيدي الحاج العباس وابنه سيدي حمزة.
            </p>
          </div>

          {/* Interactive Confluent Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-ibm">
            {/* Branch 1: Qadiriyya Trunk */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border-2 border-[#1B4332] dark:border-[#2D5A47] space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378] font-bold">
                <Crown className="w-5 h-5 text-[#C5A059]" />
                <h4 className="font-amiri text-lg">الجذع القادري الأسري</h4>
              </div>
              <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8]">
                السند المتصل من النبي ﷺ والإمام علي والجنيد إلى الشيخ عبد القادر الجيلاني ببغداد، ثم سلالة بني سناسن بالمغرب (19 حلقة أسرية).
              </p>
              <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]">
                مولاي عبد القادر الجيلاني ➔ سيدي علي البودشيش ➔ الحاج المختار الثالث
              </div>
            </div>

            {/* Branch 2: Darqawiyya Stream */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border-2 border-[#C5A059] space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#C5A059] font-bold">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
                <h4 className="font-amiri text-lg">الرافد الشاذلي الدرقاوي</h4>
              </div>
              <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8]">
                إمداد الطريقة الشاذلية الدرقاوية، مدرسة التجريد والمحبة وفناء الإرادة في مراد الله.
              </p>
              <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]">
                سيدي محمد لحلو الفاسي (شيخ شاذلي-درقاوي)
              </div>
            </div>

            {/* Branch 3: Tijaniyya Stream */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border-2 border-[#52796F] dark:border-[#4B8272] space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#52796F] dark:text-[#A1B3A9] font-bold">
                <Scroll className="w-5 h-5 text-[#C5A059]" />
                <h4 className="font-amiri text-lg">الرافد التجاني المبارك</h4>
              </div>
              <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8]">
                إمداد الصلاة على النبي ﷺ والفتوح المحمدي في الطريقة التجانية.
              </p>
              <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]">
                سيدي محمد بن موسى ➔ سيدي المهدي بن العريان
              </div>
            </div>
          </div>

          {/* Central Confluence Card (Sidi Boumedien) */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1B4332] via-[#143628] to-[#1B4332] text-[#FAF7F2] border-2 border-[#C5A059] shadow-2xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>مصب الروافد الثلاثة وملتقى الأنوار</span>
            </div>
            <h3 className="font-amiri text-2xl sm:text-3xl font-bold">
              سيدي بومدين بن المنور القادري البودشيشي (1873 – 1957 م)
            </h3>
            <p className="font-ibm text-sm sm:text-base text-[#FAF7F2]/90 max-w-3xl mx-auto leading-relaxed">
              «السر المستعاد في تمامه»: في شخصه الشريف التأمت الأمانة القادرية مع الفتوحات الدرقاوية والتجانية، فقام بالتربية الحية وسلم الأمانة في بادرة واحدة لمريديه: سيدي الحاج العباس وابنه سيدي حمزة.
            </p>
          </div>

          {/* Succession of Madagh Masters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-ibm">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#1F3D2F] text-center space-y-2">
              <span className="font-mono text-xs text-[#C5A059] font-bold">1960 – 1972 م</span>
              <h4 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                سيدي الحاج العباس
              </h4>
              <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8]">
                مؤسس زاوية مداغ الحديثة وباعث مجالس الذكر والمحبة
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border-2 border-[#C5A059] text-center space-y-2 shadow-sm">
              <span className="font-mono text-xs text-[#C5A059] font-bold">1972 – 2017 م</span>
              <h4 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                سيدي حمزة بن العباس
              </h4>
              <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8]">
                مجدد التصوف العالمي الذي عمّ إشعاعه القارات الخمس
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#1F3D2F] text-center space-y-2">
              <span className="font-mono text-xs text-[#C5A059] font-bold">2017 – 2025 م</span>
              <h4 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                سيدي جمال الدين
              </h4>
              <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8]">
                صاحب الحكمة والوقار ورعاية الملتقيات العلمية الكبرى
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#C5A059]/15 to-transparent border-2 border-[#C5A059] text-center space-y-2 ring-2 ring-[#C5A059]/30">
              <span className="font-mono text-xs text-[#143628] dark:text-[#E5C378] font-bold">العهد الحالي (2025 - الآن)</span>
              <h4 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                سيدي منير القادري بودشيش
              </h4>
              <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8]">
                شيخ الطريقة ومربيها الروحي بالوصيتين المباركتين
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COMPLETE ILLUMINATED MANUSCRIPT TABLE                               */}
      {/* ========================================================================= */}
      {activeTab === "table" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-[#E7DFD5] dark:border-[#1F3D2F]">
            <table className="w-full text-right font-ibm text-xs sm:text-sm">
              <thead className="bg-[#FAF7F2] dark:bg-[#07130E] text-[#143628] dark:text-[#FAF7F2] border-b border-[#E7DFD5] dark:border-[#1F3D2F]">
                <tr>
                  <th className="p-3.5 font-bold">#</th>
                  <th className="p-3.5 font-bold">اسم الشيخ العارف</th>
                  <th className="p-3.5 font-bold">الموقع والمنطقة</th>
                  <th className="p-3.5 font-bold">الحقبة والوفاة</th>
                  <th className="p-3.5 font-bold">المقام والصفة الروحية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DFD5] dark:divide-[#1F3D2F] bg-white dark:bg-[#0B1A14]">
                {masters.map((m) => (
                  <tr
                    key={m.order}
                    className={`hover:bg-[#C5A059]/5 transition-colors ${
                      m.order === 1 || m.order === 14 || m.order === 34 || m.order === 38
                        ? "bg-[#C5A059]/10 font-medium"
                        : ""
                    }`}
                  >
                    <td className="p-3.5 font-mono font-bold text-[#C5A059]">
                      {m.order}
                    </td>
                    <td className="p-3.5 font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                      {m.name}
                    </td>
                    <td className="p-3.5 text-[#52796F] dark:text-[#A1B3A9]">
                      {m.location}
                    </td>
                    <td className="p-3.5 font-mono text-xs" dir="ltr">
                      {m.dates}
                    </td>
                    <td className="p-3.5 text-[#1D2A24]/90 dark:text-[#D5E2DB]">
                      {m.title}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AI ARTWORK GENERATION PROMPTS (ChatGPT Image & Gemini Pro Image)   */}
      {/* ========================================================================= */}
      {activeTab === "prompts" && (
        <div className="space-y-6 py-2">
          <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#C5A059]/40 space-y-2">
            <h3 className="font-amiri text-xl font-bold text-[#143628] dark:text-[#FAF7F2] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <span>أوامر التوليد الفني (Prompts) لإنشاء لوحة التذهيب والشجرة الشريفة</span>
            </h3>
            <p className="font-ibm text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
              استخدم هذه البرومبتات الاحترافية المكتوبة بلغة الوصف الفني الدقيق للحصول على خلفية مذهبة ومخطوطة ملكية عالية الدقة بدون تشويه، مهيأة لكتابة وإدراج أسماء المشايخ:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-ibm">
            {/* Prompt 1: ChatGPT Image (DALL-E 3) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2019] border-2 border-[#1B4332] dark:border-[#204033] space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#1B4332] text-white text-xs font-bold">
                    ChatGPT Image (DALL-E 3)
                  </span>
                  <span className="text-xs text-[#C5A059] font-mono">Format 9:16 Vertical</span>
                </div>

                <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                  شجرة السلسلة الشريفة بالطراز المغربي الأندلسي المذهب (Tazhib)
                </h4>

                <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] text-xs font-mono text-[#1D2A24]/90 dark:text-[#D5E2DB] leading-relaxed max-h-56 overflow-y-auto select-all" dir="ltr">
                  {chatGptPrompt}
                </div>
              </div>

              <button
                onClick={() => handleCopy(chatGptPrompt, "chatgpt")}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {copiedPrompt === "chatgpt" ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-[#C5A059]" />}
                <span>{copiedPrompt === "chatgpt" ? "تم نسخ البرومبت بنجاح!" : "نسخ برومبت ChatGPT Image"}</span>
              </button>
            </div>

            {/* Prompt 2: Gemini Pro Image (Imagen 3 / 4) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2019] border-2 border-[#C5A059] space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#C5A059] text-[#143628] text-xs font-black">
                    Gemini Pro Image (Imagen 3)
                  </span>
                  <span className="text-xs text-[#52796F] dark:text-[#A1B3A9] font-mono">8K Archival Folio</span>
                </div>

                <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                  لوحة المخطوطة الأرشيفية المذهبة بالورق الملكي التراثي
                </h4>

                <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] text-xs font-mono text-[#1D2A24]/90 dark:text-[#D5E2DB] leading-relaxed max-h-56 overflow-y-auto select-all" dir="ltr">
                  {geminiPrompt}
                </div>
              </div>

              <button
                onClick={() => handleCopy(geminiPrompt, "gemini")}
                className="w-full py-2.5 px-4 rounded-xl bg-[#C5A059] hover:bg-[#b08d48] text-[#143628] text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {copiedPrompt === "gemini" ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPrompt === "gemini" ? "تم نسخ البرومبت بنجاح!" : "نسخ برومبت Gemini Pro Image"}</span>
              </button>
            </div>
          </div>

          {/* Workflow Guide for Poster Insertion */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] space-y-2 font-ibm text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB]">
            <h5 className="font-amiri text-base font-bold text-[#143628] dark:text-[#E5C378]">
              💡 طريقة إدراج أسماء المشايخ على الصورة المولدة (Workflow):
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>انسخ أحد البرومبتين أعلاه والصقه في <strong>ChatGPT Plus (DALL-E 3)</strong> أو <strong>Gemini Advanced (Imagen 3)</strong> لإنشاء إطار المخطوطة وشجرة الميداليات المذهبة الفارغة.</li>
              <li>حمّل الصورة الناتجة بصيغة عالية الجودة (PNG أو 4K).</li>
              <li>افتح الصورة على <strong>Canva</strong> أو <strong>Photoshop</strong> أو <strong>محرر الملصقات الداخلي في الموقع (/tasmeem)</strong>.</li>
              <li>انسخ أسماء المشايخ من <strong>«الجدول المخطوطي المحقق»</strong> وضع كل اسم داخل الميدالية المخصصة له بخط الثلث أو الخط المغربي المبسوط.</li>
            </ol>
          </div>
        </div>
      )}

      {/* FOOTER NOTICE: Authentic Silsila Verification */}
      <div className="pt-4 border-t border-[#E7DFD5] dark:border-[#1F3D2F] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7D74] dark:text-[#95B8A8] font-ibm gap-2">
        <span>السند الروحي محقق ومعتمد رسمياً من مشيخة الطريقة القادرية البودشيشية بمداغ الشريفة.</span>
        <span className="font-mono text-[#C5A059]">38 مرتبة نورانية متصلة</span>
      </div>
    </section>
  );
}
