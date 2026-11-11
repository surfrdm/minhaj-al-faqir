import topicsData from "@/data/quran_thematic_topics.json";
import menuEvidencesData from "@/data/menu_quran_evidences.json";
import type { ThematicTopicEntry, VerifiedQuranVerse } from "@/types/quran-evidence";

export type { ThematicTopicEntry, VerifiedQuranVerse } from "@/types/quran-evidence";
export type ThematicVerse = VerifiedQuranVerse;
export type ThematicTopic = ThematicTopicEntry;

export interface MenuQuranEvidences {
  thawabit: Record<string, VerifiedQuranVerse[]>;
  adab_foundation: VerifiedQuranVerse[];
  adab_items: Record<string, VerifiedQuranVerse[]>;
  evidence: Record<string, VerifiedQuranVerse[]>;
  wazifa: Record<string, VerifiedQuranVerse[]>;
  tracks: Record<string, VerifiedQuranVerse[]>;
  masar: Record<string, VerifiedQuranVerse[]>;
  glossary: Record<string, VerifiedQuranVerse[]>;
  pages: Record<string, VerifiedQuranVerse[]>;
}

export const ALL_THEMATIC_TOPICS: ThematicTopicEntry[] =
  topicsData as ThematicTopicEntry[];

export const MENU_QURAN_EVIDENCES: MenuQuranEvidences =
  menuEvidencesData as MenuQuranEvidences;

/**
 * Normalizes Arabic text for accent-insensitive search across Warsh/Hafs/Modern prose
 */
export function normalizeArabicForSearch(text: string): string {
  if (!text) return "";
  return text
    .replace(/\u06d2\u0654/g, "ي")
    .replace(/\u06d2\u0655/g, "ي")
    .replace(/\u06d2/g, "ي")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u06DE\u06E9]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function getAllThematicTopics(): ThematicTopicEntry[] {
  return ALL_THEMATIC_TOPICS;
}

export function getTopicById(id: string): ThematicTopicEntry | undefined {
  return ALL_THEMATIC_TOPICS.find((t) => t.id === id);
}

export function getTotalThematicVersesCount(): number {
  return ALL_THEMATIC_TOPICS.reduce((sum, t) => sum + t.verses.length, 0);
}

export function getTotalMenuEvidencesCount(): number {
  let total = MENU_QURAN_EVIDENCES.adab_foundation.length;
  const groups = [
    MENU_QURAN_EVIDENCES.thawabit,
    MENU_QURAN_EVIDENCES.adab_items,
    MENU_QURAN_EVIDENCES.evidence,
    MENU_QURAN_EVIDENCES.wazifa,
    MENU_QURAN_EVIDENCES.tracks,
    MENU_QURAN_EVIDENCES.masar,
    MENU_QURAN_EVIDENCES.glossary,
    MENU_QURAN_EVIDENCES.pages,
  ];
  for (const grp of groups) {
    for (const list of Object.values(grp)) {
      total += list.length;
    }
  }
  return total;
}

export function getTotalVerifiedEvidencesCount(): number {
  return getTotalThematicVersesCount() + getTotalMenuEvidencesCount();
}

export function getThawabitVerses(id: string): VerifiedQuranVerse[] {
  return MENU_QURAN_EVIDENCES.thawabit[id] || [];
}

export function getAdabFoundationVerses(): VerifiedQuranVerse[] {
  return MENU_QURAN_EVIDENCES.adab_foundation || [];
}

export function getAdabItemVerses(num: number): VerifiedQuranVerse[] {
  return MENU_QURAN_EVIDENCES.adab_items[String(num)] || [];
}

export function getEvidenceVerses(key: string): VerifiedQuranVerse[] {
  return MENU_QURAN_EVIDENCES.evidence[key] || [];
}

export function getWazifaVerses(key: string): VerifiedQuranVerse[] {
  return MENU_QURAN_EVIDENCES.wazifa[key] || [];
}

export function getTrackModuleVerses(moduleId: string): VerifiedQuranVerse[] {
  return MENU_QURAN_EVIDENCES.tracks[moduleId] || [];
}

export function getMasarStageVerses(stageId: number | string): VerifiedQuranVerse[] {
  const key = String(stageId).startsWith("stage_") ? String(stageId) : `stage_${stageId}`;
  return MENU_QURAN_EVIDENCES.masar[key] || [];
}

export function getGlossaryTermVerses(term: string): VerifiedQuranVerse[] {
  return MENU_QURAN_EVIDENCES.glossary[term] || [];
}

export function getPageVerses(pageKey: string): VerifiedQuranVerse[] {
  return MENU_QURAN_EVIDENCES.pages[pageKey] || [];
}

export function searchThematicVerses(query: string): Array<{
  topic: ThematicTopicEntry;
  verse: VerifiedQuranVerse;
}> {
  const cleanQ = normalizeArabicForSearch(query);
  if (!cleanQ) return [];

  const results: Array<{ topic: ThematicTopicEntry; verse: VerifiedQuranVerse }> = [];

  for (const topic of ALL_THEMATIC_TOPICS) {
    const topicTitleNorm = normalizeArabicForSearch(topic.title);
    for (const verse of topic.verses) {
      const match =
        normalizeArabicForSearch(verse.verse_text).includes(cleanQ) ||
        normalizeArabicForSearch(verse.surah_name).includes(cleanQ) ||
        normalizeArabicForSearch(verse.tafsir_summary || "").includes(cleanQ) ||
        normalizeArabicForSearch(verse.ishari_benefit).includes(cleanQ) ||
        normalizeArabicForSearch(verse.practical_amal || "").includes(cleanQ) ||
        topicTitleNorm.includes(cleanQ) ||
        (verse.keywords || []).some((k) => normalizeArabicForSearch(k).includes(cleanQ));

      if (match) {
        results.push({ topic, verse });
      }
    }
  }

  return results;
}
