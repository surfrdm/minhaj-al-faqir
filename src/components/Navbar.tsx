"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Moon,
  Sun,
  Menu,
  X,
  GraduationCap,
  Scale,
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  Clock,
  User,
  ChevronDown,
  Scroll,
  Award,
  ShieldCheck,
} from "lucide-react";
import { MemberPortalModal } from "./MemberPortalModal";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);

  // Dropdown states
  const [curriculumDropdown, setCurriculumDropdown] = useState(false);
  const [evidenceDropdown, setEvidenceDropdown] = useState(false);

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
    setCurriculumDropdown(false);
    setEvidenceDropdown(false);
    setMobileMenuOpen(false);
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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-[#FAF7F2]/95 dark:bg-[#0B1914]/95 backdrop-blur-md border-b border-[#E7DFD5]/80 dark:border-[#203A2F] ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Seal / Official Boutchichiyya Mohammedia Logo & Clean Title */}
          <div className="flex items-center gap-3">
            {/* Clickable Zawiya Logo navigating smoothly to Home */}
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

            {/* Title */}
            <Link href="/" className="flex items-center text-right touch-manipulation cursor-pointer">
              <span className="font-amiri text-2xl sm:text-3xl font-bold tracking-wide text-[#143628] dark:text-[#E8F0EC] select-none">
                مِنْهَاجُ الفَقِير
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Menus (Grouped & Unified) */}
          <nav className="hidden lg:flex items-center gap-2.5">
            {/* Direct Link to Sheikh Dedicated Standalone Page */}
            <Link
              href="/shaykh"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#143628] dark:text-[#E5C378] bg-[#C5A059]/15 hover:bg-[#C5A059]/25 border border-[#C5A059]/40 transition-all flex items-center gap-1.5 shadow-sm"
              title="ورقة تعريفية بفضيلة الشيخ الدكتور سيدي منير القادري بودشيش"
            >
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>شيخ الطريقة</span>
            </Link>

            {/* Direct Link to Thawabit */}
            <a
              href="/#thawabit"
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#1D2A24]/85 dark:text-[#E8F0EC]/85 hover:text-[#1B4332] dark:hover:text-[#D4AF37] hover:bg-[#C5A059]/10 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>الثوابت الخمسة</span>
            </a>

            {/* Direct Link to Hub */}
            <button
              onClick={() => navigateToTab("arbaeen")}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#1D2A24]/85 dark:text-[#E8F0EC]/85 hover:text-[#1B4332] dark:hover:text-[#D4AF37] hover:bg-[#C5A059]/10 transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>خزانة المنهاج</span>
            </button>

            {/* Menu 1: Curriculum & Texts Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCurriculumDropdown(true)}
              onMouseLeave={() => setCurriculumDropdown(false)}
            >
              <button
                onClick={() => setCurriculumDropdown(!curriculumDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#1D2A24]/85 dark:text-[#E8F0EC]/85 hover:text-[#1B4332] dark:hover:text-[#D4AF37] hover:bg-[#C5A059]/10 transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>الدرر والمتون المباركة</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#84928A]" />
              </button>

              {curriculumDropdown && (
                <div className="absolute right-0 top-full pt-1 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white dark:bg-[#0E2019] rounded-xl border border-[#C5A059]/40 shadow-xl p-2 space-y-1">
                    <button
                      onClick={() => navigateToTab("arbaeen")}
                      className="w-full p-2 rounded-lg text-right hover:bg-[#FAF7F2] dark:hover:bg-[#122820] flex items-center justify-between text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]"
                    >
                      <div className="flex items-center gap-2">
                        <Scroll className="w-4 h-4 text-[#C5A059]" />
                        <span>الأربعين النووية</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C5A059]/15 text-[#9E7B35]">
                        42 لوحة
                      </span>
                    </button>

                    <button
                      onClick={() => navigateToTab("hikam")}
                      className="w-full p-2 rounded-lg text-right hover:bg-[#FAF7F2] dark:hover:bg-[#122820] flex items-center justify-between text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#C5A059]" />
                        <span>الحكم العطائية الكبرى</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C5A059]/15 text-[#9E7B35]">
                        264 حكمة
                      </span>
                    </button>

                    <button
                      onClick={() => navigateToTab("ibn-ashir")}
                      className="w-full p-2 rounded-lg text-right hover:bg-[#FAF7F2] dark:hover:bg-[#122820] flex items-center justify-between text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#C5A059]" />
                        <span>متن ابن عاشر (المرشد المعين)</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C5A059]/15 text-[#9E7B35]">
                        311 بيتاً
                      </span>
                    </button>

                    <button
                      onClick={() => navigateToTab("hikma-day")}
                      className="w-full p-2 rounded-lg text-right hover:bg-[#FAF7F2] dark:hover:bg-[#122820] flex items-center gap-2 text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]"
                    >
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>درة اليوم العطائية</span>
                    </button>

                    <button
                      onClick={() => navigateToTab("tracks")}
                      className="w-full p-2 rounded-lg text-right hover:bg-[#FAF7F2] dark:hover:bg-[#122820] flex items-center gap-2 text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]"
                    >
                      <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                      <span>مَدَارِجُ الارْتِقَاءِ الرُّوحِيِّ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu 2: Evidence & Awrad Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setEvidenceDropdown(true)}
              onMouseLeave={() => setEvidenceDropdown(false)}
            >
              <button
                onClick={() => setEvidenceDropdown(!evidenceDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#1D2A24]/85 dark:text-[#E8F0EC]/85 hover:text-[#1B4332] dark:hover:text-[#D4AF37] hover:bg-[#C5A059]/10 transition-all"
              >
                <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>التأصيل والأوراد</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#84928A]" />
              </button>

              {evidenceDropdown && (
                <div className="absolute right-0 top-full pt-1 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white dark:bg-[#0E2019] rounded-xl border border-[#C5A059]/40 shadow-xl p-2 space-y-1">
                    <button
                      onClick={() => navigateToTab("evidence")}
                      className="w-full p-2 rounded-lg text-right hover:bg-[#FAF7F2] dark:hover:bg-[#122820] flex items-center gap-2 text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]"
                    >
                      <Scale className="w-4 h-4 text-[#C5A059]" />
                      <span>دقائق الطريق (السبحة والجهر)</span>
                    </button>

                    <button
                      onClick={() => navigateToTab("wazifa")}
                      className="w-full p-2 rounded-lg text-right hover:bg-[#FAF7F2] dark:hover:bg-[#122820] flex items-center gap-2 text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]"
                    >
                      <Clock className="w-4 h-4 text-[#C5A059]" />
                      <span>الأوراد والوظيفة الراتبة</span>
                    </button>

                    <button
                      onClick={() => navigateToTab("wazifa")}
                      className="w-full p-2 rounded-lg text-right hover:bg-[#FAF7F2] dark:hover:bg-[#122820] flex items-center gap-2 text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]"
                    >
                      <Award className="w-4 h-4 text-[#C5A059]" />
                      <span>فقه الطريق (آداب الذكر)</span>
                    </button>

                    <button
                      onClick={() => navigateToTab("glossary")}
                      className="w-full p-2 rounded-lg text-right hover:bg-[#FAF7F2] dark:hover:bg-[#122820] flex items-center gap-2 text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]"
                    >
                      <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                      <span>معجم مصطلحات السلوك</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Actions: Member Portal, Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setPortalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200 border border-[#C5A059]/40 hover:-translate-y-0.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>فضاء الفقير</span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label="تبديل الوضع الليلي والنهاري"
              className="p-2 sm:p-2.5 rounded-full border border-[#E7DFD5] dark:border-[#203A2F] text-[#1B4332] dark:text-[#D4AF37] bg-white/70 dark:bg-[#12241D] hover:bg-[#C5A059]/15 hover:border-[#C5A059] transition-all duration-200 shadow-sm cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl border border-[#C5A059]/40 text-[#1B4332] dark:text-[#E8F0EC] bg-white/90 dark:bg-[#12241D] hover:bg-[#C5A059]/15 active:scale-95 touch-manipulation cursor-pointer shadow-sm"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#C5A059]" /> : <Menu className="w-5 h-5 text-[#1B4332] dark:text-[#C5A059]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 px-3 border-t border-[#E7DFD5] dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#0B1914] shadow-2xl rounded-b-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              {/* Standalone Sheikh Page Link in Mobile Drawer */}
              <Link
                href="/shaykh"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-[#143628] dark:text-[#E5C378] bg-[#C5A059]/15 border border-[#C5A059]/35 hover:bg-[#C5A059]/25 text-right mb-2 shadow-sm touch-manipulation"
              >
                <span>شيخ الطريقة القادرية البودشيشية</span>
                <Award className="w-4 h-4 text-[#C5A059]" />
              </Link>

              <button
                type="button"
                onClick={() => navigateToTab("arbaeen")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>الأربعين النووية (42 حديثاً)</span>
                <Scroll className="w-4 h-4 text-[#C5A059]" />
              </button>
              <button
                type="button"
                onClick={() => navigateToTab("hikam")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>الحكم العطائية (264 حكمة)</span>
                <Layers className="w-4 h-4 text-[#C5A059]" />
              </button>
              <button
                type="button"
                onClick={() => navigateToTab("ibn-ashir")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>متن ابن عاشر (311 بيتاً محققاً)</span>
                <BookOpen className="w-4 h-4 text-[#C5A059]" />
              </button>
              <button
                type="button"
                onClick={() => navigateToTab("tracks")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>مَدَارِجُ الارْتِقَاءِ الرُّوحِيِّ</span>
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
              </button>
              <button
                type="button"
                onClick={() => navigateToTab("evidence")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>التأصيل الشرعي لدقائق الطريق</span>
                <Scale className="w-4 h-4 text-[#C5A059]" />
              </button>
              <button
                type="button"
                onClick={() => navigateToTab("wazifa")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>الأوراد والوظيفة الراتبة</span>
                <Clock className="w-4 h-4 text-[#C5A059]" />
              </button>
              <button
                type="button"
                onClick={() => navigateToTab("glossary")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>معجم مصطلحات الطريق</span>
                <HelpCircle className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Member Portal Modal */}
      <MemberPortalModal
        isOpen={portalOpen}
        onClose={() => setPortalOpen(false)}
      />
    </header>
  );
}
