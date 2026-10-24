"use client";

import React from "react";
import { GraduationCap, Scale, BookOpen, Clock } from "lucide-react";

export function PillarsOverview() {
  return (
    <section className="py-12 bg-subtle-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold text-[#9E7B35] dark:text-[#E5C378] tracking-wider uppercase">
            أركان المنهاج الدراسي
          </span>
          <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#143628] dark:text-[#FAF7F2] mt-1">
            أربعة ركائز علمية وسلوكية تُنير درب السالك
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-right" dir="rtl">
          <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#12241D]/90 border border-[#E7DFD5] dark:border-[#203A2F] shadow-sm hover:border-[#C5A059]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3.5">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
              مَدَارِجُ الارْتِقَاءِ الرُّوحِيِّ
            </h3>
            <p className="text-xs text-[#596B62] dark:text-[#9BB0A5] leading-relaxed">
              مسار سلوكي متدرج يبدأ من مدخل التربية وصولاً إلى رسوخ المعرفة والتحقيق.
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
