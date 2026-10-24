"use client";

import React, { useState, useEffect } from "react";
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
  LogOut,
  ShieldCheck,
  Coins,
  UserPlus,
  KeyRound,
  Save,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Lock,
} from "lucide-react";

interface MemberPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MemberRecord {
  id: string;
  name: string;
  city: string;
  monthly: number;
  paidMonths: number;
  annualTarget: number;
  annualPaid: number;
  annualRemaining: number;
  annualPercentage: number;
  status: string;
}

const DEFAULT_MEMBERS: MemberRecord[] = [
  {
    id: "402b3765-5def-81f7-ac24-d30a2479e3b6",
    name: "سيدي عبد الرحمان البودشيشي",
    city: "مداغ (المقر العام)",
    monthly: 500,
    paidMonths: 10,
    annualTarget: 5000,
    annualPaid: 4000,
    annualRemaining: 1000,
    annualPercentage: 80,
    status: "🟢 ممتثل ومستوفي",
  },
  {
    id: "402b3765-5def-814c-a433-e2d5c8207051",
    name: "سيدي محمد الإدريسي",
    city: "الرباط",
    monthly: 200,
    paidMonths: 9,
    annualTarget: 3000,
    annualPaid: 2200,
    annualRemaining: 800,
    annualPercentage: 73,
    status: "🟢 ممتثل ومستوفي",
  },
  {
    id: "402b3765-5def-81ba-b011-f8120a83e495",
    name: "سيدي يوسف الفاسي",
    city: "فاس",
    monthly: 100,
    paidMonths: 7,
    annualTarget: 2000,
    annualPaid: 1000,
    annualRemaining: 1000,
    annualPercentage: 50,
    status: "🟡 في طور الاستيفاء",
  },
];

const MONTHS_NAMES = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "ماي",
  "يونيو",
  "يوليوز",
  "غشت",
  "شتنبر",
  "أكتوبر",
  "نونبر",
  "دجنبر",
];

export function MemberPortalModal({ isOpen, onClose }: MemberPortalModalProps) {
  // Views: 'dashboard' | 'login' | 'register' | 'admin'
  const [view, setView] = useState<"dashboard" | "login" | "register" | "admin">("dashboard");
  const [selectedTab, setSelectedTab] = useState<"malzouma" | "wird" | "privileges">("malzouma");

  const [members, setMembers] = useState<MemberRecord[]>(DEFAULT_MEMBERS);
  const [currentMember, setCurrentMember] = useState<MemberRecord>(DEFAULT_MEMBERS[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCity, setRegCity] = useState("المحمدية");
  const [regMonthly, setRegMonthly] = useState("200");
  const [regAnnual, setRegAnnual] = useState("3000");

  // Admin Edit Form State
  const [adminSelectedId, setAdminSelectedId] = useState(DEFAULT_MEMBERS[0].id);
  const [adminPaidMonths, setAdminPaidMonths] = useState(DEFAULT_MEMBERS[0].paidMonths);
  const [adminAnnualPaid, setAdminAnnualPaid] = useState(DEFAULT_MEMBERS[0].annualPaid);
  const [adminPin, setAdminPin] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Fetch members on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMembers();
    }
  }, [isOpen]);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/members");
      if (res.ok) {
        const data = await res.json();
        if (data.members && data.members.length > 0) {
          setMembers(data.members);
          // Keep current selection or default to first
          const found = data.members.find((m: MemberRecord) => m.id === currentMember.id);
          if (found) {
            setCurrentMember(found);
          } else {
            setCurrentMember(data.members[0]);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load members", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    setIsLoading(true);
    try {
      const payload = {
        name: regName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        city: regCity,
        monthly: Number(regMonthly) || 100,
        annualTarget: Number(regAnnual) || 2000,
      };

      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        const newRecord: MemberRecord = {
          id: result.id || `local-${Date.now()}`,
          name: payload.name,
          city: payload.city,
          monthly: payload.monthly,
          paidMonths: 0,
          annualTarget: payload.annualTarget,
          annualPaid: 0,
          annualRemaining: payload.annualTarget,
          annualPercentage: 0,
          status: "🟡 في طور الاستيفاء",
        };
        setMembers((prev) => [newRecord, ...prev]);
        setCurrentMember(newRecord);
        setView("dashboard");
      } else {
        alert("حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة ثانية.");
      }
    } catch (err) {
      console.error(err);
      alert("تعذر الاتصال بقاعدة البيانات.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveSuccessMsg("");

    try {
      const res = await fetch("/api/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: adminSelectedId,
          paidMonths: Number(adminPaidMonths),
          annualPaid: Number(adminAnnualPaid),
        }),
      });

      if (res.ok) {
        setSaveSuccessMsg("✅ تم تحديث بيانات المساهمات في Notion وقاعدة البيانات بنجاح!");
        await loadMembers();
        setTimeout(() => setSaveSuccessMsg(""), 4000);
      } else {
        alert("تعذر تحديث البيانات في Notion.");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحفظ.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAdminMember = (id: string) => {
    setAdminSelectedId(id);
    const m = members.find((item) => item.id === id);
    if (m) {
      setAdminPaidMonths(m.paidMonths);
      setAdminAnnualPaid(m.annualPaid);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] dark:bg-[#0E2019] rounded-2xl border border-[#C5A059]/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
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
                فضاء الفقير • دفتر المساهمات والملزومات
              </h2>
              <p className="text-xs text-[#E5C378] font-sans">
                زاوية مدينة المحمدية • الأكاديمية التكوينية
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

        {/* Modal Navigation Bar */}
        <div className="px-6 py-2.5 bg-[#F4EFE6] dark:bg-[#081410] border-b border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("dashboard")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                view === "dashboard"
                  ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                  : "text-[#596B62] dark:text-[#9BB0A5] hover:bg-white/60 dark:hover:bg-[#122820]"
              }`}
            >
              لوحة الفقير
            </button>
            <button
              onClick={() => setView("register")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                view === "register"
                  ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                  : "text-[#596B62] dark:text-[#9BB0A5] hover:bg-white/60 dark:hover:bg-[#122820]"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>إنشاء حساب جديد</span>
            </button>
            <button
              onClick={() => setView("login")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                view === "login"
                  ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                  : "text-[#596B62] dark:text-[#9BB0A5] hover:bg-white/60 dark:hover:bg-[#122820]"
              }`}
            >
              تبديل الفقير
            </button>
          </div>

          <button
            onClick={() => setView("admin")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
              view === "admin"
                ? "bg-[#C5A059] text-[#143628]"
                : "text-[#C5A059] border border-[#C5A059]/40 hover:bg-[#C5A059]/10"
            }`}
          >
            <KeyRound className="w-3 h-3" />
            <span>لوحة أمين الصندوق</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* VIEW 1: FAQR DASHBOARD */}
          {view === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Member Identity Card */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#1B4332] text-[#C5A059] flex items-center justify-center font-amiri text-xl font-bold border border-[#C5A059]/40 shadow-inner">
                    {currentMember.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                      {currentMember.name}
                    </h3>
                    <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                      الزاوية: <strong className="text-[#143628] dark:text-[#FAF7F2]">{currentMember.city}</strong> •{" "}
                      <span className="text-[#C5A059] font-medium">{currentMember.status}</span>
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right bg-[#FAF7F2] dark:bg-[#0B1914] px-3.5 py-1.5 rounded-lg border border-[#C5A059]/30">
                  <span className="text-xs text-[#52796F] dark:text-[#A1B3A9] block">معرف الفقير الرسمي</span>
                  <span className="font-mono text-xs font-semibold text-[#1B4332] dark:text-[#E5C378]">
                    BDT-2026-{currentMember.id.slice(0, 4)}
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
                      : "text-[#596B62] dark:text-[#9BB0A5] hover:bg-[#E7DFD5]/50"
                  }`}
                >
                  <Coins className="w-4 h-4 text-[#C5A059]" />
                  <span>المساهمات والملزومات</span>
                </button>
                <button
                  onClick={() => setSelectedTab("wird")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    selectedTab === "wird"
                      ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                      : "text-[#596B62] dark:text-[#9BB0A5] hover:bg-[#E7DFD5]/50"
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>دفتر الأوراد اليومية</span>
                </button>
                <button
                  onClick={() => setSelectedTab("privileges")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    selectedTab === "privileges"
                      ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                      : "text-[#596B62] dark:text-[#9BB0A5] hover:bg-[#E7DFD5]/50"
                  }`}
                >
                  <Award className="w-4 h-4 text-[#C5A059]" />
                  <span>امتيازات المنتسب</span>
                </button>
              </div>

              {/* TAB 1: MALZOUMA DASHBOARD (READ-ONLY) */}
              {selectedTab === "malzouma" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Annual Goal */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm">
                      <span className="text-xs text-[#829288] dark:text-[#8E9F96] block mb-1">
                        المساهمة السنوية المستهدفة
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                          {currentMember.annualTarget}
                        </span>
                        <span className="text-xs text-[#C5A059]">درهم</span>
                      </div>
                      <span className="text-xs text-[#52796F] dark:text-[#95B8A8] mt-1 block">
                        مساهمة ختام السنة
                      </span>
                    </div>

                    {/* Annual Paid */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#122820] border border-green-500/30 shadow-sm bg-green-50/20 dark:bg-green-950/20">
                      <span className="text-xs text-green-800 dark:text-green-300 block mb-1">
                        المبلغ المؤدى فعلياً
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-amiri text-2xl font-bold text-green-700 dark:text-green-400">
                          {currentMember.annualPaid}
                        </span>
                        <span className="text-xs text-green-600">درهم</span>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 mt-1 block">
                        نسبة الإنجاز: {currentMember.annualPercentage}%
                      </span>
                    </div>

                    {/* Remaining */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#122820] border border-amber-500/30 shadow-sm bg-amber-50/20 dark:bg-amber-950/20">
                      <span className="text-xs text-amber-800 dark:text-amber-300 block mb-1">
                        المبلغ المتبقي لختام السنة
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-amiri text-2xl font-bold text-amber-700 dark:text-amber-400">
                          {currentMember.annualRemaining}
                        </span>
                        <span className="text-xs text-amber-600">درهم</span>
                      </div>
                      <span className="text-xs text-amber-600 dark:text-amber-400 mt-1 block">
                        واجب الاستيفاء
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#143628] dark:text-[#E8F0EC]">
                        التقدم في أداء المساهمة السنوية
                      </span>
                      <span className="text-[#C5A059] font-bold">
                        {currentMember.annualPercentage}% مكتمل
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#E7DFD5] dark:bg-[#1A382D] rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-l from-[#C5A059] to-[#1B4332] rounded-full transition-all duration-500"
                        style={{ width: `${currentMember.annualPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Monthly Dues Grid (12 Months) */}
                  <div className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#C5A059]" />
                        <h4 className="font-amiri text-base font-bold text-[#143628] dark:text-[#E8F0EC]">
                          الملزومة الشهرية: {currentMember.monthly} درهم / شهر
                        </h4>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/20 text-[#1B4332] dark:text-[#E5C378] font-semibold">
                        تم أداء {currentMember.paidMonths} من 12 شهراً
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                      {MONTHS_NAMES.map((mName, i) => {
                        const isPaid = i < currentMember.paidMonths;
                        return (
                          <div
                            key={mName}
                            className={`p-2.5 rounded-lg border text-center transition-all ${
                              isPaid
                                ? "bg-green-50/70 dark:bg-green-950/40 border-green-500/40 text-green-800 dark:text-green-300"
                                : "bg-[#FAF7F2] dark:bg-[#081410] border-[#E7DFD5] dark:border-[#203D31] text-[#8E9F96]"
                            }`}
                          >
                            <span className="text-xs font-semibold block mb-1">{mName}</span>
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400 font-bold">
                                <CheckCircle2 className="w-3 h-3" /> تم الأداء
                              </span>
                            ) : (
                              <span className="text-xs text-[#A0AFA6] block">
                                متبقي
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Read-Only Notice */}
                  <div className="p-3.5 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center gap-3 text-xs text-[#826122] dark:text-[#E5C378]">
                    <Lock className="w-4 h-4 shrink-0 text-[#C5A059]" />
                    <span>
                      دفتر المساهمات والملزومات مسجل وموثق مركزياً لدى أمين صندوق الزاوية، ويتم تحديثه تلقائياً عند تسليم الدفوعات.
                    </span>
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
                    متابعة يومية للبرنامج الروحي: حزبا القرآن، حزب دلائل الخيرات، الورد العام، 15,000 هيللة، والوظيفة بالزاوية.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* 1. ذِكْرُ الوِرْدِ العَامِّ */}
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#C5A059]/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1B4332] dark:text-[#E5C378]">
                          ذِكْرُ الوِرْدِ العَامِّ
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059] font-bold">
                          صباحاً ومساءً
                        </span>
                      </div>
                      <span className="text-xs text-[#52796F] dark:text-[#95B8A8] block">
                        الاستغفار • الصلاة على النبي ﷺ • كلمة التوحيد
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> تم الأداء بحمد الله
                      </span>
                    </div>

                    {/* 2. حزبان من القرآن الكريم */}
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#C5A059]/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1B4332] dark:text-[#E5C378]">
                          حِزبان من القرآن الكريم
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#1B4332]/15 text-[#1B4332] dark:text-[#E5C378] font-bold">
                          ختمة شهرية
                        </span>
                      </div>
                      <span className="text-xs text-[#52796F] dark:text-[#95B8A8] block">
                        حزب بعد الصبح • حزب بعد العصر أو المغرب
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> تم أداء حزب الصباح
                      </span>
                    </div>

                    {/* 3. حزب دلائل الخيرات */}
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#C5A059]/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1B4332] dark:text-[#E5C378]">
                          حزب دلائل الخيرات
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059] font-bold">
                          للإمام الجزولي
                        </span>
                      </div>
                      <span className="text-xs text-[#52796F] dark:text-[#95B8A8] block">
                        تلاوة الحزب اليومي الراتب في الصلاة على النبي ﷺ
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> تلاوة الحزب اليومي
                      </span>
                    </div>

                    {/* 4. 15 000 لا إله إلا الله */}
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#C5A059]/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1B4332] dark:text-[#E5C378]">
                          15 000 لا إله إلا الله
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#1B4332]/15 text-[#1B4332] dark:text-[#E5C378] font-bold">
                          عمارة الأوقات
                        </span>
                      </div>
                      <span className="text-xs text-[#52796F] dark:text-[#95B8A8] block">
                        عمارة اليوم بكلمة الإخلاص والتوحيد
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300 text-xs font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> قيد الذكر والمتابعة
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
                      <span>الاطلاع والتأمل في كامل لوحات الأربعين النووية (42) والشروح المصاحبة.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                      <span>الاطلاع على كامل بطاقات الحكم العطائية (264) مع الشروح والتصنيفات.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                      <span>التسجيل التلقائي في الملتقيات والمحاضرات التربوية المقامة بزاوية المحمدية ومداغ.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: REGISTER NEW ACCOUNT */}
          {view === "register" && (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#E7DFD5] dark:border-[#203D31]">
                  <UserPlus className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                    إنشاء حساب فقير جديد والانتساب للمنظومة
                  </h3>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#143628] dark:text-[#E8F0EC] mb-1">
                    الاسم الكامل (الاسم والنسب) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سيدي أحمد البودشيشي"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#0B1914] text-[#143628] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* City & Phone */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#143628] dark:text-[#E8F0EC] mb-1">
                      المدينة / الزاوية التابع لها *
                    </label>
                    <select
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#0B1914] text-[#143628] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="المحمدية">المحمدية (زاوية المحمدية)</option>
                      <option value="مداغ (المقر العام)">مداغ (المقر العام)</option>
                      <option value="الرباط">الرباط</option>
                      <option value="الدار البيضاء">الدار البيضاء</option>
                      <option value="فاس">فاس</option>
                      <option value="وجدة">وجدة</option>
                      <option value="طنجة">طنجة</option>
                      <option value="مراكش">مراكش</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#143628] dark:text-[#E8F0EC] mb-1">
                      رقم الهاتف / واتساب
                    </label>
                    <input
                      type="tel"
                      placeholder="06XXXXXXXX"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#0B1914] text-[#143628] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#143628] dark:text-[#E8F0EC] mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#0B1914] text-[#143628] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Monthly & Annual Pledges */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#143628] dark:text-[#E8F0EC] mb-1">
                      الملزومة الشهرية المتعهد بها (درهم)
                    </label>
                    <select
                      value={regMonthly}
                      onChange={(e) => setRegMonthly(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#0B1914] text-[#143628] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="50">50 درهم / شهر (ثمن رمزي)</option>
                      <option value="100">100 درهم / شهر</option>
                      <option value="200">200 درهم / شهر</option>
                      <option value="300">300 درهم / شهر</option>
                      <option value="500">500 درهم / شهر</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#143628] dark:text-[#E8F0EC] mb-1">
                      المساهمة السنوية المستهدفة (درهم)
                    </label>
                    <select
                      value={regAnnual}
                      onChange={(e) => setRegAnnual(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#0B1914] text-[#143628] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="1000">1000 درهم / سنة</option>
                      <option value="2000">2000 درهم / سنة</option>
                      <option value="3000">3000 درهم / سنة</option>
                      <option value="5000">5000 درهم / سنة</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all mt-3"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  )}
                  <span>تأكيد إنشاء الحساب والحفظ في المنظومة</span>
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: SWITCH / LOGIN MEMBER */}
          {view === "login" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                  اختر حساب الفقير لتصفح فضاءه
                </h3>
                <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                  قائمة الفقراء المسجلين في قاعدة بيانات زاوية المحمدية ومداغ:
                </p>

                <div className="space-y-2 pt-2">
                  {members.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setCurrentMember(m);
                        setView("dashboard");
                      }}
                      className={`w-full p-3 rounded-lg border text-right flex items-center justify-between transition-all ${
                        currentMember.id === m.id
                          ? "bg-[#1B4332] text-white border-[#C5A059]"
                          : "bg-[#FAF7F2] dark:bg-[#0B1914] border-[#E7DFD5] dark:border-[#203D31] text-[#143628] dark:text-[#FAF7F2] hover:border-[#C5A059]"
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs block">{m.name}</span>
                        <span className="text-xs opacity-80 block">
                          {m.city} • الملزومة الشهرية: {m.monthly} درهم • السنوية: {m.annualTarget} درهم
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: TREASURER / ADMIN MANAGEMENT MODE */}
          {view === "admin" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {!adminUnlocked ? (
                <div className="p-6 rounded-xl bg-white dark:bg-[#122820] border border-[#C5A059]/40 text-center space-y-3 shadow-sm">
                  <KeyRound className="w-8 h-8 text-[#C5A059] mx-auto" />
                  <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                    فضاء أمين صندوق الزاوية (إدارة المساهمات)
                  </h3>
                  <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                    هذا الفضاء مخصص لمسؤول الصندوق لتسجيل المبالغ المؤداة، وتحديث عدد الأشهر، والمزامنة مع قاعدة بيانات Notion.
                  </p>
                  <div className="max-w-xs mx-auto space-y-2">
                    <input
                      type="password"
                      placeholder="رمز المرور (أدخل: 1447 أو 2026)"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      className="w-full px-3 py-2 text-center text-xs rounded-lg border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#0B1914] text-[#143628] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      onClick={() => {
                        if (adminPin === "1447" || adminPin === "2026" || adminPin === "admin") {
                          setAdminUnlocked(true);
                        } else {
                          alert("الرمز غير صحيح، يرجى إدخال 1447 أو 2026");
                        }
                      }}
                      className="w-full py-2 rounded-lg bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143628] transition-colors"
                    >
                      فتح لوحة الإدارة
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAdminSave} className="space-y-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#C5A059]/40 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E7DFD5] dark:border-[#203D31]">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-[#C5A059]" />
                        <h3 className="font-amiri text-base font-bold text-[#143628] dark:text-[#E8F0EC]">
                          تسجيل وتعديل مساهمات الفقراء (مزامنة مباشرة مع Notion)
                        </h3>
                      </div>
                      <a
                        href="https://app.notion.com/p/Architecture-402b37655def80cabacac119a241b556"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#C5A059] flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>فتح قاعدة Notion الأصلية</span>
                      </a>
                    </div>

                    {saveSuccessMsg && (
                      <div className="p-3 rounded-lg bg-green-100 text-green-900 text-xs font-semibold border border-green-300">
                        {saveSuccessMsg}
                      </div>
                    )}

                    {/* Member Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-[#143628] dark:text-[#E8F0EC] mb-1">
                        اختر الفقير المراد تسجيل دفوعاته:
                      </label>
                      <select
                        value={adminSelectedId}
                        onChange={(e) => handleSelectAdminMember(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#0B1914] text-[#143628] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                      >
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} — {m.city} (مؤدى: {m.paidMonths} من 12 شهراً | {m.annualPaid} درهم)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Paid Months Count (0-12) */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#143628] dark:text-[#E8F0EC] mb-1">
                          عدد الشهور المؤداة (من 12 شهراً):
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="12"
                          value={adminPaidMonths}
                          onChange={(e) => setAdminPaidMonths(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#0B1914] text-[#143628] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      {/* Annual Amount Paid */}
                      <div>
                        <label className="block text-xs font-semibold text-[#143628] dark:text-[#E8F0EC] mb-1">
                          المبلغ المؤدى سنوياً (درهم):
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={adminAnnualPaid}
                          onChange={(e) => setAdminAnnualPaid(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7DFD5] dark:border-[#203D31] bg-[#FAF7F2] dark:bg-[#0B1914] text-[#143628] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                      ) : (
                        <Save className="w-4 h-4 text-[#C5A059]" />
                      )}
                      <span>حفظ التعديلات وتحديث سجل Notion</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#F4EFE6] dark:bg-[#081410] border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between">
          <span className="text-xs text-[#829288] dark:text-[#7A8C82]">
            منهاج الفقير • زاوية مدينة المحمدية الشريفة
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
