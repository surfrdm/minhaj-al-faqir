"use client";

import React, { useState } from "react";
import {
  Award,
  Droplets,
  Compass,
  PhoneOff,
  EyeOff,
  Volume2,
  Users,
  ShieldCheck,
  Clock,
  Layers,
  Radio,
  ExternalLink,
  Share2,
  Check,
  Copy,
} from "lucide-react";

/**
 * أيقونة الامتناع عن شرب الماء: كأس ماء مشطوب بخط مائل دال على الامتناع والنهي
 */
export function GlassWaterOff({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z" />
      <path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

export const ADAB_DHIKR_DATA = [
  {
    num: 1,
    title: "الطَّهَارَةُ",
    icon: Droplets,
    description: "أن يكون الذاكر متوضئاً، نقي الثياب، طيب الرائحة؛ إجلالاً لحضرة المذكور سبحانه ومجالسة الملائكة الكرام.",
  },
  {
    num: 2,
    title: "التَّوَجُّهُ",
    icon: Compass,
    description: "استحضار همة شيخه ليكون رفيقاً له في السير.",
  },
  {
    num: 3,
    title: "إِقْفَالُ الهَاتِفِ",
    icon: PhoneOff,
    danger: true,
    description: "إقفال الهاتف أثناء الذكر حفاظاً على حرمة المجلس وحتى لا يشوش على حلقة الذكر ويشتت ذهن الذاكرين.",
  },
  {
    num: 4,
    title: "تَغْمِيضُ العَيْنَيْنِ",
    icon: EyeOff,
    description: "تغميض العينين للمساعدة على التركيز في معاني الذكر.",
  },
  {
    num: 5,
    title: "المُشَارَكَةُ جَهْراً",
    icon: Volume2,
    description: "المشاركة جهراً في الذكر الجماعي بخشوع ونشاط واجتناب النوم.",
  },
  {
    num: 6,
    title: "الِامْتِنَاعُ عَنْ شُرْبِ المَاءِ",
    icon: GlassWaterOff,
    description: "الامتناع عن شرب الماء أثناء الذكر.",
  },
  {
    num: 7,
    title: "انْعِقَادُ المَجْلِسِ عَلَى هَيْئَةِ حَلْقَةٍ",
    icon: Users,
    description: "انعقاد المجلس على هيئة حلقة واجتناب وجود ثغرات تفصل بينهم وذلك حسب الإمكان.",
  },
  {
    num: 8,
    title: "الهُدُوءُ وَالسَّكِينَةُ",
    icon: ShieldCheck,
    description: "اجتناب كل ما من شأنه التشويش على حرمة الذكر: الكلام أثناء الذكر، عدم الالتفات وترك الحركة، كثرة التثاؤب، والضحك والمزاح.",
  },
  {
    num: 9,
    title: "الحِرْصُ عَلَى حُضُورِ الذِّكْرِ مِنْ البِدَايَةِ حَتَّى النِّهَايَةِ",
    icon: Clock,
    description: "قياساً بالصلاة وعدم الانصراف إلا للضرورة. «مَنْ قَامَ مِنَ المَجْلِسِ مِنْ غَيْرِ عُذْرٍ مَقْبُولٍ فَقَدْ حُرِمَ بَرَكَةَ ذَلِكَ المَجْلِسِ».",
  },
  {
    num: 10,
    title: "التَّوَقُّفُ عَنْ ذِكْرِ الوِرْدِ الفَرْدِيِّ",
    icon: Layers,
    description: "التوقف عن ذكر الورد الفردي أثناء الوظيفة.",
  },
  {
    num: 11,
    title: "الاسْتِمَاعُ إِلَى المُذَاكَرَاتِ التَّرْبَوِيَّةِ وَالسَّمَاعِ",
    icon: Radio,
    description: "والصمت عن الكلام في مختلف الأمور الدنيوية وغيرها.",
  },
];

export function AdabDhikrSection() {
  const [copied, setCopied] = useState(false);

  const handleShareWhatsApp = () => {
    let text = "📜 فقه الطريق : آداب الذكر في الطريقة البودشيشية 📜\n\nالانتفاع بمجالس الذكر والاستفادة من أسرارها وفيوضاتها يستوجب من الذاكر التحلي بمجموعة من الآداب:\n\n";
    ADAB_DHIKR_DATA.forEach((adab) => {
      text += `• ${adab.title}: ${adab.description}\n`;
    });
    text += `\nطالع الآداب كاملة على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/thawabit#adab-dhikr`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopy = () => {
    let text = "📜 فقه الطريق : آداب الذكر 📜\n\nالانتفاع بمجالس الذكر والاستفادة من أسرارها وفيوضاتها يستوجب من الذاكر التحلي بمجموعة من الآداب:\n\n";
    ADAB_DHIKR_DATA.forEach((adab) => {
      text += `• ${adab.title}: ${adab.description}\n`;
    });
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="adab-dhikr"
      className="scroll-mt-20 py-12 sm:py-16 bg-white dark:bg-[#07130E] border-t border-[#E7DFD5] dark:border-[#203D31] relative transition-colors duration-300"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] border-2 border-[#C5A059]/40 text-white shadow-lg mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/25 text-[#E5C378] text-xs font-bold border border-[#C5A059]/40">
              <Award className="w-3.5 h-3.5" />
              <span>فِقْهُ الطَّرِيقِ • مَجَالِسُ الصَّفَاءِ</span>
            </div>
            <h3 className="font-amiri text-2xl sm:text-4xl font-bold text-[#FAF7F2] leading-tight">
              آدَابُ مَجَالِسِ الذِّكْرِ (11 أَدَباً)
            </h3>
            <p className="text-xs sm:text-sm text-[#E8F0EC]/80 font-ibm max-w-2xl leading-relaxed">
              الانتفاع بمجالس الذكر والاستفادة من أسرارها وفيوضاتها يستوجب من الذاكر التحلي بمجموعة من الآداب المباركة:
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
            <button
              onClick={handleCopy}
              className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
              title="نسخ آداب الذكر"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#C5A059]" />
                  <span>نسخ الآداب</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-2 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="مشاركة الآداب عبر واتساب"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة عبر واتساب</span>
            </button>

            <a
              href="https://www.facebook.com/zaouia.mohammedia"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 rounded-xl bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-white text-xs font-semibold flex items-center gap-1.5 transition border border-[#1877F2]/40"
              title="صفحة الزاوية على فيسبوك"
            >
              <span>صفحة الزاوية</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 11 Etiquettes Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADAB_DHIKR_DATA.map((adab) => {
            const Icon = adab.icon;
            return (
              <div
                key={adab.num}
                className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] transition-all duration-200 space-y-2 text-right shadow-xs hover:shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        adab.danger
                          ? "bg-red-500/15 text-red-600 dark:text-red-400"
                          : "bg-[#143628] dark:bg-[#1B4332] text-[#C5A059]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-amiri text-base sm:text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                      {adab.num}. {adab.title}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378] font-bold">
                    أدب {adab.num}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#406357] dark:text-[#A1B8AD] font-ibm leading-relaxed pt-1">
                  {adab.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
