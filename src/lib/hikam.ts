import rawHikam from "@/data/hikam.json";

export interface HikmaItem {
  id: number;
  number: number;
  title: string;
  topic: string;
  text_ar: string;
  text_fr: string;
  text_en: string;
  explanation_ar: string;
  explanation_fr: string;
  explanation_en: string;
  capsule_image_url: string;
  has_image: boolean;
}

export const HIKAM_LIST: HikmaItem[] = rawHikam as HikmaItem[];

export const TOTAL_HIKAM = HIKAM_LIST.length;

/**
 * Returns the Hikma of the Day deterministically based on date.
 * Uses the day of the year + year seed so it rotates sequentially every day.
 */
export function getHikmaOfTheDay(targetDate?: Date): HikmaItem {
  const d = targetDate || new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Deterministic 1-based index mapped into 1..TOTAL_HIKAM
  const index = ((dayOfYear - 1) % TOTAL_HIKAM + TOTAL_HIKAM) % TOTAL_HIKAM;
  return HIKAM_LIST[index] || HIKAM_LIST[0];
}

export function getHikmaByNumber(num: number): HikmaItem | undefined {
  return HIKAM_LIST.find((h) => h.number === num);
}

export function getAllTopics(): string[] {
  const topics = new Set<string>();
  HIKAM_LIST.forEach((h) => {
    if (h.topic) topics.add(h.topic);
  });
  return Array.from(topics);
}

export function getHikamByTopic(topic: string): HikmaItem[] {
  if (!topic || topic === "all") return HIKAM_LIST;
  return HIKAM_LIST.filter((h) => h.topic === topic);
}

export function searchHikam(query: string): HikmaItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return HIKAM_LIST;

  return HIKAM_LIST.filter((h) => {
    return (
      h.number.toString() === q ||
      h.text_ar.toLowerCase().includes(q) ||
      h.text_fr.toLowerCase().includes(q) ||
      h.text_en.toLowerCase().includes(q) ||
      h.explanation_ar.toLowerCase().includes(q) ||
      h.topic.toLowerCase().includes(q)
    );
  });
}
