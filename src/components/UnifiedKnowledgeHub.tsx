"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  Scale,
  Clock,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Scroll,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Share2,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import { ArbaeenSection } from "./ArbaeenSection";
import { HikamArchive } from "./HikamArchive";
import { HikmaOfTheDay } from "./HikmaOfTheDay";
import { CurriculumRoadmap } from "./CurriculumRoadmap";
import { GlossarySection } from "./GlossarySection";

export type KnowledgeTab =
  | "arbaeen"
  | "hikam"
  | "hikma-day"
  | "ibn-ashir"
  | "tracks"
  | "evidence"
  | "wazifa"
  | "glossary";

import { IBN_ASHIR_ALL_VERSES, IBN_ASHIR_CHAPTERS } from "@/lib/ibn-ashir";

interface NavBranch {
  id: KnowledgeTab;
  title: string;
  badge?: string;
  count?: string;
  desc: string;
  icon: any;
}

interface NavCategory {
  id: string;
  title: string;
  subtitle: string;
  branches: NavBranch[];
}

const CATEGORIES: NavCategory[] = [
  {
    id: "hadith",
    title: "مساق الحديث النبوي الشريف",
    subtitle: "جوامع الكلم وقواعد الدين الكلية",
    branches: [
      {
        id: "arbaeen",
        title: "الأربعين النووية",
        badge: "42 حديثاً",
        count: "42 لوحة",
        desc: "لوحات فنية عالية الدقة مع التخريج والمدارسة",
        icon: Scroll,
      },
    ],
  },
  {
    id: "tarbiya",
    title: "مساق التربية والتصوف والسلوك",
    subtitle: "تزكية النفوس ومقامات السائرين إلى الله",
    branches: [
      {
        id: "hikam",
        title: "الحكم العطائية الكبرى",
        badge: "264 حكمة",
        count: "264 درة",
        desc: "الأرشيف التفاعلي الكامل المصنف بالمقامات",
        icon: Layers,
      },
      {
        id: "hikma-day",
        title: "درة اليوم العطائية",
        badge: "يومي",
        count: "حكمة اليوم",
        desc: "تأمل روحي يومي متجدد لشحذ الهمة",
        icon: Sparkles,
      },
      {
        id: "tracks",
        title: "الأسلاك التكوينية المدرسية",
        badge: "4 أسلاك",
        count: "4 مسارات",
        desc: "تدرج بيداغوجي مدرسي للسالك من البداية للتحقيق",
        icon: GraduationCap,
      },
    ],
  },
  {
    id: "taasil",
    title: "مساق التأصيل الفقهي والشرعي",
    subtitle: "الثوابت المغربية: فقه مالك وعقد الأشعري وتصوف الجنيد",
    branches: [
      {
        id: "ibn-ashir",
        title: "متن ابن عاشر (المرشد المعين)",
        badge: "317 بيتاً",
        count: "الأبيات والشروح",
        desc: "منظومة الثوابت الثلاث: التوحيد والفقه والتصوف",
        icon: BookOpen,
      },
      {
        id: "evidence",
        title: "دقائق الطريق المبرهنة",
        badge: "أدلة قطعية",
        count: "السبحة والجهر",
        desc: "تأصيل السبحة، الجهر بالذكر، العمارة والوجد",
        icon: Scale,
      },
    ],
  },
  {
    id: "awrad",
    title: "مساق الأوراد والوظيفة الراتبة",
    subtitle: "الغذاء الروحي اليومي وفق السنة النبوية",
    branches: [
      {
        id: "wazifa",
        title: "الأوراد والوظيفة اليومية",
        badge: "الورد العام",
        count: "الصلوات الراتبة",
        desc: "صلاة الفاتح، الصلاة المشيشية، وأذكار الصباح والمساء",
        icon: Clock,
      },
    ],
  },
  {
    id: "lugha",
    title: "معجم لغة القوم ومصطلحاتهم",
    subtitle: "ضبط مفاهيم السلوك وأهل الإحسان",
    branches: [
      {
        id: "glossary",
        title: "معجم مصطلحات الطريق",
        badge: "100+ مصطلح",
        count: "قاموس السالك",
        desc: "شرح مصطلحات الصحبة، الفناء، الجمع، والوجد",
        icon: HelpCircle,
      },
    ],
  },
];

export function UnifiedKnowledgeHub() {
  const [activeTab, setActiveTab] = useState<KnowledgeTab>("arbaeen");
  const [selectedIbnAshirBab, setSelectedIbnAshirBab] = useState<string>("all");
  const [searchIbnAshir, setSearchIbnAshir] = useState<string>("");
  const [visibleVersesCount, setVisibleVersesCount] = useState<number>(30);

  // Listen to URL hash or custom events to switch tabs
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (
        hash === "arbaeen" ||
        hash === "archive" ||
        hash === "hikam" ||
        hash === "hikma-today" ||
        hash === "ibn-ashir" ||
        hash === "tracks" ||
        hash === "evidence" ||
        hash === "wazifa" ||
        hash === "glossary"
      ) {
        if (hash === "archive" || hash === "hikam") setActiveTab("hikam");
        else if (hash === "hikma-today") setActiveTab("hikma-day");
        else setActiveTab(hash as KnowledgeTab);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);

    const handleCustomSwitch = (e: any) => {
      if (typeof e.detail === "string") setActiveTab(e.detail as KnowledgeTab);
      else if (e.detail?.tabId) setActiveTab(e.detail.tabId as KnowledgeTab);
    };
    window.addEventListener("switch-knowledge-tab", handleCustomSwitch);

    return () => {
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("switch-knowledge-tab", handleCustomSwitch);
    };
  }, []);

  const handleSelectTab = (tabId: KnowledgeTab) => {
    setActiveTab(tabId);
    // Smooth scroll to hub container if below or above
    const el = document.getElementById("knowledge-hub");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Find active metadata
  let activeBranchMeta: NavBranch | undefined;
  let activeCatMeta: NavCategory | undefined;
  for (const cat of CATEGORIES) {
    const found = cat.branches.find((b) => b.id === activeTab);
    if (found) {
      activeBranchMeta = found;
      activeCatMeta = cat;
      break;
    }
  }

  return (
    <section
      id="knowledge-hub"
      className="scroll-mt-20 py-16 sm:py-20 bg-[#FAF7F2] dark:bg-[#081410] border-t border-[#E7DFD5] dark:border-[#203D31] relative transition-colors duration-300"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unified Hub Master Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 border border-[#1B4332]/20 dark:border-[#C5A059]/30 text-[#1B4332] dark:text-[#E5C378] text-xs sm:text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4 text-[#C5A059]" />
            <span>خِزَانَةُ التَّكْوِينِ الشَّامِلَةِ • زَاوِيَةُ مَدِينَةِ المَحْمَدِيَّة</span>
          </div>

          <h2 className="font-amiri text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143628] dark:text-[#FAF7F2] tracking-wide mb-4 leading-tight">
            مَعَالِمُ المِنْهَاجِ وَمَدَارِجُ الارْتِقَاءِ الرُّوحِيِّ
          </h2>

          <p className="font-ibm text-sm sm:text-base text-[#1D2A24]/80 dark:text-[#C5D5CC] leading-relaxed max-w-3xl mx-auto">
            رِحَابٌ تَرْبَوِيَّةٌ وَسُلُوكِيَّةٌ مُبَارَكَةٌ تَجْمَعُ بَيْنَ نُورِ الحَدِيثِ النَّبَوِيِّ الشَّرِيفِ (الأَرْبَعِينَ النَّوَوِيَّةَ)، دُرَرِ التَّصَوُّفِ وَالسُّلُوكِ (الحِكَمِ العَطَائِيَّةِ)،
            فِقْهِ المُرْشِدِ المُعِينِ لِابْنِ عَاشِرٍ، وَأَدِلَّةِ التَّأْصِيلِ الشَّرْعِيِّ، فِي فَضَاءٍ رُوحِيٍّ ذَاتِيٍّ يَرْتَقِي بِالسَّالِكِ رِفْقاً وَطُمَأْنِينَةً.
          </p>
        </div>

        {/* Mobile Horizontal Category Scroller */}
        <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto flex items-center gap-2 pb-2 scrollbar-none">
          {CATEGORIES.flatMap((c) => c.branches).map((branch) => {
            const Icon = branch.icon;
            const isActive = activeTab === branch.id;
            return (
              <button
                key={branch.id}
                onClick={() => handleSelectTab(branch.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? "bg-[#1B4332] text-white shadow-md border border-[#C5A059]"
                    : "bg-white dark:bg-[#122820] text-[#143628] dark:text-[#FAF7F2] border border-[#E7DFD5] dark:border-[#203D31]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C5A059]" : "text-[#8E9F96]"}`} />
                <span>{branch.title}</span>
                {branch.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-[#C5A059] text-[#143628] font-bold"
                        : "bg-[#1B4332]/10 dark:bg-white/10 text-[#C5A059]"
                    }`}
                  >
                    {branch.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Layout: Sidebar on Right (à droite), Content on Left */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* RIGHT SIDEBAR: MENU & BRANCHES (à droite en RTL) */}
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28 order-1 lg:order-2 space-y-4">
            <div className="bg-white dark:bg-[#0E2019] rounded-2xl border border-[#C5A059]/40 p-4 sm:p-5 shadow-lg space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD5] dark:border-[#203D31]">
                <div className="flex items-center gap-2 text-[#143628] dark:text-[#FAF7F2]">
                  <Layers className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-amiri text-lg font-bold">فهرس المناهل والمدارج الروحية</h3>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378]">
                  5 مدارج
                </span>
              </div>

              {/* Navigation Categories Tree */}
              <div className="space-y-4 font-ibm text-xs">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="px-2 pt-1 text-[11px] font-bold text-[#84928A] dark:text-[#8E9F96] flex items-center justify-between">
                      <span>{cat.title}</span>
                    </div>

                    <div className="space-y-1">
                      {cat.branches.map((branch) => {
                        const Icon = branch.icon;
                        const isActive = activeTab === branch.id;
                        return (
                          <button
                            key={branch.id}
                            onClick={() => handleSelectTab(branch.id)}
                            className={`w-full p-2.5 rounded-xl text-right transition-all flex items-center justify-between group ${
                              isActive
                                ? "bg-[#1B4332] text-white shadow-md border border-[#C5A059]"
                                : "bg-[#FAF7F2] dark:bg-[#122820] text-[#143628] dark:text-[#E8F0EC] hover:bg-[#C5A059]/10 border border-transparent hover:border-[#C5A059]/30"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                                  isActive
                                    ? "bg-[#C5A059] text-[#143628]"
                                    : "bg-white dark:bg-[#081410] text-[#C5A059] border border-[#E7DFD5] dark:border-[#203D31]"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="font-semibold block text-xs leading-tight">
                                  {branch.title}
                                </span>
                                <span
                                  className={`text-[10px] block mt-0.5 line-clamp-1 ${
                                    isActive ? "text-[#E5C378]" : "text-[#6B7D74] dark:text-[#8E9F96]"
                                  }`}
                                >
                                  {branch.count || branch.desc}
                                </span>
                              </div>
                            </div>

                            <ChevronLeft
                              className={`w-4 h-4 transition-transform ${
                                isActive
                                  ? "text-[#C5A059] translate-x-[-2px]"
                                  : "text-[#8E9F96] group-hover:translate-x-[-2px]"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Academy Identity Footer Note */}
              <div className="pt-3 border-t border-[#E7DFD5] dark:border-[#203D31] text-[11px] text-[#84928A] dark:text-[#7A8C82] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>معالم تزكية وتأصيل معتمدة على هدي المشيخة الصوفية الجليلة</span>
              </div>
            </div>
          </aside>

          {/* LEFT CONTENT AREA: DYNAMIC VIEW (flex-1) */}
          <main className="flex-1 w-full order-2 lg:order-1 min-w-0">
            {/* Active Syllabus Breadcrumb & Info Card */}
            <div className="bg-white dark:bg-[#0E2019] rounded-2xl border border-[#E7DFD5] dark:border-[#203D31] p-4 sm:p-5 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#C5A059] font-semibold">
                  <span>خزانة المنهاج</span>
                  <span>•</span>
                  <span>{activeCatMeta?.title}</span>
                </div>
                <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                  {activeBranchMeta?.title}
                </h3>
                <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm">
                  {activeBranchMeta?.desc}
                </p>
              </div>

              {activeBranchMeta?.badge && (
                <div className="px-3.5 py-1.5 rounded-xl bg-[#1B4332]/10 dark:bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#1B4332] dark:text-[#E5C378] text-xs font-bold font-mono">
                  {activeBranchMeta.badge}
                </div>
              )}
            </div>

            {/* DYNAMIC COMPONENT RENDER */}
            <div className="bg-white dark:bg-[#0E2019] rounded-2xl border border-[#E7DFD5] dark:border-[#203D31] p-4 sm:p-6 shadow-sm">
              {/* 1. ARBAEEN NAWAWIYYA (42 POSTERS) */}
              {activeTab === "arbaeen" && <ArbaeenSection isEmbedded />}

              {/* 2. HIKAM ATA'IYYA ARCHIVE (264 CAPSULES) */}
              {activeTab === "hikam" && <HikamArchive isEmbedded />}

              {/* 3. DAILY HIKMA OF THE DAY */}
              {activeTab === "hikma-day" && <HikmaOfTheDay />}

              {/* 4. CURRICULUM ROADMAP (4 TRACKS) */}
              {activeTab === "tracks" && <CurriculumRoadmap />}

              {/* 5. MATN IBN ASHIR VIEW */}
              {activeTab === "ibn-ashir" && (() => {
                const filteredVerses = IBN_ASHIR_ALL_VERSES.filter((v) => {
                  const matchesBab =
                    selectedIbnAshirBab === "all" || v.bab === selectedIbnAshirBab;
                  const matchesSearch =
                    !searchIbnAshir ||
                    v.bayt.includes(searchIbnAshir) ||
                    v.sharh.includes(searchIbnAshir) ||
                    v.bab.includes(searchIbnAshir);
                  return matchesBab && matchesSearch;
                });

                const displayedVerses = filteredVerses.slice(0, visibleVersesCount);

                return (
                  <div className="space-y-6" id="ibn-ashir">
                    {/* Top Header Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1B4332]/10 via-[#C5A059]/10 to-[#1B4332]/10 border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-semibold text-[#C5A059] block mb-1">
                          منظومة المرشد المعين على الضروري من علوم الدين
                        </span>
                        <h4 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                          متن الإمام عبد الواحد بن عاشر (المتوفى 1040هـ)
                        </h4>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm mt-1">
                          الجامع لثوابت المذهب المغربي الشريف: في عقد الأشعري وفقه مالك وفي طريقة الجنيد السالك.
                        </p>
                      </div>

                      <div className="px-3.5 py-2 rounded-xl bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378] text-xs font-bold border border-[#C5A059]/30 shrink-0 flex items-center gap-1.5 shadow-sm">
                        <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>311 بيتاً مباركاً • 29 باباً</span>
                      </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
                      {/* Search Input */}
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-[#84928A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={searchIbnAshir}
                          onChange={(e) => {
                            setSearchIbnAshir(e.target.value);
                            setVisibleVersesCount(30);
                          }}
                          placeholder="ابحث في نص البيت أو الشرح الفقهي..."
                          className="w-full pr-9 pl-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#143628] dark:text-[#FAF7F2] placeholder-[#84928A] focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      {/* Chapter Select */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
                        <select
                          value={selectedIbnAshirBab}
                          onChange={(e) => {
                            setSelectedIbnAshirBab(e.target.value);
                            setVisibleVersesCount(30);
                          }}
                          className="px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#143628] dark:text-[#FAF7F2] font-semibold focus:outline-none focus:border-[#C5A059]"
                        >
                          <option value="all">جميع الأبواب (29 باباً)</option>
                          {IBN_ASHIR_CHAPTERS.map((ch) => (
                            <option key={ch} value={ch}>
                              {ch}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Count pill */}
                      <div className="text-[11px] text-[#84928A] font-mono shrink-0 text-left">
                        {filteredVerses.length} بيتاً
                      </div>
                    </div>

                    {/* List of Verses */}
                    <div className="grid gap-4">
                      {displayedVerses.map((v) => (
                        <div
                          key={v.id}
                          className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-3 hover:border-[#C5A059]/50 transition-all shadow-sm"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7DFD5] dark:border-[#203D31] pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center font-mono text-xs font-bold">
                                #{v.number}
                              </span>
                              <div>
                                <span className="text-[10px] text-[#C5A059] font-medium block">
                                  {v.bab}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-[#0E2019] text-[#84928A] border border-[#E7DFD5] dark:border-[#203D31]">
                                {v.qism}
                              </span>
                              <button
                                onClick={() => {
                                  const text = `📜 بيت من متن ابن عاشر (البيت #${v.number} - ${v.bab}):\n«${v.firstHemistich} ❖ ${v.secondHemistich}»\n\nالشرح:\n${v.sharh}\n\nطالع المزيد على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#ibn-ashir`;
                                  window.open(
                                    `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
                                    "_blank"
                                  );
                                }}
                                className="p-1 rounded-lg text-[#128C7E] dark:text-[#25D366] hover:bg-[#25D366]/15 transition"
                                title="مشاركة عبر واتساب"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Verses poetry */}
                          <div className="p-3 rounded-xl bg-white/80 dark:bg-[#0A1813] border border-[#C5A059]/30 shadow-inner">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 px-3 py-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#122820] text-center font-amiri font-bold text-sm sm:text-base text-[#143628] dark:text-[#FAF7F2] leading-relaxed">
                              <span className="sm:text-right flex-1">{v.firstHemistich}</span>
                              <span className="text-[#C5A059] text-xs font-mono select-none px-2">❖</span>
                              <span className="sm:text-left flex-1">{v.secondHemistich}</span>
                            </div>
                          </div>

                          {/* Explanation from Notion */}
                          <div className="p-3 rounded-xl bg-white/60 dark:bg-[#0E2019]/60 border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                            <strong className="text-[#143628] dark:text-[#FAF7F2] block mb-1">
                              الشرح:
                            </strong>
                            {v.sharh}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load More Button if more verses remain */}
                    {visibleVersesCount < filteredVerses.length && (
                      <div className="text-center pt-4">
                        <button
                          onClick={() => setVisibleVersesCount((prev) => prev + 30)}
                          className="px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] text-xs font-semibold shadow-md transition border border-[#C5A059]/40"
                        >
                          عرض المزيد من الأبيات ({filteredVerses.length - visibleVersesCount} متبقٍ)
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 5. SHARIA EVIDENCE FOR TARIQA PRACTICES */}
              {activeTab === "evidence" && (
                <div className="space-y-6" id="evidence">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#1B4332]/10 to-[#C5A059]/10 border border-[#C5A059]/30">
                    <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      التأصيل الشرعي القطعي لدقائق السير إلى الله
                    </h4>
                    <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                      بيان الحجج النقلية من الكتاب وصحيح السنة وأقوال أئمة المذاهب الأربعة لدفع أي شبهة عن أصول الذكر في الطريقة البودشيشية.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {/* Sibha Evidence */}
                    <div className="p-5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
                      <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                        <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                        <h5 className="font-amiri text-base font-bold">1. تأصيل التسبيح بالسبحة (عقد الأذكار)</h5>
                      </div>
                      <p className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed">
                        • حديث أم المؤمنين صفية رضي الله عنها: «دخل عليّ رسول الله ﷺ وبين يدي أربعة آلاف نواة أسبح بها، فقال: لقد سبحت بهذا! ألا أعلمك بأكثر مما سبحت به؟...» (رواه الترمذي والحاكم وصححه، وأقرّها على أصل التسبيح بالنوى ولم ينكره).<br />
                        • رسالة الحافظ جلال الدين السيوطي: «المنحة في السبحة»، ونصّ فيها: «لم ينقل عن أحد من السلف ولا من الخلف المنع من جواز عدّ الذكر بالسبحة، بل كان أكثرهم يعدون بها ولا يرون ذلك مكروهاً».
                      </p>
                    </div>

                    {/* Jahran Evidence */}
                    <div className="p-5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
                      <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                        <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                        <h5 className="font-amiri text-base font-bold">2. تأصيل الذكر جهراً والذكر الجماعي</h5>
                      </div>
                      <p className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed">
                        • قوله تعالى: ﴿فَاذْكُرُوا اللَّهَ كَذِكْرِكُمْ آبَاءَكُمْ أَوْ أَشَدَّ ذِكْرًا﴾ (البقرة: 200)، وكان العرب يجهرون بذكر آبائهم فأمر بالجهر بذكره سبحانه.<br />
                        • حديث صحيح البخاري عن ابن عباس رضي الله عنهما: «أن رفع الصوت بالذكر حين ينصرف الناس من المكتوبة كان على عهد النبي ﷺ، وكنت أعلم إذا انصرفوا بذلك إذا سمعته».<br />
                        • الحديث القدسي في الصحيحين: «وإن ذكرني في ملأ ذكرته في ملأ خير منهم»، وذكر الملأ لا يكون إلا جهراً وجماعة.
                      </p>
                    </div>

                    {/* Imara Evidence */}
                    <div className="p-5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
                      <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                        <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                        <h5 className="font-amiri text-base font-bold">3. تأصيل العمارة، الوجد، والسماع الروحي</h5>
                      </div>
                      <p className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed">
                        • حديث حبشة المسجد ورقصهم بحضرة النبي ﷺ وعائشة رضي الله عنها تنظر، وقوله ﷺ: «دونكم يا بني أرفدة» (متفق عليه).<br />
                        • حداء الصحابة وهم يحفرون الخندق ونشيدهم: «نحن الذين بايعوا محمدا... على الجهاد ما بقينا أبدا».<br />
                        • فتوى الإمام العز بن عبد السلام وسلطان العلماء في جواز التواجد والحركة الاضطرارية إذا غلب الوجد والشوق على الذاكر.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. AWRAD & WAZIFA GUIDE */}
              {activeTab === "wazifa" && (
                <div className="space-y-6" id="wazifa">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#1B4332]/10 to-[#C5A059]/10 border border-[#C5A059]/30">
                    <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      فقه الأوراد والوظيفة الراتبة في الطريقة البودشيشية
                    </h4>
                    <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                      التربية اليومية القائمة على المحافظة على الورد العام صباحاً ومساءً، وعمارة المجالس بالوظيفة الراتبة وصلاة الفاتح والصلاة المشيشية.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-2">
                      <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                        <Clock className="w-4 h-4 text-[#C5A059]" />
                        <h5 className="font-amiri text-base font-bold">الورد العام (صباحاً وعشياً)</h5>
                      </div>
                      <p className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed">
                        • 100 مرة: الاستغفار (أستغفر الله العظيم وأتوب إليه)<br />
                        • 100 مرة: الصلاة على النبي ﷺ<br />
                        • 100 مرة: الهيللة (لا إله إلا الله)<br />
                        يُؤدى بعد صلاة الصبح وبعد صلاة العصر/المغرب، وهو عهد السالك وركيزة صفاء قلبه.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-2">
                      <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <h5 className="font-amiri text-base font-bold">الوظيفة الراتبة والصلوات</h5>
                      </div>
                      <p className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed">
                        • الوظيفة الجامعة التي تجمع الفقراء في الزاوية كل يوم بين المغرب والعشاء.<br />
                        • تلاوة الحزب القرآني الراتب.<br />
                        • الصلاة المشيشية لسيدي عبد السلام بن مشيش.<br />
                        • صلاة الفاتح لما أغلق، وجوهرة الكمال في مجالس الجمعة.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. GLOSSARY SECTION */}
              {activeTab === "glossary" && <GlossarySection />}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
