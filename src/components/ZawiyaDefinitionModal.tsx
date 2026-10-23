"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  BookOpen,
  GraduationCap,
  Globe2,
  HeartHandshake,
  Compass,
  CheckCircle2,
  Award
} from "lucide-react";

interface ZawiyaDefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ZawiyaDefinitionModal({ isOpen, onClose }: ZawiyaDefinitionModalProps) {
  const [activeTab, setActiveTab] = useState<"tariqa" | "shaykh">("tariqa");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#FAF7F2] dark:bg-[#0E2019] rounded-2xl border border-[#C5A059]/40 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#1B4332] via-[#143628] to-[#1B4332] text-[#FAF7F2] flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 p-1.5 flex items-center justify-center border border-[#C5A059]/40 shadow-md">
              <img
                src="/images/logo_zawiya_mohammedia_clean.png"
                alt="شعار الطريقة القادرية البودشيشية"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <h2 className="font-amiri text-xl sm:text-2xl font-bold tracking-wide">
                الطَّرِيقَةُ القَادِرِيَّةُ البُودْشِيشِيَّةُ
              </h2>
              <p className="text-xs text-[#E5C378] font-sans">
                زاوية مدينة المحمدية الشريفة • التعريف بالمنهج والشيخ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 bg-[#F4EFE6] dark:bg-[#0A1813] border-b border-[#E7DFD5] dark:border-[#203D31] flex gap-3">
          <button
            onClick={() => setActiveTab("tariqa")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "tariqa"
                ? "border-[#C5A059] text-[#1B4332] dark:text-[#E5C378]"
                : "border-transparent text-[#6B7D74] dark:text-[#8E9F96] hover:text-[#1B4332]"
            }`}
          >
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>التعريف بالطريقة والمنهج</span>
          </button>
          <button
            onClick={() => setActiveTab("shaykh")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "shaykh"
                ? "border-[#C5A059] text-[#1B4332] dark:text-[#E5C378]"
                : "border-transparent text-[#6B7D74] dark:text-[#8E9F96] hover:text-[#1B4332]"
            }`}
          >
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span>شيخ الطريقة: سيدي منير القادري بودشيش</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: TARIQA DEFINITION */}
          {activeTab === "tariqa" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Origin of Name */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm">
                <div className="flex items-center gap-2.5 mb-2 text-[#1B4332] dark:text-[#E5C378]">
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-amiri text-lg font-bold">أصل التسمية والسند القادري</h3>
                </div>
                <p className="font-ibm text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
                  تنتسب الطريقة القادرية البودشيشية إلى الإمام العارف بالله وسلطان الأولياء <strong>سيدي عبد القادر الجيلاني</strong> رضي الله عنه (المتوفى سنة 561هـ). وعُرفت بـ <strong>"البودشيشية"</strong> نسبة إلى الولي الصالح <strong>سيدي علي بن محمد</strong> دفين بني سنوس (نواحي وجدة والجهة الشرقية)، الذي لُقّب بـ <em>"سيدي علي بودشيش"</em> لكونه كان يُطعم الناس في عام مسغبة ومجاعة طعاماً يُعرف بالمغرب بـ <strong>"الدشيشة"</strong> (حساء الشعير)، فاقترن اسم الطريقة بالكرم والجود وإطعام الطعام وخدمة الخلق.
                </p>
              </div>

              {/* Pillars of the Method */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm">
                <div className="flex items-center gap-2.5 mb-3 text-[#1B4332] dark:text-[#E5C378]">
                  <HeartHandshake className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-amiri text-lg font-bold">معالم المنهج التربوي</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 font-ibm text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB]">
                  <div className="p-3 rounded-lg bg-[#FAF7F2] dark:bg-[#081410] border border-[#E7DFD5] dark:border-[#1F3A2E]">
                    <strong className="text-[#1B4332] dark:text-[#E5C378] block mb-1">المحبة والذكر الكثير:</strong>
                    التربية بالحب في الله، وملازمة ذكر الله تعالى باللسان والقلب لغسل القلوب من الصدأ ورؤية النفس.
                  </div>
                  <div className="p-3 rounded-lg bg-[#FAF7F2] dark:bg-[#081410] border border-[#E7DFD5] dark:border-[#1F3A2E]">
                    <strong className="text-[#1B4332] dark:text-[#E5C378] block mb-1">الجمع بين الشريعة والحقيقة:</strong>
                    التصوف السني الجنيدي المنضبط بالكتاب والسنة والعمل بأحكام المذهب المالكي بلا غلو ولا ابتداع.
                  </div>
                  <div className="p-3 rounded-lg bg-[#FAF7F2] dark:bg-[#081410] border border-[#E7DFD5] dark:border-[#1F3A2E]">
                    <strong className="text-[#1B4332] dark:text-[#E5C378] block mb-1">خدمة الخلق وجبر الخواطر:</strong>
                    حسن الخلق، التواضع للفقراء وعامة المسلمين، واعتبار خدمة عباد الله مقصداً كبيراً من مقاصد السير.
                  </div>
                  <div className="p-3 rounded-lg bg-[#FAF7F2] dark:bg-[#081410] border border-[#E7DFD5] dark:border-[#1F3A2E]">
                    <strong className="text-[#1B4332] dark:text-[#E5C378] block mb-1">الثوابت الوطنية الجامعة:</strong>
                    الوفاء لثوابت المملكة المغربية الشريفة (العقيدة الأشعرية، المذهب المالكي، التصوف السني، وإمارة المؤمنين).
                  </div>
                </div>
              </div>

              {/* International Sufi Forum */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#1B4332]/10 to-[#C5A059]/10 border border-[#C5A059]/30">
                <div className="flex items-center gap-2 mb-2 text-[#1B4332] dark:text-[#E5C378]">
                  <Globe2 className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="font-amiri text-base font-bold">الملتقى العالمي للتصوف بمداغ الشريفة</h4>
                </div>
                <p className="font-ibm text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
                  تنظم الزاوية الأم بمداغ سنوياً بمناسبة ذكرى المولد النبوي الشريف <strong>«الملتقى العالمي للتصوف»</strong>، الذي يجمع نخبة من كبار العلماء والمفكرين والأكاديميين من شتى قارات العالم لمدارسة إسهامات التصوف في بناء السلام، ترسيخ القيم الأخلاقية، ومكافحة التطرف.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SHAYKH DEFINITION */}
          {activeTab === "shaykh" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Shaykh Profile Header */}
              <div className="p-5 rounded-xl bg-white dark:bg-[#122820] border border-[#C5A059]/40 shadow-sm flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
                <div className="w-16 h-16 rounded-full bg-[#1B4332] p-2 flex items-center justify-center border-2 border-[#C5A059] shadow-md shrink-0">
                  <img
                    src="/images/rosette_boutchichiyya.png"
                    alt="شعار الزاوية"
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-sans tracking-wider text-[#C5A059] font-semibold block mb-0.5">
                    شَيْخُ الطَّرِيقَةِ القَادِرِيَّةِ البُودْشِيشِيَّةِ
                  </span>
                  <h3 className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-tight">
                    فضيلة الدكتور الشيخ سيدي منير القادري بودشيش
                  </h3>
                  <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm mt-1">
                    عالم ومفكر إسلامي • رئيس مؤسسة الملتقى • مدير المركز الأورو-متوسطي لدراسة الإسلام اليوم (CERCLE)
                  </p>
                </div>
              </div>

              {/* Scholarly & Spiritual Background */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                  <GraduationCap className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="font-amiri text-lg font-bold">المسار الأكاديمي والفكري</h4>
                </div>
                <p className="font-ibm text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
                  يجمع فضيلة الشيخ الدكتور سيدي منير القادري بودشيش بين <strong>الوراثة الروحية الأصيلة</strong> وسعة <strong>التكوين العلمي والأكاديمي المعاصر</strong>. فهو حاصل على الدكتوراه في الدراسات الإسلامية والفكر الصوفي، ويشغل منصب رئيس المركز الأورو-متوسطي لدراسة إسلام اليوم في باريس، ورئيس مؤسسة الملتقى العالمي للتصوف.
                </p>
              </div>

              {/* Key Priorities in Spiritual Leadership */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#E5C378]">
                  <BookOpen className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="font-amiri text-lg font-bold">أولويات التجديد والتربية المعاصرة</h4>
                </div>
                <ul className="space-y-2.5 font-ibm text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span><strong>التربية الروحية كأداة لبناء الإنسان الصالح:</strong> التأكيد على أن التصوف عمل وسلوك في الواقع، وليس مجرد نظريات أو انعزال عن المجتمع.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span><strong>العناية بالشباب والأجيال الصاعدة:</strong> حماية الشباب من التطرف الفكري والخواء الروحي عبر تقديم خطاب صوفي ناصع يجمع بين الأصالة والحداثة.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span><strong>الدبلوماسية الروحية وإشعاع المغرب عالمياً:</strong> الإسهام الفاعل في إبراز النموذج الديني والروحي المغربي القائم على الوسطية والاعتدال والسلام.</span>
                  </li>
                </ul>
              </div>

              {/* Quote / Spiritual Rationale */}
              <div className="p-4 rounded-xl bg-[#1B4332] text-[#FAF7F2] border border-[#C5A059]/40 text-center">
                <p className="font-amiri text-base sm:text-lg leading-relaxed italic text-[#E5C378] mb-1">
                  «التصوف السني هو روح الإسلام وجوهره، وغايته تربية القلوب على حب الله ورسوله، وخدمة الإنسانية بالرحمة والجمال.»
                </p>
                <span className="text-[11px] font-sans text-white/70 block">
                  — فضيلة الشيخ الدكتور سيدي منير القادري بودشيش
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#F4EFE6] dark:bg-[#081410] border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between">
          <span className="text-xs text-[#829288] dark:text-[#7A8C82]">
            زاوية مدينة المحمدية • الطريقة القادرية البودشيشية
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1B4332] text-[#FAF7F2] hover:bg-[#143628] text-xs font-semibold transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
}
