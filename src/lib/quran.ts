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
 * Convert western digits to Arabic-Indic digits (١ ٢ ٣...)
 */
export function toArabicDigits(num: number | string): string {
  const str = String(num);
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return str.replace(/[0-9]/g, (w) => arabicDigits[+w]);
}
