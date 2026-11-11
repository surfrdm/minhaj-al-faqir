'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Library,
  Search,
  Share2,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import defaultRijalData from '@/data/rijal_hawl_rasul.json';
import type {
  ClassicalBookSlug,
  RijalCategoryId,
  RijalCompanion,
  RijalDataset,
} from '@/types/turath-books';

interface RijalHawlRasulSectionProps {
  data?: RijalDataset;
  isEmbedded?: boolean;
  onOpenHeritageLookup?: (book: ClassicalBookSlug, query: string) => void;
}

const ITEMS_PER_PAGE = 12;

function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[«»"'()\[\]{}،؛:.؟!\-\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function RijalHawlRasulSection({
  data,
  isEmbedded = false,
  onOpenHeritageLookup,
}: RijalHawlRasulSectionProps) {
  const dataset = (data ?? (defaultRijalData as RijalDataset));

  const [selectedCategory, setSelectedCategory] = useState<RijalCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showIntro, setShowIntro] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: dataset.companions.length };
    for (const c of dataset.companions) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
    return counts;
  }, [dataset.companions]);

  const filteredCompanions = useMemo(() => {
    const q = searchQuery.trim();
    const normQ = normalizeArabic(q);
    const tokens = normQ.split(' ').filter((t) => t.length > 0);
    const isNumeric = /^\d+$/.test(q);
    const targetRank = isNumeric ? parseInt(q, 10) : null;

    return dataset.companions.filter((comp) => {
      if (selectedCategory !== 'all' && comp.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      if (targetRank !== null) {
        return comp.rank === targetRank;
      }
      const haystack = normalizeArabic(
        `${comp.name_ar} ${comp.epithet_ar} ${comp.kunya_or_lineage_ar} ${comp.category_label} ${comp.bio_summary} ${comp.sufi_lesson} ${comp.authentic_anchor}`
      );
      return tokens.every((tok) => haystack.includes(tok));
    });
  }, [dataset.companions, selectedCategory, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCompanions.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);

  const pagedCompanions = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredCompanions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCompanions, safePage]);

  const handleCopyCompanion = (comp: RijalCompanion) => {
    const formatted =
      `${comp.rank}. ${comp.name_ar} — ${comp.epithet_ar}\n` +
      `(${comp.kunya_or_lineage_ar})\n\n` +
      `• السيرة:\n${comp.bio_summary}\n\n` +
      `• اللطيفة التربوية والسلوكية:\n${comp.sufi_lesson}\n\n` +
      `• المستند الموثق:\n${comp.authentic_anchor}\n\n` +
      `— [منصة منهاج الفقير • مدارسة سير الصحابة (رجال حول الرسول ﷺ)]`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(comp.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsapp = (comp: RijalCompanion) => {
    const shareOrigin =
      typeof window !== 'undefined' ? window.location.origin : '';
    const text =
      `✦ من مدارسة «رجال حول الرسول ﷺ» في منهاج الفقير:\n` +
      `*${comp.rank}. ${comp.name_ar}*\n` +
      `_${comp.epithet_ar}_\n\n` +
      `${comp.sufi_lesson}\n\n` +
      `طالع الترجمة والتخريج الكامل: ${shareOrigin}/maktaba#rijal`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const renderHeritageButton = (
    book: ClassicalBookSlug,
    label: string,
    query: string
  ) => {
    const className =
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 hover:border-[#C5A059] text-[#143628] dark:text-[#E5C378] text-xs font-bold transition shadow-xs cursor-pointer';

    if (onOpenHeritageLookup) {
      return (
        <button
          type="button"
          onClick={() => onOpenHeritageLookup(book, query)}
          className={className}
        >
          <Library className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>{label}</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      );
    }

    return (
      <Link
        href={`/turath?source=${book}&q=${encodeURIComponent(query)}`}
        className={className}
      >
        <Library className="w-3.5 h-3.5 text-[#C5A059]" />
        <span>{label}</span>
        <ChevronLeft className="w-3.5 h-3.5" />
      </Link>
    );
  };

  return (
    <div id="rijal" className="space-y-6" dir="rtl">
      {/* الترويسة السلوكية والعلمية */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-l from-[#143628] via-[#1B4332] to-[#0E271D] text-white border border-[#C5A059]/45 shadow-md space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5C378] bg-[#C5A059]/20 px-3 py-1 rounded-full border border-[#C5A059]/40">
              <Users className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>60 عَلَماً • قراءة صوفية وأكاديمية ميسَّرة</span>
            </span>
            <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#FAF7F2] leading-snug">
              {dataset.title_ar}
            </h2>
            <p className="text-xs sm:text-sm text-[#D5E2DB] font-ibm leading-relaxed max-w-3xl">
              {dataset.subtitle_ar}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowIntro((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-[#E5C378] transition cursor-pointer shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showIntro ? 'طيّ المقدمة المنهجية' : 'المقدمة المنهجية'}</span>
            {showIntro ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <p className="text-xs text-[#E5C378]/95 bg-black/20 rounded-xl p-3 border border-[#C5A059]/25 leading-relaxed">
          ✦ {dataset.methodology_note_ar}
        </p>

        {showIntro && (
          <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm leading-loose text-[#FAF7F2]">
            {dataset.intro_ar}
          </div>
        )}

        {/* روابط سريعة لأمهات كتب التراجم في الموقع */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10 text-xs">
          <span className="text-[#D5E2DB] font-semibold">
            المصادر التراثية الكاملة بالموقع:
          </span>
          {onOpenHeritageLookup ? (
            <>
              <button
                type="button"
                onClick={() => onOpenHeritageLookup('safwat', '')}
                className="px-2.5 py-1 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/35 text-[#E5C378] font-bold transition cursor-pointer"
              >
                صفة الصفوة (1108) ←
              </button>
              <button
                type="button"
                onClick={() => onOpenHeritageLookup('hilya', '')}
                className="px-2.5 py-1 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/35 text-[#E5C378] font-bold transition cursor-pointer"
              >
                حلية الأولياء (10 مجلدات) ←
              </button>
              <button
                type="button"
                onClick={() => onOpenHeritageLookup('isaba', '')}
                className="px-2.5 py-1 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/35 text-[#E5C378] font-bold transition cursor-pointer"
              >
                الإصابة في تمييز الصحابة (12307) ←
              </button>
            </>
          ) : (
            <>
              <Link
                href="/turath?source=safwat"
                className="px-2.5 py-1 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/35 text-[#E5C378] font-bold transition"
              >
                صفة الصفوة (1108) ←
              </Link>
              <Link
                href="/turath?source=hilya"
                className="px-2.5 py-1 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/35 text-[#E5C378] font-bold transition"
              >
                حلية الأولياء (10 مجلدات) ←
              </Link>
              <Link
                href="/turath?source=isaba"
                className="px-2.5 py-1 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/35 text-[#E5C378] font-bold transition"
              >
                الإصابة لابن حجر (12307) ←
              </Link>
            </>
          )}
        </div>
      </div>

      {/* شريط البحث والتصنيف بحسب المسالك التربوية */}
      <div
        className={`rounded-2xl p-4 border border-[#C5A059]/30 shadow-sm space-y-3 ${
          isEmbedded
            ? 'bg-[#FAF7F2] dark:bg-[#122820]'
            : 'bg-white dark:bg-[#122820]'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="ابحث في تراجم الستين صحابياً"
              placeholder="ابحث باسم الصحابي أو رقمه (1-60) أو بمعنى تربوي مثل: الزهد، الأمانة، الصدق..."
              className="w-full pr-10 pl-10 py-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#07130E] text-sm text-[#143628] dark:text-[#E8F0EC] placeholder-gray-400 focus:outline-none focus:border-[#C5A059] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                aria-label="مسح البحث"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#143628]/10 dark:bg-[#C5A059]/15 text-[#143628] dark:text-[#E5C378] text-xs font-bold font-mono tabular-nums shrink-0 text-center">
            {filteredCompanions.length} صحابياً
          </div>
        </div>

        {/* أزرار المقامات التربوية الخمسة */}
        <div className="flex flex-wrap items-center gap-1.5">
          {dataset.categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#143628] text-white shadow-sm ring-1 ring-[#C5A059]'
                    : 'bg-white dark:bg-[#07130E] text-[#143628] dark:text-[#D5E2DB] border border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]'
                }`}
              >
                <span>{cat.label}</span>
                {cat.id !== 'all' && (
                  <span
                    className={`font-mono tabular-nums text-[11px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#C5A059] text-[#143628]'
                        : 'bg-[#FAF7F2] dark:bg-[#122820] text-[#8F7032] dark:text-[#E5C378]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* بطاقات الصحابة */}
      {pagedCompanions.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white dark:bg-[#122820] rounded-2xl border border-dashed border-[#C5A059]/40 text-sm text-gray-500 dark:text-gray-400 space-y-3">
          <p>لم يُعثر على ترجمة مطابقة للبحث في هذه الفئة.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-xl bg-[#143628] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer"
          >
            عرض جميع الصحابة (60)
          </button>
        </div>
      ) : (
        <div className="grid gap-5">
          {pagedCompanions.map((comp) => (
            <article
              key={comp.id}
              className="bg-white dark:bg-[#122820] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]/60 transition-all space-y-4"
            >
              {/* رأس البطاقة */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3.5 border-b border-gray-100 dark:border-[#203A2F]">
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-xl bg-[#143628] text-[#E5C378] border border-[#C5A059]/50 flex items-center justify-center font-mono tabular-nums text-sm font-bold shrink-0 shadow-xs">
                    {comp.rank}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-snug">
                      {comp.name_ar}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#8F7032] dark:text-[#E5C378]">
                      {comp.epithet_ar}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                      <span className="text-[#52796F] dark:text-[#9BB0A5]">
                        {comp.kunya_or_lineage_ar}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#C5A059]/15 text-[#8F7032] dark:text-[#E5C378] font-semibold">
                        {comp.category_label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* أزرار النسخ والمشاركة */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyCompanion(comp)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203A2F] text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#C5A059] transition cursor-pointer"
                    title="نسخ الترجمة والتأمل السلوكي"
                  >
                    {copiedId === comp.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareWhatsapp(comp)}
                    className="p-1.5 rounded-lg bg-[#25D366]/12 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] transition cursor-pointer"
                    title="مشاركة عبر واتساب"
                    aria-label="مشاركة عبر واتساب"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 1. السيرة التاريخية المختصرة */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#52796F] dark:text-[#9BB0A5]">
                  السيرة والوقائع المحققة:
                </h4>
                <p className="text-sm sm:text-base text-[#1D2A24] dark:text-[#E8F0EC] font-ibm leading-relaxed">
                  {comp.bio_summary}
                </p>
              </div>

              {/* 2. اللطيفة التربوية والبعد السلوكي */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-[#162A22] border-r-4 border-[#C5A059] border border-amber-200/50 dark:border-[#203A2F] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#8F7032] dark:text-[#E5C378]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>الدلالة التربوية واللطيفة السلوكية:</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1D2A24] dark:text-[#D5E2DB] leading-relaxed font-ibm">
                  {comp.sufi_lesson}
                </p>
              </div>

              {/* 3. المستند الموثق + رابط ترجمته التراثية */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1E17] border border-[#E7DFD5] dark:border-[#203D31] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] block">
                    ❖ المستند الموثق:
                  </span>
                  <p className="text-xs text-[#52796F] dark:text-[#A1B3A9] leading-relaxed">
                    {comp.authentic_anchor}
                  </p>
                </div>
                <div className="shrink-0 self-start sm:self-center">
                  {renderHeritageButton(
                    'isaba',
                    'ترجمته في الإصابة لابن حجر',
                    comp.lookup_query
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* شريط التنقل بين الصفحات */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-[#122820] rounded-2xl p-4 border border-[#E7DFD5] dark:border-[#203A2F] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              document
                .getElementById('rijal')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/30 text-xs font-bold text-[#143628] dark:text-[#E5C378] disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            <span>الصفحة السابقة</span>
          </button>

          <span className="text-xs font-bold font-mono tabular-nums text-[#143628] dark:text-[#E5C378]">
            صفحة {safePage} من {totalPages}
          </span>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              document
                .getElementById('rijal')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#143628] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
          >
            <span>الصفحة التالية</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
