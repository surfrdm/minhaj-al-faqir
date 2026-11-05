import topicsData from "@/data/quran_thematic_topics.json";

export interface ThematicVerse {
  id: string;
  verse_text: string;
  surah_name: string;
  surah_number: number;
  verse_number: string;
  hizb_number: number;
  page_number: number;
  ishari_benefit: string;
  keywords: string[];
}

export interface ThematicTopic {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  color: string;
  thabit_id?: string;
  verses: ThematicVerse[];
}

export const ALL_THEMATIC_TOPICS: ThematicTopic[] = topicsData as ThematicTopic[];

/**
 * Returns all thematic topics
 */
export function getAllThematicTopics(): ThematicTopic[] {
  return ALL_THEMATIC_TOPICS;
}

/**
 * Finds a topic by ID
 */
export function getTopicById(id: string): ThematicTopic | undefined {
  return ALL_THEMATIC_TOPICS.find((t) => t.id === id);
}

/**
 * Total count of indexed verses across all topics
 */
export function getTotalThematicVersesCount(): number {
  return ALL_THEMATIC_TOPICS.reduce((sum, t) => sum + t.verses.length, 0);
}

/**
 * Search verses by query (text, surah, ishari explanation, or keywords)
 */
export function searchThematicVerses(query: string): Array<{
  topic: ThematicTopic;
  verse: ThematicVerse;
}> {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];

  const results: Array<{ topic: ThematicTopic; verse: ThematicVerse }> = [];

  for (const topic of ALL_THEMATIC_TOPICS) {
    for (const verse of topic.verses) {
      const match =
        verse.verse_text.toLowerCase().includes(cleanQ) ||
        verse.surah_name.toLowerCase().includes(cleanQ) ||
        verse.ishari_benefit.toLowerCase().includes(cleanQ) ||
        topic.title.toLowerCase().includes(cleanQ) ||
        verse.keywords.some((k) => k.toLowerCase().includes(cleanQ));

      if (match) {
        results.push({ topic, verse });
      }
    }
  }

  return results;
}
