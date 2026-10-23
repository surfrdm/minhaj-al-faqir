"use client";

import React, { useState } from "react";
import {
  X,
  User,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Coins
} from "lucide-react";

interface MemberPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MemberPortalModal({ isOpen, onClose }: MemberPortalModalProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"malzouma" | "wird" | "privileges">("malzouma");

  // Member Demo Data
  const member = {
    name: "سيدي عبد الرحمان البودشيشي",
    zawiya: "زاوية مداغ الشريفة (بركان)",
    role: "فقير سالك • السلك التأصيلي",
    idNumber: "BDT-1447-0348",
    monthlyAmount: 200, // DH
    monthlyPaidMonths: 9, // Out of 12
    annualTarget: 3000, // DH
    annualPaid: 2100, // DH
  };

  const annualRemaining = member.annualTarget - member.annualPaid;
  const annualPercentage = Math.round((member.annualPaid / member.annualTarget) * 100);

  const months = [
    { name: "يناير", paid: true },
    { name: "فبراير", paid: true },
    { name: "مارس", paid: true },
    { name: "أبريل", paid: true },
    { name: "ماي", paid: true },
    { name: "يونيو", paid: true },
    { name: "يوليوز", paid: true },
    { name: "غشت", paid: true },
    { name: "شتنبر", paid: true },
    { name: "أكتوبر", paid: false },
    { name: "نونبر", paid: false },
    { name: "دجنبر", paid: false },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] dark:bg-[#0E2019] rounded-2xl border border-[#C5A059]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1B4332] via-[#143628] to-[#1B4332] text-[#FAF7F2] flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-amiri text-xl font-bold tracking-wide">
                فضاء الفقير • دفتر الملزومات والمساهمات
              </h2>
              <p className="text-xs text-[#E5C378] font-sans">
                الأكاديمية العلمية والتأصيلية للطريقة القادرية البودشيشية
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Member Identity Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#1B4332] text-[#C5A059] flex items-center justify-center font-amiri text-xl font-bold border border-[#C5A059]/40 shadow-inner">
                ع
              </div>
              <div>
                <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                  {member.name}
                </h3>
                <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                  {member.zawiya} • <span className="text-[#C5A059] font-medium">{member.role}</span>
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right bg-[#FAF7F2] dark:bg-[#0B1914] px-3.5 py-1.5 rounded-lg border border-[#C5A059]/30">
              <span className="text-[11px] text-[#84928A] block">معرف الفقير</span>
              <span className="font-mono text-xs font-semibold text-[#1B4332] dark:text-[#E5C378]">
                {member.idNumber}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-[#E7DFD5] dark:border-[#203D31] pb-2">
            <button
              onClick={() => setSelectedTab("malzouma")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedTab === "malzouma"
                  ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                  : "text-[#52796F] dark:text-[#95B8A8] hover:bg-[#C5A059]/10"
              }`}
            >
              <Coins className="w-4 h-4 text-[#C5A059]" />
              <span>الملزومات والمساهمات</span>
            </button>
            <button
              onClick={() => setSelectedTab("wird")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedTab === "wird"
                  ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                  : "text-[#52796F] dark:text-[#95B8A8] hover:bg-[#C5A059]/10"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>متابعة الورد والسبحة</span>
            </button>
            <button
              onClick={() => setSelectedTab("privileges")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedTab === "privileges"
                  ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                  : "text-[#52796F] dark:text-[#95B8A8] hover:bg-[#C5A059]/10"
              }`}
            >
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>امتيازات المنتسب</span>
            </button>
          </div>

          {/* TAB 1: MALZOUMA & CONTRIBUTIONS */}
          {selectedTab === "malzouma" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Annual Contribution Progress */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-white via-white to-[#F6F1E8] dark:from-[#122820] dark:via-[#122820] dark:to-[#0D1D17] border border-[#C5A059]/40 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#C5A059]" />
                    <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                      المساهمة السنوية (الملزومة السنوية العامة)
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#9E7B35] dark:text-[#E5C378] text-xs font-bold">
                    {annualPercentage}% مستوفى
                  </span>
                </div>

                <p className="text-xs text-[#52796F] dark:text-[#95B8A8] mb-4">
                  مساهمتك المخصصة لدعم أنشطة الزاوية، ملتقى المولد النبوي الشريف، وإطعام الفقراء وعمارة الدور.
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-[#E5DFD5] dark:bg-[#1A382D] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#C5A059]/30 mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#C5A059] to-[#1B4332] rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${annualPercentage}%` }}
                  />
                </div>

                {/* Financial Breakdown */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31]">
                    <span className="text-[11px] text-[#718279] dark:text-[#92A69C] block">الهدف السنوي</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-[#143628] dark:text-[#E8F0EC]">
                      {member.annualTarget} <span className="text-xs font-normal">درهم</span>
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31]">
                    <span className="text-[11px] text-[#1B4332] dark:text-[#E5C378] block font-semibold">المؤدى حتى الآن</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-[#1B4332] dark:text-[#E5C378]">
                      {member.annualPaid} <span className="text-xs font-normal">درهم</span>
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31]">
                    <span className="text-[11px] text-[#B84232] dark:text-[#E07A5F] block font-semibold">المتبقي لآخر السنة</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-[#B84232] dark:text-[#E07A5F]">
                      {annualRemaining} <span className="text-xs font-normal">درهم</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Monthly Malzouma (Monthly Tracking) */}
              <div className="p-5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#C5A059]" />
                    <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                      الملزومة الشهرية ({member.monthlyAmount} درهم / شهر)
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-[#1B4332] dark:text-[#E5C378]">
                    {member.monthlyPaidMonths} من 12 شهراً مستوفاة
                  </span>
                </div>

                <p className="text-xs text-[#52796F] dark:text-[#95B8A8] mb-4">
                  ملزومة الصندوق الشهري للزاوية المحلية للمساهمة في المصاريف الجارية ونفقة الاجتماعات الأسبوعية.
                </p>

                {/* 12 Months Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                  {months.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        m.paid
                          ? "bg-[#1B4332]/10 border-[#1B4332]/40 text-[#1B4332] dark:text-[#A7D7C5] dark:bg-[#1B4332]/25"
                          : "bg-[#FAF7F2] dark:bg-[#0B1914] border-[#E7DFD5] dark:border-[#203D31] text-[#9AA5A0]"
                      }`}
                    >
                      <span className="text-xs font-semibold block">{m.name}</span>
                      <div className="mt-1 flex items-center justify-center">
                        {m.paid ? (
                          <CheckCircle2 className="w-4 h-4 text-[#1B4332] dark:text-[#E5C378]" />
                        ) : (
                          <span className="text-[10px] text-[#A0A0A0]">في الانتظار</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Action Button */}
                <div className="pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#95B8A8]">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>جميع البيانات والمساهمات موثقة ومحفوظة بسرية وأمانة تامة.</span>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] text-xs font-semibold flex items-center gap-2 shadow-sm transition-all">
                    <CreditCard className="w-4 h-4 text-[#C5A059]" />
                    <span>تسجيل أداء جديد (دفعة)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WIRD TRACKING */}
          {selectedTab === "wird" && (
            <div className="p-5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-4">
              <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                دفتر الورد اليومي والوظيفة
              </h4>
              <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                متابعة يومية لأداء الورد العام (صباحاً ومساءً)، صلاة الفاتح، والصلاة المشيشية الشريفة.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#C5A059]/30">
                  <span className="text-xs font-bold text-[#1B4332] dark:text-[#E5C378] block mb-1">
                    الورد الصباحي
                  </span>
                  <span className="text-xs text-[#52796F] dark:text-[#95B8A8] block mb-2">
                    100 استغفار • 100 صلاة على النبي • 100 لا إله إلا الله
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> تم الأداء
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#C5A059]/30">
                  <span className="text-xs font-bold text-[#1B4332] dark:text-[#E5C378] block mb-1">
                    الورد المسائي
                  </span>
                  <span className="text-xs text-[#52796F] dark:text-[#95B8A8] block mb-2">
                    100 استغفار • 100 صلاة على النبي • 100 لا إله إلا الله
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300 text-[11px] font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> في انتظار وقت المساء
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVILEGES */}
          {selectedTab === "privileges" && (
            <div className="p-5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-3">
              <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                امتيازات الفقير المنتسب للأكاديمية
              </h4>
              <ul className="text-xs space-y-2 text-[#52796F] dark:text-[#95B8A8]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>الاطلاع على كامل بطاقات الحكم العطائية (264) مع الشروح الصوتية للمشايخ.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>تحميل كبسولات التصاميم بدقة الطباعة الفائقة (Vector & Print Ready 300 DPI).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>حجز مقاعد الحضور في الندوات العلمية وملتقيات الطريقة بمداغ.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#F4EFE6] dark:bg-[#081410] border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between">
          <span className="text-xs text-[#829288] dark:text-[#7A8C82]">
            منهاج الفقير • خدمة أهل السلوك
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#E7DFD5] dark:bg-[#1A382D] text-[#143628] dark:text-[#E8F0EC] hover:bg-[#D5CBBE] text-xs font-semibold transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
}
