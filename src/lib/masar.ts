import masarRaw from "@/data/masar.json";

export interface MasarBook {
  id: string;
  title: string | null;
  author: string | null;
  level: string;
  essential: boolean;
  edition: string | null;
  editor: string | null;
  note: string | null;
  status: "pending_committee" | "approved" | "rejected";
}

export interface MasarStage {
  id: number;
  slug: string;
  title: string;
  duration: string;
  goal: string;
  practice: string[];
  review_questions: string[];
  books: MasarBook[];
}

export interface MasarMeta {
  title: string;
  version: string;
  last_updated: string;
  notice: string;
  visibility_rule: string;
  status_values: string[];
  level_values: Record<string, string>;
  acceptance_criteria: string[];
  excluded_categories: string[];
}

export interface MasarData {
  meta: MasarMeta;
  stages: MasarStage[];
}

export const MASAR_DATA: MasarData = masarRaw as unknown as MasarData;

/**
 * Filter approved books only, per strict visibility rule
 */
export function getApprovedBooks(stage: MasarStage): MasarBook[] {
  return stage.books.filter((b) => b.status === "approved");
}
