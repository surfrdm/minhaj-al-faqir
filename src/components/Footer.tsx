"use client";

import { GraduationCap, Scale, Clock, BookOpen, Sparkles, Layers, HelpCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#143628] text-[#FAF7F2] border-t border-[#C5A059]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Calligraphic Quote */}
        <div className="text-center max-w-2xl mx-auto mb-12 p-6 rounded-2xl bg-[#0B1914]/40 border border-[#C5A059]/20 shadow-inner">
          <p className="font-amiri text-2xl font-bold text-[#E5C378] leading-relaxed mb-2">
            «مَا مَنَعَكَ شَيْئاً إِلَّا لِيُعْطِيَكَ، وَمَا أَوْرَدَكَ الحَاجَةَ إِلَّا لِيُشْهِدَكَ فَضْلَهُ»
          </p>
          <span className="text-xs text-[#FAF7F2]/60 font-ibm">
            — من جواهر الحكم العطائية
          </span>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10 text-right">
          {/* Brand & Vision */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-white/10 p-1.5 flex items-center justify-center border border-[#C5A059]/50 shadow-md">
                <img
                  src="/images/rosette_boutchichiyya.png"
                  alt="شعار الطريقة القادرية البودشيشية"
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>
              <div>
                <span className="font-amiri text-2xl font-bold block">
                  مِنْهَاجُ الفَقِير
                </span>
                <span className="text-xs text-[#C5A059] block font-medium">
                  الطريقة القادرية البودشيشية • زاوية مدينة المحمدية
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/75 font-ibm leading-relaxed max-w-md">
              صرح تعليمي وتأصيلي متدرج لفقراء ومريدي الطريقة القادرية البودشيشية،
              يجمع بين التأصيل الشرعي العلمي الموثق لأعمال الطريق (السبحة، الذكر جهراً، العمارة)،
              وفقه الأوراد والوظيفة، ودراسة الأربعين النووية وأمهات كتب التصوف السني،
              مع الغذاء الروحي اليومي عبر الحكم العطائية.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-amiri text-lg font-bold text-[#E5C378]">
              أركان المنصة
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F2]/80 font-ibm">
              <li>
                <a href="#tracks" className="hover:text-[#C5A059] transition">
                  • الأسلاك التكوينية (المدرسة)
                </a>
              </li>
              <li>
                <a href="#evidence" className="hover:text-[#C5A059] transition">
                  • التأصيل الشرعي (السبحة • الجهر • العمارة)
                </a>
              </li>
              <li>
                <a href="#wazifa" className="hover:text-[#C5A059] transition">
                  • الأوراد والوظيفة ودستور الخدمة
                </a>
              </li>
              <li>
                <a href="#academy" className="hover:text-[#C5A059] transition">
                  • الأكاديمية والمتون (الأربعين النووية والكتب)
                </a>
              </li>
              <li>
                <a href="#hikma-today" className="hover:text-[#C5A059] transition">
                  • حكمة اليوم المصورة
                </a>
              </li>
              <li>
                <a href="#archive" className="hover:text-[#C5A059] transition">
                  • أرشيف الحكم العطائية (264)
                </a>
              </li>
              <li>
                <a href="#glossary" className="hover:text-[#C5A059] transition">
                  • معجم مصطلحات الطريق
                </a>
              </li>
            </ul>
          </div>

          {/* Principles */}
          <div className="space-y-3">
            <h4 className="font-amiri text-lg font-bold text-[#E5C378]">
              مرتكزات المنهج البودشيشي
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F2]/80 font-ibm">
              <li>• الجمع المحكم بين الشريعة والحقيقة</li>
              <li>• التربية على الشكر والمحبة النبوية</li>
              <li>• كسر التكبر ومبدأ أن الخلق كلهم سواسية</li>
              <li>• نصرة الممارسات بالأدلة النقلية والشرعية</li>
              <li>• جبر خواطر الفقراء والخدمة الخالصة</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F2]/60">
          <p>© 2026 مِنْهَاجُ الفَقِير — الأكاديمية التكوينية والتأصيلية. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1.5 font-ibm">
            <span>صُمّم بعناية وروحانية لخدمة أهل السلوك</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
