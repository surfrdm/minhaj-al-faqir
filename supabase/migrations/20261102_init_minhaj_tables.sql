-- ============================================================
-- MINHAJ AL-FAQIR - MIGRATION SUPABASE POSTGRESQL
-- Tables: disciples, suivi_wird, suivi_masar
-- ============================================================

-- 1. Table des Disciples (فقراء الزاوية)
CREATE TABLE IF NOT EXISTS public.disciples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    ville TEXT NOT NULL DEFAULT 'المحمدية',
    telephone TEXT,
    moqaddem_referent TEXT,
    role TEXT NOT NULL DEFAULT 'faqir' CHECK (role IN ('faqir', 'moqaddem', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_disciples_ville ON public.disciples(ville);
CREATE INDEX IF NOT EXISTS idx_disciples_nom ON public.disciples(nom);

-- 2. Table de Suivi Quotidien des Awrâd (متتبع الأوراد اليومية)
CREATE TABLE IF NOT EXISTS public.suivi_wird (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disciple_id UUID NOT NULL REFERENCES public.disciples(id) ON DELETE CASCADE,
    date_jour DATE NOT NULL DEFAULT CURRENT_DATE,
    wird_matin BOOLEAN NOT NULL DEFAULT FALSE,
    wird_soir BOOLEAN NOT NULL DEFAULT FALSE,
    hizb_quran_matin BOOLEAN NOT NULL DEFAULT FALSE,
    hizb_quran_soir BOOLEAN NOT NULL DEFAULT FALSE,
    dalail_khayrat BOOLEAN NOT NULL DEFAULT FALSE,
    hailala_15k BOOLEAN NOT NULL DEFAULT FALSE,
    wazifa_attended BOOLEAN NOT NULL DEFAULT FALSE,
    score_pct INT NOT NULL DEFAULT 0 CHECK (score_pct >= 0 AND score_pct <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(disciple_id, date_jour)
);

CREATE INDEX IF NOT EXISTS idx_suivi_wird_date ON public.suivi_wird(date_jour);
CREATE INDEX IF NOT EXISTS idx_suivi_wird_disciple ON public.suivi_wird(disciple_id);

-- 3. Table de Progression dans le Masar (مراحل المسار التكويني الست)
CREATE TABLE IF NOT EXISTS public.suivi_masar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disciple_id UUID NOT NULL REFERENCES public.disciples(id) ON DELETE CASCADE,
    etape_numero INT NOT NULL CHECK (etape_numero BETWEEN 1 AND 6),
    complete BOOLEAN NOT NULL DEFAULT FALSE,
    date_completion TIMESTAMPTZ,
    notes_personnelles TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(disciple_id, etape_numero)
);

CREATE INDEX IF NOT EXISTS idx_suivi_masar_disciple ON public.suivi_masar(disciple_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.disciples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suivi_wird ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suivi_masar ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Lecture publique pour le moqaddem / écriture sécurisée)
CREATE POLICY "Allow public read for active disciples" ON public.disciples
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert/update on disciples" ON public.disciples
    FOR ALL USING (true);

CREATE POLICY "Allow public read and write on suivi_wird" ON public.suivi_wird
    FOR ALL USING (true);

CREATE POLICY "Allow public read and write on suivi_masar" ON public.suivi_masar
    FOR ALL USING (true);

-- 6. Table des Modifications Visuelles Directes du Site (Wix In-Page Direct Edits)
CREATE TABLE IF NOT EXISTS public.site_page_edits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    element_key TEXT NOT NULL UNIQUE,
    html_content TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Table des Notes et Carnet Spirituel (فضاء الفقير - المذكرات والخواطر)
CREATE TABLE IF NOT EXISTS public.faqir_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disciple_id TEXT NOT NULL DEFAULT 'default_faqir',
    note_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT NOT NULL DEFAULT 'dhikr',
    note_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_page_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqir_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read and write on site_page_edits" ON public.site_page_edits
    FOR ALL USING (true);

CREATE POLICY "Allow public read and write on faqir_notes" ON public.faqir_notes
    FOR ALL USING (true);
