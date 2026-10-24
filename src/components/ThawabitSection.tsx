"use client";

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Share2,
  Users,
  HeartHandshake,
  ShieldCheck,
  Coins,
  Send,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  Award,
} from "lucide-react";

const ZAWIYA_FACEBOOK_URL = "https://www.facebook.com/zaouia.mohammedia";

export const THAWABIT_DATA = [
  {
    id: "dhikr",
    num: 1,
    title: "الذِّكْرُ وَالتَّذْكِيرُ",
    tagline: "تجديد الإذن، دوام الأوراد، وعمارة الزوايا",
    icon: Sparkles,
    color: "#C5A059",
    summary:
      "تجديد الإذن في الأوراد العامة والخاصة والوظائف، وملازمة الأدب والتوجه الصادق لتزكية النفس واستقرار مجالس الذكر بالزوايا.",
    points: [
      "يجدد شيخنا حفظه الله تعالى ورضي عنه، الإذن في الأذكار المنتظمة في الأوراد العامة والخاصة، ووظائف الطريقة وأذكار الاعتصام بباب الله، ومختلف برامج الصدقات والخلوات الجماعية والاعتكافات.",
      "يحث شيخنا على الاجتهاد في أداء الأذكار الفردية والجماعية بالأدب اللازم، والتوجه الصادق إلى الله عز وجل، تزكية للنفس وتطهيراً للقلب، حتى تستقيم الأقوال على التوحيد، والأفعال على الموافقة، والأحوال على الإخلاص.",
      "يوصي شيخنا بالحرص على استقرار الأذكار الجماعية الخاصة بالزوايا كمقرات رئيسية للطريقة، بطهارة الثوب والبدن والمكان، واستحضار عظمة المذكور سبحانه، كأذكار الاعتصام أو اللطيف وسائر البرامج الخاصة.",
    ],
  },
  {
    id: "talim",
    num: 2,
    title: "العِلْمُ وَالتَّكْوِينُ",
    tagline: "الدلائل المنهجية والجمع بين الأصالة والمعاصرة",
    icon: BookOpen,
    color: "#1B4332",
    summary:
      "اعتماد دلائل علمية توحد مفاهيم فقه الطريقة، وتزويد المريدين بالكفايات التأصيلية والمهارات التواصلية العصرية.",
    points: [
      "اعتماد دلائل علمية تعريفية، توحد مفاهيم فقه الطريقة تثقيفاً وتوعية، تأطيراً وتدبيراً.",
      "وضع برامج تكوينية تزود المريدات والمريدين بالكفايات التأصيلية والمهارات التواصلية، جمعاً بين العلوم الشرعية الرصينة والعلوم العصرية المواكبة.",
    ],
  },
  {
    id: "nashr",
    num: 3,
    title: "النَّشْرُ وَالِاسْتِقْبَالُ",
    tagline: "التدين الوسطي المعتدل والتجسير المعاصر",
    icon: Send,
    color: "#1E3A8A",
    summary:
      "بيان مقاصد الطريقة الأخلاقية والتربوية بخطاب وسطي معتدل يجسر بين الأصول وأشواق الروح، مع مصادقة اللجنة العلمية.",
    points: [
      "العناية باجتماعات النشر من أجل التعريف بمقاصد الطريقة وأدوارها التربوية والأخلاقية والاجتماعية، وترسيخ ثوابت التدين الوسطي والمعتدل من خلال خطاب يجسر بين الأصول الشرعية وأشواق الروح ومتغيرات السياق المعاصر.",
      "تخصيص اجتماع دوري منتظم ينهض بنشر الطريقة وبيان مقاصدها الأخلاقية النافعة للفرد والمجتمع.",
      "اشتراط مصادقة اللجنة العلمية على مختلف الأعمال والإنتاجات العلمية والإعلامية قبل نشرها.",
    ],
  },
  {
    id: "shabab",
    num: 4,
    title: "الشَّبَابُ وَالبَرَاعِمُ",
    tagline: "تحصين الناشئة وصناعة المواطنة الإيجابية",
    icon: Users,
    color: "#047857",
    summary:
      "عناية خاصة بالبراعم والشباب ذكوراً وإناثاً، ببرامج تواكب الزمن الرقمي وتقيهم من التطرف والعدمية وتبني حس المبادرة.",
    points: [
      "مراعاة النمو النفسي والنضج العمري للبراعم واليافعين والشباب راشدين وراشدات.",
      "مواكبة متغيرات الزمن الرقمي المعاصر وبناء كفاياتهم في رفع التحديات بإيجابية وإبداع.",
      "إكسابهم حس المبادرة وقوة الاقتراح للإسهام في بناء مواطنة صالحة ونافعة تنشر قيم المحبة والسلام.",
      "وقايتهم من العدمية والتطرف وكل أشكال التيئيس والقنوط.",
      "تحصينهم من مختلف أنواع الاختراق الهدامة لعقولهم ووجداناتهم، وكل انزلاق خطير نحو العنف أو الإدمان.",
      "تأهيلهم للعطاء الإيجابي وتمكينهم من التمييز بين الخطابات الأصيلة والدخيلة.",
    ],
  },
  {
    id: "joud",
    num: 5,
    title: "الإِنْفَاقُ وَالجُودُ",
    tagline: "فالوجود ينفعل بالجود • التكافل والتسيير",
    icon: Coins,
    color: "#B45309",
    summary:
      "تجديد الإذن في منهجية الإنفاق الشهرية والسنوية لتدبير شؤون الطريقة وزواياها، ودعم الفئات الهشة في أعمال البر والتكافل.",
    points: [
      "يجدد شيخنا رضي الله عنه الإذن في اعتماد منهجية الإنفاق في طريقتنا المباركة بصيغتيها الشهرية والسنوية.",
      "ضمان حسن سير وتدبير أنشطة وشؤون الطريقة والزوايا وتغطية نفقاتها العامة.",
      "الإسهام الفاعل في أعمال البر والخير والتكافل الاجتماعي بدعم مختلف الفئات الهشة، فرسالة القوم: «فَالوُجُودُ يَنْفَعِلُ بِالجُودِ».",
    ],
  },
];

export function ThawabitSection() {
  const [expandedId, setExpandedId] = useState<string | null>("dhikr");
  const [copied, setCopied] = useState(false);

  const handleShareWhatsApp = (thawabi: typeof THAWABIT_DATA[0]) => {
    const pointsText = thawabi.points.map((p) => `• ${p}`).join("\n");
    const text = `🌟 الثوابت الخمسة في الطريقة البودشيشية (${thawabi.num}/5): ${thawabi.title}\n\n${thawabi.summary}\n\nالتفاصيل والتوجيهات:\n${pointsText}\n\nطالع الميثاق كاملاً على منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/#thawabit`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyAll = () => {
    let fullText = "🌟 الثوابت الخمسة في الطريقة القادرية البودشيشية 🌟\nيوصي شيخنا رضي الله عنه بالعناية والالتزام بالثوابت الخمسة التالية:\n\n";
    THAWABIT_DATA.forEach((t) => {
      fullText += `【 ${t.num}. ${t.title} 】\n${t.summary}\n` + t.points.map((p) => `  - ${p}`).join("\n") + "\n\n";
    });
    fullText += "— منصة منهاج الفقير (زاوية مدينة المحمدية)";
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="thawabit"
      className="scroll-mt-20 py-16 sm:py-20 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] dark:from-[#081410] dark:via-[#0B1914] dark:to-[#081410] border-t border-[#E7DFD5] dark:border-[#203D31] relative transition-colors duration-300"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 border border-[#1B4332]/20 dark:border-[#C5A059]/30 text-[#1B4332] dark:text-[#E5C378] text-xs sm:text-sm font-semibold mb-3">
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span>مِيثَاقُ الطَّرِيقِ • تَوْجِيهَاتُ المَشْيَخَةِ الجَلِيلَةِ</span>
          </div>

          <h2 className="font-amiri text-3xl sm:text-5xl font-bold text-[#143628] dark:text-[#FAF7F2] tracking-wide mb-3 leading-tight">
            الثَّوَابِتُ الخَمْسَةُ فِي الطَّرِيقَةِ
          </h2>

          <p className="font-ibm text-xs sm:text-sm text-[#52796F] dark:text-[#9BB0A5] leading-relaxed max-w-2xl mx-auto mb-4">
            يوصي شيخنا رضي الله عنه وأرضاه، المريدات والمريدين، بالعناية التامة والالتزام الدائم بالثوابت الخمسة المؤسسة للنهضة التربوية والسلوكية والمجتمعية.
          </p>

          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#122820]/80 border border-[#C5A059]/40 max-w-2xl mx-auto shadow-sm flex items-center justify-between gap-3">
            <p className="font-amiri text-sm sm:text-base font-bold text-[#1B4332] dark:text-[#E5C378] text-right">
              «الذِّكْرُ • العِلْمُ • النَّشْرُ • الشَّبَابُ • الإِنْفَاقُ»
            </p>
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-xl bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#9E7B35] dark:text-[#E5C378] border border-[#C5A059]/30 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
              title="نسخ وثيقة الثوابت كاملة"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الوثيقة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 items-start">
          {THAWABIT_DATA.map((t) => {
            const Icon = t.icon;
            const isExpanded = expandedId === t.id;

            return (
              <div
                key={t.id}
                className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden lg:col-span-1 ${
                  isExpanded
                    ? "bg-white dark:bg-[#0E2019] border-[#C5A059] shadow-xl ring-1 ring-[#C5A059]/40"
                    : "bg-white/90 dark:bg-[#0E2019]/90 border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059] shadow-sm hover:shadow-md"
                }`}
              >
                {/* Pillar Card Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                  className="p-5 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-9 h-9 rounded-2xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center font-mono font-bold text-sm border border-[#C5A059]/30">
                      #{t.num}
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-[#1B4332]/10 dark:bg-[#C5A059]/15 flex items-center justify-center text-[#1B4332] dark:text-[#E5C378]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-amiri text-xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                    {t.title}
                  </h3>
                  <span className="text-xs font-semibold text-[#C5A059] block mb-2">
                    {t.tagline}
                  </span>

                  <p className="font-ibm text-xs text-[#52796F] dark:text-[#95B8A8] leading-relaxed line-clamp-3">
                    {t.summary}
                  </p>
                </div>

                {/* Expanded Detailed Points */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] space-y-3 bg-[#FAF7F2]/60 dark:bg-[#081410]/60 animate-in fade-in duration-200">
                    <span className="text-xs font-bold text-[#1B4332] dark:text-[#E5C378] block">
                      التفاصيل والتوجيهات المعتمدة:
                    </span>
                    <div className="space-y-2">
                      {t.points.map((pt, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-ibm text-[#1D2A24]/90 dark:text-[#C5D5CC] leading-relaxed"
                        >
                          <span className="text-[#C5A059] font-mono text-xs mt-0.5">•</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 flex items-center justify-between gap-2">
                      <a
                        href={ZAWIYA_FACEBOOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#5B9DF8] border border-[#1877F2]/30 text-xs font-semibold flex items-center gap-1 transition"
                        title="زيارة صفحة الزاوية على فيسبوك"
                      >
                        <span>زيارة صفحة الزاوية</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => handleShareWhatsApp(t)}
                        className="py-1.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>مشاركة الثابت</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Expand Toggle Button */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                  className="w-full py-2 px-4 bg-[#FAF7F2] dark:bg-[#122820] text-center text-xs font-semibold text-[#52796F] dark:text-[#A1B3A9] hover:text-[#C5A059] border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-center gap-1 transition"
                >
                  <span>{isExpanded ? "طي التفاصيل" : "عرض التوجيهات بالتفصيل"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-[#C5A059]" : ""
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
