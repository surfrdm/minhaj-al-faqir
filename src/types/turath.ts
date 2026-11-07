export type TurathSource = 'bukhari' | 'shifa';
export type LanguageView = 'ar' | 'fr' | 'en' | 'all';

export interface TurathItem {
  id: string;
  source: TurathSource;
  bookTitle: string;
  chapter: string;
  number?: number;
  narrator?: string;
  text_ar: string;
  sharh_maliki: {
    scholar: string;
    book: string;
    text: string;
  };
  translations: {
    fr?: { text: string };
    en?: { text: string };
  };
  tags: string[];
}
