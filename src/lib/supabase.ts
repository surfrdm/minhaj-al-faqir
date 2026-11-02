import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-minhaj.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseConfigured = () => {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-minhaj.supabase.co"
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DiscipleRecord {
  id: string;
  nom: string;
  ville: string;
  telephone: string;
  moqaddem_referent?: string;
  role: "faqir" | "moqaddem" | "admin";
  created_at?: string;
}

export interface SuiviWirdRecord {
  id?: string;
  disciple_id: string;
  date_jour: string; // YYYY-MM-DD
  wird_matin: boolean;
  wird_soir: boolean;
  hizb_quran_matin: boolean;
  hizb_quran_soir: boolean;
  dalail_khayrat: boolean;
  hailala_15k: boolean;
  wazifa_attended: boolean;
  score_pct: number;
}

export interface SuiviMasarRecord {
  id?: string;
  disciple_id: string;
  etape_numero: number; // 1 to 6
  complete: boolean;
  date_completion?: string;
}
