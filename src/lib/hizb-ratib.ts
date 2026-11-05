import quranHizbsData from "@/data/quran_hizbs.json";

export interface HizbInfo {
  number: number;
  name: string;
  opening: string;
  surahs: string;
}

export interface DailyHizbRatibResult {
  hijriDay: number;
  isShortMonth: boolean;
  isKhatmaDay: boolean;
  morningHizbs: HizbInfo[];
  eveningHizbs: HizbInfo[];
  summaryText: string;
  explanation: string;
}

const ALL_HIZBS: HizbInfo[] = quranHizbsData;

export function getHizbByNumber(num: number): HizbInfo {
  const found = ALL_HIZBS.find((h) => h.number === num);
  if (found) return found;
  return ALL_HIZBS[0];
}

/**
 * Calculates Moroccan Mosque / Zaouia Daily Hizb Ratib (حزبا اليوم الراتب)
 * @param hijriDay Day of the Hijri month (1 to 30)
 * @param isShortMonth Whether the current Hijri month has 29 days (الشهر ناقص)
 */
export function getDailyHizbRatib(
  hijriDay: number = 1,
  isShortMonth: boolean = false
): DailyHizbRatibResult {
  // Clamp day between 1 and 30
  const day = Math.max(1, Math.min(30, Math.floor(hijriDay)));

  // Case A: 29-day month on day 29 (ختم السلكة في الشهر الناقص)
  if (isShortMonth && day >= 29) {
    const morning = [getHizbByNumber(57), getHizbByNumber(58)];
    const evening = [getHizbByNumber(59), getHizbByNumber(60)];
    return {
      hijriDay: 29,
      isShortMonth: true,
      isKhatmaDay: true,
      morningHizbs: morning,
      eveningHizbs: evening,
      summaryText: "سلكة الختم القرآني: الحزبان 57 و58 صباحاً • والحزبان 59 و60 مساءً",
      explanation:
        "وفق العرف القرآني الأصيل بالزوايا والمساجد المغربية: في اليوم 29 من الشهر الناقص تُضاعف القراءة (حزبان صباحاً وحزبان مساءً) لختم سلكة الـ 60 حزباً كاملة واستنزال البركات.",
    };
  }

  // Case B: 30-day month on day 30 (ختم السلكة في الشهر التام)
  if (day === 30) {
    const morning = [getHizbByNumber(59)];
    const evening = [getHizbByNumber(60)];
    return {
      hijriDay: 30,
      isShortMonth: false,
      isKhatmaDay: true,
      morningHizbs: morning,
      eveningHizbs: evening,
      summaryText: "يوم الختم المبارك: الحزب 59 صباحاً • والحزب 60 مساءً",
      explanation:
        "اليوم الثلاثون التام: يُقرأ الحزب 59 بعد الصبح، وتُختم السلكة الشريفة بالحزب 60 بين المغرب والعشاء مع دعاء ختم القرآن الكريم.",
    };
  }

  // Case C: Normal days (1 to 28, or 29 in full month)
  const morningHizbNum = 2 * day - 1;
  const eveningHizbNum = 2 * day;

  const morning = [getHizbByNumber(morningHizbNum)];
  const evening = [getHizbByNumber(eveningHizbNum)];

  return {
    hijriDay: day,
    isShortMonth,
    isKhatmaDay: false,
    morningHizbs: morning,
    eveningHizbs: evening,
    summaryText: `حزب الصباح: ${morning[0].name} (${morning[0].number}) • حزب المساء: ${evening[0].name} (${evening[0].number})`,
    explanation:
      "الحزب الراتب اليومي بالزوايا والمساجد المغربية الشريفة: حزب الصباح يُتلى جماعة بعد صلاة الصبح، وحزب المساء يُتلى بين المغرب والعشاء.",
  };
}
