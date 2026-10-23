"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { MemberPortalModal } from "./MemberPortalModal";
import { ZawiyaDefinitionModal } from "./ZawiyaDefinitionModal";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [zawiyaModalOpen, setZawiyaModalOpen] = useState(false);

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

  const navLinks = [
    { href: "#tracks", label: "الأسلاك التكوينية", icon: GraduationCap },
    { href: "#evidence", label: "التأصيل الشرعي", icon: Scale },
    { href: "#wazifa", label: "الأوراد والوظيفة", icon: Clock },
    { href: "#arbaeen", label: "الأربعين النووية (42)", icon: BookOpen },
    { href: "#hikma-today", label: "حكمة اليوم", icon: Sparkles },
    { href: "#archive", label: "الحكم العطائية (264)", icon: Layers },
    { href: "#glossary", label: "معجم الطريق", icon: HelpCircle },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-[#FAF7F2]/95 dark:bg-[#0B1914]/95 backdrop-blur-md border-b border-[#E7DFD5]/80 dark:border-[#203A2F] ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Seal / Official Boutchichiyya Mohammedia Logo & Title */}
          <div className="flex items-center gap-3">
            {/* Clickable Zawiya Logo (Triggers Definition Modal) */}
            <button
              onClick={() => setZawiyaModalOpen(true)}
              title="انقر هنا للتعريف بالطريقة القادرية البودشيشية وشيخها سيدي منير القادري بودشيش"
              className="flex items-center justify-center p-1 sm:p-1.5 rounded-xl bg-white/80 dark:bg-[#122820] hover:bg-[#C5A059]/15 border border-[#C5A059]/40 hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group relative cursor-pointer"
            >
              <img
                src="/images/logo_zawiya_mohammedia_clean.png"
                alt="شعار زاوية مدينة المحمدية - الطريقة القادرية البودشيشية"
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-sm"
              />
              <span className="sr-only">التعريف بالطريقة وشيخها</span>
            </button>

            {/* Title & Mohammedia Designation */}
            <a href="#" className="flex flex-col text-right">
              <span className="font-amiri text-xl sm:text-2xl font-bold tracking-wide text-[#143628] dark:text-[#E8F0EC]">
                مِنْهَاجُ الفَقِير
              </span>
              <span className="text-[10px] sm:text-[11px] font-sans tracking-wider text-[#C5A059] dark:text-[#D4AF37] font-semibold">
                الطريقة القادرية البودشيشية • مدينة المحمدية
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#1D2A24]/85 dark:text-[#E8F0EC]/85 hover:text-[#1B4332] dark:hover:text-[#D4AF37] hover:bg-[#C5A059]/10 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Actions: Member Portal, Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setPortalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200 border border-[#C5A059]/40 hover:-translate-y-0.5"
            >
              <User className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>فضاء الفقير</span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label="تبديل الوضع الليلي والنهاري"
              className="p-2 sm:p-2.5 rounded-full border border-[#E7DFD5] dark:border-[#203A2F] text-[#1B4332] dark:text-[#D4AF37] bg-white/70 dark:bg-[#12241D] hover:bg-[#C5A059]/15 hover:border-[#C5A059] transition-all duration-200 shadow-sm"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-lg border border-[#E7DFD5] dark:border-[#203A2F] text-[#1B4332] dark:text-[#E8F0EC] bg-white/70 dark:bg-[#12241D]"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] dark:bg-[#0B1914] border-b border-[#E7DFD5] dark:border-[#203A2F] px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setPortalOpen(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#1B4332] border border-[#C5A059]/40 mb-2"
          >
            <User className="w-4 h-4 text-[#C5A059]" />
            <span>فضاء الفقير (الملزومات والمساهمات)</span>
          </button>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/15"
              >
                <Icon className="w-4 h-4 text-[#C5A059]" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      )}

      {/* Faqir Member Portal Modal */}
      <MemberPortalModal isOpen={portalOpen} onClose={() => setPortalOpen(false)} />

      {/* Tariqa & Shaykh Definition Modal */}
      <ZawiyaDefinitionModal isOpen={zawiyaModalOpen} onClose={() => setZawiyaModalOpen(false)} />
    </header>
  );
}
