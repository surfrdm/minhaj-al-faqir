'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Filter,
  Loader2,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import type {
  ClassicalBookSlug,
  TurathBookEntry,
  TurathBookOverview,
  TurathBookPageResponse,
  TurathBookSearchHit,
} from '@/types/turath-books';

interface ClassicalBookReaderProps {
  overview: TurathBookOverview;
  initialQuery?: string;
}

const ITEMS_PER_PAGE = 25;
const COLLAPSE_THRESHOLD_CHARS = 3400;

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildHighlightRegex(query: string): RegExp | null {
  const clean = query
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[«»"'()\[\]{}،؛:.؟!\-\/◆❖]/g, ' ')
    .trim();
  if (clean.length < 2) return null;

  const rawTokens = clean
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .slice(0, 5);
  if (rawTokens.length === 0) return null;

  const diacriticsGap = '[\\u064B-\\u065F\\u0670\\u0640]*';

  const patterns = rawTokens.map((tok) => {
    const isArabic = /[\u0600-\u06FF]/.test(tok);
    if (!isArabic) return escapeRegExp(tok);
    return Array.from(tok)
      .map((ch) => {
        if ('اأإآٱ'.includes(ch)) return '[اأإآٱ]';
        if ('ىي'.includes(ch)) return '[ىي]';
        if ('هة'.includes(ch)) return '[هة]';
        return escapeRegExp(ch);
      })
      .join(diacriticsGap);
  });

  try {
    return new RegExp(`(${patterns.join('|')})`, 'gi');
  } catch {
    return null;
  }
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const regex = useMemo(() => buildHighlightRegex(query), [query]);
  if (!regex || !text) return <>{text}</>;
  const parts = text.split(regex);
  if (parts.length <= 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, idx) =>
        idx % 2 === 1 ? (
          <mark
            key={idx}
            className="bg-[#C5A059]/30 dark:bg-[#C5A059]/40 text-inherit px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={idx}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export function ClassicalBookReader({
  overview,
  initialQuery = '',
}: ClassicalBookReaderProps) {
  const slug: ClassicalBookSlug = overview.slug;
  const trimmedInit = initialQuery.trim();

  const [selectedChunkId, setSelectedChunkId] = useState<number>(0);
  const [browsePage, setBrowsePage] = useState<number>(1);
  const [browseData, setBrowseData] = useState<TurathBookPageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!trimmedInit);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState<string>(trimmedInit);
  const [activeQuery, setActiveQuery] = useState<string>(trimmedInit);
  const [searchScope, setSearchScope] = useState<'all' | 'chunk'>('all');
  const [isSearching, setIsSearching] = useState<boolean>(Boolean(trimmedInit));
  const [searchResults, setSearchResults] = useState<{
    totalMatches: number;
    truncated: boolean;
    results: TurathBookSearchHit[];
  } | null>(null);
  const [searchPage, setSearchPage] = useState<number>(1);

  const [expandedLong, setExpandedLong] = useState<Record<string, boolean>>({});
  const [fetchedFullEntries, setFetchedFullEntries] = useState<
    Record<string, TurathBookEntry>
  >({});
  const [loadingEntryId, setLoadingEntryId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [scrollToEntryId, setScrollToEntryId] = useState<string | null>(null);

  const browseCacheRef = useRef<Map<string, TurathBookPageResponse>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readerTopRef = useRef<HTMLDivElement>(null);

  const selectedChunkMeta = useMemo(() => {
    return (
      overview.chunks.find((c) => c.chunkId === selectedChunkId) ??
      overview.chunks[0]
    );
  }, [overview.chunks, selectedChunkId]);

  const scrollToReaderTop = () => {
    readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fetchBrowsePage = useCallback(
    async (chunkId: number, page: number) => {
      const key = `${slug}:${chunkId}:${page}`;
      const cached = browseCacheRef.current.get(key);
      if (cached) {
        setBrowseData(cached);
        setIsLoading(false);
        setLoadError(null);
        return;
      }

      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(
          `/api/turath-books?book=${slug}&chunk=${chunkId}&page=${page}&limit=${ITEMS_PER_PAGE}`
        );
        if (!res.ok) throw new Error('تعذر تحميل نصوص القسم');
        const payload = (await res.json()) as TurathBookPageResponse;
        if (browseCacheRef.current.size >= 24) {
          const oldest = browseCacheRef.current.keys().next().value;
          if (oldest) browseCacheRef.current.delete(oldest);
        }
        browseCacheRef.current.set(key, payload);
        setBrowseData(payload);
      } catch {
        setLoadError('حدث خطأ أثناء تحميل نصوص الكتاب. يرجى المحاولة مرة أخرى.');
      } finally {
        setIsLoading(false);
      }
    },
    [slug]
  );

  const executeSearch = useCallback(
    async (rawQuery: string, scope: 'all' | 'chunk', chunkId: number) => {
      const q = rawQuery.trim();
      if (!q) {
        if (abortRef.current) {
          abortRef.current.abort();
          abortRef.current = null;
        }
        setActiveQuery('');
        setSearchResults(null);
        setIsSearching(false);
        setLoadError(null);
        return;
      }

      if (q.length < 2 && !/^\d+$/.test(q)) {
        return;
      }

      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setIsSearching(true);
      setLoadError(null);
      setActiveQuery(q);
      setSearchPage(1);

      try {
        const params = new URLSearchParams();
        params.set('book', slug);
        params.set('q', q);
        params.set('chunk', scope === 'chunk' ? String(chunkId) : 'all');

        const res = await fetch(`/api/turath-books?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('تعذر تنفيذ البحث');
        const payload = await res.json();
        if (controller.signal.aborted) return;

        setSearchResults({
          totalMatches: payload.totalMatches,
          truncated: payload.truncated,
          results: payload.results,
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setLoadError('تعذر تنفيذ البحث حالياً. يرجى المحاولة مرة أخرى.');
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    },
    [slug]
  );

  // Initial search if opened with an incoming lookup query & cleanup on unmount
  useEffect(() => {
    let cancelled = false;
    if (trimmedInit) {
      queueMicrotask(() => {
        if (!cancelled) {
          executeSearch(trimmedInit, 'all', 0);
        }
      });
    }
    return () => {
      cancelled = true;
      if (abortRef.current) abortRef.current.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, trimmedInit]);

  // Trigger browse load when in browse mode or changing chunk/page
  useEffect(() => {
    if (activeQuery) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        fetchBrowsePage(selectedChunkId, browsePage);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeQuery, selectedChunkId, browsePage, fetchBrowsePage]);

  // Optional scroll target after jumping from a search result into the book
  useEffect(() => {
    if (!scrollToEntryId || isLoading || !browseData) return;
    const target = document.getElementById(`entry-${scrollToEntryId}`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setScrollToEntryId(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [scrollToEntryId, isLoading, browseData]);

  // Live debounced search when input/scope changes
  const skipFirstDebounceRef = useRef<boolean>(Boolean(trimmedInit));
  useEffect(() => {
    if (skipFirstDebounceRef.current) {
      skipFirstDebounceRef.current = false;
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    const q = searchInput.trim();
    const isValidNumeric = /^\d+$/.test(q) && searchScope === 'chunk';
    if (!q || (q.length < 2 && !isValidNumeric)) {
      return;
    }
    debounceRef.current = setTimeout(() => {
      executeSearch(q, searchScope, selectedChunkId);
    }, 320);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput, searchScope, selectedChunkId, executeSearch]);

  const clearSearch = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setSearchInput('');
    setActiveQuery('');
    setSearchResults(null);
    setIsSearching(false);
    setLoadError(null);
    setSearchPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    const q = searchInput.trim();
    if (!q) {
      clearSearch();
      return;
    }
    if (q.length < 2 && !/^\d+$/.test(q)) {
      setLoadError('أدخل حرفين على الأقل للبحث، أو رقم ترجمة صحيح داخل القسم.');
      return;
    }
    executeSearch(q, searchScope, selectedChunkId);
  };

  const handleChunkChange = (newChunkId: number) => {
    setSelectedChunkId(newChunkId);
    setBrowsePage(1);
    if (searchInput.trim().length > 0 && searchScope === 'chunk') {
      executeSearch(searchInput.trim(), 'chunk', newChunkId);
    }
  };

  const handleJumpToEntryInBook = (hit: TurathBookSearchHit) => {
    clearSearch();
    const targetPage = Math.max(
      1,
      Math.floor((hit.entry.orderInChunk - 1) / ITEMS_PER_PAGE) + 1
    );
    setSelectedChunkId(hit.chunkId);
    setBrowsePage(targetPage);
    setScrollToEntryId(hit.entry.id);
  };

  const handleFetchFullEntry = async (entry: TurathBookEntry) => {
    if (fetchedFullEntries[entry.id]) {
      setExpandedLong((prev) => ({ ...prev, [entry.id]: true }));
      return;
    }
    setLoadingEntryId(entry.id);
    try {
      const res = await fetch(
        `/api/turath-books?book=${slug}&chunk=${entry.chunkId}&entryId=${encodeURIComponent(entry.id)}`
      );
      if (!res.ok) throw new Error('تعذر جلب النص كاملاً');
      const payload = (await res.json()) as { entry: TurathBookEntry };
      setFetchedFullEntries((prev) => ({ ...prev, [entry.id]: payload.entry }));
      setExpandedLong((prev) => ({ ...prev, [entry.id]: true }));
    } catch {
      setLoadError('تعذر جلب كامل الترجمة، يرجى فتح موضعها في الكتاب.');
    } finally {
      setLoadingEntryId(null);
    }
  };

  const handleCopy = (entry: TurathBookEntry, chunkLabel: string) => {
    const resolved = fetchedFullEntries[entry.id] ?? entry;
    const refLabel = `${overview.title_ar} • ${chunkLabel}${resolved.pageRef ? ` • ${resolved.pageRef}` : ''}`;
    navigator.clipboard.writeText(`${resolved.title_ar}\n\n${resolved.text_ar}\n\n— [${refLabel}]`);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const pagedSearchHits = useMemo(() => {
    if (!searchResults) return [];
    const start = (searchPage - 1) * ITEMS_PER_PAGE;
    return searchResults.results.slice(start, start + ITEMS_PER_PAGE);
  }, [searchResults, searchPage]);

  const totalPages = activeQuery
    ? Math.max(1, Math.ceil((searchResults?.results.length ?? 0) / ITEMS_PER_PAGE))
    : Math.max(1, browseData?.totalPages ?? 1);
  const activePageNum = activeQuery
    ? Math.min(searchPage, totalPages)
    : Math.min(browsePage, totalPages);

  const scopeLabel =
    searchScope === 'chunk' && selectedChunkMeta
      ? `داخل: ${selectedChunkMeta.chunkLabel}`
      : `كامل الكتاب (${overview.totalEntries.toLocaleString('en-US')} نصاً وترجمةً)`;

  const displayedItems: Array<{
    chunkLabel: string;
    entry: TurathBookEntry;
  }> = activeQuery
    ? pagedSearchHits.map((hit) => ({
        chunkLabel: hit.chunkLabel,
        entry: fetchedFullEntries[hit.entry.id] ?? hit.entry,
      }))
    : (browseData?.entries ?? []).map((entry) => ({
        chunkLabel: browseData?.meta.chunkLabel ?? selectedChunkMeta?.chunkLabel ?? '',
        entry: fetchedFullEntries[entry.id] ?? entry,
      }));

  return (
    <div ref={readerTopRef} className="space-y-5" dir="rtl">
      {/* لوحة البحث والفلاتر داخل الكتاب التراثي */}
      <div className="bg-white dark:bg-[#122820] rounded-2xl p-4 sm:p-5 shadow-md border-2 border-[#C5A059]/35 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E7DFD5] dark:border-[#203A2F]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#143628] text-[#C5A059] flex items-center justify-center shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#143628] dark:text-[#E8F0EC]">
                محرك البحث والتصفح داخل «{overview.title_ar}»
              </h2>
              <p className="text-[11px] sm:text-xs text-[#52796F] dark:text-[#9BB0A5]">
                النطاق الحالي:{' '}
                <span className="font-bold text-[#8F7032] dark:text-[#E5C378]">
                  {scopeLabel}
                </span>
              </p>
            </div>
          </div>

          {(searchInput || searchScope !== 'all') && (
            <button
              type="button"
              onClick={() => {
                clearSearch();
                setSearchScope('all');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 text-[#8F7032] dark:text-[#E5C378] hover:bg-[#C5A059]/15 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة الضبط</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => {
                const v = e.target.value;
                setSearchInput(v);
                if (!v.trim()) {
                  clearSearch();
                }
              }}
              aria-label={`ابحث في ${overview.title_ar}`}
              placeholder={
                slug === 'isaba'
                  ? 'ابحث باسم الصحابي (مثل: بلال بن رباح، خبيب، عائشة) أو عبارة في كامل المجلدات...'
                  : slug === 'hilya'
                  ? 'ابحث باسم العَلَم (مثل: الجنيد، المحاسبي، البسطامي، إبراهيم بن أدهم) أو عبارة في العشرة مجلدات...'
                  : 'ابحث باسم العَلَم أو المدينة (مثل: المغرب، البصرة، أويس القرني) أو كلمة...'
              }
              className="w-full pr-10 pl-10 py-3 rounded-xl border-2 border-[#C5A059]/30 dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#07130E] text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#C5A059] transition"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                title="مسح البحث"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-white text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shrink-0 shadow-sm"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
            ) : (
              <Search className="w-4 h-4 text-[#C5A059]" />
            )}
            <span>بحث في الكتاب</span>
          </button>
        </form>

        {/* اختيار القسم / الحرف / المجلد + نطاق البحث */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#8F7032] dark:text-[#E5C378] mb-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>
                {slug === 'hilya'
                  ? `اختيار المجلد (1 - ${overview.totalChunks}):`
                  : slug === 'isaba'
                  ? `اختيار الحرف أو القسم (${overview.totalChunks}):`
                  : `اختيار القسم أو القطر (${overview.totalChunks}):`}
              </span>
            </label>
            <select
              value={selectedChunkId}
              onChange={(e) => handleChunkChange(Number(e.target.value))}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#07130E] text-sm font-medium text-[#143628] dark:text-[#E8F0EC] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            >
              {overview.chunks.map((c) => (
                <option key={c.chunkId} value={c.chunkId}>
                  {c.chunkId}. {c.chunkLabel} ({c.entryCount.toLocaleString('en-US')})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <span className="text-xs font-bold text-[#52796F] dark:text-[#9BB0A5] mb-1.5">
              نطاق البحث النصي:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchScope('all')}
                className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  searchScope === 'all'
                    ? 'bg-[#143628] text-white shadow-xs'
                    : 'bg-[#FAF7F2] dark:bg-[#07130E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#203A2F] hover:border-[#C5A059]'
                }`}
              >
                كامل الكتاب ({overview.totalEntries.toLocaleString('en-US')})
              </button>
              <button
                type="button"
                onClick={() => setSearchScope('chunk')}
                className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  searchScope === 'chunk'
                    ? 'bg-[#C5A059] text-[#143628] shadow-xs'
                    : 'bg-[#FAF7F2] dark:bg-[#07130E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#203A2F] hover:border-[#C5A059]'
                }`}
              >
                هذا القسم فقط
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* بطاقة تعريف الكتاب / نتائج البحث */}
      {activeQuery ? (
        <div className="bg-amber-50/80 dark:bg-[#162A22] border border-[#C5A059]/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="text-sm space-y-0.5">
            <div>
              <span className="font-bold text-[#143628] dark:text-[#E5C378]">
                نتائج البحث عن «{activeQuery}»:{' '}
              </span>
              <span className="font-semibold text-[#8F7032] dark:text-[#E5C378] font-mono tabular-nums">
                {searchResults
                  ? `${searchResults.totalMatches.toLocaleString('en-US')} نتيجة${
                      searchResults.truncated
                        ? ` (أول ${searchResults.results.length} — مرتبة بتقديم العناوين المطابقة)`
                        : ''
                    }`
                  : ''}
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              النطاق: {scopeLabel}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {searchScope !== 'all' && (
              <button
                type="button"
                onClick={() => setSearchScope('all')}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#143628] text-white hover:bg-[#1B4332] cursor-pointer"
              >
                توسيع لكامل الكتاب
              </button>
            )}
            <button
              type="button"
              onClick={clearSearch}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-[#0B1E17] border border-[#C5A059]/40 text-[#143628] dark:text-[#E5C378] hover:bg-[#C5A059]/10 cursor-pointer"
            >
              مسح البحث والعودة للقراءة
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-l from-[#143628] to-[#0E271D] text-white rounded-2xl p-5 border border-[#C5A059]/40 shadow-sm space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs text-[#E5C378] font-bold">
                {overview.author_ar} (ت {overview.deathHijri}) •{' '}
                {selectedChunkMeta?.subGroup}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-amiri">
                {selectedChunkMeta?.chunkLabel || overview.title_ar}
              </h2>
              <p className="text-xs text-[#D1DDD6] leading-relaxed max-w-3xl">
                {overview.scholarlyNote_ar}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs shrink-0">
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 font-mono tabular-nums">
                {selectedChunkMeta?.entryCount.toLocaleString('en-US')} نصاً
                {selectedChunkMeta?.pageRange ? ` • ${selectedChunkMeta.pageRange}` : ''}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={selectedChunkId <= 0 || isLoading}
                  onClick={() => handleChunkChange(selectedChunkId - 1)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 cursor-pointer"
                  title="القسم السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={selectedChunkId >= overview.totalChunks - 1 || isLoading}
                  onClick={() => handleChunkChange(selectedChunkId + 1)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 cursor-pointer"
                  title="القسم التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* رسائل الخطأ والتحميل */}
      {loadError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-300">
          {loadError}
        </div>
      )}

      {isLoading || isSearching ? (
        <div className="py-16 text-center bg-white dark:bg-[#122820] rounded-2xl border border-[#E7DFD5] dark:border-[#203A2F]">
          <Loader2 className="w-8 h-8 animate-spin text-[#C5A059] mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {isSearching
              ? `جارٍ البحث في ${overview.title_ar}...`
              : 'جارٍ تحميل نصوص القسم...'}
          </p>
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="text-center py-12 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#122820] rounded-2xl border border-dashed border-gray-300 dark:border-[#203A2F] space-y-3">
          <p className="font-medium text-sm">
            {activeQuery
              ? `لم يُعثر على نتائج لكلمة «${activeQuery}» ضمن ${scopeLabel}.`
              : 'لا توجد تراجم في هذا القسم.'}
          </p>
          {activeQuery && searchScope === 'chunk' && (
            <button
              type="button"
              onClick={() => setSearchScope('all')}
              className="px-4 py-2 rounded-xl bg-[#143628] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer"
            >
              توسيع البحث إلى كامل «{overview.title_ar}»
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {displayedItems.map(({ chunkLabel, entry }) => {
            const isOpen = !!expandedLong[entry.id];
            const isLocallyLong =
              !entry.isExcerpt && entry.text_ar.length > COLLAPSE_THRESHOLD_CHARS;
            const displayedText =
              isLocallyLong && !isOpen
                ? `${entry.text_ar.slice(0, COLLAPSE_THRESHOLD_CHARS).trim()}...`
                : entry.text_ar;
            const badgeNum = entry.entryNumber || String(entry.orderInChunk);

            return (
              <article
                id={`entry-${entry.id}`}
                key={entry.id}
                className="bg-white dark:bg-[#122820] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]/60 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-4 border-b border-gray-100 dark:border-[#203A2F]/60">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono tabular-nums bg-[#143628] text-[#E5C378]">
                      #{badgeNum}
                    </span>
                    <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                      <HighlightMatch text={entry.title_ar} query={activeQuery} />
                    </h3>
                    {entry.pageRef && (
                      <span className="px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#8F7032] dark:text-[#E5C378] text-xs font-semibold font-mono tabular-nums">
                        {entry.pageRef}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {activeQuery && (
                      <button
                        type="button"
                        onClick={() =>
                          handleJumpToEntryInBook({
                            chunkId: entry.chunkId,
                            chunkLabel,
                            entry,
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#143628]/10 dark:bg-[#C5A059]/15 text-[#143628] dark:text-[#E5C378] text-xs font-bold hover:bg-[#C5A059]/25 transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>فتح في موضعه</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopy(entry, chunkLabel)}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#C5A059] transition-colors cursor-pointer"
                    >
                      {copiedId === entry.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ النص</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-[#52796F] dark:text-[#9BB0A5] mb-3 font-medium">
                  {activeQuery ? `${chunkLabel} • ` : ''}
                  {entry.sectionPath_ar}
                </div>

                <div className="font-amiri text-lg sm:text-xl leading-loose text-[#143628] dark:text-[#E8F0EC] p-4 sm:p-5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border-r-4 border-[#C5A059] whitespace-pre-line">
                  <HighlightMatch text={displayedText} query={activeQuery} />
                </div>

                {entry.isExcerpt && (
                  <button
                    type="button"
                    disabled={loadingEntryId === entry.id}
                    onClick={() => handleFetchFullEntry(entry)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#8F7032] dark:text-[#E5C378] hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {loadingEntryId === entry.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>جارٍ تحميل الترجمة كاملة...</span>
                      </>
                    ) : (
                      <span>
                        ▼ قراءة الترجمة كاملةً (
                        {(entry.fullCharCount ?? entry.text_ar.length).toLocaleString('en-US')}{' '}
                        حرفاً)
                      </span>
                    )}
                  </button>
                )}

                {isLocallyLong && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedLong((prev) => ({
                        ...prev,
                        [entry.id]: !prev[entry.id],
                      }))
                    }
                    className="mt-3 text-xs font-bold text-[#8F7032] dark:text-[#E5C378] hover:underline cursor-pointer"
                  >
                    {isOpen
                      ? '▲ طيّ النص المطول'
                      : `▼ إظهار بقية الترجمة كاملةً (${entry.text_ar.length.toLocaleString('en-US')} حرفاً)`}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* شريط ترقيم الصفحات والتنقل */}
      {(totalPages > 1 || !activeQuery) && (
        <div className="mt-6 bg-white dark:bg-[#122820] rounded-2xl p-4 border border-[#E7DFD5] dark:border-[#203A2F] flex flex-wrap items-center justify-between gap-4">
          {totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={activePageNum <= 1 || isLoading}
                onClick={() => {
                  if (activeQuery) {
                    setSearchPage((p) => Math.max(1, p - 1));
                  } else {
                    setBrowsePage((p) => Math.max(1, p - 1));
                  }
                  scrollToReaderTop();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/30 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                الصفحة السابقة
              </button>
              <span className="text-xs font-bold font-mono tabular-nums text-[#143628] dark:text-[#E5C378] px-2">
                صفحة {activePageNum} من {totalPages}
              </span>
              <button
                type="button"
                disabled={activePageNum >= totalPages || isLoading}
                onClick={() => {
                  if (activeQuery) {
                    setSearchPage((p) => Math.min(totalPages, p + 1));
                  } else {
                    setBrowsePage((p) => Math.min(totalPages, p + 1));
                  }
                  scrollToReaderTop();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/30 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                الصفحة التالية
              </button>
            </div>
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono tabular-nums">
              عرض {displayedItems.length} من أصل{' '}
              {(browseData?.totalEntries ?? displayedItems.length).toLocaleString('en-US')}
            </div>
          )}

          {!activeQuery && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={selectedChunkId <= 0 || isLoading}
                onClick={() => {
                  handleChunkChange(selectedChunkId - 1);
                  scrollToReaderTop();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#143628]/10 dark:bg-[#1A3329] text-[#143628] dark:text-[#E5C378] text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                → القسم السابق
              </button>
              <button
                type="button"
                disabled={selectedChunkId >= overview.totalChunks - 1 || isLoading}
                onClick={() => {
                  handleChunkChange(selectedChunkId + 1);
                  scrollToReaderTop();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#143628] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                القسم التالي ←
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
