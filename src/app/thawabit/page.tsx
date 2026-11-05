import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThawabitSection } from "@/components/ThawabitSection";
import { AdabDhikrSection } from "@/components/AdabDhikrSection";
import { Sparkles, Award, ArrowRight, HeartHandshake, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "الثوابت الخمسة وفقه الطريق • منهاج الفقير",
  description:
    "ميثاق السلوك وتوجيهات المشيخة الجليلة في الثوابت الخمسة وآداب مجالس الذكر والوظيفة في الطريقة القادرية البودشيشية",
};

export default function ThawabitPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC] transition-colors duration-300">
      <Navbar />

      {/* Hero Spiritual Header */}
      <header className="relative pt-24 sm:pt-28 pb-10 bg-gradient-to-b from-[#143628] via-[#1B4332] to-[#143628] text-white overflow-hidden border-b border-[#C5A059]/30">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir="rtl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#E5C378] mb-4">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <span>الرئيسية</span>
            </Link>
            <span>/</span>
            <span className="text-white/80">ميثاق الطريقة</span>
            <span>/</span>
            <span className="text-[#FAF7F2] font-bold">الثوابت الخمسة وفقه الطريق</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/20 text-[#E5C378] text-xs font-bold border border-[#C5A059]/40">
                <Award className="w-4 h-4 text-[#C5A059]" />
                <span>مِيثَاقُ الطَّرِيقَةِ القَادِرِيَّةِ البُودْشِيشِيَّةِ</span>
              </div>

              <h1 className="font-amiri text-3xl sm:text-5xl font-bold text-[#FAF7F2] leading-tight">
                الثَّوَابِتُ الخَمْسَةُ وَفِقْهُ الطَّرِيقِ
              </h1>

              <p className="font-ibm text-xs sm:text-sm text-[#E8F0EC]/85 leading-relaxed">
                توجيهات مشيخة الطريقة الجليلة، يوصي بها شيخنا رضي الله عنه المريدات والمريدين بالعناية والالتزام، تأصيلاً لمنهج التربية والسلوك، وحفظاً لجمعية القلوب في مجالس الذكر.
              </p>
            </div>

            {/* Quick Jumps */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <a
                href="#thawabit"
                className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#d4af37] text-[#143628] text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>الثوابت الخمسة</span>
              </a>

              <a
                href="#adab-dhikr"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition border border-white/20"
              >
                <Compass className="w-4 h-4 text-[#C5A059]" />
                <span>آداب الذكر (11)</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Section 1: Thawabit */}
        <ThawabitSection />

        {/* Section 2: Adab Dhikr */}
        <AdabDhikrSection />
      </main>

      <Footer />
    </div>
  );
}
