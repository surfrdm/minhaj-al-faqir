"use client";

import { useState, useEffect } from "react";
import { Clock, Calendar, Sparkles } from "lucide-react";

interface ScheduleItem {
  timeLabel: string;
  title: string;
}

interface DaySchedule {
  dayName: string;
  dayIndex: number;
  items: ScheduleItem[];
}

const SCHEDULE_DATA: Record<number, DaySchedule> = {
  1: {
    dayName: "الإثنين",
    dayIndex: 1,
    items: [
      {
        timeLabel: "بعد صلاة المغرب",
        title: "الحزب الراتب + الوظيفة",
      },
    ],
  },
  2: {
    dayName: "الثلاثاء",
    dayIndex: 2,
    items: [
      {
        timeLabel: "بعد صلاة المغرب",
        title: "الحزب الراتب + الوظيفة",
      },
    ],
  },
  3: {
    dayName: "الأربعاء",
    dayIndex: 3,
    items: [
      {
        timeLabel: "بعد صلاة المغرب",
        title: "الحزب الراتب + الوظيفة",
      },
    ],
  },
  4: {
    dayName: "الخميس",
    dayIndex: 4,
    items: [
      {
        timeLabel: "بعد صلاة المغرب",
        title: "الحزب الراتب + الوظيفة",
      },
    ],
  },
  5: {
    dayName: "الجمعة",
    dayIndex: 5,
    items: [
      {
        timeLabel: "من العصر إلى المغرب",
        title: "ذكر المخلصين (مع الحزب الراتب)",
      },
      {
        timeLabel: "بعد صلاة المغرب",
        title: "الوظيفة",
      },
    ],
  },
  6: {
    dayName: "السبت",
    dayIndex: 6,
    items: [
      {
        timeLabel: "بعد صلاة المغرب",
        title: "الحزب الراتب + الوظيفة",
      },
    ],
  },
};

const ORDERED_DAYS = [1, 2, 3, 4, 5, 6]; // Strictly Monday to Saturday

export function ZaouiaSchedule() {
  const [selectedDay, setSelectedDay] = useState<number>(4); // Default to Thursday for SSR
  const [todayDayIndex, setTodayDayIndex] = useState<number>(4);

  useEffect(() => {
    const current = new Date().getDay();
    setTodayDayIndex(current);
    // If Sunday (0), display Monday (1)
    setSelectedDay(current === 0 ? 1 : current);
  }, []);

  const activeSchedule = SCHEDULE_DATA[selectedDay] || SCHEDULE_DATA[1];

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
      dir="rtl"
      data-no-wix-override="true"
    >
      <div className="rounded-2xl bg-white dark:bg-[#0A1C14] border border-[#C5A059]/35 dark:border-[#C5A059]/25 p-4 sm:p-5 shadow-sm">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E7DFD5] dark:border-[#1E3A2F] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#143628] text-[#E5C378] border border-[#C5A059]/40 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#C5A059]" />
            </div>
            <div>
              <h2 className="font-amiri text-base sm:text-lg font-bold text-[#143628] dark:text-[#E8F0EC]">
                البرنامج اليومي للزاوية المحمدية
              </h2>
            </div>
          </div>

          {todayDayIndex >= 1 && todayDayIndex <= 6 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143628]/5 dark:bg-[#143628]/40 border border-[#C5A059]/30 text-xs font-bold text-[#143628] dark:text-[#E5C378] self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>اليوم: {SCHEDULE_DATA[todayDayIndex]?.dayName || ""}</span>
            </div>
          )}
        </div>

        {/* Day Selector Pills (Mon to Sat ONLY) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-3 scrollbar-none">
          {ORDERED_DAYS.map((dayIdx) => {
            const day = SCHEDULE_DATA[dayIdx];
            const isSelected = selectedDay === dayIdx;
            const isToday = todayDayIndex === dayIdx;

            return (
              <button
                key={dayIdx}
                type="button"
                onClick={() => setSelectedDay(dayIdx)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#143628] text-[#FAF7F2] border border-[#C5A059] shadow-sm"
                    : "bg-[#FAF7F2] dark:bg-[#12241D] text-[#143628] dark:text-[#D5E2DB] border border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]"
                }`}
              >
                <span>{day.dayName}</span>
                {isToday && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected
                        ? "bg-[#C5A059] text-[#143628] font-bold"
                        : "bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378]"
                    }`}
                  >
                    اليوم
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Schedule Items for Active Day */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {activeSchedule.items.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <span className="text-xs font-bold text-[#52796F] dark:text-[#A1B3A9]">
                  {item.timeLabel}:
                </span>
                <span className="font-amiri text-sm sm:text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
