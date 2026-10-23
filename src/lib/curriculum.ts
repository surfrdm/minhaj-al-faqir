import curriculumData from "@/data/curriculum.json";
import rawGlossary from "@/data/glossary.json";

export interface CurriculumBook {
  name: string;
  author: string;
  why_read: string;
  benefit: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  summary: string;
  level?: string;
  evidence?: string[];
  key_takeaways?: string[];
  books?: CurriculumBook[];
}

export interface CurriculumTrack {
  id: string;
  slug: string;
  step: number;
  badge: string;
  title: string;
  subtitle: string;
  quote: string;
  description: string;
  modules: CurriculumModule[];
}

export type CurriculumGate = CurriculumTrack;

export interface GlossaryItem {
  term: string;
  plural: string;
  category: string;
  definition: string;
  quote: string;
}

export const ACADEMY_TITLE = curriculumData.academy_title || "مِنْهَاجُ الفَقِير";
export const ACADEMY_SUBTITLE =
  curriculumData.academy_subtitle || "الأكاديمية التكوينية والتأصيلية لسالكي الطريقة القادرية البودشيشية";

export const CURRICULUM_TRACKS: CurriculumTrack[] = (curriculumData.tracks || (curriculumData as any).curriculum) as CurriculumTrack[];
export const CURRICULUM_GATES = CURRICULUM_TRACKS;

export const GLOSSARY_ITEMS: GlossaryItem[] = rawGlossary as GlossaryItem[];
