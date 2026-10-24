"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Tag,
  BookOpen,
  Sparkles,
  Clock,
  Coins,
  ChevronRight,
  ChevronLeft,
  Filter,
  FileText,
  Share2,
  Folder,
  CheckSquare,
  Compass,
  Heart,
  Briefcase,
  User,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Types
interface Habit {
  id: string;
  name: string;
  isDefault?: boolean;
}

interface Note {
  id: string;
  title: string;
  content: string;
  category: "dhikr" | "reading" | "service" | "work" | "personal";
  date: string;
}

interface PlannerTask {
  id: string;
  text: string;
  completed: boolean;
  time?: string;
}

const DEFAULT_HABITS: Habit[] = [
  { id: "h1", name: "حِزبا القرآن الكريم (الصبح والمساء)", isDefault: true },
  { id: "h2", name: "حزب دلائل الخيرات للإمام الجزولي", isDefault: true },
  { id: "h3", name: "الورد العام (الاستغفار • الصلاة • التوحيد)", isDefault: true },
  { id: "h4", name: "15,000 هَيْلَلَة (جلسة التوحيد ~ ساعة ونصف)", isDefault: true },
  { id: "h5", name: "حضور الوظيفة الراتبة بالزاوية", isDefault: true },
  { id: "h6", name: "أذكار الصباح والمساء وحفظ اللسان", isDefault: true },
];

const NOTE_CATEGORIES: {
  key: Note["category"];
  label: string;
  icon: string;
  color: string;
}[] = [
  { key: "dhikr", label: "ذكر وسلوك", icon: "📿", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300/40" },
  { key: "reading", label: "قراءة وعلم", icon: "📖", color: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300/40" },
  { key: "service", label: "خدمة وزاوية", icon: "🕌", color: "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 border-green-300/40" },
  { key: "work", label: "عمل ومهنة", icon: "💼", color: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300/40" },
  { key: "personal", label: "حياة شخصية", icon: "🌿", color: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300/40" },
];

const MONTH_NAMES_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو",
  "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر",
];

const DAYS_NAMES_AR = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Fixed initial date for deterministic SSR / SSG prerender
const INITIAL_DATE = new Date("2026-10-24T00:00:00Z");

export default function FaqirPortalPage() {
  const [activeTab, setActiveTab] = useState<"habits" | "planner" | "notes" | "nafaqa">("habits");

  // Selected Date for tracking & planner (initialized deterministically, updated on client)
  const [selectedDate, setSelectedDate] = useState<Date>(INITIAL_DATE);
  const [calendarViewMonth, setCalendarViewMonth] = useState<Date>(INITIAL_DATE);
  const [todayKey, setTodayKey] = useState<string>("2026-10-24");

  // Habits State
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [newHabitName, setNewHabitName] = useState("");
  // Habit checks map: { "YYYY-MM-DD": { [habitId]: boolean } }
  const [habitChecks, setHabitChecks] = useState<Record<string, Record<string, boolean>>>({});

  // Planner State: { "YYYY-MM-DD": PlannerTask[] }
  const [plannerTasks, setPlannerTasks] = useState<Record<string, PlannerTask[]>>({});
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");

  // Notes State
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState<Note["category"]>("dhikr");
  const [selectedNoteFilter, setSelectedNoteFilter] = useState<string>("all");

  // Nafaqa / Cotisation State
  const [monthlyAmount, setMonthlyAmount] = useState<number>(200);
  const [paidMonths, setPaidMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Load from localStorage & client date on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const now = new Date();
      setSelectedDate(now);
      setCalendarViewMonth(now);
      setTodayKey(formatDateKey(now));

      const savedHabits = localStorage.getItem("minhaj_faqir_habits");
      if (savedHabits) setHabits(JSON.parse(savedHabits));

      const savedChecks = localStorage.getItem("minhaj_faqir_checks");
      if (savedChecks) setHabitChecks(JSON.parse(savedChecks));

      const savedPlanner = localStorage.getItem("minhaj_faqir_planner");
      if (savedPlanner) setPlannerTasks(JSON.parse(savedPlanner));

      const savedNotes = localStorage.getItem("minhaj_faqir_notes");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        // Sample starter note
        setNotes([
          {
            id: "n-1",
            title: "فائدة من مذاكرة الشيخ في جمعية القلب",
            content: "«الذكر بلا حضور كالجسم بلا روح، ومن جلس للذكر فليستحضر أنه بين يدي الله، وليغمض عينيه عن صور الأكوان لتبدو له أنوار العيان».",
            category: "dhikr",
            date: formatDateKey(new Date()),
          },
        ]);
      }

      const savedPaidMonths = localStorage.getItem("minhaj_faqir_paid_months");
      if (savedPaidMonths) setPaidMonths(JSON.parse(savedPaidMonths));
    } catch (e) {
      console.error("Error reading faqir data from storage", e);
    }
  }, []);

  // Sync to localStorage
  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("minhaj_faqir_habits", JSON.stringify(updated));
    }
  };

  const saveChecks = (updated: Record<string, Record<string, boolean>>) => {
    setHabitChecks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("minhaj_faqir_checks", JSON.stringify(updated));
    }
  };

  const savePlanner = (updated: Record<string, PlannerTask[]>) => {
    setPlannerTasks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("minhaj_faqir_planner", JSON.stringify(updated));
    }
  };

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("minhaj_faqir_notes", JSON.stringify(updated));
    }
  };

  const savePaidMonths = (updated: number[]) => {
    setPaidMonths(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("minhaj_faqir_paid_months", JSON.stringify(updated));
    }
  };

  // Date Key
  const dateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);

  // Current Day Checks & Dynamic Percentage
  const currentDayChecks = habitChecks[dateKey] || {};
  const totalHabitsCount = habits.length;
  const completedHabitsCount = useMemo(() => {
    return habits.filter((h) => currentDayChecks[h.id]).length;
  }, [habits, currentDayChecks]);

  const habitPercentage = useMemo(() => {
    if (totalHabitsCount === 0) return 0;
    return Math.round((completedHabitsCount / totalHabitsCount) * 100);
  }, [completedHabitsCount, totalHabitsCount]);

  // Toggle habit checkbox
  const toggleHabit = (habitId: string) => {
    const dayRecord = { ...currentDayChecks };
    dayRecord[habitId] = !dayRecord[habitId];
    saveChecks({
      ...habitChecks,
      [dateKey]: dayRecord,
    });
  };

  // Add new habit
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      id: `h-custom-${Date.now()}`,
      name: newHabitName.trim(),
      isDefault: false,
    };
    saveHabits([...habits, newHabit]);
    setNewHabitName("");
  };

  // Delete habit
  const handleDeleteHabit = (id: string) => {
    if (confirm("هل تريد حذف هذه العادة/الورد من قائمتك؟")) {
      saveHabits(habits.filter((h) => h.id !== id));
    }
  };

  // Planner Task handlers
  const currentTasks = plannerTasks[dateKey] || [];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const task: PlannerTask = {
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
      time: newTaskTime.trim() || undefined,
    };
    savePlanner({
      ...plannerTasks,
      [dateKey]: [...currentTasks, task],
    });
    setNewTaskText("");
    setNewTaskTime("");
  };

  const toggleTask = (taskId: string) => {
    const updated = currentTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    savePlanner({
      ...plannerTasks,
      [dateKey]: updated,
    });
  };

  const deleteTask = (taskId: string) => {
    const updated = currentTasks.filter((t) => t.id !== taskId);
    savePlanner({
      ...plannerTasks,
      [dateKey]: updated,
    });
  };

  // Note Handlers
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory,
      date: dateKey,
    };
    saveNotes([newNote, ...notes]);
    setNoteTitle("");
    setNoteContent("");
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("هل تريد حذف هذه الخاطرة؟")) {
      saveNotes(notes.filter((n) => n.id !== id));
    }
  };

  const filteredNotes = useMemo(() => {
    if (selectedNoteFilter === "all") return notes;
    return notes.filter((n) => n.category === selectedNoteFilter);
  }, [notes, selectedNoteFilter]);

  // Calendar Calculation for Notion-like month grid
  const daysInMonth = useMemo(() => {
    const year = calendarViewMonth.getFullYear();
    const month = calendarViewMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: { date: Date; isCurrentMonth: boolean; key: string }[] = [];

    // Prev month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({ date: d, isCurrentMonth: false, key: formatDateKey(d) });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true, key: formatDateKey(d) });
    }

    // Next month padding to fill grid (up to 35 or 42 cells)
    const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false, key: formatDateKey(d) });
    }

    return days;
  }, [calendarViewMonth]);

  const isToday = (d: Date) => {
    return formatDateKey(d) === todayKey;
  };

  const isSelected = (d: Date) => {
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getDayCompletionRate = (key: string) => {
    const checks = habitChecks[key];
    if (!checks || totalHabitsCount === 0) return 0;
    const completed = habits.filter((h) => checks[h.id]).length;
    return Math.round((completed / totalHabitsCount) * 100);
  };

  const toggleMonthPayment = (monthNum: number) => {
    const updated = paidMonths.includes(monthNum)
      ? paidMonths.filter((m) => m !== monthNum)
      : [...paidMonths, monthNum].sort((a, b) => a - b);
    savePaidMonths(updated);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B1914] text-[#1D2A24] dark:text-[#E8F0EC] font-sans antialiased selection:bg-[#C5A059]/25 selection:text-[#1B4332]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 space-y-8" dir="rtl">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#A1B3A9]">
            <Link href="/" className="hover:text-[#C5A059] transition flex items-center gap-1">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[#143628] dark:text-[#E5C378] font-bold">
              فضاء الفقير
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const text = `🌟 إنجاز الورد الروحي ليوم ${dateKey}:\n• نسبة الأوراد المنجزة: ${habitPercentage}% (${completedHabitsCount} من ${totalHabitsCount})\n• منصة منهاج الفقير: ${typeof window !== "undefined" ? window.location.origin : ""}/faqir`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
              }}
              className="px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="مشاركة إنجاز اليوم"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة الإنجاز</span>
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <section className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0E2019] text-[#FAF7F2] border border-[#C5A059]/40 shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>منهاج السلوك والتربية • فضاء المريد الخاص</span>
            </div>
            <h1 className="font-amiri text-2xl sm:text-4xl font-bold tracking-wide text-[#FAF7F2] drop-shadow-sm">
              فَضَاءُ الفَقِيرِ • رُزْنَامَةُ الأَوْرَادِ وَالمُفَكِّرَةُ
            </h1>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed font-ibm">
              مساحتك الروحية الخاصة للمواظبة على الأوراد الراتبة، تتبع السلوك اليومي، تسجيل فوائد ومذاكرات الشيخ، وضبط الملزومة الشهرية بخصوصية وسهولة تامة.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#C5A059]/25">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-[#C5A059] block font-ibm">تاريخ اليوم المختار</span>
              <span className="text-sm font-bold text-white">{dateKey}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-[#C5A059] block font-ibm">نسبة أوراد اليوم</span>
              <span className="text-sm font-bold text-white">{habitPercentage}% ({completedHabitsCount}/{totalHabitsCount})</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-[#C5A059] block font-ibm">مهام اليوم</span>
              <span className="text-sm font-bold text-white">{currentTasks.filter((t) => t.completed).length}/{currentTasks.length} منجزة</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-[#C5A059] block font-ibm">النفقة الشهرية</span>
              <span className="text-sm font-bold text-white">{paidMonths.length * monthlyAmount} درهم ({paidMonths.length}/12)</span>
            </div>
          </div>
        </section>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E7DFD5] dark:border-[#203D31]">
          <button
            onClick={() => setActiveTab("habits")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === "habits"
                ? "bg-[#1B4332] text-[#FAF7F2] shadow-md dark:bg-[#C5A059] dark:text-[#143628]"
                : "bg-white dark:bg-[#122820] text-[#1D2A24] dark:text-[#E8F0EC] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>متتبع الأوراد والعادات</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-black/20">
              {habitPercentage}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab("planner")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === "planner"
                ? "bg-[#1B4332] text-[#FAF7F2] shadow-md dark:bg-[#C5A059] dark:text-[#143628]"
                : "bg-white dark:bg-[#122820] text-[#1D2A24] dark:text-[#E8F0EC] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>المخطط والمهام (Planner)</span>
            {currentTasks.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-black/20">
                {currentTasks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === "notes"
                ? "bg-[#1B4332] text-[#FAF7F2] shadow-md dark:bg-[#C5A059] dark:text-[#143628]"
                : "bg-white dark:bg-[#122820] text-[#1D2A24] dark:text-[#E8F0EC] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>المفكرة والخواطر (Notes)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-black/20">
              {notes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("nafaqa")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === "nafaqa"
                ? "bg-[#1B4332] text-[#FAF7F2] shadow-md dark:bg-[#C5A059] dark:text-[#143628]"
                : "bg-white dark:bg-[#122820] text-[#1D2A24] dark:text-[#E8F0EC] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>دفتر النفقة والملزومة</span>
          </button>
        </div>

        {/* 2-COLUMN LAYOUT: CALENDAR (SIDEBAR / TOP) + ACTIVE TAB CONTENT */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* COLUMN 1: NOTION-STYLE MONTHLY CALENDAR (4 Cols on lg) */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#143628] dark:text-[#E5C378]">
                  <CalendarIcon className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-amiri text-base font-bold">
                    رزنامة الشهر • {MONTH_NAMES_AR[calendarViewMonth.getMonth()]} {calendarViewMonth.getFullYear()}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const d = new Date(calendarViewMonth);
                      d.setMonth(d.getMonth() - 1);
                      setCalendarViewMonth(d);
                    }}
                    className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#1D2A24] dark:text-[#E8F0EC] transition cursor-pointer"
                    title="الشهر السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const d = new Date(calendarViewMonth);
                      d.setMonth(d.getMonth() + 1);
                      setCalendarViewMonth(d);
                    }}
                    className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#1D2A24] dark:text-[#E8F0EC] transition cursor-pointer"
                    title="الشهر القادم"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#52796F] dark:text-[#A1B3A9]">
                {DAYS_NAMES_AR.map((day) => (
                  <span key={day} className="py-1">
                    {day}
                  </span>
                ))}
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map(({ date, isCurrentMonth, key }) => {
                  const rate = getDayCompletionRate(key);
                  const selected = isSelected(date);
                  const today = isToday(date);

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDate(date)}
                      className={`relative aspect-square rounded-xl p-1 flex flex-col items-center justify-between transition text-xs font-semibold cursor-pointer ${
                        selected
                          ? "bg-[#1B4332] text-white shadow-md ring-2 ring-[#C5A059]"
                          : today
                          ? "bg-[#C5A059]/20 text-[#143628] dark:text-[#E5C378] font-bold border border-[#C5A059]"
                          : isCurrentMonth
                          ? "hover:bg-[#FAF7F2] dark:hover:bg-[#0B1914] text-[#1D2A24] dark:text-[#E8F0EC]"
                          : "text-gray-300 dark:text-gray-600 opacity-40 hover:opacity-100"
                      }`}
                    >
                      <span>{date.getDate()}</span>
                      {/* Mini completion bar or dot */}
                      {rate > 0 && (
                        <div className="w-full px-1">
                          <div
                            className={`h-1 rounded-full ${
                              rate === 100
                                ? "bg-emerald-500"
                                : rate >= 50
                                ? "bg-[#C5A059]"
                                : "bg-amber-400"
                            }`}
                            title={`${rate}% منجز`}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Jump Today Button */}
              <button
                onClick={() => {
                  const now = new Date();
                  setSelectedDate(now);
                  setCalendarViewMonth(now);
                }}
                className="w-full py-1.5 rounded-xl border border-[#C5A059]/40 text-[11px] font-bold text-[#143628] dark:text-[#E5C378] hover:bg-[#C5A059]/15 transition text-center cursor-pointer"
              >
                العودة إلى اليوم ({todayKey})
              </button>
            </div>

            {/* Selected Day Overview Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#FAF7F2]/60 dark:from-[#122820] dark:to-[#0B1914] border border-[#C5A059]/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#143628] dark:text-[#E5C378]">
                  يوم: {selectedDate.getDate()} {MONTH_NAMES_AR[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </span>
              </div>
              <p className="text-xs text-[#52796F] dark:text-[#95B8A8] font-ibm">
                كل تغيير أو تكويش في هذا اليوم يُحفظ تلقائياً في رزنامتك.
              </p>
            </div>
          </aside>

          {/* COLUMN 2: ACTIVE TAB CONTENT (8 Cols on lg) */}
          <section className="lg:col-span-8 space-y-6">
            {/* TAB 1: HABIT TRACKER */}
            {activeTab === "habits" && (
              <div className="space-y-6">
                {/* Progress Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                        مُتتبّع الأوراد والعادات الروحية
                      </h3>
                      <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                        إنجازك ليوم {dateKey}: {completedHabitsCount} من أصل {totalHabitsCount} عادات
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-amiri text-2xl font-bold text-[#C5A059]">
                        {habitPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden p-0.5 border border-black/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#C5A059] transition-all duration-500"
                      style={{ width: `${habitPercentage}%` }}
                    />
                  </div>

                  {habitPercentage === 100 && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>ما شاء الله! أتممت جميع أوراد وعادات هذا اليوم كاملة بحمد الله.</span>
                    </div>
                  )}
                </div>

                {/* Habits List */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-[#52796F] dark:text-[#A1B3A9] tracking-wider uppercase">
                    قائمة الأوراد والعادات لهذا اليوم
                  </h4>

                  <div className="space-y-2">
                    {habits.map((habit) => {
                      const isChecked = !!currentDayChecks[habit.id];
                      return (
                        <div
                          key={habit.id}
                          onClick={() => toggleHabit(habit.id)}
                          className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isChecked
                              ? "bg-[#FAF7F2] dark:bg-[#0B1914] border-[#C5A059] shadow-sm"
                              : "bg-white dark:bg-[#122820] border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                                isChecked
                                  ? "bg-emerald-600 text-white"
                                  : "border-2 border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {isChecked && <CheckCircle2 className="w-4 h-4" />}
                            </button>
                            <span
                              className={`text-xs sm:text-sm font-semibold ${
                                isChecked
                                  ? "text-[#143628] dark:text-[#E5C378] line-through opacity-80"
                                  : "text-[#1D2A24] dark:text-[#E8F0EC]"
                              }`}
                            >
                              {habit.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {habit.isDefault && (
                              <span className="px-2 py-0.5 rounded-md bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378] text-[10px] font-bold">
                                راتب الطريقة
                              </span>
                            )}
                            {!habit.isDefault && (
                              <button
                                onClick={() => handleDeleteHabit(habit.id)}
                                className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                                title="حذف العادة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Custom Habit Form */}
                  <form onSubmit={handleAddHabit} className="pt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex gap-2">
                    <input
                      type="text"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      placeholder="أضف عادة أو ورداً خاصاً بك (مثلاً: قيام الليل، صلاة الضحى، تلاوة جزء...)"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#1D2A24] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143628] dark:bg-[#C5A059] dark:hover:bg-[#D4AF37] text-white dark:text-[#143628] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: PLANNER */}
            {activeTab === "planner" && (
              <div className="space-y-6">
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                        مخطط اليوم ومواعيد السلوك ({dateKey})
                      </h3>
                      <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                        سجل مواعيد الزاوية، مجالس الذكر، والمهام اليومية التي تنوي أداءها.
                      </p>
                    </div>
                  </div>

                  {/* Task List */}
                  <div className="space-y-2">
                    {currentTasks.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#52796F] dark:text-[#95B8A8]">
                        لا توجد مواعيد أو مهام مسجلة لهذا اليوم. أضف موعداً بالأسفل.
                      </div>
                    ) : (
                      currentTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition cursor-pointer ${
                                task.completed
                                  ? "bg-emerald-600 text-white"
                                  : "border-2 border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>
                            <span
                              className={`text-xs sm:text-sm font-semibold ${
                                task.completed ? "line-through opacity-70 text-gray-500" : ""
                              }`}
                            >
                              {task.text}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {task.time && (
                              <span className="px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059] text-[10px] font-bold">
                                {task.time}
                              </span>
                            )}
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition cursor-pointer"
                              title="حذف المهمة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Task Form */}
                  <form onSubmit={handleAddTask} className="pt-3 border-t border-[#E7DFD5] dark:border-[#203D31] flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder="أضف موعداً أو مهمة (مثلاً: حضور مجلس المذاكرة بعد العصر...)"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#1D2A24] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                    />
                    <input
                      type="text"
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value)}
                      placeholder="الوقت (اختياري: 17:00)"
                      className="w-full sm:w-32 px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#1D2A24] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143628] dark:bg-[#C5A059] dark:hover:bg-[#D4AF37] text-white dark:text-[#143628] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 3: SMART CATEGORIZED NOTES */}
            {activeTab === "notes" && (
              <div className="space-y-6">
                {/* Note Category Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setSelectedNoteFilter("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      selectedNoteFilter === "all"
                        ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#143628]"
                        : "bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-[#52796F]"
                    }`}
                  >
                    جميع الخواطر ({notes.length})
                  </button>
                  {NOTE_CATEGORIES.map((cat) => {
                    const count = notes.filter((n) => n.category === cat.key).length;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setSelectedNoteFilter(cat.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                          selectedNoteFilter === cat.key
                            ? "bg-[#1B4332] text-white dark:bg-[#C5A059] dark:text-[#143628]"
                            : "bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-[#52796F]"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                        <span className="text-[10px] opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add New Note Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                  <h4 className="font-amiri text-base font-bold text-[#143628] dark:text-[#E8F0EC]">
                    تدوين خاطرة أو فائدة جديدة
                  </h4>
                  <form onSubmit={handleAddNote} className="space-y-3">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="عنوان الخاطرة أو الفائدة..."
                        className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#1D2A24] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                      />
                      <select
                        value={noteCategory}
                        onChange={(e) => setNoteCategory(e.target.value as Note["category"])}
                        className="px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#1D2A24] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059] cursor-pointer"
                      >
                        {NOTE_CATEGORIES.map((cat) => (
                          <option key={cat.key} value={cat.key}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      rows={3}
                      placeholder="اكتب ما فتح الله به عليك من معانٍ، أو توجيهات سمعتها في المذاكرة..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203D31] text-xs text-[#1D2A24] dark:text-[#FAF7F2] focus:outline-none focus:border-[#C5A059] leading-relaxed"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143628] dark:bg-[#C5A059] dark:hover:bg-[#D4AF37] text-white dark:text-[#143628] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>حفظ الخاطرة</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Notes Feed */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredNotes.length === 0 ? (
                    <div className="sm:col-span-2 py-10 text-center text-xs text-[#52796F] dark:text-[#95B8A8]">
                      لا توجد خواطر مسجلة في هذا التصنيف حالياً.
                    </div>
                  ) : (
                    filteredNotes.map((note) => {
                      const catInfo = NOTE_CATEGORIES.find((c) => c.key === note.category);
                      return (
                        <div
                          key={note.id}
                          className="p-5 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm flex flex-col justify-between space-y-3 hover:border-[#C5A059] transition"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                  catInfo?.color || "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {catInfo?.icon} {catInfo?.label}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {note.date}
                              </span>
                            </div>

                            <h5 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                              {note.title}
                            </h5>

                            <p className="text-xs text-[#1D2A24]/85 dark:text-[#D5E2DB] font-ibm leading-relaxed whitespace-pre-wrap">
                              {note.content}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] flex justify-end">
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: NAFAQA & COTISATION */}
            {activeTab === "nafaqa" && (
              <div className="space-y-6">
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                        دفتر النفقة والملزومة السنوية
                      </h3>
                      <p className="text-xs text-[#52796F] dark:text-[#95B8A8]">
                        متابعة مساهمة الفقير في نفقات الزاوية وإعانة المحتاجين وعمارة المجالس.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/40 text-right">
                      <span className="text-[11px] text-[#9E7B35] dark:text-[#E5C378] block">المبلغ الشهري المقدر</span>
                      <span className="text-base font-bold text-[#143628] dark:text-white">{monthlyAmount} درهم / شهرياً</span>
                    </div>
                  </div>

                  {/* 12 Months Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {MONTH_NAMES_AR.map((monthName, idx) => {
                      const monthNum = idx + 1;
                      const isPaid = paidMonths.includes(monthNum);
                      return (
                        <div
                          key={monthNum}
                          onClick={() => toggleMonthPayment(monthNum)}
                          className={`p-3.5 rounded-xl border transition flex flex-col justify-between space-y-2 cursor-pointer ${
                            isPaid
                              ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                              : "bg-[#FAF7F2] dark:bg-[#0B1914] border-[#E7DFD5] dark:border-[#203D31] opacity-75 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378]">
                              {monthName}
                            </span>
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                isPaid
                                  ? "bg-emerald-600 text-white"
                                  : "border border-gray-300 dark:border-gray-600 text-gray-400"
                              }`}
                            >
                              {isPaid ? "✓" : "—"}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#52796F] dark:text-[#A1B3A9]">
                            {isPaid ? `تم أداء ${monthlyAmount} د.م` : "قيد الأداء"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Bar */}
                  <div className="pt-4 border-t border-[#E7DFD5] dark:border-[#203D31] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-[#52796F] dark:text-[#A1B3A9]">
                      مجموع ما تم أداؤه لهذا العام: <strong className="text-[#143628] dark:text-[#E5C378]">{paidMonths.length * monthlyAmount} درهم</strong> ({paidMonths.length} من 12 شهراً)
                    </span>
                    <span className="text-[11px] text-[#826122] dark:text-[#E5C378] bg-[#C5A059]/15 px-3 py-1 rounded-lg">
                      🔒 مسجل ومحفوظ تلقائياً على جهازك
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
