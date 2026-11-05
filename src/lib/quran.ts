import quranAhzabIndex from "@/data/quran_ahzab_index.json";

export interface HizbIndexItem {
  hizb_number: number;
  start_page: number;
  end_page: number;
  surahs: string[];
  matlaa: string;
  page_count: number;
}

export interface QuranWord {
  id: string;
  surah_order?: string;
  quran_order?: string;
  text: string;
  surah_number?: string;
  hizb_number?: string;
  tomon_number?: string;
  line_order?: string;
  verse_order?: string;
  is_last_word?: string;
  is_first_tomon?: string;
  verse?: {
    verse_number?: string;
    next_verse?: string;
    previous_verse?: string | null;
    sajda?: string;
    is_last_verse?: string;
    is_number_linebreak?: string;
    wakf_end?: string;
    word_start?: string;
    word_stop?: string;
  };
}

export interface QuranLine {
  line_id: number;
  line_number: number;
  is_surah_title: string;
  surah_title?: string;
  surah_title_ar?: string;
  surah_title_lt?: string;
  starts_with_verse_number?: string;
  words: QuranWord[];
}

export interface QuranPage {
  page_number: number;
  hizb_number: number;
  is_intro?: string;
  page_surah_title?: string;
  page_surah_title_lt?: string;
  page_size?: string;
  surah_verses_count?: number | string;
  lines: QuranLine[];
}

export interface QuranHizbData {
  hizb_number: number;
  start_page: number;
  end_page: number;
  surahs: string[];
  matlaa: string;
  pages: QuranPage[];
}

export const ALL_AHZAB_INDEX: HizbIndexItem[] = quranAhzabIndex as HizbIndexItem[];

/**
 * Returns today's Morning and Evening Ahzab according to Moroccan traditional monthly cycle
 * (2 Ahzab per day -> 60 Ahzab per month).
 * Day 1: Hizb 1 (Subh), Hizb 2 (Masa')
 * Day 2: Hizb 3 (Subh), Hizb 4 (Masa')
 * ...
 * Day 30: Hizb 59 (Subh), Hizb 60 (Masa')
 */
export function getTodayAhzabNumbers(date: Date = new Date()): {
  morningHizb: number;
  eveningHizb: number;
  dayOfMonth: number;
} {
  const day = date.getDate(); // 1 - 31
  // Normalize to 1 - 30 range
  const normalizedDay = ((day - 1) % 30) + 1;
  const morningHizb = (normalizedDay - 1) * 2 + 1;
  const eveningHizb = (normalizedDay - 1) * 2 + 2;

  return {
    morningHizb: Math.max(1, Math.min(60, morningHizb)),
    eveningHizb: Math.max(1, Math.min(60, eveningHizb)),
    dayOfMonth: normalizedDay,
  };
}

export function getHizbMeta(hizbNumber: number): HizbIndexItem {
  const found = ALL_AHZAB_INDEX.find((h) => h.hizb_number === hizbNumber);
  if (found) return found;
  return ALL_AHZAB_INDEX[0];
}

/**
 * Formats numbers for Quran UI.
 * Returns Western / French numerals (1, 2, 3...) as explicitly requested
 * by the user for maximum clarity and effortless reading.
 */
export function toArabicDigits(num: number | string): string {
  return String(num);
}

export function formatQuranNumber(num: number | string): string {
  return String(num);
}

export interface TomonBadgeInfo {
  type: "hizb" | "nisf" | "rub" | "thumun";
  label: string;
  shortLabel: string;
  badgeStyle: string;
}

/**
 * Returns authentic Moroccan Quran division metadata:
 * - Hizb (كبيرة - Large)
 * - Nisf (فوق المتوسطة - Medium-Large)
 * - Rub' (متوسطة - Medium)
 * - Thumun (صغيرة - Small)
 */
export function getTomonDivisionInfo(
  tomonNumber: number | string,
  hizbNumber?: number | string
): TomonBadgeInfo | null {
  const t = Number(tomonNumber);
  if (!t || t < 1 || t > 8) return null;

  switch (t) {
    case 1:
      return {
        type: "hizb",
        label: hizbNumber ? `۞ الحِزْبُ ${hizbNumber}` : "۞ الحِزْبُ",
        shortLabel: hizbNumber ? `الحزب ${hizbNumber}` : "الحزب",
        badgeStyle: "px-2.5 py-1 text-xs font-bold bg-[#143628] text-[#E5C378] border-2 border-[#C5A059] shadow-sm",
      };
    case 5:
      return {
        type: "nisf",
        label: "۞ نِصْفُ الحِزْبِ",
        shortLabel: "النصف",
        badgeStyle: "px-2 py-0.5 text-[11px] font-bold bg-[#C5A059]/25 text-[#826122] dark:text-[#E5C378] border border-[#C5A059] shadow-2xs",
      };
    case 3:
      return {
        type: "rub",
        label: "۞ رُبُعُ الحِزْبِ",
        shortLabel: "الربع",
        badgeStyle: "px-1.5 py-0.5 text-[10px] font-bold bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378] border border-[#C5A059]/80",
      };
    case 7:
      return {
        type: "rub",
        label: "۞ ثَلَاثَةُ أَرْبَاعِ الحِزْبِ",
        shortLabel: "¾ الحزب",
        badgeStyle: "px-1.5 py-0.5 text-[10px] font-bold bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378] border border-[#C5A059]/80",
      };
    case 2:
    case 4:
    case 6:
    case 8:
      return {
        type: "thumun",
        label: "۞ ثُمُنٌ",
        shortLabel: "ثمن",
        badgeStyle: "px-1 py-0.2 text-[9px] font-bold bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#DFC07D] border border-[#C5A059]/50",
      };
    default:
      return null;
  }
}

/**
 * Robust sanitizer to prevent rendering glitches (e.g. ؉, ؐ, ؊, ؋)
 */
export function cleanQuranWordText(txt: string): string {
  if (!txt) return "";
  return txt
    .replace(/؉ّ/g, "ٍّ")
    .replace(/؉/g, "ٍ")
    .replace(/[؊؋ؐ]/g, "")
    .replace(/[ ;,¢/¿]+$/, "");
}
