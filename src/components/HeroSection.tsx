import Link from "next/link";
import {
  GraduationCap,
  Scale,
  Sparkles,
  BookOpen,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-10 sm:pt-14 pb-12 sm:pb-16 overflow-hidden bg-subtle-pattern">
      {/* Decorative ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#C5A059]/10 dark:bg-[#1B4332]/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center" dir="rtl">
        {/* Top Spiritual Pill linking to Shaykh page */}
        <Link
          href="/shaykh"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#9E7B35] dark:text-[#E5C378] text-xs sm:text-sm font-semibold mb-6 hover:bg-[#C5A059]/25 hover:border-[#C5A059] transition-all group"
          title="التعريف بشيخ الطريقة القادرية البودشيشية"
        >
          <GraduationCap className="w-4 h-4 text-[#C5A059]" />
          <span>الأكاديمية العلمية والتأصيلية • الطريقة القادرية البودشيشية (مدينة المحمدية)</span>
          <span className="text-[11px] opacity-70 group-hover:opacity-100 transition-opacity">←</span>
        </Link>

        {/* Main Title with generous vertical room so diacritics breathe */}
        <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold tracking-normal text-[#143628] dark:text-[#FAF7F2] leading-normal mb-3 pt-2">
          مِنْهَاجُ الفَقِير
        </h1>

        {/* Subtitle on dedicated element with relaxed leading to prevent any collision */}
        <p className="font-amiri text-[#C5A059] dark:text-[#D4AF37] text-xl sm:text-2xl lg:text-3xl font-semibold leading-relaxed mb-6 pt-1">
          التَّكْوِينُ العِلْمِيُّ وَالسُّلُوكِيُّ المُتَدَرِّجُ لِأَهْلِ الطَّرِيقِ
        </p>

        {/* Lead Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed mb-8">
          صَرْحٌ مَنْهَجِيٌّ رَصِينٌ يَرْتَقِي بِالسَّالِكِ فِي <strong className="text-[#1B4332] dark:text-[#E5C378] font-semibold">مَدَارِجِ التَّرْبِيَةِ وَالإِحْسَانِ</strong>؛ يَجْمَعُ بَيْنَ صَفَاءِ السُّلُوكِ القَلْبِيِّ وَرُسُوخِ التَّأْصِيلِ الشَّرْعِيِّ وَاسْتِمْدَادِ الغِذَاءِ الرُّوحِيِّ اليَوْمِيِّ.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#daily-spiritual"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] font-semibold shadow-md shadow-[#1B4332]/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-[#C5A059]/40 text-xs sm:text-sm"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>زاد اليوم الروحي (الحكمة والحديث والورد)</span>
          </a>

          <a
            href="#knowledge-hub"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#12241D] hover:bg-[#C5A059]/10 text-[#143628] dark:text-[#E8F0EC] font-semibold border border-[#E7DFD5] dark:border-[#203A2F] shadow-sm hover:border-[#C5A059] transition-all duration-200 hover:-translate-y-0.5 text-xs sm:text-sm"
          >
            <BookOpen className="w-4 h-4 text-[#C5A059]" />
            <span>خزانة المقررات والمتون الشاملة</span>
          </a>
        </div>
      </div>
    </section>
  );
}
