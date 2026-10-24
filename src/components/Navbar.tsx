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
} from "lucide-react";
import { MemberPortalModal } from "./MemberPortalModal";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);

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

          {/* Desktop Navigation Menus (Streamlined to 5 Clean Portals + Sheikh) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {/* Direct Link to Sheikh Dedicated Standalone Page */}
            <Link
              href="/shaykh"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#143628] dark:text-[#E5C378] bg-[#C5A059]/15 hover:bg-[#C5A059]/25 border border-[#C5A059]/40 transition-all flex items-center gap-1.5 shadow-sm"
              title="ورقة تعريفية بفضيلة الشيخ الدكتور سيدي منير القادري بودشيش"
            >
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>شيخ الطريقة</span>
            </Link>

            {/* 1. مساري */}
            <Link
              href="/masar"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1D2A24]/85 dark:text-[#E8F0EC]/85 hover:text-[#1B4332] dark:hover:text-[#D4AF37] hover:bg-[#C5A059]/10 transition-all flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>مساري التكويني</span>
            </Link>

            {/* 2. المكتبة */}
            <button
              onClick={() => navigateToTab("arbaeen")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1D2A24]/85 dark:text-[#E8F0EC]/85 hover:text-[#1B4332] dark:hover:text-[#D4AF37] hover:bg-[#C5A059]/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>المكتبة</span>
            </button>

            {/* 3. الورد والوظيفة */}
            <button
              onClick={() => navigateToTab("wazifa")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1D2A24]/85 dark:text-[#E8F0EC]/85 hover:text-[#1B4332] dark:hover:text-[#D4AF37] hover:bg-[#C5A059]/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>الورد والوظيفة</span>
            </button>

            {/* 4. زاد اليوم */}
            <a
              href="/#daily-spiritual"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1D2A24]/85 dark:text-[#E8F0EC]/85 hover:text-[#1B4332] dark:hover:text-[#D4AF37] hover:bg-[#C5A059]/10 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>زاد اليوم</span>
            </a>

            {/* 5. المعجم */}
            <button
              onClick={() => navigateToTab("glossary")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1D2A24]/85 dark:text-[#E8F0EC]/85 hover:text-[#1B4332] dark:hover:text-[#D4AF37] hover:bg-[#C5A059]/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>المعجم</span>
            </button>
          </nav>

          {/* Actions: Member Portal, Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/faqir"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200 border border-[#C5A059]/40 hover:-translate-y-0.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>فضاء الفقير</span>
            </Link>

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
              {/* Standalone Faqir Portal Link in Mobile Drawer */}
              <Link
                href="/faqir"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-[#FAF7F2] bg-[#1B4332] border border-[#C5A059]/40 hover:bg-[#143628] text-right mb-1 shadow-sm touch-manipulation"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <span>فضاء الفقير (الرزنامة والمتتبع والمفكرة)</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-[#C5A059]" />
              </Link>

              {/* Standalone Sheikh Page Link in Mobile Drawer */}
              <Link
                href="/shaykh"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-[#143628] dark:text-[#E5C378] bg-[#C5A059]/15 border border-[#C5A059]/35 hover:bg-[#C5A059]/25 text-right mb-2 shadow-sm touch-manipulation"
              >
                <span>شيخ الطريقة القادرية البودشيشية</span>
                <Award className="w-4 h-4 text-[#C5A059]" />
              </Link>

              {/* 1. مساري التكويني */}
              <Link
                href="/masar"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>مساري التكويني</span>
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
              </Link>

              {/* 2. المكتبة */}
              <button
                type="button"
                onClick={() => navigateToTab("arbaeen")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>المكتبة (الأربعين والحكم وابن عاشر)</span>
                <BookOpen className="w-4 h-4 text-[#C5A059]" />
              </button>

              {/* 3. الورد والوظيفة */}
              <button
                type="button"
                onClick={() => navigateToTab("wazifa")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>الورد والوظيفة الراتبة</span>
                <Clock className="w-4 h-4 text-[#C5A059]" />
              </button>

              {/* 4. زاد اليوم */}
              <a
                href="/#daily-spiritual"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>زاد اليوم</span>
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
              </a>

              {/* 5. المعجم */}
              <button
                type="button"
                onClick={() => navigateToTab("glossary")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>معجم مصطلحات السلوك</span>
                <HelpCircle className="w-4 h-4 text-[#C5A059]" />
              </button>

              {/* الثوابت الخمسة */}
              <a
                href="/#thawabit"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15 active:bg-[#C5A059]/25 text-right touch-manipulation transition"
              >
                <span>الثوابت الخمسة في الطريقة</span>
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              </a>
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
