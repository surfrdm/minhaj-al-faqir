export interface VerifiedQuranVerse {
  id: string;
  verse_key: string; // Exact Warsh S:V key (matches src/data/tafsir & /api/quran/tafsir)
  verse_text: string; // Authentic Warsh Mushaf text
  surah_name: string;
  surah_number: number;
  verse_number: string; // Warsh verse display (e.g. "41-42" or "151")
  hafs_note?: string; // Concordance note when Hafs numbering differs
  hizb_number: number;
  page_number: number;
  tafsir_summary?: string; // Clear exegetical context & meaning
  ishari_benefit: string; // Sufi / Suluk spiritual & educational commentary
  practical_amal?: string; // Concrete daily practice for the seeker
  keywords?: string[];
}

export interface ThematicTopicEntry {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  color: string;
  thabit_id?: string;
  overview?: string;
  verses: VerifiedQuranVerse[];
}
