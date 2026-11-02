"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Moon,
  Sun,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  BookOpen,
  HelpCircle,
  Clock,
  User,
  Award,
  ShieldCheck,
  ChevronLeft,
  Video,
  Palette,
  Scroll,
  FolderOpen,
  Compass,
} from "lucide-react";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const isDarkStored =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDarkStored) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const navigateToTab = (tabId: string) => {
    setDrawerOpen(false);
    if (typeof window !== "undefined") {
      if (window.location.pathname !== "/") {
        window.location.href = `/#${tabId}`;
        return;
      }
      window.location.hash = tabId;
      window.dispatchEvent(new CustomEvent("switch-knowledge-tab", { detail: tabId }));
      const el = document.getElementById("knowledge-hub");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-[#FAF7F2]/95 dark:bg-[#07130E]/95 backdrop-blur-md border-b border-[#E7DFD5]/80 dark:border-[#203A2F] ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* 1. Official Brand Seal & Clean Title + DEDICATED STANDALONE SHEIKH BUTTON */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                title="مِنْهَاجُ الفَقِير - الصفحة الرئيسية"
                className="flex items-center justify-center p-1 sm:p-1.5 rounded-xl bg-white/80 dark:bg-[#122820] hover:bg-[#C5A059]/15 border border-[#C5A059]/40 hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group relative touch-manipulation cursor-pointer"
              >
                <img
                  src="/images/logo_zawiya_mohammedia_clean.png"
                  alt="شعار زاوية مدينة المحمدية - الطريقة القادرية البودشيشية"
                  className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-sm pointer-events-none select-none"
                />
                <span className="sr-only">الصفحة الرئيسية</span>
              </Link>

              <Link href="/" className="hidden xs:flex items-center text-right touch-manipulation cursor-pointer">
                <span className="font-amiri text-xl sm:text-3xl font-bold tracking-wide text-[#143628] dark:text-[#E8F0EC] select-none">
                  مِنْهَاجُ الفَقِير
                </span>
              </Link>

              {/* DEDICATED STANDALONE SHEIKH BUTTON (Toujours visible, mobile et desktop, jamais masqué) */}
              <Link
                href="/shaykh"
                title="مقام الشيخ المربي • فضيلة الدكتور سيدي منير القادري بودشيش"
                className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-[#FAF7F2] border-2 border-[#C5A059] shadow-md hover:shadow-xl hover:border-[#E5C378] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer relative"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-[#C5A059] bg-[#FAF7F2]/20 flex-shrink-0 shadow-sm ring-2 ring-[#C5A059]/30">
                  <img
                    src="/images/sheikh/sheikh_portrait_close.png"
                    alt="فضيلة الشيخ الدكتور سيدي منير القادري بودشيش"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1">
                    <span className="font-amiri text-xs sm:text-sm font-bold text-[#E5C378] group-hover:text-white transition leading-none">
                      مَقَامُ الشَّيْخِ
                    </span>
                    <Sparkles className="w-2.5 h-2.5 text-[#C5A059] animate-pulse" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-white/80 font-medium hidden sm:inline leading-tight">
                    سيدي منير القادري
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Épuré : Les 3 raccourcis essentiels uniquement */}
            <nav className="hidden md:flex items-center gap-2 xl:gap-3">
              {/* Raccourci 1: زاد اليوم (3) */}
              <a
                href="/#daily-trio"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#143628] dark:text-[#E5C378] bg-[#C5A059]/15 hover:bg-[#C5A059]/25 border border-[#C5A059]/40 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>زاد اليوم (3)</span>
              </a>

              {/* Raccourci 2: مساري التكويني */}
              <Link
                href="/masar"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#1D2A24]/90 dark:text-[#E8F0EC]/90 hover:text-[#1B4332] dark:hover:text-[#D4AF37] hover:bg-[#C5A059]/10 transition-all flex items-center gap-1.5 border border-transparent hover:border-[#C5A059]/30"
              >
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                <span>مساري التكويني</span>
              </Link>

              {/* Raccourci 3: فضاء الفقير */}
              <Link
                href="/faqir"
                className="px-3.5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200 border border-[#C5A059]/40 hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-[#C5A059]" />
                <span>فضاء الفقير</span>
              </Link>
            </nav>

            {/* 3. Bouton Tiroir ("☰ باقي الأقسام") & Theme Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="تبديل الوضع الليلي والنهاري"
                className="p-2 sm:p-2.5 rounded-full border border-[#E7DFD5] dark:border-[#203A2F] text-[#1B4332] dark:text-[#D4AF37] bg-white/70 dark:bg-[#12241D] hover:bg-[#C5A059]/15 hover:border-[#C5A059] transition-all duration-200 shadow-sm cursor-pointer"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Bouton Tiroir "☰ باقي الأقسام" */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#12241D] border border-[#C5A059]/50 hover:border-[#C5A059] text-[#143628] dark:text-[#E5C378] text-xs font-bold shadow-sm hover:bg-[#C5A059]/15 transition cursor-pointer"
                title="فتح قائمة الأقسام الكاملة للمنهاج"
              >
                <Menu className="w-4 h-4 text-[#C5A059]" />
                <span className="hidden sm:inline">باقي الأقسام</span>
                <span className="sm:hidden">القائمة</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FULL DRAWER LATÉRAL PLEIN ÉCRAN / SLIDE-IN (DROITE -> GAUCHE EN RTL) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FAF7F2] dark:bg-[#07130E] border-l border-[#C5A059]/40 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between bg-gradient-to-l from-[#143628] to-[#1B4332] text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-amiri text-lg font-bold text-[#FAF7F2]">
                      فهرس أقسام منهاج الفقير
                    </h3>
                    <p className="text-[11px] text-[#E5C378]">
                      الزاوية القادرية البودشيشية • المحمدية
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="إغلاق القائمة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links Navigation */}
              <div className="p-5 space-y-6 flex-1">
                {/* 1. المسارات والفقير */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#C5A059] block uppercase tracking-wider font-ibm">
                    المسار والسلوك اليومي
                  </span>

                  <Link
                    href="/#daily-trio"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>زاد اليوم (3 دقائق)</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059]" />
                  </Link>

                  <Link
                    href="/masar"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                      <span>مساري التكويني (المراحل الست)</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059]" />
                  </Link>

                  <Link
                    href="/faqir"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-[#C5A059]" />
                      <span>فضاء الفقير (التقويم والمتتبع والمفكرة)</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059]" />
                  </Link>
                </div>

                {/* 2. الشيخ والدروس والإعلام */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#C5A059] block uppercase tracking-wider font-ibm">
                    الشيخ، الدروس والتصميم
                  </span>

                  <Link
                    href="/shaykh"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-[#C5A059]" />
                      <span>شيخ الطريقة (سيرة ومسار الدكتور سيدي منير)</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059]" />
                  </Link>

                  <Link
                    href="/dourous"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Video className="w-4 h-4 text-[#C5A059]" />
                      <span>دروس السبت المشهودة (محرك البحث بالفيديو)</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378] font-bold">50 درساً</span>
                  </Link>

                  <Link
                    href="/tasmeem"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Palette className="w-4 h-4 text-[#C5A059]" />
                      <span>استوديو تصميم الملصقات الرسمية (5 صيغ HD)</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059]" />
                  </Link>
                </div>

                {/* 3. المكتبة العلمية والتأصيل */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#C5A059] block uppercase tracking-wider font-ibm">
                    المكتبة والمتون والتأصيل الشرعي
                  </span>

                  <button
                    onClick={() => navigateToTab("arbaeen")}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition text-right group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-[#C5A059]" />
                      <span>الأربعون النووية السلوكية (42 حديثاً)</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059]" />
                  </button>

                  <button
                    onClick={() => navigateToTab("hikam")}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition text-right group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>الحكم العطائية (264 حكمة مع الشروح)</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059]" />
                  </button>

                  <button
                    onClick={() => navigateToTab("ibn-ashir")}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition text-right group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Scroll className="w-4 h-4 text-[#C5A059]" />
                      <span>متن ابن عاشر (311 بيتاً في الفقه والتصوف)</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059]" />
                  </button>

                  <button
                    onClick={() => navigateToTab("evidence")}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition text-right group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                      <span>أدلة الطريق (السبحة، العمارة، الذكر الجماعي)</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059]" />
                  </button>

                  <button
                    onClick={() => navigateToTab("glossary")}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] text-xs font-bold text-[#143628] dark:text-[#E8F0EC] transition text-right group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                      <span>معجم مصطلحات الطريق والتربية الروحية</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059]" />
                  </button>
                </div>

                {/* 4. المسؤول والمقدم */}
                <div className="pt-2 border-t border-[#E7DFD5] dark:border-[#203D31]">
                  <Link
                    href="/moqaddem"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#1B4332]/10 dark:bg-[#1B4332]/30 border border-[#C5A059]/40 text-xs font-bold text-[#143628] dark:text-[#E5C378] hover:bg-[#C5A059]/20 transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderOpen className="w-4 h-4 text-[#C5A059]" />
                      <span>فضاء المقدم والمسؤول (إحصائيات ومريدين)</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#C5A059]/20 font-bold">محمي بـ PIN</span>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#E7DFD5] dark:border-[#203D31] bg-white/50 dark:bg-black/20 text-center text-xs text-[#52796F] dark:text-[#95B8A8]">
                <span>منهاج الفقير • خدمة الزاوية القادرية البودشيشية بالمحمدية</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
