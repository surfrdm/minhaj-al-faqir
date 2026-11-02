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
  GraduationCap,
  MessageCircle,
  Filter,
  Check,
  ArrowUpRight,
  Database,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase, isSupabaseConfigured, DiscipleRecord } from "@/lib/supabase";

interface DiscipleStats extends DiscipleRecord {
  score_wird_today: number;
  wazifa_attended: boolean;
  masar_completed_stages: number; // 0 to 6
  last_activity: string;
}

const SEED_DISCIPLES: DiscipleStats[] = [
  {
    id: "d-1",
    nom: "سيدي يوسف الفاسي",
    ville: "المحمدية",
    telephone: "+212661000001",
    moqaddem_referent: "سيدي عبد اللطيف",
    role: "faqir",
    score_wird_today: 100,
    wazifa_attended: true,
    masar_completed_stages: 5,
    last_activity: "اليوم 07:30",
  },
  {
    id: "d-2",
    nom: "سيدي عبد الرحمان البودشيشي",
    ville: "الدار البيضاء",
    telephone: "+212661000002",
    moqaddem_referent: "سيدي عبد اللطيف",
    role: "faqir",
    score_wird_today: 83,
    wazifa_attended: true,
    masar_completed_stages: 4,
    last_activity: "اليوم 08:15",
  },
  {
    id: "d-3",
    nom: "سيدي محمد الإدريسي",
    ville: "المحمدية",
    telephone: "+212661000003",
    moqaddem_referent: "سيدي أحمد",
    role: "faqir",
    score_wird_today: 67,
    wazifa_attended: false,
    masar_completed_stages: 3,
    last_activity: "أمس 19:40",
  },
  {
    id: "d-4",
    nom: "سيدي كريم المنصوري",
    ville: "الرباط",
    telephone: "+212661000004",
    moqaddem_referent: "سيدي عبد اللطيف",
    role: "faqir",
    score_wird_today: 50,
    wazifa_attended: false,
    masar_completed_stages: 2,
    last_activity: "منذ يومين",
  },
  {
    id: "d-5",
    nom: "سيدي حمزة بن جلون",
    ville: "فاس",
    telephone: "+212661000005",
    moqaddem_referent: "سيدي هشام",
    role: "faqir",
    score_wird_today: 100,
    wazifa_attended: true,
    masar_completed_stages: 6,
    last_activity: "اليوم 06:10",
  },
  {
    id: "d-6",
    nom: "سيدي طارق الشرقاوي",
    ville: "المحمدية",
    telephone: "+212661000006",
    moqaddem_referent: "سيدي عبد اللطيف",
    role: "faqir",
    score_wird_today: 83,
    wazifa_attended: true,
    masar_completed_stages: 4,
    last_activity: "اليوم 09:00",
  },
];

export default function MoqaddemPage() {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [disciples, setDisciples] = useState<DiscipleStats[]>(SEED_DISCIPLES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDisciple, setSelectedDisciple] = useState<DiscipleStats | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPin = sessionStorage.getItem("minhaj_moqaddem_unlocked");
      if (savedPin === "true") {
        setIsUnlocked(true);
      }
      setSupabaseReady(isSupabaseConfigured());
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234" || pin === "2026") {
      setIsUnlocked(true);
      setPinError(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("minhaj_moqaddem_unlocked", "true");
      }
    } else {
      setPinError(true);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPin("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("minhaj_moqaddem_unlocked");
    }
  };

  // Filtered List
  const filteredDisciples = useMemo(() => {
    return disciples.filter((d) => {
      const matchSearch =
        d.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ville.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (cityFilter !== "all" && d.ville !== cityFilter) return false;

      if (statusFilter === "high" && d.score_wird_today < 80) return false;
      if (statusFilter === "mid" && (d.score_wird_today < 50 || d.score_wird_today >= 80)) return false;
      if (statusFilter === "low" && d.score_wird_today >= 50) return false;
      if (statusFilter === "wazifa_yes" && !d.wazifa_attended) return false;
      if (statusFilter === "wazifa_no" && d.wazifa_attended) return false;

      return true;
    });
  }, [disciples, searchQuery, cityFilter, statusFilter]);

  // Aggregate Metrics
  const avgWirdScore = useMemo(() => {
    if (disciples.length === 0) return 0;
    const total = disciples.reduce((acc, d) => acc + d.score_wird_today, 0);
    return Math.round(total / disciples.length);
  }, [disciples]);

  const wazifaRate = useMemo(() => {
    if (disciples.length === 0) return 0;
    const count = disciples.filter((d) => d.wazifa_attended).length;
    return Math.round((count / disciples.length) * 100);
  }, [disciples]);

  const avgMasarStage = useMemo(() => {
    if (disciples.length === 0) return 0;
    const total = disciples.reduce((acc, d) => acc + d.masar_completed_stages, 0);
    return (total / disciples.length).toFixed(1);
  }, [disciples]);

  const sendWhatsAppGuidance = (d: DiscipleStats) => {
    const message = `السلام عليكم ورحمة الله أخي الحبيب ${d.nom}، تقبل الله منكم صالح الأعمال في زاوية ${d.ville}. نسعد بمواظبتكم على المسار والأوراد (إنجاز اليوم: ${d.score_wird_today}%)، ونذكركم بحضور مجلس الوظيفة المبارك بالزاوية. حفظكم الله ونفعنا بكم.`;
    window.open(`https://api.whatsapp.com/send?phone=${d.telephone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC] font-sans antialiased" dir="rtl">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">
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
              فضاء المقدم والمسؤول
            </span>
          </div>

          {isUnlocked && (
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                supabaseReady
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
              }`}>
                <Database className="w-3.5 h-3.5" />
                <span>{supabaseReady ? "موصول بقاعدة Supabase" : "وضع التخزين الموضعي / Notion"}</span>
              </span>

              <button
                onClick={handleLock}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>قفل الفضاء</span>
              </button>
            </div>
          )}
        </div>

        {/* LOCKED STATE */}
        {!isUnlocked && (
          <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                فضاء المقدَّم والمسؤول التربوي
              </h1>
              <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm">
                مساحة مخصصة لمشرفي ومقدمي الزوايا لمتابعة سير أوراد الفقراء، انضباطهم في المسار، وتوجيههم تربوياً.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-[#1D2A24] dark:text-[#E8F0EC]">
                  رمز الأمان الخاص بالمقدم (Code PIN):
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="أدخل الرمز (مثلاً: 1234 أو 2026)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31] text-sm text-center tracking-widest focus:outline-none focus:border-[#C5A059]"
                  autoFocus
                />
                {pinError && (
                  <span className="text-[11px] text-red-500 block">
                    رمز الأمان غير صحيح. يمكنك تجربة 1234 أو 2026.
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#143628] text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                دخول فضاء المقدم
              </button>
            </form>
          </div>
        )}

        {/* UNLOCKED DASHBOARD */}
        {isUnlocked && (
          <div className="space-y-8">
            {/* Hero Header */}
            <section className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0E2019] text-[#FAF7F2] border border-[#C5A059]/40 shadow-xl">
              <div className="relative z-10 max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>المتابعة التربوية والتعليمية • مشيخة الطريقة</span>
                </div>
                <h1 className="font-amiri text-2xl sm:text-3xl font-bold tracking-wide text-[#FAF7F2]">
                  لَوْحَةُ تَتَبُّعِ الفُقَرَاءِ وَالمَسَارِ التَّكْوِينِيِّ
                </h1>
                <p className="text-xs text-[#FAF7F2]/80 leading-relaxed font-ibm">
                  مؤشرات لحظية لانتظام مريدي الزاوية في الأوراد الراتبة، مراحل المسار الست، وحضور مجالس الذكر والوظيفة.
                </p>
              </div>
            </section>

            {/* 4 KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#52796F] dark:text-[#A1B3A9]">
                  <span className="text-xs font-bold">إجمالي المريدين</span>
                  <Users className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-amiri text-3xl font-bold text-[#143628] dark:text-[#E8F0EC]">
                    {disciples.length}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">مريداً مسجلاً</span>
                </div>
                <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8] block">
                  موزعون على الزوايا
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#52796F] dark:text-[#A1B3A9]">
                  <span className="text-xs font-bold">متوسط أوراد اليوم</span>
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-amiri text-3xl font-bold text-[#C5A059]">
                    {avgWirdScore}%
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">مواظبة ممتازة</span>
                </div>
                <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8] block">
                  القرآن • الدلائل • 15k هيللة
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#52796F] dark:text-[#A1B3A9]">
                  <span className="text-xs font-bold">حضور الوظيفة</span>
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-amiri text-3xl font-bold text-[#143628] dark:text-[#E8F0EC]">
                    {wazifaRate}%
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">مجلس الجماعة</span>
                </div>
                <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8] block">
                  أداء جماعي بالزاوية
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#52796F] dark:text-[#A1B3A9]">
                  <span className="text-xs font-bold">متوسط إنجاز المسار</span>
                  <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-amiri text-3xl font-bold text-[#143628] dark:text-[#E8F0EC]">
                    {avgMasarStage}
                  </span>
                  <span className="text-[11px] text-[#826122] dark:text-[#E5C378] font-bold">
                    من أصل 6 مراحل
                  </span>
                </div>
                <span className="text-[11px] text-[#52796F] dark:text-[#95B8A8] block">
                  المراحل التكوينية المعتمدة
                </span>
              </div>
            </div>

            {/* Filter and Table */}
            <section className="p-6 rounded-3xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                    قائمة المريدين والمتابعة الفردية ({filteredDisciples.length})
                  </h3>
                  <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                    إمكانية إرسال توجيه تربوي فوري عبر واتساب ومتابعة انضباط كل فقير.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="بحث بالاسم أو المدينة..."
                      className="pr-8 pl-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="all">جميع الزوايا</option>
                    <option value="المحمدية">المحمدية</option>
                    <option value="الدار البيضاء">الدار البيضاء</option>
                    <option value="الرباط">الرباط</option>
                    <option value="فاس">فاس</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="high">أوراد عالية (&gt;= 80%)</option>
                    <option value="mid">أوراد متوسطة (50-79%)</option>
                    <option value="low">يحتاج تشجيعاً (&lt; 50%)</option>
                    <option value="wazifa_yes">حضر الوظيفة</option>
                    <option value="wazifa_no">لم يحضر الوظيفة</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-[#E7DFD5] dark:border-[#203D31] text-[#52796F] dark:text-[#A1B3A9] font-bold">
                      <th className="py-3 px-3">الفقير</th>
                      <th className="py-3 px-3">الزاوية</th>
                      <th className="py-3 px-3">أوراد اليوم</th>
                      <th className="py-3 px-3">الوظيفة الراتبة</th>
                      <th className="py-3 px-3">مرحلة المسار</th>
                      <th className="py-3 px-3">آخر نشاط</th>
                      <th className="py-3 px-3 text-center">التوجيه التربوي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7DFD5]/60 dark:divide-[#203D31]/60">
                    {filteredDisciples.map((d) => (
                      <tr key={d.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#143628] dark:text-[#FAF7F2] block">
                            {d.nom}
                          </span>
                          <span className="text-[11px] text-[#52796F] dark:text-[#A1B3A9]">
                            المقدم: {d.moqaddem_referent}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059]/15 text-[#826122] dark:text-[#E5C378]">
                            زاوية {d.ville}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#1B4332] to-[#C5A059]"
                                style={{ width: `${d.score_wird_today}%` }}
                              />
                            </div>
                            <span className="font-bold text-[11px]">
                              {d.score_wird_today}%
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          {d.wazifa_attended ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> حاضر
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px]">— غير حاضر</span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-[#143628] dark:text-[#FAF7F2]">
                            المرحلة {d.masar_completed_stages} من 6
                          </span>
                        </td>

                        <td className="py-3 px-3 text-[11px] text-gray-400">
                          {d.last_activity}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => sendWhatsAppGuidance(d)}
                            className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
                            title="إرسال توجيه تربوي بالواتساب"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>توجيه تربوي</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
