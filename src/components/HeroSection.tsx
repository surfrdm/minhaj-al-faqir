"use client";

import {
  GraduationCap,
  Scale,
  Clock,
  BookOpen,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Compass,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-6 sm:pt-8 pb-8 overflow-hidden bg-subtle-pattern">
      {/* Decorative ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#C5A059]/10 dark:bg-[#1B4332]/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Top Spiritual Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#9E7B35] dark:text-[#E5C378] text-xs sm:text-sm font-semibold mb-5">
          <GraduationCap className="w-4 h-4 text-[#C5A059]" />
          <span>الأكاديمية العلمية والتأصيلية • الطريقة القادرية البودشيشية (مدينة المحمدية)</span>
        </div>

        {/* Main Title in Classical Calligraphic Serif */}
        <h1 className="font-amiri text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#143628] dark:text-[#FAF7F2] leading-[1.25] mb-2 sm:mb-3">
          مِنْهَاجُ الفَقِير
          <span className="block text-[#C5A059] dark:text-[#D4AF37] text-lg sm:text-xl lg:text-2xl font-semibold mt-1">
            التَّكْوِينُ العِلْمِيُّ وَالسُّلُوكِيُّ المُتَدَرِّجُ لِأَهْلِ الطَّرِيقِ
          </span>
        </h1>

        {/* Lead Subtitle */}
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed mb-4 sm:mb-5">
          صَرْحٌ مَنْهَجِيٌّ رَصِينٌ يَرْتَقِي بِالسَّالِكِ فِي <strong className="text-[#1B4332] dark:text-[#E5C378] font-semibold">مَدَارِجِ التَّرْبِيَةِ وَالإِحْسَانِ</strong>؛ يَجْمَعُ بَيْنَ صَفَاءِ السُّلُوكِ القَلْبِيِّ وَرُسُوخِ التَّأْصِيلِ الشَّرْعِيِّ وَاسْتِمْدَادِ الغِذَاءِ الرُّوحِيِّ اليَوْمِيِّ.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <a
            href="#showcase-3d"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#9E7B35] dark:text-[#E5C378] font-semibold border border-[#C5A059]/50 transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>المعرض ثلاثي الأبعاد (الحِكَم والأربعين)</span>
          </a>

          <a
            href="#tracks"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] font-semibold shadow-md shadow-[#1B4332]/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-[#C5A059]/30"
          >
            <GraduationCap className="w-4 h-4 text-[#C5A059]" />
            <span>المسارات التعليمية</span>
          </a>

          <a
            href="#evidence"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#12241D] hover:bg-[#C5A059]/10 text-[#143628] dark:text-[#E8F0EC] font-semibold border border-[#E7DFD5] dark:border-[#203A2F] shadow-sm hover:border-[#C5A059] transition-all duration-200 hover:-translate-y-0.5"
          >
            <Scale className="w-4 h-4 text-[#C5A059]" />
            <span>التأصيل الشرعي</span>
          </a>
        </div>
      </div>
    </section>
  );
}
