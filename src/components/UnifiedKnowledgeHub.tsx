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
  Award,
  PhoneOff,
  EyeOff,
  Volume2,
  Users,
  Compass,
  Droplets,
  HeartHandshake,
  VolumeX,
  Radio,
} from "lucide-react";
import { ArbaeenSection } from "./ArbaeenSection";
import { HikamArchive } from "./HikamArchive";
import { HikmaOfTheDay } from "./HikmaOfTheDay";
import { CurriculumRoadmap } from "./CurriculumRoadmap";
import { GlossarySection } from "./GlossarySection";
import { IBN_ASHIR_TOTAL_COUNT } from "@/lib/ibn-ashir";

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
        title: "مَسَارَاتُ الارْتِقَاءِ الرُّوحِيِّ",
        badge: "4 مسارات",
        count: "4 معالم",
        desc: "تَدَرُّجٌ رُوحِيٌّ وَسُلُوكِيٌّ لِلسَّالِكِ مِنَ البِدَايَةِ إِلَى التَّحْقِيقِ",
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
        badge: `${IBN_ASHIR_TOTAL_COUNT} بيتاً`,
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
        badge: "الأوراد الراتبة",
        count: "البرنامج الخماسي",
        desc: "البرنامج الروحي الخماسي لترقية همة السالك وتنوير قلبه بالذكر وتلاوة القرآن",
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
                    className={`text-xs px-1.5 py-0.5 rounded ${
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
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378]">
                  5 مدارج
                </span>
              </div>

              {/* Navigation Categories Tree */}
              <div className="space-y-4 font-ibm text-xs">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="px-2 pt-1 text-xs font-bold text-[#52796F] dark:text-[#8E9F96] flex items-center justify-between">
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
                                  className={`text-xs block mt-0.5 line-clamp-1 ${
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
              <div className="pt-3 border-t border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#52796F] dark:text-[#7A8C82] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>معالم تزكية وتأصيل معتمدة على هدي المشيخة الصوفية الجليلة</span>
              </div>
            </div>
          </aside>

          {/* LEFT CONTENT AREA: DYNAMIC VIEW (flex-1) */}
          <div role="region" aria-label="خزانة المنهاج المعرفية" className="flex-1 w-full order-2 lg:order-1 min-w-0">
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
                        <span className="text-xs font-semibold text-[#C5A059] block mb-1">
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
                        <span>{IBN_ASHIR_TOTAL_COUNT} بيتاً مباركاً • 29 باباً</span>
                      </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
                      {/* Search Input */}
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-[#52796F] dark:text-[#A1B3A9] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                      <div className="text-xs text-[#52796F] dark:text-[#A1B3A9] font-mono shrink-0 text-left">
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
                                <span className="text-xs text-[#C5A059] font-medium block">
                                  {v.bab}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-xs px-2 py-0.5 rounded-md bg-white dark:bg-[#0E2019] text-[#52796F] dark:text-[#A1B3A9] border border-[#E7DFD5] dark:border-[#203D31]">
                                {v.qism}
                              </span>
                              <a
                                href="https://www.facebook.com/zaouia.mohammedia"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-lg text-[#1877F2] dark:text-[#5B9DF8] hover:bg-[#1877F2]/15 transition"
                                title="زيارة صفحة الزاوية على فيسبوك"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                          <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                          <h5 className="font-amiri text-base font-bold">1. تأصيل التسبيح بالسبحة (عقد الأذكار)</h5>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a
                            href="https://www.facebook.com/zaouia.mohammedia"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#5B9DF8] text-xs font-semibold flex items-center gap-1 transition"
                            title="زيارة صفحة الزاوية على فيسبوك"
                          >
                            <span>زيارة صفحة الزاوية</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => {
                              const text = `⚖️ تأصيل التسبيح بالسبحة في الطريقة البودشيشية:\nحديث أم المؤمنين صفية رضي الله عنها في إقرار النبي ﷺ للتسبيح بالنوى، ورسالة الحافظ السيوطي 'المنحة في السبحة'.\n\nطالع التأصيل كاملاً: ${typeof window !== "undefined" ? window.location.origin : ""}/#evidence`;
                              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                            }}
                            className="p-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-semibold flex items-center gap-1 transition"
                            title="مشاركة عبر واتساب"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed">
                        • حديث أم المؤمنين صفية رضي الله عنها: «دخل عليّ رسول الله ﷺ وبين يدي أربعة آلاف نواة أسبح بها، فقال: لقد سبحت بهذا! ألا أعلمك بأكثر مما سبحت به؟...» (رواه الترمذي والحاكم وصححه، وأقرّها على أصل التسبيح بالنوى ولم ينكره).<br />
                        • رسالة الحافظ جلال الدين السيوطي: «المنحة في السبحة»، ونصّ فيها: «لم ينقل عن أحد من السلف ولا من الخلف المنع من جواز عدّ الذكر بالسبحة، بل كان أكثرهم يعدون بها ولا يرون ذلك مكروهاً».
                      </p>
                    </div>

                    {/* Jahran Evidence */}
                    <div className="p-5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                          <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                          <h5 className="font-amiri text-base font-bold">2. تأصيل الذكر جهراً والذكر الجماعي</h5>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a
                            href="https://www.facebook.com/zaouia.mohammedia"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#5B9DF8] text-xs font-semibold flex items-center gap-1 transition"
                            title="زيارة صفحة الزاوية على فيسبوك"
                          >
                            <span>زيارة صفحة الزاوية</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => {
                              const text = `⚖️ تأصيل الذكر جهراً والجماعي في الطريقة البودشيشية:\nقوله تعالى: {فاذكروا الله كذكركم آباءكم أو أشد ذكراً}، وحديث البخاري عن ابن عباس في رفع الصوت بالذكر، وحديث الصحيحين: {وإن ذكرني في ملأ ذكرته في ملأ خير منهم}.\n\nطالع التأصيل كاملاً: ${typeof window !== "undefined" ? window.location.origin : ""}/#evidence`;
                              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                            }}
                            className="p-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-semibold flex items-center gap-1 transition"
                            title="مشاركة عبر واتساب"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed">
                        • قوله تعالى: ﴿فَاذْكُرُوا اللَّهَ كَذِكْرِكُمْ آبَاءَكُمْ أَوْ أَشَدَّ ذِكْرًا﴾ (البقرة: 200)، وكان العرب يجهرون بذكر آبائهم فأمر بالجهر بذكره سبحانه.<br />
                        • حديث صحيح البخاري عن ابن عباس رضي الله عنهما: «أن رفع الصوت بالذكر حين ينصرف الناس من المكتوبة كان على عهد النبي ﷺ، وكنت أعلم إذا انصرفوا بذلك إذا سمعته».<br />
                        • الحديث القدسي في الصحيحين: «وإن ذكرني في ملأ ذكرته في ملأ خير منهم»، وذكر الملأ لا يكون إلا جهراً وجماعة.
                      </p>
                    </div>

                    {/* Imara Evidence */}
                    <div className="p-5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                          <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                          <h5 className="font-amiri text-base font-bold">3. تأصيل العمارة، الوجد، والسماع الروحي</h5>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a
                            href="https://www.facebook.com/zaouia.mohammedia"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#5B9DF8] text-xs font-semibold flex items-center gap-1 transition"
                            title="زيارة صفحة الزاوية على فيسبوك"
                          >
                            <span>زيارة صفحة الزاوية</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => {
                              const text = `⚖️ تأصيل العمارة والوجد والسماع في الطريقة البودشيشية:\nحديث الحبشة في المسجد النبوي، وحداء الصحابة في الخندق، وفتوى سلطان العلماء العز بن عبد السلام في غلبة الوجد.\n\nطالع التأصيل كاملاً: ${typeof window !== "undefined" ? window.location.origin : ""}/#evidence`;
                              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                            }}
                            className="p-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-semibold flex items-center gap-1 transition"
                            title="مشاركة عبر واتساب"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
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
                      البرنامج الروحي اليومي وأوراد السالك
                    </h4>
                    <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                      الأوراد اليومية المباركة المقررة في الطريقة: حزبا القرآن الكريم، حزب دلائل الخيرات، ذِكْرُ الوِرْدِ العَامِّ، خمس عشرة ألف هيللة، والوظيفة الراتبة بالزاوية.
                    </p>
                  </div>

                  {/* 4 Cards Grid for the Daily Awrad */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. حزبان من القرآن الكريم (صباحاً ومساءً) */}
                    <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                            <BookOpen className="w-5 h-5 text-[#C5A059]" />
                            <h5 className="font-amiri text-base font-bold">حِزْبَانِ مِنَ القُرْآنِ الكَرِيمِ</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378] text-xs font-bold">
                            صباحاً ومساءً
                          </span>
                        </div>
                        <p className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed">
                          • حزب بعد صلاة الصبح وحزب بعد صلاة العصر أو المغرب.<br />
                          • المحافظة على قراءة الحزبين ختماً لكتاب الله تعالى شهرياً وتثبيتاً للنور القرآني في قلب السالك.
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] flex justify-end">
                        <button
                          onClick={() => {
                            const text = `📖 أوراد السالك في الطريقة البودشيشية:\nقراءة حِزبين من القرآن الكريم يومياً (حزب صباحاً وحزب مساءً ختماً لكتاب الله شهرياً).\n\nطالع تفاصيل الأوراد: ${typeof window !== "undefined" ? window.location.origin : ""}/#wazifa`;
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>مشاركة الورد</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. حزب دلائل الخيرات */}
                    <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                            <Sparkles className="w-5 h-5 text-[#C5A059]" />
                            <h5 className="font-amiri text-base font-bold">حِزْبُ دَلَائِلِ الخَيْرَاتِ</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378] text-xs font-bold">
                            الصلاة على النبي ﷺ
                          </span>
                        </div>
                        <p className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed">
                          • تلاوة الحزب اليومي الراتب من كتاب «دلائل الخيرات وشوارق الأنوار في ذكر الصلاة على النبي المختار ﷺ» للإمام أبي عبد الله محمد بن سليمان الجزولي رضي الله عنه.<br />
                          • صلاة دائمة على النبي المصطفى ﷺ، بها تُفتح أبواب القبول وتزكو النفوس وتشرق البصائر.
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] flex justify-end">
                        <button
                          onClick={() => {
                            const text = `🌹 أوراد السالك في الطريقة البودشيشية:\nتلاوة الحزب اليومي من كتاب «دلائل الخيرات» للإمام الجزولي رضي الله عنه في الصلاة على النبي ﷺ.\n\nطالع تفاصيل الأوراد: ${typeof window !== "undefined" ? window.location.origin : ""}/#wazifa`;
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>مشاركة الورد</span>
                        </button>
                      </div>
                    </div>

                    {/* 3. ذِكْرُ الوِرْدِ العَامِّ */}
                    <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                            <Compass className="w-5 h-5 text-[#C5A059]" />
                            <h5 className="font-amiri text-base font-bold">ذِكْرُ الوِرْدِ العَامِّ</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#1B4332]/15 text-[#1B4332] dark:text-[#E5C378] text-xs font-bold">
                            صباحاً ومساءً
                          </span>
                        </div>
                        <p className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed">
                          • الورد الأساسي الراتب لمريدي الطريقة: الاستغفار، الصلاة على النبي ﷺ، وكلمة التوحيد (لا إله إلا الله).<br />
                          • يؤدى مرتين يومياً بالسكينة والخشوع والأدب، وهو عهد السالك وركيزة صفاء قلبه واستقامته في السير إلى الله.
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] flex justify-end">
                        <button
                          onClick={() => {
                            const text = `📿 ذِكْرُ الورد العام في الطريقة البودشيشية:\nالورد الأساسي الراتب صباحاً ومساءً (الاستغفار، الصلاة على النبي ﷺ، لا إله إلا الله).\n\nطالع تفاصيل الأوراد: ${typeof window !== "undefined" ? window.location.origin : ""}/#wazifa`;
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>مشاركة الورد</span>
                        </button>
                      </div>
                    </div>

                    {/* 4. 15,000 هَيْلَلَة (لَا إِلَهَ إِلَّا اللهُ) */}
                    <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                            <Layers className="w-5 h-5 text-[#C5A059]" />
                            <h5 className="font-amiri text-base font-bold">15,000 هَيْلَلَة (لَا إِلَهَ إِلَّا اللهُ)</h5>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378] text-xs font-bold">
                            عمارة الأوقات
                          </span>
                        </div>
                        <div className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed space-y-1.5">
                          <p>
                            • <strong>عمارة الأوقات:</strong> عمارة سائر أوقات اليوم بذكر كلمة التوحيد «لا إله إلا الله» حتى يبلغ السالك 15,000 مرة في اليوم.
                          </p>
                          <p>
                            • <strong>الأصل وآداب الذكر:</strong> الأصل والمطلوب من الفقير في الطريقة أداء 15,000 هيللة في جلسة واحدة بتوجّه قلبي كامل، وإغلاق العينين، واستقبال القبلة التزاماً بالأدب المعتمد دائماً في جميع الأذكار.
                          </p>
                          <p>
                            • <strong>الرخصة والتيسير:</strong> ويجوز تقسيمها وتوزيعها على مدار اليوم عند الحاجة ومراعاة للضرورة.
                          </p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] flex justify-end">
                        <button
                          onClick={() => {
                            const text = `✨ 15,000 هيللة في الطريقة البودشيشية:\nعمارة سائر أوقات اليوم بذكر كلمة التوحيد «لا إله إلا الله» حتى يبلغ السالك 15,000 مرة في اليوم.\n\n• الأصل والمطلوب من الفقير في الطريقة أداؤها في جلسة واحدة بتوجّه كامل، وإغلاق العينين، واستقبال القبلة دائماً في جميع الأذكار، ويجوز تقسيمها للضرورة.\n\nطالع تفاصيل الأوراد: ${typeof window !== "undefined" ? window.location.origin : ""}/#wazifa`;
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>مشاركة الورد</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 5. الوظيفة الراتبة اليومية بالزاوية */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#FAF7F2]/60 dark:from-[#122820] dark:to-[#0B1914] border border-[#C5A059]/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-[#1B4332] dark:text-[#E5C378]">
                        <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                            الوظيفة الراتبة بالزاوية (مجلس الجماعة)
                          </h5>
                          <span className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm">
                            بين صلاتي المغرب والعشاء يومياً بمقرات الزاوية
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <a
                          href="https://www.facebook.com/zaouia.mohammedia"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-3 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#5B9DF8] text-xs font-semibold flex items-center gap-1 transition"
                          title="زيارة صفحة الزاوية على فيسبوك"
                        >
                          <span>زيارة صفحة الزاوية</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            const text = `🕌 الوظيفة الراتبة في الطريقة البودشيشية:\nالوظيفة الراتبة وتلاوة الحزب القرآني كل يوم بين المغرب والعشاء بالزاوية.\n\nطالع تفاصيل الوظيفة: ${typeof window !== "undefined" ? window.location.origin : ""}/#wazifa`;
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                          }}
                          className="py-1.5 px-3 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>مشاركة الوظيفة</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-[#1D2A24]/90 dark:text-[#D5E2DB] font-ibm leading-relaxed">
                      • الوظيفة الجامعة لقلوب الفقراء في الزاوية كل يوم بين المغرب والعشاء لتجديد العهد وتقوية الرابطة الأخوية.<br />
                      • تلاوة الحزب القرآني الراتب مع الجماعة، استماعاً وإنصاتاً وتدبراً.
                    </p>
                  </div>

                  {/* فقه الطريق: آداب مجالس الذكر (11 أدباً) */}
                  <div className="pt-6 border-t border-[#E7DFD5] dark:border-[#203D31] space-y-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#C5A059]/15 via-[#1B4332]/10 to-[#C5A059]/15 border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#9E7B35] dark:text-[#E5C378] text-xs font-bold mb-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>فِقْهُ الطَّرِيقِ • مَجَالِسُ الصَّفَاءِ</span>
                        </div>
                        <h5 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                          آدَابُ مَجَالِسِ الذِّكْرِ وَالِانْتِفَاعِ بِأَسْرَارِهَا
                        </h5>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm mt-1 leading-relaxed">
                          الانتفاع بمجالس الذكر والاستفادة من أسرارها وفيوضاتها يستوجب من الذاكر التحلي بمجموعة من الآداب:
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href="https://www.facebook.com/zaouia.mohammedia"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#5B9DF8] text-xs font-semibold flex items-center gap-1.5 transition"
                          title="زيارة صفحة الزاوية على فيسبوك"
                        >
                          <span>زيارة صفحة الزاوية</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => {
                            const text = `📜 فقه الطريق : آداب الذكر في الطريقة البودشيشية:\nالانتفاع بمجالس الذكر والاستفادة من أسرارها وفيوضاتها يستوجب من الذاكر التحلي بمجموعة من الآداب:\n\n1. الطهارة: متوضئاً، نقي الثياب، طيب الرائحة.\n2. التوجه: استحضار همة شيخه ليكون رفيقاً له في السير.\n3. إقفال الهاتف: حفظاً لحرمة المجلس وحتى لا يشوش على حلقة الذكر.\n4. تغميض العينين: للمساعدة على التركيز في معاني الذكر.\n5. المشاركة جهراً: في الذكر الجماعي بخشوع ونشاط واجتناب النوم.\n6. الامتناع عن شرب الماء أثناء الذكر.\n7. هيئة الحلقة: انعقاد المجلس على هيئة حلقة واجتناب وجود ثغرات.\n8. الهدوء والسكينة: اجتناب الكلام والحركة والتثاؤب والمزاح.\n9. لزوم المجلس من البداية حتى النهاية: 'من قام من المجلس من غير عذر مقبول فقد حرم بركة ذلك المجلس'.\n10. التوقف عن ذكر الورد الفردي أثناء الوظيفة.\n11. الاستماع إلى المذاكرات التربوية والسماع والصمت عن لغو الدنيا.\n\nطالع الوثيقة على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#wazifa`;
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                          }}
                          className="py-1.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-semibold flex items-center gap-1.5 transition"
                          title="مشاركة الآداب عبر واتساب"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>مشاركة الآداب</span>
                        </button>
                      </div>
                    </div>

                    {/* 11 Etiquettes Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {/* 1. الطهارة */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                            <Droplets className="w-4 h-4" />
                          </div>
                          <h6 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            1. الطَّهَارَةُ
                          </h6>
                        </div>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                          أن يكون الذاكر متوضئاً، نقي الثياب، طيب الرائحة؛ إجلالاً لحضرة المذكور سبحانه ومجالسة الملائكة الكرام.
                        </p>
                      </div>

                      {/* 2. التوجه */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                            <Compass className="w-4 h-4" />
                          </div>
                          <h6 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            2. التَّوَجُّهُ الصَّادِقُ
                          </h6>
                        </div>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                          استحضار همة شيخه ليكون رفيقاً له في السير ومرآة يستمد منها نور الصدق والإخلاص في التوجه إلى الله.
                        </p>
                      </div>

                      {/* 3. إقفال الهاتف */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center">
                            <PhoneOff className="w-4 h-4" />
                          </div>
                          <h6 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            3. إِقْفَالُ الهَاتِفِ
                          </h6>
                        </div>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                          إقفال الهاتف أثناء الذكر حفاظاً على حرمة المجلس، وحتى لا يشوش على حلقة الذكر ويشتت أذهان الذاكرين.
                        </p>
                      </div>

                      {/* 4. تغميض العينين */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                            <EyeOff className="w-4 h-4" />
                          </div>
                          <h6 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            4. تَغْمِيضُ العَيْنَيْنِ
                          </h6>
                        </div>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                          تغميض العينين للمساعدة على سد منافذ الحواس الظاهرة، والتركيز في معاني الذكر واستحضار عظمة المذكور.
                        </p>
                      </div>

                      {/* 5. المشاركة جهراً */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                            <Volume2 className="w-4 h-4" />
                          </div>
                          <h6 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            5. المُشَارَكَةُ جَهْراً
                          </h6>
                        </div>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                          المشاركة جهراً في الذكر الجماعي بخشوع ونشاط وهمة عالية، ومدافعة النوم والفتور والتكاسل.
                        </p>
                      </div>

                      {/* 6. الامتناع عن شرب الماء */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                            <VolumeX className="w-4 h-4" />
                          </div>
                          <h6 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            6. الِامْتِنَاعُ عَنْ شُرْبِ المَاءِ
                          </h6>
                        </div>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                          الامتناع عن شرب الماء أثناء الذكر حفاظاً على حرارة الذكر وتركيز الأنفاس وعدم كسر جمعية المجلس.
                        </p>
                      </div>

                      {/* 7. هيئة الحلقة */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                          <h6 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            7. هَيْئَةُ الحَلْقَةِ المُحْكَمَةِ
                          </h6>
                        </div>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                          انعقاد المجلس على هيئة حلقة واجتناب وجود ثغرات تفصل بين الذاكرين بحسب الإمكان، لتتصل النفحات.
                        </p>
                      </div>

                      {/* 8. الهدوء والسكينة */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <h6 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            8. الهُدُوءُ وَالسَّكِينَةُ
                          </h6>
                        </div>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                          اجتناب كل ما يشوش على حرمة الذكر: الكلام، عدم الالتفات وترك الحركة العابثة، كثرة التثاؤب، والضحك والمزاح.
                        </p>
                      </div>

                      {/* 9. الحضور من البداية للنهاية */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                          </div>
                          <h6 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            9. الحُضُورُ التَّامُّ
                          </h6>
                        </div>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                          الحرص على حضور الذكر من البداية حتى النهاية قياساً بالصلاة وعدم الانصراف إلا لضرورة؛ «من قام من المجلس من غير عذر مقبول فقد حُرِم بركة ذلك المجلس».
                        </p>
                      </div>

                      {/* 10. التوقف عن الورد الفردي */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                            <Layers className="w-4 h-4" />
                          </div>
                          <h6 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            10. لُزُومُ الجَمَاعَةِ
                          </h6>
                        </div>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                          التوقف عن ذكر الورد الفردي أثناء أداء الوظيفة الراتبة؛ فحق الجماعة مقدم وحرمة الوظيفة أجمع للقلوب.
                        </p>
                      </div>

                      {/* 11. الاستماع للمذاكرات التربوية */}
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                            <Radio className="w-4 h-4" />
                          </div>
                          <h6 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            11. أَدَبُ المَذَاكَرَةِ وَالسَّمَاعِ
                          </h6>
                        </div>
                        <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                          الاستماع إلى المذاكرات التربوية والسماع الروحي، والصمت التام عن الكلام في مختلف الأمور الدنيوية وغيرها.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. GLOSSARY SECTION */}
              {activeTab === "glossary" && <GlossarySection />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
