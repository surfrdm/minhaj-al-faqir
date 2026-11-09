export type TurathSource = 'bukhari' | 'shifa';
export type LanguageView = 'ar' | 'fr' | 'en' | 'all';
export type TurathSearchFieldScope = 'all' | 'text' | 'sharh';
export type BukhariSearchScope = 'all' | 'book' | 'bab';
export type ShifaSearchScope = 'all' | 'part' | 'chapter';

export interface BukhariBookMeta {
  bookNumber: number;
  title_ar: string;
  title_fr: string;
  title_en: string;
  hadithCount: number;
  firstNumber: number;
  lastNumber: number;
  babCount: number;
  hasIbnBattal: boolean;
}

export interface BukhariBab {
  id: string;
  title_ar: string;
  sharh_scholar: string;
  sharh_book: string;
  sharh_ar: string;
  has_ibn_battal: boolean;
}

export interface BukhariHadith {
  id: string;
  number: number;
  numberLabel?: string;
  babId: string;
  text_ar: string;
  text_fr: string;
  text_en: string;
}

export interface BukhariBookData {
  meta: BukhariBookMeta;
  babs: Record<string, BukhariBab>;
  hadiths: BukhariHadith[];
}

export interface BukhariSearchResult {
  bookMeta: BukhariBookMeta;
  bab: BukhariBab;
  hadith: BukhariHadith;
}

export interface ShifaChapterMeta {
  chapterNumber: number;
  partNumber: number;
  part_ar: string;
  part_fr: string;
  title_ar: string;
  title_fr: string;
  maliki_focus_ar: string;
  maliki_focus_fr: string;
  faslCount: number;
}

export interface ShifaFasl {
  id: string;
  chapterNumber: number;
  faslNumber: number;
  title_ar: string;
  text_ar: string;
  sharh_scholar: string;
  sharh_book: string;
  sharh_ar: string;
}

export interface ShifaChapterData {
  meta: ShifaChapterMeta;
  fasls: ShifaFasl[];
}

export interface ShifaSearchResult {
  chapterMeta: ShifaChapterMeta;
  fasl: ShifaFasl;
}
