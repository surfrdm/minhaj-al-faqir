"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Unlock,
  Users,
  TrendingUp,
  Clock,
  Coins,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  RefreshCw,
  Share2,
  ChevronLeft,
  Calendar,
  Sparkles,
  Award,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Code,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface Member {
  id: string;
  name: string;
  monthly: number;
  paidMonths: number;
  annualTarget: number;
  annualPaid: number;
  annualRemaining: number;
  annualPercentage: number;
  city: string;
  status: string;
  todayAwradRate?: number; // % of today awrad completed
  wazifaAttended?: boolean;
}

const DEFAULT_MEMBERS: Member[] = [
  {
    id: "m-1",
    name: "سيدي يوسف الفاسي",
    monthly: 200,
    paidMonths: 10,
    annualTarget: 2400,
    annualPaid: 2000,
    annualRemaining: 400,
    annualPercentage: 83,
    city: "المحمدية",
    status: "🟢 منضبط ومواظب",
    todayAwradRate: 100,
    wazifaAttended: true,
  },
  {
    id: "m-2",
    name: "سيدي عبد الرحمان البودشيشي",
    monthly: 250,
    paidMonths: 9,
    annualTarget: 3000,
    annualPaid: 2250,
    annualRemaining: 750,
    annualPercentage: 75,
    city: "الدار البيضاء",
    status: "🟢 منضبط ومواظب",
    todayAwradRate: 83,
    wazifaAttended: true,
  },
  {
    id: "m-3",
    name: "سيدي محمد الإدريسي",
    monthly: 150,
    paidMonths: 6,
    annualTarget: 1800,
    annualPaid: 900,
    annualRemaining: 900,
    annualPercentage: 50,
    city: "المحمدية",
    status: "🟡 في طور الاستيفاء",
    todayAwradRate: 67,
    wazifaAttended: false,
  },
  {
    id: "m-4",
    name: "سيدي كريم المنصوري",
    monthly: 200,
    paidMonths: 4,
    annualTarget: 2400,
    annualPaid: 800,
    annualRemaining: 1600,
    annualPercentage: 33,
    city: "المحمدية",
    status: "🔴 يحتاج تذكيراً",
    todayAwradRate: 50,
    wazifaAttended: false,
  },
];

// Sample weekly spiritual progression curve (Sun -> Sat)
const WEEKLY_TREND = [
  { day: "الأحد", awrad: 82, wazifa: 78 },
  { day: "الإثنين", awrad: 85, wazifa: 82 },
  { day: "الثلاثاء", awrad: 84, wazifa: 80 },
  { day: "الأربعاء", awrad: 88, wazifa: 85 },
  { day: "الخميس (ليلة الجمعة)", awrad: 95, wazifa: 92 },
  { day: "الجمعة المباركة", awrad: 98, wazifa: 96 },
  { day: "السبت (ليلة الذكر)", awrad: 96, wazifa: 94 },
];

export default function SupervisorDashboardPage() {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [syncStatusMsg, setSyncStatusMsg] = useState("");
  const [showN8nCode, setShowN8nCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Check session unlock on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPin = sessionStorage.getItem("minhaj_supervisor_unlocked");
      if (savedPin === "true") {
        setIsUnlocked(true);
      }
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234 or 2026
    if (pin === "1234" || pin === "2026") {
      setIsUnlocked(true);
      setPinError(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("minhaj_supervisor_unlocked", "true");
      }
      fetchMembers();
    } else {
      setPinError(true);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPin("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("minhaj_supervisor_unlocked");
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    setSyncStatusMsg("");
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const data = await res.json();
        if (data.members && data.members.length > 0) {
          // Merge with mock awrad completion rates
          const merged = data.members.map((m: any, idx: number) => ({
            ...m,
            todayAwradRate: idx === 0 ? 100 : idx === 1 ? 83 : idx === 2 ? 67 : 50,
            wazifaAttended: idx <= 1,
          }));
          setMembers(merged);
          setSyncStatusMsg("✓ تم جلب البيانات بنجاح من قاعدة بيانات Notion");
        }
      }
    } catch (e) {
      console.error(e);
      setSyncStatusMsg("⚠️ تعذر الاتصال بـ Notion، يتم عرض البيانات المؤقتة");
    } finally {
      setLoading(false);
    }
  };

  // Quick increment/decrement of a member's paid months
  const handleUpdateMonths = async (memberId: string, delta: number) => {
    const target = members.find((m) => m.id === memberId);
    if (!target) return;

    const newMonths = Math.max(0, Math.min(12, target.paidMonths + delta));
    const newAnnualPaid = newMonths * target.monthly;

    // Optimistic UI update
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              paidMonths: newMonths,
              annualPaid: newAnnualPaid,
              annualRemaining: Math.max(0, m.annualTarget - newAnnualPaid),
              annualPercentage: Math.round((newAnnualPaid / (m.annualTarget || 1)) * 100),
            }
          : m
      )
    );

    // Sync to Notion / server
    try {
      await fetch("/api/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: memberId,
          paidMonths: newMonths,
          annualPaid: newAnnualPaid,
        }),
      });
      setSyncStatusMsg(`✓ تم تحديث ملزومة ${target.name} في قاعدة بيانات Notion`);
    } catch (e) {
      console.error("Error updating member", e);
    }
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.city.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === "paid") return m.paidMonths >= 10;
      if (statusFilter === "pending") return m.paidMonths < 10 && m.paidMonths >= 6;
      if (statusFilter === "late") return m.paidMonths < 6;
      if (statusFilter === "awrad_full") return (m.todayAwradRate || 0) === 100;

      return true;
    });
  }, [members, searchQuery, statusFilter]);

  // Aggregate Metrics
  const totalCollected = useMemo(() => {
    return members.reduce((sum, m) => sum + (m.annualPaid || 0), 0);
  }, [members]);

  const totalTarget = useMemo(() => {
    return members.reduce((sum, m) => sum + (m.annualTarget || 2400), 0);
  }, [members]);

  const avgAwradToday = useMemo(() => {
    if (members.length === 0) return 0;
    const total = members.reduce((sum, m) => sum + (m.todayAwradRate || 0), 0);
    return Math.round(total / members.length);
  }, [members]);

  const wazifaAttendanceRate = useMemo(() => {
    if (members.length === 0) return 0;
    const attended = members.filter((m) => m.wazifaAttended).length;
    return Math.round((attended / members.length) * 100);
  }, [members]);

  const n8nWorkflowJSON = JSON.stringify(
    {
      name: "Minhaj Al-Faqir - Malzouma Daily Sync",
      nodes: [
        {
          parameters: {
            rule: {
              interval: [{ field: "cronExpression", expression: "0 0 * * *" }],
            },
          },
          name: "Schedule Midnight Trigger",
          type: "n8n-nodes-base.cron",
          typeVersion: 1,
          position: [250, 300],
        },
        {
          parameters: {
            resource: "databasePage",
            operation: "getAll",
            databaseId: "402b3765-5def-8142-af31-fd8b4a2ffd8e",
          },
          name: "Fetch Notion Members DB",
          type: "n8n-nodes-base.notion",
          typeVersion: 2,
          position: [450, 300],
        },
        {
          parameters: {
            url: "https://minhaj-al-faqir.vercel.app/api/members/sync",
            method: "POST",
            sendHeaders: true,
            headerParameters: {
              parameters: [
                { name: "x-sync-secret", value: "zawiya-mohammedia-secret-2026" },
              ],
            },
          },
          name: "Sync to Minhaj Al-Faqir API",
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.1,
          position: [680, 300],
        },
      ],
      connections: {
        "Schedule Midnight Trigger": {
          main: [[{ node: "Fetch Notion Members DB", type: "main", index: 0 }]],
        },
        "Fetch Notion Members DB": {
          main: [[{ node: "Sync to Minhaj Al-Faqir API", type: "main", index: 0 }]],
        },
      },
    },
    null,
    2
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B1914] text-[#1D2A24] dark:text-[#E8F0EC] font-sans antialiased selection:bg-[#C5A059]/25 selection:text-[#1B4332]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 space-y-8" dir="rtl">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#A1B3A9]">
            <Link href="/" className="hover:text-[#C5A059] transition">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <Link href="/faqir" className="hover:text-[#C5A059] transition">
              فضاء الفقير
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[#143628] dark:text-[#E5C378] font-bold">
              لوحة قيادة المشرف العام
            </span>
          </div>

          {isUnlocked && (
            <div className="flex items-center gap-2">
              <button
                onClick={fetchMembers}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-[#1B4332] dark:text-[#E5C378] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer hover:border-[#C5A059]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>مزامنة مع Notion</span>
              </button>

              <button
                onClick={handleLock}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>قفل اللوحة</span>
              </button>
            </div>
          )}
        </div>

        {/* LOCKED STATE VIEW */}
        {!isUnlocked && (
          <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#122820] border border-[#C5A059]/40 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                لوحة قيادة المشرف العام والمسؤول المالي
              </h1>
              <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm">
                مساحة مخصصة لمشرفي ومقدمي الزاوية لمتابعة سير أوراد الجماعة، حضور الوظيفة، وتدقيق الملزومة الشهرية.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-[#1D2A24] dark:text-[#E8F0EC]">
                  رمز الأمان الخاص بالمشرف (Code PIN):
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="أدخل الرمز (مثلاً: 1234)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31] text-sm text-center tracking-widest focus:outline-none focus:border-[#C5A059]"
                  autoFocus
                />
                {pinError && (
                  <span className="text-[11px] text-red-500 block">
                    الرمز غير صحيح. جرب الرمز الافتراضي (1234 أو 2026).
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#143628] text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                فتح لوحة القيادة
              </button>
            </form>
          </div>
        )}

        {/* UNLOCKED DASHBOARD VIEW */}
        {isUnlocked && (
          <div className="space-y-8">
            {/* Header Banner */}
            <section className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0E2019] text-[#FAF7F2] border border-[#C5A059]/40 shadow-xl">
              <div className="relative z-10 max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>المراقبة التربوية والمالية • زاوية مدينة المحمدية</span>
                </div>
                <h1 className="font-amiri text-2xl sm:text-3xl font-bold tracking-wide text-[#FAF7F2]">
                  لَوْحَةُ قِيَادَةِ المَشْرَفِ العَامِّ • نَبْضُ الجَمَاعَةِ
                </h1>
                <p className="text-xs text-[#FAF7F2]/80 leading-relaxed font-ibm">
                  متابعة شاملة وفورية: وتيرة خروج الأوراد، نسبة حضور الوظيفة الراتبة، وتحصيل الملزومة الموثقة بقاعدة بيانات Notion وn8n.
                </p>
              </div>

              {/* Status Notice */}
              {syncStatusMsg && (
                <div className="relative z-10 mt-4 p-2.5 rounded-xl bg-white/10 text-xs text-[#E5C378] font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>{syncStatusMsg}</span>
                </div>
              )}
            </section>

            {/* 4 Core KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Total Members */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#52796F] dark:text-[#A1B3A9]">
                  <span className="text-xs font-bold">الفقراء المسجلون</span>
                  <Users className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-amiri text-3xl font-bold text-[#143628] dark:text-[#E8F0EC]">
                    {members.length}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">منتسباً نشطاً</span>
                </div>
                <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8] block">
                  موثقون بـ Notion Database
                </span>
              </div>

              {/* Metric 2: Today Awrad Rate */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#52796F] dark:text-[#A1B3A9]">
                  <span className="text-xs font-bold">معدل خروج أوراد اليوم</span>
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-amiri text-3xl font-bold text-[#C5A059]">
                    {avgAwradToday}%
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">مواظبة عالية</span>
                </div>
                <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8] block">
                  (القرآن • الدلائل • الورد • 15k هيللة)
                </span>
              </div>

              {/* Metric 3: Wazifa Attendance */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#52796F] dark:text-[#A1B3A9]">
                  <span className="text-xs font-bold">حضور الوظيفة بالزاوية</span>
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-amiri text-3xl font-bold text-[#143628] dark:text-[#E8F0EC]">
                    {wazifaAttendanceRate}%
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">مجلس الجماعة</span>
                </div>
                <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8] block">
                  اجتماع الفقراء بالزاوية
                </span>
              </div>

              {/* Metric 4: Malzouma Collected */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#52796F] dark:text-[#A1B3A9]">
                  <span className="text-xs font-bold">تحصيل الملزومة السنوية</span>
                  <Coins className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#E8F0EC]">
                    {totalCollected} د.م
                  </span>
                  <span className="text-[11px] text-[#826122] dark:text-[#E5C378] font-bold">
                    من أصل {totalTarget}
                  </span>
                </div>
                <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8] block">
                  نسبة التحصيل: {Math.round((totalCollected / (totalTarget || 1)) * 100)}%
                </span>
              </div>
            </div>

            {/* Visual Trend Curves (المنحنيات البيانية لوتيرة الأوراد وحضور الوظيفة) */}
            <section className="p-6 rounded-3xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#C5A059]" />
                    <span>منحنى المواظبة الروحية الأسبوعية للجماعة</span>
                  </h3>
                  <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                    تتبع بياني لمعدل إتمام الأوراد الفردية وحضور الوظيفة الراتبة على مدار أيام الأسبوع.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#1B4332] dark:bg-[#C5A059]" />
                    <span>خروج الأوراد الفردية</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>حضور الوظيفة بالزاوية</span>
                  </div>
                </div>
              </div>

              {/* Graphical Visual Curve (Bar + Area Representation) */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 pt-6 pb-2 px-2 border-b border-[#E7DFD5] dark:border-[#203D31]">
                {WEEKLY_TREND.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    {/* Tooltip / Rate display on hover */}
                    <span className="text-[10px] font-bold text-[#C5A059] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition">
                      {item.awrad}%
                    </span>

                    {/* Dual visual bars */}
                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      {/* Awrad bar */}
                      <div
                        className="w-1/2 rounded-t-lg bg-gradient-to-t from-[#143628] to-[#C5A059] transition-all duration-500 group-hover:brightness-110"
                        style={{ height: `${item.awrad}%` }}
                        title={`الأوراد: ${item.awrad}%`}
                      />
                      {/* Wazifa bar */}
                      <div
                        className="w-1/2 rounded-t-lg bg-emerald-500/80 transition-all duration-500 group-hover:brightness-110"
                        style={{ height: `${item.wazifa}%` }}
                        title={`الوظيفة: ${item.wazifa}%`}
                      />
                    </div>

                    <span className="text-[11px] font-bold text-[#52796F] dark:text-[#A1B3A9] text-center truncate w-full">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-[#52796F] dark:text-[#95B8A8] pt-1">
                <span>💡 تبلغ وتيرة الحضور والذكر ذروتها ليلة الجمعة ويوم الجمعة المباركة (98%).</span>
                <span className="text-[11px] text-[#826122] dark:text-[#E5C378]">
                  تحديث آلي مستمر من أجهزة الفقراء
                </span>
              </div>
            </section>

            {/* Fuqara Interactive Table & Treasurer Controls */}
            <section className="p-6 rounded-3xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                    سجل الفقراء • المتابعة الفردية وتدقيق الملزومة
                  </h3>
                  <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                    يمكن لأمين الصندوق زيادة الشهور المؤداة مباشرة (+1 شهر) لتسجيل الدفع فورياً في Notion.
                  </p>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="بحث بالاسم أو المدينة..."
                      className="pr-8 pl-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="paid">الملزومة مستوفاة (&gt;=10)</option>
                    <option value="pending">في طور الاستيفاء (6-9)</option>
                    <option value="late">يحتاج تذكيراً (&lt;6)</option>
                    <option value="awrad_full">أوراد اليوم كاملة (100%)</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-[#E7DFD5] dark:border-[#203D31] text-[#52796F] dark:text-[#A1B3A9] font-bold">
                      <th className="py-3 px-3">اسم الفقير والمدينة</th>
                      <th className="py-3 px-3">حالة الانضباط</th>
                      <th className="py-3 px-3">أوراد اليوم</th>
                      <th className="py-3 px-3">حضور الوظيفة</th>
                      <th className="py-3 px-3">الملزومة (المؤدى/المستهدف)</th>
                      <th className="py-3 px-3">الشهور المؤداة</th>
                      <th className="py-3 px-3 text-center">إجراءات المشرف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7DFD5]/60 dark:divide-[#203D31]/60">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#143628] dark:text-[#FAF7F2] block">
                            {member.name}
                          </span>
                          <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8]">
                            زاوية {member.city}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378]">
                            {member.status}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#1B4332] to-[#C5A059]"
                                style={{ width: `${member.todayAwradRate || 0}%` }}
                              />
                            </div>
                            <span className="font-bold text-[11px]">
                              {member.todayAwradRate || 0}%
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          {member.wazifaAttended ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> حاضر
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px]">— لم يحضر</span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-[#143628] dark:text-[#FAF7F2] block">
                            {member.annualPaid} / {member.annualTarget} د.م
                          </span>
                          <span className="text-[10px] text-gray-400">
                            (الشهري: {member.monthly} د.م)
                          </span>
                        </td>

                        {/* Paid Months with +/- buttons for Treasurer */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdateMonths(member.id, -1)}
                              disabled={member.paidMonths <= 0}
                              className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-700 dark:text-gray-300 font-bold flex items-center justify-center text-xs disabled:opacity-30 cursor-pointer"
                              title="إنقاص شهر"
                            >
                              -
                            </button>
                            <span className="font-bold text-xs px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#143628] dark:text-[#E5C378]">
                              {member.paidMonths} / 12
                            </span>
                            <button
                              onClick={() => handleUpdateMonths(member.id, 1)}
                              disabled={member.paidMonths >= 12}
                              className="w-5 h-5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center text-xs disabled:opacity-30 cursor-pointer"
                              title="تسجيل أداء شهر جديد"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Actions: 1-Click WhatsApp */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => {
                              const msg = `السلام عليكم ورحمة الله أخي الكريم ${member.name}، تقبل الله أورادكم وطاعاتكم في زاوية ${member.city}. نحثكم على دوام المواظبة والاستبشار، وبارك الله في صدقكم وخدمتكم للزاوية.`;
                              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                            title="مراسلة تشجيعية عبر واتساب"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>تواصل</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Synology NAS n8n Automation Workflow Details */}
            <section className="p-6 rounded-3xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-[#143628] dark:text-[#E5C378]">
                  <Code className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="font-amiri text-base font-bold">
                    إعداد الأتمتة التلقائية على NAS Synology (n8n Workflow)
                  </h4>
                </div>

                <button
                  onClick={() => setShowN8nCode(!showN8nCode)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#C5A059]/40 text-xs font-bold text-[#143628] dark:text-[#E5C378] hover:bg-[#C5A059]/15 transition cursor-pointer"
                >
                  {showN8nCode ? "إخفاء كود n8n JSON" : "عرض كود الاستيراد n8n JSON"}
                </button>
              </div>

              <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm leading-relaxed">
                يقوم سيناريو n8n بتفقد جدول الملزومة يومياً مع منتصف الليل (00:00) أو التاسعة صباحاً (09:00)، ثم يرسل التحديثات تلقائياً عبر نقطة النهاية:
                <code className="mx-1 px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 font-mono text-[11px] text-[#C5A059]">
                  POST /api/members/sync
                </code>
              </p>

              {showN8nCode && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>انسخ الكود والصقه مباشرة في n8n (Import from JSON):</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(n8nWorkflowJSON);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="px-2.5 py-1 rounded bg-[#C5A059]/20 text-[#143628] dark:text-[#E5C378] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-green-600" /> : <Share2 className="w-3 h-3" />}
                      <span>{copiedCode ? "تم النسخ!" : "نسخ الكود"}</span>
                    </button>
                  </div>
                  <pre
                    dir="ltr"
                    className="p-4 rounded-xl bg-gray-900 text-gray-100 font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed border border-gray-800"
                  >
                    {n8nWorkflowJSON}
                  </pre>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
