export type ClassicalBookSlug = 'safwat' | 'hilya' | 'isaba';

export interface TurathBookChunkMeta {
  bookSlug: ClassicalBookSlug;
  bookTitle_ar: string;
  author_ar: string;
  chunkId: number;
  chunkLabel: string;
  subGroup: string;
  entryCount: number;
  pageRange: string;
}

export interface TurathBookEntry {
  id: string;
  chunkId: number;
  orderInChunk: number;
  entryNumber?: string;
  title_ar: string;
  sectionPath_ar: string;
  pageRef?: string;
  text_ar: string;
  isExcerpt?: boolean;
  fullCharCount?: number;
}

export interface TurathBookOverview {
  slug: ClassicalBookSlug;
  title_ar: string;
  subtitle_ar: string;
  author_ar: string;
  deathHijri: string;
  eraNote_ar: string;
  scholarlyNote_ar: string;
  totalEntries: number;
  totalChunks: number;
  compressedBytes: number;
  chunks: TurathBookChunkMeta[];
}

export interface TurathBooksIndexData {
  books: TurathBookOverview[];
  totalEntries: number;
}

export interface TurathBookPageResponse {
  book: ClassicalBookSlug;
  meta: TurathBookChunkMeta;
  page: number;
  limit: number;
  totalEntries: number;
  totalPages: number;
  entries: TurathBookEntry[];
}

export interface TurathBookSearchHit {
  chunkId: number;
  chunkLabel: string;
  entry: TurathBookEntry;
}

export interface TurathBookSearchResponse {
  book: ClassicalBookSlug;
  query: string;
  chunkFilter: number | 'all';
  totalMatches: number;
  truncated: boolean;
  results: TurathBookSearchHit[];
}

export type RijalCategoryId = 'all' | 'zuhd' | 'fida' | 'ilm' | 'ihsan' | 'qiyada';

export interface RijalCategory {
  id: RijalCategoryId;
  label: string;
}

export interface RijalCompanion {
  rank: number;
  id: string;
  name_ar: string;
  epithet_ar: string;
  kunya_or_lineage_ar: string;
  category: Exclude<RijalCategoryId, 'all'>;
  category_label: string;
  bio_summary: string;
  sufi_lesson: string;
  authentic_anchor: string;
  lookup_query: string;
}

export interface RijalDataset {
  title_ar: string;
  subtitle_ar: string;
  methodology_note_ar: string;
  intro_ar: string;
  categories: RijalCategory[];
  companions: RijalCompanion[];
}
