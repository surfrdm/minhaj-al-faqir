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
  Award,
  Briefcase,
  Crown,
  Building,
  School,
  FileText,
  UserCheck
} from "lucide-react";

interface ZawiyaDefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ZawiyaDefinitionModal({ isOpen, onClose }: ZawiyaDefinitionModalProps) {
  // Start directly on Shaykh profile as requested
  const [activeTab, setActiveTab] = useState<"shaykh" | "tariqa">("shaykh");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl my-auto bg-[#FAF7F2] dark:bg-[#0B1A14] rounded-2xl border border-[#C5A059]/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Top Header */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 bg-gradient-to-r from-[#1B4332] via-[#143628] to-[#1B4332] text-[#FAF7F2] flex items-center justify-between border-b border-[#C5A059]/40 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 p-1.5 flex items-center justify-center border border-[#C5A059]/40 shadow-inner shrink-0">
              <img
                src="/images/logo_zawiya_mohammedia_clean.png"
                alt="شعار زاوية المحمدية"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <h2 className="font-amiri text-lg sm:text-2xl font-bold tracking-wide text-[#FAF7F2]">
                الطَّرِيقَةُ القَادِرِيَّةُ البُودْشِيشِيَّةُ
              </h2>
              <p className="text-[11px] sm:text-xs text-[#E5C378] font-ibm">
                زاوية مدينة المحمدية الشريفة • التعريف بالشيخ والمنهج التربوي
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/shaykh"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#E5C378] border border-[#C5A059]/40 text-xs font-semibold transition-colors"
              title="الانتقال إلى الصفحة الكاملة المستقلة لشيخ الطريقة"
            >
              <span>فتح في صفحة كاملة</span>
              <span className="text-[10px]">↗</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher - Sheikh first! */}
        <div className="px-5 sm:px-7 pt-3 bg-[#F4EFE6] dark:bg-[#081510] border-b border-[#E7DFD5] dark:border-[#1F3A2E] flex gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => setActiveTab("shaykh")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "shaykh"
                ? "border-[#C5A059] text-[#1B4332] dark:text-[#E5C378]"
                : "border-transparent text-[#6B7D74] dark:text-[#8E9F96] hover:text-[#1B4332]"
            }`}
          >
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span>ورقة تعريفية بشيخ الطريقة: سيدي منير القادري بودشيش</span>
          </button>

          <button
            onClick={() => setActiveTab("tariqa")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "tariqa"
                ? "border-[#C5A059] text-[#1B4332] dark:text-[#E5C378]"
                : "border-transparent text-[#6B7D74] dark:text-[#8E9F96] hover:text-[#1B4332]"
            }`}
          >
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>عن الطريقة والمنهج السلوكي</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* ======================================================== */}
          {/* TAB 1: SHAYKH SIDI MOUNIR OFFICIAL BIOGRAPHY (REQUESTED) */}
          {/* ======================================================== */}
          {activeTab === "shaykh" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Shaykh Luxury Hero Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white via-[#FAF7F2] to-[#F3EDE2] dark:from-[#122820] dark:via-[#0E2019] dark:to-[#081510] border-2 border-[#C5A059]/40 shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-2xl -z-0 pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
                  {/* Portrait Container */}
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-b from-[#1B4332] to-[#143628] p-1 border-2 border-[#C5A059] shadow-xl overflow-hidden flex items-center justify-center">
                      <img
                        src="/images/sidi_mounir_portrait.png"
                        alt="فضيلة الشيخ الدكتور سيدي منير القادري بودشيش"
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[#C5A059] text-[#143628] rounded-full p-1.5 shadow-md border border-white dark:border-[#0E2019]">
                      <Crown className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Honorifics */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#9E7B35] dark:text-[#E5C378] text-[11px] font-semibold mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>الإرشاد والتربية الروحية • السند القادري المتصل</span>
                    </div>

                    <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-tight mb-1">
                      الشيخ الدكتور سيدي منير القادري بودشيش
                    </h3>

                    <p className="font-amiri text-base sm:text-lg text-[#C5A059] font-semibold leading-relaxed">
                      شيخ الطريقة القادرية البودشيشية ومربيها الروحي
                    </p>
                  </div>
                </div>

                {/* Introductory Rationale & Spiritual Succession */}
                <div className="mt-5 pt-5 border-t border-[#C5A059]/20 space-y-3 font-ibm text-xs sm:text-sm text-[#1D2A24]/90 dark:text-[#D5E2DB] leading-relaxed">
                  <p>
                    يُعدّ <strong>الشيخ الدكتور سيدي منير القادري بودشيش</strong> أحد أبرز أعلام الطريقة القادرية البودشيشية في المرحلة الراهنة، حيث <strong className="text-[#1B4332] dark:text-[#E5C378]">آلت إليه مهمة الإرشاد والتربية الروحية بناء على وصيتين مباركتين للشيخين سيدي حمزة بن العباس وسيدي جمال الدين</strong>، رحمهما الله، في سياق استمرارية السند التربوي والروحي للطريقة.
                  </p>
                  <p>
                    وقد اقترن اسمه بحضور علمي متميز جمع بين <strong>التكوين الشرعي والمعرفة العصرية</strong>، إذ راكم سيدي منير مسارا أكاديميا متنوعا يعكس انفتاحا على الحقول الإنسانية والاجتماعية والاقتصادية، بما يعزز مقاربته للتصوف في أبعاده الفكرية والتواصلية المعاصرة.
                  </p>
                </div>
              </div>

              {/* SECTION: ACADEMIC CURRICULUM (المسار الأكاديمي) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#1F3A2E] shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-[#1B4332] dark:text-[#E5C378] border-b border-[#E7DFD5] dark:border-[#1F3A2E] pb-3">
                  <div className="p-2 rounded-lg bg-[#C5A059]/15 text-[#C5A059]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-amiri text-xl font-bold">المسار الأكاديمي والشهادات العليا</h4>
                    <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8] font-sans">
                      تكوين شرعي أصيل وانفتاح أكاديمي عالمي رصين
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5 font-ibm text-xs">
                  {/* Item 1 */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#143628] dark:text-[#FAF7F2] block">الإجازة في الدراسات الإسلامية</span>
                      <span className="text-[#6B7D74] dark:text-[#95B8A8]">كلية الآداب – وجدة، 1994</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#143628] dark:text-[#FAF7F2] block">الإجازة في العلوم الاقتصادية</span>
                      <span className="text-[#6B7D74] dark:text-[#95B8A8]">وجدة، 1995</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#143628] dark:text-[#FAF7F2] block">خريج دار الحديث الحسنية</span>
                      <span className="text-[#6B7D74] dark:text-[#95B8A8]">مؤسسة دار الحديث الحسنية – الرباط، 1996</span>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#143628] dark:text-[#FAF7F2] block">دبلوم في العلوم الاقتصادية وتسيير المقاولات</span>
                      <span className="text-[#6B7D74] dark:text-[#95B8A8]">جامعة كرونوبل (Grenoble) – فرنسا، 1999</span>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#143628] dark:text-[#FAF7F2] block">دبلوم الدراسات العليا المتخصصة في الأنثروبولوجيا السوسيولوجية</span>
                      <span className="text-[#6B7D74] dark:text-[#95B8A8]">حول المجتمعات المغاربية المعاصرة، 1999</span>
                    </div>
                  </div>

                  {/* Item 6 */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#143628] dark:text-[#FAF7F2] block">ماجستير في الذكاء الاقتصادي</span>
                      <span className="text-[#6B7D74] dark:text-[#95B8A8]">Intelligence Économique</span>
                    </div>
                  </div>

                  {/* Item 7 */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#143628] dark:text-[#FAF7F2] block">دكتوراه في العلوم الإنسانية</span>
                      <span className="text-[#6B7D74] dark:text-[#95B8A8]">دار الحديث الحسنية – الرباط</span>
                    </div>
                  </div>

                  {/* Item 8 */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#143628] dark:text-[#FAF7F2] block">دكتوراه في علوم الأديان وأنظمة التفكير</span>
                      <span className="text-[#6B7D74] dark:text-[#95B8A8]">المدرسة التطبيقية للدراسات العليا (السوربون - EPHE)</span>
                    </div>
                  </div>

                  {/* Item 9 - Prestigious Sorbonne Ph.D. */}
                  <div className="p-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/40 sm:col-span-2 flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#143628] dark:text-[#FAF7F2] block">
                        دكتوراه في الدراسات الصوفية – جامعة السوربون (Sorbonne Université)
                      </span>
                      <span className="text-[#1D2A24]/85 dark:text-[#D5E2DB]">
                        عن أطروحة علمية تناولت كتاب <strong>«قوت القلوب»</strong> للإمام أبي طالب المكي، تحت إشراف البروفيسور <em>بيير لوري (Pierre Lory)</em>.
                      </span>
                    </div>
                  </div>

                  {/* Item 10 */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] sm:col-span-2 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#143628] dark:text-[#FAF7F2] block">دبلوم معهد أوروبا – المغارب</span>
                      <span className="text-[#6B7D74] dark:text-[#95B8A8]">باريس، 2001</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: SCIENTIFIC MISSIONS & LEADERSHIP (المهام العلمية والإشعاع الفكري) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#1F3A2E] shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-[#1B4332] dark:text-[#E5C378] border-b border-[#E7DFD5] dark:border-[#1F3A2E] pb-3">
                  <div className="p-2 rounded-lg bg-[#1B4332]/10 dark:bg-[#C5A059]/20 text-[#1B4332] dark:text-[#E5C378]">
                    <Briefcase className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <h4 className="font-amiri text-xl font-bold">المهام العلمية والإشعاع الفكري والمؤسساتي</h4>
                    <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8] font-sans">
                      حضور بارز في مجالات البحث والتأطير والتواصل الحضاري
                    </p>
                  </div>
                </div>

                <p className="font-ibm text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB]">
                  إلى جانب مساره الأكاديمي، اضطلع الشيخ سيدي منير القادري بودشيش بعدد من المسؤوليات العلمية والمؤسساتية التي تعكس حضوره في مجالات البحث والتأطير والتواصل الحضاري، من أبرزها:
                </p>

                <div className="grid sm:grid-cols-2 gap-3 font-ibm text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <Building className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="text-[#1D2A24]/90 dark:text-[#E8F0EC]">
                      <strong>مدير مركز الدراسات الأورو-متوسطية حول الإسلام اليوم (CEMEIA)</strong> – باريس
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <School className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="text-[#1D2A24]/90 dark:text-[#E8F0EC]">
                      <strong>أستاذ المالية الإسلامية</strong> بجامعة دوفين (Paris-Dauphine) – فرنسا
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <Globe2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="text-[#1D2A24]/90 dark:text-[#E8F0EC]">
                      <strong>رئيس الملتقى العالمي للتصوف</strong> – مداغ الشريفة، إقليم بركان
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <UserCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="text-[#1D2A24]/90 dark:text-[#E8F0EC]">
                      <strong>عضو المجلس الأوروبي للعلماء المغاربة</strong> – بروكسيل
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="text-[#1D2A24]/90 dark:text-[#E8F0EC]">
                      <strong>رئيس لجنة الرقابة الشرعية</strong> بالمجلس الأوروبي المستقل للمالية الإسلامية
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="text-[#1D2A24]/90 dark:text-[#E8F0EC]">
                      <strong>رئيس جمعية «ورش»</strong> لتحفيظ القرآن الكريم وتعليم علومه – بركان
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0A1813] border border-[#E7DFD5] dark:border-[#1F3A2E] sm:col-span-2 flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="text-[#1D2A24]/90 dark:text-[#E8F0EC]">
                      <strong>باحث في التصوف والتواصل</strong> بالمدرسة التطبيقية للدراسات العليا – جامعة السوربون (EPHE - Sorbonne)
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION: CONCLUSION & ROYAL MOROCCAN VISION */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#1B4332] via-[#143628] to-[#1B4332] text-[#FAF7F2] border-2 border-[#C5A059]/50 shadow-lg text-center sm:text-right space-y-3">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-[#E5C378]">
                  <Crown className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="font-amiri text-lg sm:text-xl font-bold">
                    أنموذج العالم الصوفي المعاصر وحفظ الثوابت الوطنية
                  </h4>
                </div>
                <p className="font-ibm text-xs sm:text-sm text-[#FAF7F2]/95 leading-relaxed">
                  يمثل الشيخ الدكتور سيدي منير القادري بودشيش نموذجا لعالم صوفي معاصر يجمع بين عمق التكوين الشرعي والانفتاح على العلوم الإنسانية والاجتماعية، بما يؤهله للإسهام في تجديد الخطاب الصوفي وتعزيز حضوره في السياقات العالمية الراهنة، ضمن رؤية تقوم على الحوار والتواصل وبناء المشترك الإنساني، <strong className="text-[#E5C378]">ممثلا لرؤية صاحب الجلالة الملك محمد السادس نصره الله وأيده القائمة على حفظ ثوابت المملكة المغربية الشريفة</strong>.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: TARIQA DEFINITION & ZAWIYA MOHAMMEDIA             */}
          {/* ======================================================== */}
          {activeTab === "tariqa" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Origin of Name */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm">
                <div className="flex items-center gap-2.5 mb-2 text-[#1B4332] dark:text-[#E5C378]">
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-amiri text-lg sm:text-xl font-bold">أصل التسمية والسند القادري</h3>
                </div>
                <p className="font-ibm text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
                  تنتسب الطريقة القادرية البودشيشية إلى الإمام العارف بالله وسلطان الأولياء <strong>سيدي عبد القادر الجيلاني</strong> رضي الله عنه (المتوفى سنة 561هـ). وعُرفت بـ <strong>"البودشيشية"</strong> نسبة إلى الولي الصالح <strong>سيدي علي بن محمد</strong> دفين بني سنوس (نواحي وجدة والجهة الشرقية)، الذي لُقّب بـ <em>"سيدي علي بودشيش"</em> لكونه كان يُطعم الناس في عام مسغبة ومجاعة طعاماً يُعرف بالمغرب بـ <strong>"الدشيشة"</strong> (حساء الشعير)، فاقترن اسم الطريقة بالكرم والجود وإطعام الطعام وخدمة الخلق.
                </p>
              </div>

              {/* Pillars of the Method */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm">
                <div className="flex items-center gap-2.5 mb-3 text-[#1B4332] dark:text-[#E5C378]">
                  <HeartHandshake className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-amiri text-lg sm:text-xl font-bold">معالم المنهج التربوي</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 font-ibm text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB]">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#081410] border border-[#E7DFD5] dark:border-[#1F3A2E]">
                    <strong className="text-[#1B4332] dark:text-[#E5C378] block mb-1 text-sm font-amiri">المحبة والذكر الكثير:</strong>
                    التربية بالحب في الله، وملازمة ذكر الله تعالى باللسان والقلب لغسل القلوب من الصدأ ورؤية النفس.
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#081410] border border-[#E7DFD5] dark:border-[#1F3A2E]">
                    <strong className="text-[#1B4332] dark:text-[#E5C378] block mb-1 text-sm font-amiri">الجمع بين الشريعة والحقيقة:</strong>
                    التصوف السني الجنيدي المنضبط بالكتاب والسنة والعمل بأحكام المذهب المالكي بلا غلو ولا ابتداع.
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#081410] border border-[#E7DFD5] dark:border-[#1F3A2E]">
                    <strong className="text-[#1B4332] dark:text-[#E5C378] block mb-1 text-sm font-amiri">خدمة الخلق وجبر الخواطر:</strong>
                    حسن الخلق، التواضع للفقراء وعامة المسلمين، واعتبار خدمة عباد الله مقصداً كبيراً من مقاصد السير.
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#081410] border border-[#E7DFD5] dark:border-[#1F3A2E]">
                    <strong className="text-[#1B4332] dark:text-[#E5C378] block mb-1 text-sm font-amiri">الثوابت الوطنية الجامعة:</strong>
                    الوفاء لثوابت المملكة المغربية الشريفة (العقيدة الأشعرية، المذهب المالكي، التصوف السني، وإمارة المؤمنين).
                  </div>
                </div>
              </div>

              {/* International Sufi Forum */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1B4332]/10 to-[#C5A059]/10 border border-[#C5A059]/40">
                <div className="flex items-center gap-2 mb-2 text-[#1B4332] dark:text-[#E5C378]">
                  <Globe2 className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="font-amiri text-lg font-bold">الملتقى العالمي للتصوف بمداغ الشريفة</h4>
                </div>
                <p className="font-ibm text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
                  تنظم الزاوية الأم بمداغ سنوياً بمناسبة ذكرى المولد النبوي الشريف <strong>«الملتقى العالمي للتصوف»</strong>، الذي يجمع نخبة من كبار العلماء والمفكرين والأكاديميين من شتى قارات العالم لمدارسة إسهامات التصوف في بناء السلام، ترسيخ القيم الأخلاقية، ومكافحة التطرف.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3.5 bg-[#F4EFE6] dark:bg-[#081410] border-t border-[#E7DFD5] dark:border-[#1F3A2E] flex items-center justify-between shrink-0">
          <span className="text-xs text-[#829288] dark:text-[#7A8C82] font-ibm">
            زاوية مدينة المحمدية • الطريقة القادرية البودشيشية
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1B4332] text-[#FAF7F2] hover:bg-[#143628] text-xs font-semibold transition-all hover:shadow-md cursor-pointer border border-[#C5A059]/30"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
}
