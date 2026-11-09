'use client';

import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  X,
  Copy,
  Check,
  Loader2,
  ScrollText,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import type {
  TurathSource,
  LanguageView,
  TurathSearchFieldScope,
  BukhariSearchScope,
  ShifaSearchScope,
  BukhariBookMeta,
  BukhariBookData,
  BukhariBab,
  BukhariHadith,
  BukhariSearchResult,
  ShifaChapterMeta,
  ShifaChapterData,
  ShifaFasl,
  ShifaSearchResult,
} from '@/types/turath';

interface TurathReaderProps {
  bukhariIndex: BukhariBookMeta[];
  shifaIndex: ShifaChapterMeta[];
  initialBukhariBook: BukhariBookData;
  initialShifaChapter: ShifaChapterData;
}

const ITEMS_PER_PAGE = 25;

const SHIFA_PARTS = [
  { partNumber: 0, label: '0. مقدمة المؤلف القاضي عياض' },
  { partNumber: 1, label: 'القسم الأول: في تعظيم العلي الأعلى لقدر النبي ﷺ' },
  { partNumber: 2, label: 'القسم الثاني: فيما يجب على الأنام من حقوقه ﷺ' },
  { partNumber: 3, label: 'القسم الثالث: فيما يجب ويستحيل ويجوز في حقه ﷺ' },
  { partNumber: 4, label: 'القسم الرابع: في تصرف وجوه الأحكام والآداب' },
];

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildHighlightRegex(query: string): RegExp | null {
  const clean = query
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[«»"'()\[\]{}،؛:.؟!\-\/]/g, ' ')
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
    if (!isArabic) {
      return escapeRegExp(tok);
    }
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

export default function TurathReader({
  bukhariIndex,
  shifaIndex,
  initialBukhariBook,
  initialShifaChapter,
}: TurathReaderProps) {
  const [selectedSource, setSelectedSource] = useState<TurathSource>('bukhari');
  const [langView, setLangView] = useState<LanguageView>('ar');

  // Bukhari reading & filter state
  const [selectedBookNum, setSelectedBookNum] = useState<number>(1);
  const [selectedBabFilter, setSelectedBabFilter] = useState<string>('all');
  const [bukhariSearchScope, setBukhariSearchScope] =
    useState<BukhariSearchScope>('all');
  const [bukhariData, setBukhariData] =
    useState<BukhariBookData>(initialBukhariBook);
  const bukhariCacheRef = useRef<Map<number, BukhariBookData>>(
    new Map([[initialBukhariBook.meta.bookNumber, initialBukhariBook]])
  );

  // Shifa reading & filter state
  const [selectedPartFilter, setSelectedPartFilter] = useState<number | 'all'>(
    'all'
  );
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(0);
  const [selectedFaslFilter, setSelectedFaslFilter] = useState<string>('all');
  const [shifaSearchScope, setShifaSearchScope] =
    useState<ShifaSearchScope>('all');
  const [shifaData, setShifaData] =
    useState<ShifaChapterData>(initialShifaChapter);
  const shifaCacheRef = useRef<Map<number, ShifaChapterData>>(
    new Map([[initialShifaChapter.meta.chapterNumber, initialShifaChapter]])
  );

  // Shared pagination, loading, search & expand state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState<string>('');
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const [searchFieldScope, setSearchFieldScope] =
    useState<TurathSearchFieldScope>('all');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [bukhariSearchResults, setBukhariSearchResults] = useState<{
    totalMatches: number;
    truncated: boolean;
    results: BukhariSearchResult[];
  } | null>(null);
  const [shifaSearchResults, setShifaSearchResults] = useState<{
    totalMatches: number;
    truncated: boolean;
    results: ShifaSearchResult[];
  } | null>(null);

  const [expandedSharh, setExpandedSharh] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const readerTopRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToTop = () => {
    readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Switch strictly between Sahih al-Bukhari & Kitab ash-Shifa
  const handleSelectSource = (src: TurathSource) => {
    if (src === selectedSource) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setSelectedSource(src);
    setSearchInput('');
    setActiveSearchQuery('');
    setBukhariSearchResults(null);
    setShifaSearchResults(null);
    setIsSearching(false);
    setLoadError(null);
    setCurrentPage(1);
  };

  const fetchBukhariBookData = useCallback(
    async (bookNum: number): Promise<BukhariBookData | null> => {
      const cached = bukhariCacheRef.current.get(bookNum);
      if (cached) {
        setBukhariData(cached);
        return cached;
      }

      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`/api/turath?source=bukhari&book=${bookNum}`);
        if (!res.ok) throw new Error('تعذر تحميل بيانات الكتاب');
        const data = (await res.json()) as BukhariBookData;
        bukhariCacheRef.current.set(bookNum, data);
        setBukhariData(data);
        return data;
      } catch {
        setLoadError('حدث خطأ أثناء تحميل هذا الكتاب. يرجى المحاولة مرة أخرى.');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadBukhariBook = async (
    bookNum: number,
    options?: { keepSearch?: boolean; forceScope?: BukhariSearchScope }
  ) => {
    setSelectedBookNum(bookNum);
    setSelectedBabFilter('all');
    setCurrentPage(1);
    setLoadError(null);

    if (options?.forceScope) {
      setBukhariSearchScope(options.forceScope);
    } else if (options?.keepSearch) {
      setBukhariSearchScope('book');
    } else {
      setActiveSearchQuery('');
      setBukhariSearchResults(null);
      if (bukhariSearchScope === 'bab') {
        setBukhariSearchScope('book');
      }
    }

    await fetchBukhariBookData(bookNum);
  };

  const fetchShifaChapterData = useCallback(
    async (chNum: number): Promise<ShifaChapterData | null> => {
      const cached = shifaCacheRef.current.get(chNum);
      if (cached) {
        setShifaData(cached);
        return cached;
      }

      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`/api/turath?source=shifa&chapter=${chNum}`);
        if (!res.ok) throw new Error('تعذر تحميل بيانات الباب');
        const data = (await res.json()) as ShifaChapterData;
        shifaCacheRef.current.set(chNum, data);
        setShifaData(data);
        return data;
      } catch {
        setLoadError('حدث خطأ أثناء تحميل هذا الباب. يرجى المحاولة مرة أخرى.');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadShifaChapter = async (
    chNum: number,
    options?: { keepSearch?: boolean; forceScope?: ShifaSearchScope }
  ) => {
    setSelectedChapterNum(chNum);
    setSelectedFaslFilter('all');
    setCurrentPage(1);
    setLoadError(null);

    if (options?.forceScope) {
      setShifaSearchScope(options.forceScope);
    } else if (options?.keepSearch) {
      setShifaSearchScope('chapter');
    } else {
      setActiveSearchQuery('');
      setShifaSearchResults(null);
    }

    await fetchShifaChapterData(chNum);
  };

  const handleShifaPartChange = async (partVal: string) => {
    if (partVal === 'all') {
      setSelectedPartFilter('all');
      setShifaSearchScope('all');
      setCurrentPage(1);
      return;
    }

    const pNum = Number(partVal);
    setSelectedPartFilter(pNum);
    setShifaSearchScope('part');
    setSelectedFaslFilter('all');
    setCurrentPage(1);

    const matchingChapters = shifaIndex.filter((c) => c.partNumber === pNum);
    if (
      matchingChapters.length > 0 &&
      !matchingChapters.some((c) => c.chapterNumber === selectedChapterNum)
    ) {
      await fetchShifaChapterData(matchingChapters[0].chapterNumber);
      setSelectedChapterNum(matchingChapters[0].chapterNumber);
    }
  };

  const executeSearch = useCallback(
    async (rawQuery: string) => {
      const q = rawQuery.trim();
      if (!q) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        setActiveSearchQuery('');
        setBukhariSearchResults(null);
        setShifaSearchResults(null);
        setIsSearching(false);
        setLoadError(null);
        return;
      }

      if (q.length < 2 && !/^\d+$/.test(q)) {
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsSearching(true);
      setLoadError(null);
      setActiveSearchQuery(q);
      setCurrentPage(1);

      try {
        const params = new URLSearchParams();
        params.set('source', selectedSource);
        params.set('q', q);
        params.set('scope', searchFieldScope);

        if (selectedSource === 'bukhari') {
          if (bukhariSearchScope === 'book') {
            params.set('book', String(selectedBookNum));
          } else if (bukhariSearchScope === 'bab') {
            params.set('book', String(selectedBookNum));
            if (selectedBabFilter !== 'all') {
              params.set('babId', selectedBabFilter);
            }
          }
        } else {
          if (shifaSearchScope === 'part' && selectedPartFilter !== 'all') {
            params.set('part', String(selectedPartFilter));
          } else if (shifaSearchScope === 'chapter') {
            params.set('chapter', String(selectedChapterNum));
            if (selectedFaslFilter !== 'all') {
              params.set('faslId', selectedFaslFilter);
            }
          }
        }

        const res = await fetch(`/api/turath?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('خطأ في البحث');
        const data = await res.json();

        if (controller.signal.aborted) return;

        if (selectedSource === 'bukhari') {
          setBukhariSearchResults({
            totalMatches: data.totalMatches,
            truncated: data.truncated,
            results: data.results,
          });
        } else {
          setShifaSearchResults({
            totalMatches: data.totalMatches,
            truncated: data.truncated,
            results: data.results,
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setLoadError('تعذر تنفيذ البحث حالياً. يرجى المحاولة مرة أخرى.');
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    },
    [
      selectedSource,
      searchFieldScope,
      bukhariSearchScope,
      selectedBookNum,
      selectedBabFilter,
      shifaSearchScope,
      selectedPartFilter,
      selectedChapterNum,
      selectedFaslFilter,
    ]
  );

  const clearSearchResultsOnly = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setActiveSearchQuery('');
    setBukhariSearchResults(null);
    setShifaSearchResults(null);
    setIsSearching(false);
    setLoadError(null);
    setCurrentPage(1);
  }, []);

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
    if (!val.trim()) {
      clearSearchResultsOnly();
    }
  };

  // Instant live debounced search as user types or changes filters
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const q = searchInput.trim();
    const isValidNumeric =
      /^\d+$/.test(q) &&
      (selectedSource === 'bukhari' || shifaSearchScope === 'chapter');
    if (!q || (q.length < 2 && !isValidNumeric)) {
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      executeSearch(q);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput, selectedSource, shifaSearchScope, executeSearch]);

  const clearSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setSearchInput('');
    setActiveSearchQuery('');
    setBukhariSearchResults(null);
    setShifaSearchResults(null);
    setIsSearching(false);
    setLoadError(null);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    const q = searchInput.trim();
    if (!q) {
      clearSearch();
      return;
    }
    if (q.length < 2 && !/^\d+$/.test(q)) {
      setLoadError('أدخل حرفين على الأقل للبحث، أو رقم حديث صحيح.');
      return;
    }
    executeSearch(q);
  };

  const resetAllFiltersAndSearch = () => {
    clearSearch();
    setSearchFieldScope('all');
    if (selectedSource === 'bukhari') {
      setSelectedBabFilter('all');
      setBukhariSearchScope('all');
    } else {
      setSelectedPartFilter('all');
      setSelectedFaslFilter('all');
      setShifaSearchScope('all');
    }
  };

  const toggleSharh = (id: string) => {
    setExpandedSharh((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string, refLabel: string) => {
    navigator.clipboard.writeText(`${text}\n\n— [${refLabel}]`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Bukhari derived lists
  const bukhariBabsList = useMemo(() => {
    return Object.values(bukhariData.babs);
  }, [bukhariData]);

  const selectedBabObj = useMemo(() => {
    if (selectedBabFilter === 'all') return null;
    return bukhariData.babs[selectedBabFilter] ?? null;
  }, [bukhariData, selectedBabFilter]);

  const currentBukhariEntries = useMemo(() => {
    if (activeSearchQuery && bukhariSearchResults) {
      return bukhariSearchResults.results;
    }
    const list =
      selectedBabFilter === 'all'
        ? bukhariData.hadiths
        : bukhariData.hadiths.filter((h) => h.babId === selectedBabFilter);

    return list.map((hadith) => ({
      bookMeta: bukhariData.meta,
      bab: bukhariData.babs[hadith.babId],
      hadith,
    }));
  }, [activeSearchQuery, bukhariSearchResults, bukhariData, selectedBabFilter]);

  // Shifa derived lists
  const filteredShifaChapters = useMemo(() => {
    if (selectedPartFilter === 'all') return shifaIndex;
    return shifaIndex.filter((c) => c.partNumber === selectedPartFilter);
  }, [shifaIndex, selectedPartFilter]);

  const currentShifaEntries = useMemo(() => {
    if (activeSearchQuery && shifaSearchResults) {
      return shifaSearchResults.results;
    }
    const list =
      selectedFaslFilter === 'all'
        ? shifaData.fasls
        : shifaData.fasls.filter((f) => f.id === selectedFaslFilter);

    return list.map((fasl) => ({
      chapterMeta: shifaData.meta,
      fasl,
    }));
  }, [activeSearchQuery, shifaSearchResults, shifaData, selectedFaslFilter]);

  const activeTotalCount =
    selectedSource === 'bukhari'
      ? currentBukhariEntries.length
      : currentShifaEntries.length;

  const totalPages = Math.max(1, Math.ceil(activeTotalCount / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const pagedBukhariEntries = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return currentBukhariEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [currentBukhariEntries, safePage]);

  const pagedShifaEntries = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return currentShifaEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [currentShifaEntries, safePage]);

  // Active scope summary label shown in search header & results banner
  const activeScopeDescription = useMemo(() => {
    if (selectedSource === 'bukhari') {
      if (bukhariSearchScope === 'bab' && selectedBabObj) {
        const shortBab =
          selectedBabObj.title_ar.length > 48
            ? `${selectedBabObj.title_ar.slice(0, 48)}...`
            : selectedBabObj.title_ar;
        return `${bukhariData.meta.title_ar} ← ${shortBab}`;
      }
      if (bukhariSearchScope === 'book') {
        return `داخل ${bukhariData.meta.title_ar} فقط`;
      }
      return 'كامل صحيح البخاري (97 كتاباً • 7580 حديثاً)';
    }

    if (shifaSearchScope === 'chapter') {
      if (selectedFaslFilter !== 'all') {
        const fasl = shifaData.fasls.find((f) => f.id === selectedFaslFilter);
        if (fasl) {
          return `${shifaData.meta.title_ar} ← ${fasl.title_ar}`;
        }
      }
      return `داخل ${shifaData.meta.title_ar} فقط`;
    }
    if (shifaSearchScope === 'part' && selectedPartFilter !== 'all') {
      const partObj = SHIFA_PARTS.find(
        (p) => p.partNumber === selectedPartFilter
      );
      return partObj ? `داخل ${partObj.label}` : 'داخل القسم المحدد';
    }
    return 'كامل كتاب الشِّفا للقاضي عياض (4 أقسام • 14 باباً)';
  }, [
    selectedSource,
    bukhariSearchScope,
    selectedBabObj,
    bukhariData.meta.title_ar,
    shifaSearchScope,
    selectedFaslFilter,
    shifaData.fasls,
    shifaData.meta.title_ar,
    selectedPartFilter,
  ]);

  const renderSharhText = (
    cardKey: string,
    text: string,
    queryToHighlight: string
  ) => {
    const isLong = text.length > 440;
    const isOpen = !!expandedSharh[cardKey];
    const displayed =
      isLong && !isOpen ? `${text.slice(0, 400).trim()}...` : text;

    return (
      <>
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          <HighlightMatch text={displayed} query={queryToHighlight} />
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => toggleSharh(cardKey)}
            className="mt-2 text-xs font-bold text-[#8F7032] dark:text-[#E5C378] hover:underline cursor-pointer"
          >
            {isOpen ? '▲ طيّ الشرح' : '▼ قراءة الشرح كاملاً'}
          </button>
        )}
      </>
    );
  };

  return (
    <div ref={readerTopRef} className="w-full max-w-5xl mx-auto px-4 py-4" dir="rtl">
      {/* الترويسة */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F7032] dark:text-[#E5C378] bg-[#C5A059]/10 px-3.5 py-1.5 rounded-full border border-[#C5A059]/30 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          مِنْهَاجُ الفَقِير • الخِزَانَةُ الحَدِيثِيَّةُ الكَامِلَةُ
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-amiri text-[#143628] dark:text-[#E8F0EC] mb-2.5">
          الرِّحَابُ الحَدِيثِيَّةُ وَالشَّمَائِلُ النَّبَوِيَّةُ
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          المتن الكامل لصحيح الإمام البخاري (97 كتاباً • 7580 حديثاً) وكتاب الشِّفا للقاضي عياض (4 أقسام • 14 باباً) مؤصَّلَين بشرح الإمام ابن بطال المالكي وشرح الملا علي القاري.
        </p>
      </div>

      {/* أشرطة التحكم: التبديل المعزول بين الكتابين واختيار اللغة */}
      <div className="bg-white dark:bg-[#122820] rounded-2xl p-3.5 sm:p-4 shadow-sm border border-[#C5A059]/30 mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="اختيار المرجع"
          className="flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#07130E] p-1.5 rounded-xl border border-[#C5A059]/20 w-full md:w-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedSource === 'bukhari'}
            onClick={() => handleSelectSource('bukhari')}
            className={`flex-1 md:flex-initial px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              selectedSource === 'bukhari'
                ? 'bg-[#143628] text-white shadow-md ring-1 ring-[#C5A059]/60'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#C5A059]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C5A059]" />
            <span>صحيح البخاري (97)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedSource === 'shifa'}
            onClick={() => handleSelectSource('shifa')}
            className={`flex-1 md:flex-initial px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              selectedSource === 'shifa'
                ? 'bg-[#143628] text-white shadow-md ring-1 ring-[#C5A059]/60'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#C5A059]'
            }`}
          >
            <ScrollText className="w-4 h-4 text-[#C5A059]" />
            <span>الشِّفا للقاضي عياض (14)</span>
          </button>
        </div>

        {/* اختيار اللغة */}
        <div className="flex items-center gap-1 bg-[#FAF7F2] dark:bg-[#07130E] p-1 rounded-xl text-xs font-medium w-full md:w-auto justify-center border border-[#C5A059]/20">
          {(['ar', 'fr', 'en', 'all'] as LanguageView[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLangView(lang)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                langView === lang
                  ? 'bg-[#C5A059] text-white font-bold shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {lang === 'ar' && 'العربية'}
              {lang === 'fr' && 'Français'}
              {lang === 'en' && 'English'}
              {lang === 'all' && 'كل اللغات'}
            </button>
          ))}
        </div>
      </div>

      {/* محرك البحث المعزول + الفلاتر الدقيقة حسب الكتاب المختار */}
      <div className="bg-white dark:bg-[#122820] rounded-2xl p-4 sm:p-5 shadow-md border-2 border-[#C5A059]/35 mb-6 space-y-4">
        {/* عنوان المحرك ونطاقه الحالي */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E7DFD5] dark:border-[#203A2F]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#143628] text-[#C5A059] flex items-center justify-center shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#143628] dark:text-[#E8F0EC]">
                {selectedSource === 'bukhari'
                  ? 'محرك البحث والتصفية داخل صحيح البخاري فقط'
                  : 'محرك البحث والتصفية داخل كتاب الشِّفا للقاضي عياض فقط'}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#52796F] dark:text-[#9BB0A5]">
                النطاق الحالي:{' '}
                <span className="font-bold text-[#8F7032] dark:text-[#E5C378]">
                  {activeScopeDescription}
                </span>
              </p>
            </div>
          </div>

          {(searchInput ||
            searchFieldScope !== 'all' ||
            (selectedSource === 'bukhari' &&
              (selectedBabFilter !== 'all' || bukhariSearchScope !== 'all')) ||
            (selectedSource === 'shifa' &&
              (selectedPartFilter !== 'all' ||
                selectedFaslFilter !== 'all' ||
                shifaSearchScope !== 'all'))) && (
            <button
              type="button"
              onClick={resetAllFiltersAndSearch}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 text-[#8F7032] dark:text-[#E5C378] hover:bg-[#C5A059]/15 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          )}
        </div>

        {/* شريط البحث الفوري البارز */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              aria-label={
                selectedSource === 'bukhari'
                  ? 'ابحث داخل صحيح البخاري'
                  : 'ابحث داخل كتاب الشفا'
              }
              placeholder={
                selectedSource === 'bukhari'
                  ? `ابحث ${
                      bukhariSearchScope === 'bab' && selectedBabObj
                        ? `داخل «${selectedBabObj.title_ar.slice(0, 42)}»`
                        : bukhariSearchScope === 'book'
                        ? `داخل «${bukhariData.meta.title_ar}»`
                        : 'في جميع كتب البخاري (97 كتاباً)'
                    } بكلمة أو برقم الحديث مثل 1 أو الإيمان...`
                  : `ابحث ${
                      shifaSearchScope === 'chapter'
                        ? `داخل «${shifaData.meta.title_ar.slice(0, 42)}»`
                        : shifaSearchScope === 'part'
                        ? 'داخل القسم المختار من الشِّفا'
                        : 'في كامل كتاب الشِّفا (168 فصلاً)'
                    } مثل: الشفاعة أو الإسراء أو المحبة...`
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
            <span>{selectedSource === 'bukhari' ? 'بحث في البخاري' : 'بحث في الشِّفا'}</span>
          </button>
        </form>

        {/* فلاتر التحديد (الكتاب / القسم / الباب / الفصل) — فعّالة دائماً أثناء البحث والتصفح */}
        {selectedSource === 'bukhari' ? (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#8F7032] dark:text-[#E5C378] mb-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  <span>فيلتر الكتاب (1 - 97):</span>
                </label>
                <select
                  value={selectedBookNum}
                  onChange={(e) =>
                    loadBukhariBook(Number(e.target.value), {
                      keepSearch: searchInput.trim().length > 0,
                    })
                  }
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#07130E] text-sm font-medium text-[#143628] dark:text-[#E8F0EC] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                >
                  {bukhariIndex.map((b) => (
                    <option key={b.bookNumber} value={b.bookNumber}>
                      {b.bookNumber}. {b.title_ar}
                      {langView === 'fr' || langView === 'all' ? ` — ${b.title_fr}` : ''}
                      {` (${b.hadithCount})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#8F7032] dark:text-[#E5C378] mb-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  <span>فيلتر الباب داخل هذا الكتاب ({bukhariBabsList.length} باباً):</span>
                </label>
                <select
                  value={selectedBabFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedBabFilter(val);
                    setCurrentPage(1);
                    if (val !== 'all') {
                      setBukhariSearchScope('bab');
                    } else if (bukhariSearchScope === 'bab') {
                      setBukhariSearchScope('book');
                    }
                  }}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#07130E] text-sm font-medium text-[#143628] dark:text-[#E8F0EC] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                >
                  <option value="all">
                    جميع أبواب «{bukhariData.meta.title_ar}» ({bukhariData.hadiths.length} حديثاً)
                  </option>
                  {bukhariBabsList.map((bab) => (
                    <option key={bab.id} value={bab.id}>
                      {bab.title_ar.length > 85
                        ? `${bab.title_ar.slice(0, 85)}...`
                        : bab.title_ar}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* أزرار تحديد نطاق البحث + مجال البحث (المتن / الشرح) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pt-2 border-t border-dashed border-[#E7DFD5] dark:border-[#203A2F] text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-[#52796F] dark:text-[#9BB0A5] ml-1">
                  نطاق البحث:
                </span>
                <button
                  type="button"
                  onClick={() => setBukhariSearchScope('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    bukhariSearchScope === 'all'
                      ? 'bg-[#143628] text-white shadow-xs'
                      : 'bg-[#FAF7F2] dark:bg-[#07130E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#203A2F] hover:border-[#C5A059]'
                  }`}
                >
                  كامل البخاري (97 كتاباً)
                </button>
                <button
                  type="button"
                  onClick={() => setBukhariSearchScope('book')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    bukhariSearchScope === 'book'
                      ? 'bg-[#143628] text-white shadow-xs'
                      : 'bg-[#FAF7F2] dark:bg-[#07130E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#203A2F] hover:border-[#C5A059]'
                  }`}
                >
                  هذا الكتاب فقط ({bukhariData.meta.title_ar})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedBabFilter === 'all' && bukhariBabsList.length > 0) {
                      setSelectedBabFilter(bukhariBabsList[0].id);
                    }
                    setBukhariSearchScope('bab');
                  }}
                  disabled={bukhariBabsList.length === 0}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer disabled:opacity-40 ${
                    bukhariSearchScope === 'bab'
                      ? 'bg-[#C5A059] text-white shadow-xs'
                      : 'bg-[#FAF7F2] dark:bg-[#07130E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#203A2F] hover:border-[#C5A059]'
                  }`}
                >
                  هذا الباب فقط
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-[#52796F] dark:text-[#9BB0A5] ml-1">
                  البحث في:
                </span>
                {(
                  [
                    { id: 'all', label: 'الكل (المتن والشرح)' },
                    { id: 'text', label: 'المتن والترجمة' },
                    { id: 'sharh', label: 'شرح ابن بطال' },
                  ] as { id: TurathSearchFieldScope; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSearchFieldScope(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                      searchFieldScope === item.id
                        ? 'bg-[#C5A059]/20 text-[#8F7032] dark:text-[#E5C378] border border-[#C5A059]'
                        : 'bg-[#FAF7F2] dark:bg-[#07130E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#203A2F]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. فيلتر القسم */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#8F7032] dark:text-[#E5C378] mb-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  <span>فيلتر القسم:</span>
                </label>
                <select
                  value={selectedPartFilter}
                  onChange={(e) => handleShifaPartChange(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#07130E] text-sm font-medium text-[#143628] dark:text-[#E8F0EC] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                >
                  <option value="all">جميع الأقسام (1 - 4 + المقدمة)</option>
                  {SHIFA_PARTS.map((p) => (
                    <option key={p.partNumber} value={p.partNumber}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. فيلتر الباب */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#8F7032] dark:text-[#E5C378] mb-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  <span>فيلتر الباب ({filteredShifaChapters.length}):</span>
                </label>
                <select
                  value={selectedChapterNum}
                  onChange={(e) =>
                    loadShifaChapter(Number(e.target.value), {
                      keepSearch: searchInput.trim().length > 0,
                    })
                  }
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#07130E] text-sm font-medium text-[#143628] dark:text-[#E8F0EC] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                >
                  {filteredShifaChapters.map((ch) => (
                    <option key={ch.chapterNumber} value={ch.chapterNumber}>
                      {ch.chapterNumber === 0
                        ? `0. ${ch.title_ar}`
                        : `القسم ${ch.partNumber} • ${ch.title_ar}`}
                      {langView === 'fr' || langView === 'all' ? ` — ${ch.title_fr}` : ''}
                      {` (${ch.faslCount} فصول)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. فيلتر الفصل داخل الباب */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#8F7032] dark:text-[#E5C378] mb-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  <span>فيلتر الفصل داخل الباب ({shifaData.fasls.length}):</span>
                </label>
                <select
                  value={selectedFaslFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedFaslFilter(val);
                    setCurrentPage(1);
                    if (val !== 'all') {
                      setShifaSearchScope('chapter');
                    }
                  }}
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#07130E] text-sm font-medium text-[#143628] dark:text-[#E8F0EC] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                >
                  <option value="all">
                    جميع فصول الباب ({shifaData.fasls.length} فصول)
                  </option>
                  {shifaData.fasls.map((fasl) => (
                    <option key={fasl.id} value={fasl.id}>
                      {fasl.faslNumber}.{' '}
                      {fasl.title_ar.length > 70
                        ? `${fasl.title_ar.slice(0, 70)}...`
                        : fasl.title_ar}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* أزرار نطاق البحث + مجال النص في الشفا */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pt-2 border-t border-dashed border-[#E7DFD5] dark:border-[#203A2F] text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-[#52796F] dark:text-[#9BB0A5] ml-1">
                  نطاق البحث:
                </span>
                <button
                  type="button"
                  onClick={() => setShifaSearchScope('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    shifaSearchScope === 'all'
                      ? 'bg-[#143628] text-white shadow-xs'
                      : 'bg-[#FAF7F2] dark:bg-[#07130E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#203A2F] hover:border-[#C5A059]'
                  }`}
                >
                  كامل الشِّفا (168 فصلاً)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPartFilter === 'all') {
                      setSelectedPartFilter(shifaData.meta.partNumber);
                    }
                    setShifaSearchScope('part');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    shifaSearchScope === 'part'
                      ? 'bg-[#143628] text-white shadow-xs'
                      : 'bg-[#FAF7F2] dark:bg-[#07130E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#203A2F] hover:border-[#C5A059]'
                  }`}
                >
                  هذا القسم فقط
                </button>
                <button
                  type="button"
                  onClick={() => setShifaSearchScope('chapter')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    shifaSearchScope === 'chapter'
                      ? 'bg-[#C5A059] text-white shadow-xs'
                      : 'bg-[#FAF7F2] dark:bg-[#07130E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#203A2F] hover:border-[#C5A059]'
                  }`}
                >
                  هذا الباب فقط
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-[#52796F] dark:text-[#9BB0A5] ml-1">
                  البحث في:
                </span>
                {(
                  [
                    { id: 'all', label: 'الكل (النص والشرح)' },
                    { id: 'text', label: 'نص الشِّفا فقط' },
                    { id: 'sharh', label: 'شرح علي القاري' },
                  ] as { id: TurathSearchFieldScope; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSearchFieldScope(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                      searchFieldScope === item.id
                        ? 'bg-[#C5A059]/20 text-[#8F7032] dark:text-[#E5C378] border border-[#C5A059]'
                        : 'bg-[#FAF7F2] dark:bg-[#07130E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#203A2F]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* بطاقة تعريف الكتاب أو الباب الحالي / نتائج البحث */}
      {activeSearchQuery ? (
        <div className="bg-amber-50/80 dark:bg-[#162A22] border border-[#C5A059]/50 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="text-sm space-y-0.5">
            <div>
              <span className="font-bold text-[#143628] dark:text-[#E5C378]">
                نتائج البحث عن «{activeSearchQuery}»:{' '}
              </span>
              <span className="font-semibold text-[#8F7032] dark:text-[#E5C378]">
                {selectedSource === 'bukhari' && bukhariSearchResults
                  ? `${bukhariSearchResults.totalMatches} نتيجة مطابقة${
                      bukhariSearchResults.truncated
                        ? ` (أول ${bukhariSearchResults.results.length} نتيجة)`
                        : ''
                    }`
                  : selectedSource === 'shifa' && shifaSearchResults
                  ? `${shifaSearchResults.totalMatches} فصلاً مطابقاً${
                      shifaSearchResults.truncated
                        ? ` (أول ${shifaSearchResults.results.length} نتيجة)`
                        : ''
                    }`
                  : ''}
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              النطاق المفلتر: {activeScopeDescription}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selectedSource === 'bukhari' && bukhariSearchScope !== 'all' && (
              <button
                type="button"
                onClick={() => setBukhariSearchScope('all')}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#143628] text-white hover:bg-[#1B4332] cursor-pointer"
              >
                توسيع لكل البخاري (97 كتاباً)
              </button>
            )}
            {selectedSource === 'shifa' && shifaSearchScope !== 'all' && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPartFilter('all');
                  setSelectedFaslFilter('all');
                  setShifaSearchScope('all');
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#143628] text-white hover:bg-[#1B4332] cursor-pointer"
              >
                توسيع لكل الشِّفا (168 فصلاً)
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
      ) : selectedSource === 'bukhari' ? (
        <div className="bg-gradient-to-l from-[#143628] to-[#0E271D] text-white rounded-2xl p-5 mb-6 border border-[#C5A059]/40 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs text-[#E5C378] font-bold mb-1">
                صحيح الإمام البخاري • الكتاب {bukhariData.meta.bookNumber} من 97
              </div>
              <h2 className="text-2xl font-bold font-amiri">{bukhariData.meta.title_ar}</h2>
              {(langView === 'fr' || langView === 'all') && (
                <p className="text-xs text-[#D1DDD6] mt-1" dir="ltr">
                  FR : {bukhariData.meta.title_fr}
                </p>
              )}
              {(langView === 'en' || langView === 'all') && (
                <p className="text-xs text-[#D1DDD6] mt-0.5" dir="ltr">
                  EN : {bukhariData.meta.title_en}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                {bukhariData.meta.hadithCount} حديثاً • {bukhariData.meta.babCount} باباً
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={selectedBookNum <= 1 || isLoading}
                  onClick={() => loadBukhariBook(selectedBookNum - 1)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 cursor-pointer"
                  title="الكتاب السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={selectedBookNum >= 97 || isLoading}
                  onClick={() => loadBukhariBook(selectedBookNum + 1)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 cursor-pointer"
                  title="الكتاب التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-l from-[#143628] to-[#0E271D] text-white rounded-2xl p-5 mb-6 border border-[#C5A059]/40 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs text-[#E5C378] font-bold mb-1">
                {shifaData.meta.part_ar}
              </div>
              <h2 className="text-2xl font-bold font-amiri">{shifaData.meta.title_ar}</h2>
              {(langView === 'fr' || langView === 'all') && (
                <p className="text-xs text-[#D1DDD6] mt-1" dir="ltr">
                  {shifaData.meta.part_fr} — {shifaData.meta.title_fr}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                {shifaData.meta.faslCount} فصول
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={selectedChapterNum <= 0 || isLoading}
                  onClick={() => loadShifaChapter(selectedChapterNum - 1)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 cursor-pointer"
                  title="الباب السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={selectedChapterNum >= 13 || isLoading}
                  onClick={() => loadShifaChapter(selectedChapterNum + 1)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 cursor-pointer"
                  title="الباب التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-3 text-xs sm:text-sm leading-relaxed text-[#FAF7F2]">
            <span className="font-bold text-[#E5C378]">✦ التأصيل المالكي المغربي لهذا الباب: </span>
            {shifaData.meta.maliki_focus_ar}
            {(langView === 'fr' || langView === 'en' || langView === 'all') && (
              <p className="mt-2 pt-2 border-t border-white/15 text-xs text-[#D1DDD6]" dir="ltr">
                {shifaData.meta.maliki_focus_fr}
                <span className="block mt-1 italic opacity-85">
                  Note éditoriale : L&apos;intégralité du texte arabe vérifié du Qadi &apos;Iyad et son commentaire classique sont affichés ci-dessous. Les traductions commerciales complètes (Éditions Al-Bouraq en français / Aisha Bewley en anglais) sont protégées par le droit d&apos;auteur.
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* رسائل الخطأ والتحميل */}
      {loadError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-300">
          {loadError}
        </div>
      )}

      {isLoading || isSearching ? (
        <div className="py-16 text-center bg-white dark:bg-[#122820] rounded-2xl border border-[#E7DFD5] dark:border-[#203A2F]">
          <Loader2 className="w-8 h-8 animate-spin text-[#C5A059] mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {isSearching
              ? `جارٍ البحث في ${activeScopeDescription}...`
              : 'جارٍ تحميل نصوص الكتاب...'}
          </p>
        </div>
      ) : (
        <>
          {/* قائمة البطاقات */}
          <div className="space-y-6">
            {selectedSource === 'bukhari' ? (
              pagedBukhariEntries.length === 0 ? (
                <div className="text-center py-12 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#122820] rounded-2xl border border-dashed border-gray-300 dark:border-[#203A2F] space-y-3">
                  <p className="font-medium text-sm">
                    {activeSearchQuery
                      ? `لم يُعثر على نتائج لكلمة «${activeSearchQuery}» ضمن النطاق المحدد (${activeScopeDescription}).`
                      : 'لا توجد أحاديث مطابقة في هذا الباب.'}
                  </p>
                  {activeSearchQuery && bukhariSearchScope !== 'all' && (
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      {bukhariSearchScope === 'bab' && (
                        <button
                          type="button"
                          onClick={() => setBukhariSearchScope('book')}
                          className="px-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 text-xs font-bold text-[#143628] dark:text-[#E5C378] hover:border-[#C5A059] cursor-pointer"
                        >
                          توسيع البحث إلى كامل «{bukhariData.meta.title_ar}»
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setBukhariSearchScope('all')}
                        className="px-4 py-2 rounded-xl bg-[#143628] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer"
                      >
                        توسيع البحث إلى كامل صحيح البخاري (97 كتاباً)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                pagedBukhariEntries.map(
                  ({
                    bookMeta,
                    bab,
                    hadith,
                  }: {
                    bookMeta: BukhariBookMeta;
                    bab: BukhariBab;
                    hadith: BukhariHadith;
                  }) => {
                    const displayNum = hadith.numberLabel || String(hadith.number);
                    return (
                      <article
                        key={hadith.id}
                        className="bg-white dark:bg-[#122820] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]/60 transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100 dark:border-[#203A2F]/60">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#143628] text-[#E5C378]">
                              حديث {displayNum}
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#C5A059]/15 text-[#8F7032] dark:text-[#E5C378]">
                              {bookMeta.title_ar}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                              <HighlightMatch
                                text={bab.title_ar}
                                query={activeSearchQuery}
                              />
                            </span>
                            {activeSearchQuery && (
                              <button
                                type="button"
                                onClick={() => {
                                  clearSearch();
                                  loadBukhariBook(bookMeta.bookNumber, {
                                    keepSearch: false,
                                    forceScope: 'book',
                                  });
                                  scrollToTop();
                                }}
                                className="text-[11px] font-bold text-[#143628] dark:text-[#E5C378] underline hover:text-[#C5A059] cursor-pointer"
                              >
                                (قراءة الكتاب كاملاً)
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                hadith.id,
                                hadith.text_ar,
                                `صحيح البخاري • ${bookMeta.title_ar} • حديث ${displayNum}`
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#C5A059] transition-colors cursor-pointer"
                          >
                            {copiedId === hadith.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span>تم النسخ</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>نسخ المتن</span>
                              </>
                            )}
                          </button>
                        </div>

                        {(langView === 'ar' || langView === 'all') && (
                          <div className="font-amiri text-lg sm:text-xl leading-loose text-[#143628] dark:text-[#E8F0EC] mb-4 p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border-r-4 border-[#C5A059] whitespace-pre-line">
                            <HighlightMatch
                              text={hadith.text_ar}
                              query={activeSearchQuery}
                            />
                          </div>
                        )}

                        {(langView === 'fr' || langView === 'all') && hadith.text_fr && (
                          <div
                            className="text-sm text-gray-700 dark:text-gray-300 mb-3 p-3.5 rounded-xl bg-gray-50 dark:bg-[#0B1E17] border-l-2 border-blue-400 leading-relaxed"
                            dir="ltr"
                          >
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mb-1">
                              Français ({bookMeta.title_fr}) :
                            </span>
                            <HighlightMatch
                              text={hadith.text_fr}
                              query={activeSearchQuery}
                            />
                          </div>
                        )}

                        {(langView === 'en' || langView === 'all') && hadith.text_en && (
                          <div
                            className="text-sm text-gray-700 dark:text-gray-300 mb-3 p-3.5 rounded-xl bg-gray-50 dark:bg-[#0B1E17] border-l-2 border-emerald-500 leading-relaxed"
                            dir="ltr"
                          >
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                              English ({bookMeta.title_en}) :
                            </span>
                            <HighlightMatch
                              text={hadith.text_en}
                              query={activeSearchQuery}
                            />
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-[#203A2F]">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-[#8F7032] dark:text-[#C5A059]">
                              ✦{' '}
                              {bab.has_ibn_battal
                                ? 'الشرح المالكي (ابن بطال القرطبي):'
                                : 'التأصيل والتوجيه المالكي:'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({bab.sharh_scholar})
                            </span>
                          </div>
                          <div className="bg-amber-50/50 dark:bg-[#162A22] p-3.5 rounded-xl border border-amber-200/40 dark:border-[#203A2F]">
                            {renderSharhText(
                              `sharh-${hadith.id}`,
                              bab.sharh_ar,
                              activeSearchQuery
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  }
                )
              )
            ) : pagedShifaEntries.length === 0 ? (
              <div className="text-center py-12 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#122820] rounded-2xl border border-dashed border-gray-300 dark:border-[#203A2F] space-y-3">
                <p className="font-medium text-sm">
                  {activeSearchQuery
                    ? `لم يُعثر على فصول مطابقة لكلمة «${activeSearchQuery}» ضمن النطاق المحدد (${activeScopeDescription}).`
                    : 'لا توجد فصول مطابقة في هذا الباب.'}
                </p>
                {activeSearchQuery && shifaSearchScope !== 'all' && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {shifaSearchScope === 'chapter' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPartFilter(shifaData.meta.partNumber);
                          setSelectedFaslFilter('all');
                          setShifaSearchScope('part');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 text-xs font-bold text-[#143628] dark:text-[#E5C378] hover:border-[#C5A059] cursor-pointer"
                      >
                        توسيع البحث إلى هذا القسم
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPartFilter('all');
                        setSelectedFaslFilter('all');
                        setShifaSearchScope('all');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#143628] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer"
                    >
                      توسيع البحث إلى كامل كتاب الشِّفا (168 فصلاً)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              pagedShifaEntries.map(
                ({
                  chapterMeta,
                  fasl,
                }: {
                  chapterMeta: ShifaChapterMeta;
                  fasl: ShifaFasl;
                }) => (
                  <article
                    key={fasl.id}
                    className="bg-white dark:bg-[#122820] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]/60 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100 dark:border-[#203A2F]/60">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#143628] text-[#E5C378]">
                          <HighlightMatch
                            text={fasl.title_ar}
                            query={activeSearchQuery}
                          />
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {chapterMeta.title_ar}
                        </span>
                        {activeSearchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPartFilter(chapterMeta.partNumber);
                              clearSearch();
                              loadShifaChapter(chapterMeta.chapterNumber, {
                                keepSearch: false,
                                forceScope: 'chapter',
                              });
                              scrollToTop();
                            }}
                            className="text-[11px] font-bold text-[#143628] dark:text-[#E5C378] underline hover:text-[#C5A059] cursor-pointer"
                          >
                            (فتح الباب كاملاً)
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            fasl.id,
                            fasl.text_ar,
                            `الشفا للقاضي عياض • ${chapterMeta.title_ar} • ${fasl.title_ar}`
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#C5A059] transition-colors cursor-pointer"
                      >
                        {copiedId === fasl.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ الفصل</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* النص الكامل للقاضي عياض */}
                    <div className="font-amiri text-lg sm:text-xl leading-loose text-[#143628] dark:text-[#E8F0EC] mb-4 p-4 sm:p-5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border-r-4 border-[#C5A059] whitespace-pre-line">
                      <HighlightMatch
                        text={fasl.text_ar}
                        query={activeSearchQuery}
                      />
                    </div>

                    {/* شرح الملا علي القاري */}
                    <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-[#203A2F]">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-[#8F7032] dark:text-[#C5A059]">
                          ✦ شرح وضبط ألفاظ الشِّفا:
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({fasl.sharh_scholar})
                        </span>
                      </div>
                      <div className="bg-amber-50/50 dark:bg-[#162A22] p-3.5 rounded-xl border border-amber-200/40 dark:border-[#203A2F]">
                        {renderSharhText(
                          `sharh-${fasl.id}`,
                          fasl.sharh_ar,
                          activeSearchQuery
                        )}
                      </div>
                    </div>
                  </article>
                )
              )
            )}
          </div>

          {/* شريط ترقيم الصفحات والتنقل */}
          {(totalPages > 1 || !activeSearchQuery) && (
            <div className="mt-8 bg-white dark:bg-[#122820] rounded-2xl p-4 border border-[#E7DFD5] dark:border-[#203A2F] flex flex-wrap items-center justify-between gap-4">
              {totalPages > 1 ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      scrollToTop();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/30 text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    الصفحة السابقة
                  </button>
                  <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] px-2">
                    صفحة {safePage} من {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      scrollToTop();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/30 text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    الصفحة التالية
                  </button>
                </div>
              ) : (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  عرض جميع النصوص ({activeTotalCount})
                </div>
              )}

              {!activeSearchQuery && (
                <div className="flex items-center gap-2">
                  {selectedSource === 'bukhari' ? (
                    <>
                      <button
                        type="button"
                        disabled={selectedBookNum <= 1}
                        onClick={() => {
                          loadBukhariBook(selectedBookNum - 1);
                          scrollToTop();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#143628]/10 dark:bg-[#1A3329] text-[#143628] dark:text-[#E5C378] text-xs font-bold disabled:opacity-40 cursor-pointer"
                      >
                        → الكتاب السابق
                      </button>
                      <button
                        type="button"
                        disabled={selectedBookNum >= 97}
                        onClick={() => {
                          loadBukhariBook(selectedBookNum + 1);
                          scrollToTop();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#143628] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
                      >
                        الكتاب التالي ←
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={selectedChapterNum <= 0}
                        onClick={() => {
                          loadShifaChapter(selectedChapterNum - 1);
                          scrollToTop();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#143628]/10 dark:bg-[#1A3329] text-[#143628] dark:text-[#E5C378] text-xs font-bold disabled:opacity-40 cursor-pointer"
                      >
                        → الباب السابق
                      </button>
                      <button
                        type="button"
                        disabled={selectedChapterNum >= 13}
                        onClick={() => {
                          loadShifaChapter(selectedChapterNum + 1);
                          scrollToTop();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#143628] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
                      >
                        الباب التالي ←
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
