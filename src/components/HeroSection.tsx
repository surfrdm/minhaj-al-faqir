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
    <section className="relative pt-12 pb-20 overflow-hidden bg-subtle-pattern">
      {/* Decorative ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#C5A059]/10 dark:bg-[#1B4332]/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Official Boutchichiyya Mohammedia Logo */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-44 sm:w-56 md:w-64 p-3 rounded-2xl bg-white/60 dark:bg-[#122820]/60 backdrop-blur-sm border border-[#C5A059]/30 shadow-md hover:scale-105 transition-all duration-300">
            <img
              src="/images/logo_boutchichiyya_mohammedia.png"
              alt="شعار الطريقة القادرية البودشيشية - مدينة المحمدية"
              className="w-full h-auto object-contain filter drop-shadow-sm"
            />
          </div>
        </div>

        {/* Top Spiritual Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#9E7B35] dark:text-[#E5C378] text-xs sm:text-sm font-semibold mb-8">
          <GraduationCap className="w-4 h-4 text-[#C5A059]" />
          <span>الأكاديمية العلمية والتأصيلية • الطريقة القادرية البودشيشية (مدينة المحمدية)</span>
        </div>

        {/* Main Title in Classical Calligraphic Serif */}
        <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#143628] dark:text-[#FAF7F2] leading-[1.3] sm:leading-[1.25] mb-6">
          مِنْهَاجُ الفَقِير
          <br />
          <span className="text-[#C5A059] dark:text-[#D4AF37] text-2xl sm:text-3xl lg:text-4xl font-semibold">
            التَّكْوِينُ العِلْمِيُّ وَالسُّلُوكِيُّ المُتَدَرِّجُ لِأَهْلِ الطَّرِيقِ
          </span>
        </h1>

        {/* Lead Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#1D2A24]/90 dark:text-[#D5E2DB] font-ibm leading-relaxed mb-10">
          صَرْحٌ مَنْهَجِيٌّ رَصِينٌ يَرْتَقِي بِالسَّالِكِ فِي <strong className="text-[#1B4332] dark:text-[#E5C378] font-semibold">مَدَارِجِ التَّرْبِيَةِ وَالإِحْسَانِ</strong>؛
          يَجْمَعُ بَيْنَ <strong className="text-[#1B4332] dark:text-[#E5C378] font-semibold">صَفَاءِ السُّلُوكِ القَلْبِيِّ</strong> وَ<strong className="text-[#1B4332] dark:text-[#E5C378] font-semibold">رُسُوخِ التَّأْصِيلِ الشَّرْعِيِّ</strong> لِدَقَائِقِ السَّيْرِ إِلَى اللهِ تَعَالَى (السَّبْحَة، الذِّكْر جَهْراً، وَعِمَارَة القُلُوبِ بِالوَجْدِ وَالسَّمَاعِ)،
          مَعَ اسْتِيعَابِ فِقْهِ الأَوْرَادِ وَأُمَّهَاتِ مُتُونِ السُّلُوكِ، وَاسْتِمْدَادِ الغِذَاءِ الرُّوحِيِّ اليَوْمِيِّ مِنْ دُرَرِ الحِكَمِ العَطَائِيَّةِ.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="#tracks"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] font-semibold shadow-md shadow-[#1B4332]/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-[#C5A059]/30"
          >
            <GraduationCap className="w-5 h-5 text-[#C5A059]" />
            <span>استكشف المسارات التعليمية والسلوكية</span>
          </a>

          <a
            href="#evidence"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white dark:bg-[#12241D] hover:bg-[#C5A059]/10 text-[#143628] dark:text-[#E8F0EC] font-semibold border border-[#E7DFD5] dark:border-[#203A2F] shadow-sm hover:border-[#C5A059] transition-all duration-200 hover:-translate-y-0.5"
          >
            <Scale className="w-5 h-5 text-[#C5A059]" />
            <span>التأصيل الشرعي (السبحة • الجهر • العمارة)</span>
          </a>

          <a
            href="#hikma-today"
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#9E7B35] dark:text-[#E5C378] font-semibold border border-[#C5A059]/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>حكمة اليوم المصورة</span>
          </a>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-right">
          <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#12241D]/90 border border-[#E7DFD5] dark:border-[#203A2F] shadow-sm hover:border-[#C5A059]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3.5">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
              تكوين الفقير المدرسي
            </h3>
            <p className="text-xs text-[#596B62] dark:text-[#9BB0A5] leading-relaxed">
              مسار بيداغوجي متدرج يبدأ من مدخل التربية وصولاً إلى رسوخ المعرفة والتحقيق.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#12241D]/90 border border-[#E7DFD5] dark:border-[#203A2F] shadow-sm hover:border-[#C5A059]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3.5">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
              تأصيل شرعي وعلمي
            </h3>
            <p className="text-xs text-[#596B62] dark:text-[#9BB0A5] leading-relaxed">
              أدلة قطعية من القرآن والسنة وفتاوى الحفاظ حول السبحة، الذكر جهراً، والعمارة.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#12241D]/90 border border-[#E7DFD5] dark:border-[#203A2F] shadow-sm hover:border-[#C5A059]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
              الأكاديمية والمتون
            </h3>
            <p className="text-xs text-[#596B62] dark:text-[#9BB0A5] leading-relaxed">
              الأربعين النووية بمساق سلوكي، تلاخيص أمهات كتب التصوف، والأبحاث الأكاديمية.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#12241D]/90 border border-[#E7DFD5] dark:border-[#203A2F] shadow-sm hover:border-[#C5A059]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3.5">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
              الأوراد والوظيفة
            </h3>
            <p className="text-xs text-[#596B62] dark:text-[#9BB0A5] leading-relaxed">
              منهاج اليوم والليلة للفقير: الاستغفار، الصلاة على النبي، الهيللة، والوظيفة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
