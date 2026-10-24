import rawArbaeen from "@/data/arbaeen.json";

export interface HadithItem {
  id: number;
  title: string;
  topic: string;
  theme: string;
  narrator: string;
  source: string;
  image: string;
  text_ar: string;
  text_fr: string;
  text_en: string;
  suluk_lesson: string;
}

export const ARBAEEN_LIST: HadithItem[] = rawArbaeen as HadithItem[];
export const TOTAL_HADITH = ARBAEEN_LIST.length;

export function getHadithById(id: number): HadithItem | undefined {
  return ARBAEEN_LIST.find((h) => h.id === id);
}

export function getHadithOfTheDay(targetDate?: Date): HadithItem {
  const d = targetDate || new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = ((dayOfYear - 1) % TOTAL_HADITH + TOTAL_HADITH) % TOTAL_HADITH;
  return ARBAEEN_LIST[index] || ARBAEEN_LIST[0];
}
