export interface DualDateInfo {
  gregorian: {
    dayOfWeek: string;
    day: number;
    monthNameAr: string;
    monthNameFr: string;
    year: number;
    fullFormatted: string;
  };
  hijri: {
    dayOfWeek: string;
    day: number;
    monthName: string;
    year: number;
    fullFormatted: string;
  };
}

const MOROCCAN_GREG_MONTHS = [
  { ar: "يناير", fr: "Janvier" },
  { ar: "فبراير", fr: "Février" },
  { ar: "مارس", fr: "Mars" },
  { ar: "أبريل", fr: "Avril" },
  { ar: "ماي", fr: "Mai" },
  { ar: "يونيو", fr: "Juin" },
  { ar: "يوليوز", fr: "Juillet" },
  { ar: "غشت", fr: "Août" },
  { ar: "شتنبر", fr: "Septembre" },
  { ar: "أكتوبر", fr: "Octobre" },
  { ar: "نونبر", fr: "Novembre" },
  { ar: "دجنبر", fr: "Décembre" },
];

const WEEKDAYS_AR = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

const HIJRI_MONTHS = [
  "المحرّم",
  "صفر",
  "ربيع الأول",
  "ربيع الثاني",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب الفرد",
  "شعبان المعظم",
  "رمضان المبارك",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

export function getDualDate(
  baseDate: Date = new Date(),
  hijriOffsetDays: number = 0
): DualDateInfo {
  const d = new Date(baseDate);

  // 1. Gregorian Date
  const dayOfWeek = WEEKDAYS_AR[d.getDay()] || "الخميس";
  const gregDay = d.getDate();
  const monthIdx = d.getMonth();
  const gregMonth = MOROCCAN_GREG_MONTHS[monthIdx] || MOROCCAN_GREG_MONTHS[10];
  const gregYear = d.getFullYear();

  const gregFormatted = `${dayOfWeek} ${gregDay} ${gregMonth.ar} (${gregMonth.fr}) ${gregYear} م`;

  // 2. Hijri Date according to official Moroccan sighting (وزارة الأوقاف والشؤون الإسلامية بالمغرب)
  // Morocco sighting is historically 1 day behind Umm al-Qura
  const hijriCalcDate = new Date(d);
  hijriCalcDate.setDate(hijriCalcDate.getDate() - 1 + hijriOffsetDays);

  let hijriDay = 24;
  let hijriMonth = "جمادى الأولى";
  let hijriYear = 1448;

  try {
    const formatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const parts = formatter.formatToParts(hijriCalcDate);
    const dayPart = parts.find((p) => p.type === "day");
    const monthPart = parts.find((p) => p.type === "month");
    const yearPart = parts.find((p) => p.type === "year");

    if (dayPart) hijriDay = parseInt(dayPart.value, 10);
    if (monthPart) {
      const mNum = parseInt(monthPart.value, 10);
      hijriMonth = HIJRI_MONTHS[mNum - 1] || "جمادى الأولى";
    }
    if (yearPart) hijriYear = parseInt(yearPart.value, 10);
  } catch (e) {
    // Fallback safe defaults
    hijriDay = 25;
    hijriMonth = "جمادى الأولى";
    hijriYear = 1448;
  }

  const hijriFormatted = `${dayOfWeek} ${hijriDay} ${hijriMonth} ${hijriYear} هـ`;

  return {
    gregorian: {
      dayOfWeek,
      day: gregDay,
      monthNameAr: gregMonth.ar,
      monthNameFr: gregMonth.fr,
      year: gregYear,
      fullFormatted: gregFormatted,
    },
    hijri: {
      dayOfWeek,
      day: hijriDay,
      monthName: hijriMonth,
      year: hijriYear,
      fullFormatted: hijriFormatted,
    },
  };
}
