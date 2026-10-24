import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Compass,
  Sun,
  Library,
  ChevronLeft,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-8 sm:pt-12 pb-12 sm:pb-16 overflow-hidden bg-subtle-pattern">
      {/* Decorative ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#C5A059]/10 dark:bg-[#1B4332]/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center" dir="rtl">
        {/* Top Spiritual Pill linking to Shaykh page */}
        <Link
          href="/shaykh"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#9E7B35] dark:text-[#E5C378] text-xs sm:text-sm font-semibold mb-6 hover:bg-[#C5A059]/25 hover:border-[#C5A059] transition-all group shadow-sm"
          title="التعريف بشيخ الطريقة القادرية البودشيشية فضيلة الدكتور سيدي منير القادري بودشيش"
        >
          <GraduationCap className="w-4 h-4 text-[#C5A059]" />
          <span>الأكاديمية العلمية والتأصيلية • زاوية مدينة المحمدية</span>
          <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">←</span>
        </Link>

        {/* 1. Main Title & Short Definition */}
        <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold tracking-normal text-[#143628] dark:text-[#FAF7F2] leading-normal mb-2">
          مِنْهَاجُ الفَقِير
        </h1>

        <p className="font-amiri text-[#C5A059] dark:text-[#D4AF37] text-xl sm:text-2xl font-semibold leading-relaxed mb-4">
          التَّكْوِينُ العِلْمِيُّ وَالسُّلُوكِيُّ المُتَدَرِّجُ لِأَهْلِ الطَّرِيقِ
        </p>

        {/* Short, crisp definition */}
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed mb-8">
          منصة تعليمية وروحية لمريدي الطريقة القادرية البودشيشية، تجمع بين زاد الذكر اليومي، والتأصيل الشرعي لممارسات الطريق، والارتقاء السلوكي المتدرج.
        </p>

        {/* 2. Three Entry Portals: «ابدأ من هنا» — «زاد اليوم» — «تصفح المكتبة» */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto text-right">
          {/* Portal 1: Start Here */}
          <Link
            href="/masar"
            className="group relative p-5 rounded-2xl bg-white dark:bg-[#0E2019] border-2 border-[#1B4332]/40 dark:border-[#C5A059]/50 hover:border-[#C5A059] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/20 text-[#1B4332] dark:text-[#E5C378]">
                الخطوة الأولى
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#1B4332]/10 dark:bg-[#C5A059]/15 flex items-center justify-center text-[#1B4332] dark:text-[#E5C378]">
                <Compass className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1 group-hover:text-[#C5A059] transition-colors">
                ابدأ من هنا
              </h2>
              <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                المسار التكويني المتدرج لسالك الطريق عبر 6 محطات علمية وسلوكية.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between text-xs font-semibold text-[#1B4332] dark:text-[#E5C378]">
              <span>دخول المسار</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Portal 2: Zad Al-Yawm */}
          <a
            href="#daily-spiritual"
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#F7F2E8] dark:from-[#122820] dark:to-[#0A1813] border-2 border-[#C5A059]/60 hover:border-[#C5A059] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#8C6D23] dark:text-[#E5C378]">
                محطة يومية
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                <Sun className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1 group-hover:text-[#C5A059] transition-colors">
                زادُ اليَوْمِ
              </h2>
              <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                حكمة عطائية يومية، حديث نبوي شريف، ودرة فقهية من متن ابن عاشر.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[#C5A059]/30 flex items-center justify-between text-xs font-semibold text-[#C5A059]">
              <span>طالع زاد اليوم</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Portal 3: Library */}
          <a
            href="#knowledge-hub"
            className="group relative p-5 rounded-2xl bg-white dark:bg-[#0E2019] border-2 border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#122820] text-[#52796F] dark:text-[#95B8A8] border border-[#E7DFD5] dark:border-[#203D31]">
                الخزانة الكبرى
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#1B4332]/10 dark:bg-[#C5A059]/15 flex items-center justify-center text-[#143628] dark:text-[#FAF7F2]">
                <Library className="w-5 h-5 text-[#C5A059]" />
              </div>
            </div>
            <div>
              <h2 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1 group-hover:text-[#C5A059] transition-colors">
                تصفح المكتبة
              </h2>
              <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                الأربعين النووية، الحكم العطائية، تأصيل الممارسات، والأوراد الجامعة.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between text-xs font-semibold text-[#143628] dark:text-[#FAF7F2]">
              <span>فتح المكتبة</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
