'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  ScrollText,
  Sparkles,
} from 'lucide-react';
import type {
  TurathSource,
  LanguageView,
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

export default function TurathReader({
  bukhariIndex,
  shifaIndex,
  initialBukhariBook,
  initialShifaChapter,
}: TurathReaderProps) {
  const [selectedSource, setSelectedSource] = useState<TurathSource>('bukhari');
  const [langView, setLangView] = useState<LanguageView>('ar');

  // Bukhari state
  const [selectedBookNum, setSelectedBookNum] = useState<number>(1);
  const [selectedBabFilter, setSelectedBabFilter] = useState<string>('all');
  const [bukhariData, setBukhariData] = useState<BukhariBookData>(initialBukhariBook);
  const bukhariCacheRef = useRef<Map<number, BukhariBookData>>(
    new Map([[initialBukhariBook.meta.bookNumber, initialBukhariBook]])
  );

  // Shifa state
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(0);
  const [shifaData, setShifaData] = useState<ShifaChapterData>(initialShifaChapter);
  const shifaCacheRef = useRef<Map<number, ShifaChapterData>>(
    new Map([[initialShifaChapter.meta.chapterNumber, initialShifaChapter]])
  );

  // Shared pagination, loading, search & expand state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState<string>('');
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
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

  const scrollToTop = () => {
    readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectSource = (src: TurathSource) => {
    setSelectedSource(src);
    setCurrentPage(1);
    setLoadError(null);
    // Keep search input clean on source switch so results match active book
    if (activeSearchQuery) {
      setActiveSearchQuery('');
      setBukhariSearchResults(null);
      setShifaSearchResults(null);
    }
  };

  const loadBukhariBook = async (bookNum: number) => {
    setSelectedBookNum(bookNum);
    setSelectedBabFilter('all');
    setCurrentPage(1);
    setActiveSearchQuery('');
    setBukhariSearchResults(null);
    setLoadError(null);

    const cached = bukhariCacheRef.current.get(bookNum);
    if (cached) {
      setBukhariData(cached);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/turath?source=bukhari&book=${bookNum}`);
      if (!res.ok) throw new Error('تعذر تحميل بيانات الكتاب');
      const data = (await res.json()) as BukhariBookData;
      bukhariCacheRef.current.set(bookNum, data);
      setBukhariData(data);
    } catch {
      setLoadError('حدث خطأ أثناء تحميل هذا الكتاب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadShifaChapter = async (chNum: number) => {
    setSelectedChapterNum(chNum);
    setCurrentPage(1);
    setActiveSearchQuery('');
    setShifaSearchResults(null);
    setLoadError(null);

    const cached = shifaCacheRef.current.get(chNum);
    if (cached) {
      setShifaData(cached);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/turath?source=shifa&chapter=${chNum}`);
      if (!res.ok) throw new Error('تعذر تحميل بيانات الباب');
      const data = (await res.json()) as ShifaChapterData;
      shifaCacheRef.current.set(chNum, data);
      setShifaData(data);
    } catch {
      setLoadError('حدث خطأ أثناء تحميل هذا الباب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const runGlobalSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchInput.trim();
    if (!q) {
      clearSearch();
      return;
    }
    if (q.length < 2 && !/^\d+$/.test(q)) {
      setLoadError('أدخل كلمتين أو حرفين على الأقل للبحث، أو رقم حديث صحيح.');
      return;
    }

    setIsSearching(true);
    setLoadError(null);
    setActiveSearchQuery(q);
    setCurrentPage(1);

    try {
      const res = await fetch(
        `/api/turath?source=${selectedSource}&q=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error('خطأ في البحث');
      const data = await res.json();
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
    } catch {
      setLoadError('تعذر تنفيذ البحث الشامل في التراث حالياً.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setActiveSearchQuery('');
    setBukhariSearchResults(null);
    setShifaSearchResults(null);
    setLoadError(null);
    setCurrentPage(1);
  };

  const toggleSharh = (id: string) => {
    setExpandedSharh((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string, refLabel: string) => {
    navigator.clipboard.writeText(`${text}\n\n— [${refLabel}]`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Bukhari items (either search results or current book filtered by optional Bab)
  const bukhariBabsList = useMemo(() => {
    return Object.values(bukhariData.babs);
  }, [bukhariData]);

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

  const currentShifaEntries = useMemo(() => {
    if (activeSearchQuery && shifaSearchResults) {
      return shifaSearchResults.results;
    }
    return shifaData.fasls.map((fasl) => ({
      chapterMeta: shifaData.meta,
      fasl,
    }));
  }, [activeSearchQuery, shifaSearchResults, shifaData]);

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

  const renderSharhText = (cardKey: string, text: string) => {
    const isLong = text.length > 440;
    const isOpen = !!expandedSharh[cardKey];
    const displayed = isLong && !isOpen ? `${text.slice(0, 400).trim()}...` : text;

    return (
      <>
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {displayed}
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
    <div ref={readerTopRef} className="w-full max-w-5xl mx-auto px-4 py-6" dir="rtl">
      {/* الترويسة */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F7032] dark:text-[#E5C378] bg-[#C5A059]/10 px-3.5 py-1.5 rounded-full border border-[#C5A059]/30 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          مِنْهَاجُ الفَقِير • الخِزَانَةُ الحَدِيثِيَّةُ الكَامِلَةُ
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-amiri text-[#143628] dark:text-[#E8F0EC] mb-3">
          الرِّحَابُ الحَدِيثِيَّةُ وَالشَّمَائِلُ النَّبَوِيَّةُ
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          المتن الكامل لصحيح الإمام البخاري (٩٧ كتاباً • ٧٥٨٠ حديثاً) وكتاب الشِّفا للقاضي عياض (٤ أقسام • ١٤ باباً) مؤصَّلَين بشرح الإمام ابن بطال المالكي وشرح الملا علي القاري.
        </p>

        {/* روابط المصادر الرسمية المغربية */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <a
            href="https://hadithm6.ma"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#122820] border border-[#C5A059]/30 text-[#143628] dark:text-[#E5C378] hover:border-[#C5A059] transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
            منصة محمد السادس للحديث الشريف (السرد الصوتي والتخريج)
          </a>
          <a
            href="https://www.habous.gov.ma"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#122820] border border-[#C5A059]/30 text-[#143628] dark:text-[#E5C378] hover:border-[#C5A059] transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
            خزانة وزارة الأوقاف المغربية (الطبعة الملكية للشِّفا)
          </a>
        </div>
      </div>

      {/* أشرطة التحكم: التبديل بين الكتب واختيار اللغة */}
      <div className="bg-white dark:bg-[#122820] rounded-2xl p-4 shadow-sm border border-[#C5A059]/30 mb-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#07130E] p-1.5 rounded-xl border border-[#C5A059]/20 w-full md:w-auto">
          <button
            type="button"
            onClick={() => handleSelectSource('bukhari')}
            className={`flex-1 md:flex-initial px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              selectedSource === 'bukhari'
                ? 'bg-[#143628] text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#C5A059]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C5A059]" />
            <span>صحيح البخاري (٩٧)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectSource('shifa')}
            className={`flex-1 md:flex-initial px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              selectedSource === 'shifa'
                ? 'bg-[#143628] text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#C5A059]'
            }`}
          >
            <ScrollText className="w-4 h-4 text-[#C5A059]" />
            <span>الشِّفا للقاضي عياض (١٤)</span>
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

      {/* شريط الفهرس والانتقال + البحث الشامل */}
      <div className="bg-white dark:bg-[#122820] rounded-2xl p-4 sm:p-5 shadow-sm border border-[#E7DFD5] dark:border-[#203A2F] mb-6 space-y-4">
        {/* اختيار الكتاب أو الباب */}
        {selectedSource === 'bukhari' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#8F7032] dark:text-[#E5C378] mb-1.5">
                اختر الكتاب من صحيح البخاري (١ - ٩٧):
              </label>
              <select
                value={selectedBookNum}
                onChange={(e) => loadBukhariBook(Number(e.target.value))}
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
              <label className="block text-xs font-bold text-[#8F7032] dark:text-[#E5C378] mb-1.5">
                تصفية حسب الباب داخل هذا الكتاب ({bukhariBabsList.length} باباً):
              </label>
              <select
                value={selectedBabFilter}
                onChange={(e) => {
                  setSelectedBabFilter(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={isLoading || Boolean(activeSearchQuery)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#07130E] text-sm font-medium text-[#143628] dark:text-[#E8F0EC] focus:outline-none focus:ring-2 focus:ring-[#C5A059] disabled:opacity-50"
              >
                <option value="all">جميع أبواب الكتاب ({bukhariData.hadiths.length} حديثاً)</option>
                {bukhariBabsList.map((bab) => (
                  <option key={bab.id} value={bab.id}>
                    {bab.title_ar.length > 90 ? `${bab.title_ar.slice(0, 90)}...` : bab.title_ar}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-[#8F7032] dark:text-[#E5C378] mb-1.5">
              فهرس أقسام وأبواب الشِّفا بتعريف حقوق المصطفى ﷺ (١٤ قسماً وباباً • ١٦٨ فصلاً):
            </label>
            <select
              value={selectedChapterNum}
              onChange={(e) => loadShifaChapter(Number(e.target.value))}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#07130E] text-sm font-medium text-[#143628] dark:text-[#E8F0EC] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            >
              {shifaIndex.map((ch) => (
                <option key={ch.chapterNumber} value={ch.chapterNumber}>
                  {ch.chapterNumber === 0
                    ? `٠. ${ch.title_ar}`
                    : `القسم ${ch.partNumber} • ${ch.title_ar}`}
                  {langView === 'fr' || langView === 'all' ? ` — ${ch.title_fr}` : ''}
                  {` (${ch.faslCount} فصول)`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* حقل البحث الشامل في كامل الكتاب */}
        <form onSubmit={runGlobalSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                selectedSource === 'bukhari'
                  ? 'ابحث في كامل صحيح البخاري (7580 حديثاً) بالكلمة أو برقم الحديث مثل: 1 أو 255 أو الإحسان أو intention...'
                  : 'ابحث في كامل كتاب الشفا للقاضي عياض (168 فصلاً) مثل: الإسراء أو الشفاعة أو المحبة...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#07130E] text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                title="مسح البحث"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 rounded-xl bg-[#143628] hover:bg-[#1B4332] text-white text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-[#C5A059]" />
            )}
            <span>بحث شامل</span>
          </button>
        </form>
      </div>

      {/* بطاقة تعريف الكتاب أو الباب الحالي / نتائج البحث */}
      {activeSearchQuery ? (
        <div className="bg-amber-50/70 dark:bg-[#162A22] border border-[#C5A059]/40 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm">
            <span className="font-bold text-[#143628] dark:text-[#E5C378]">
              نتائج البحث الشامل عن «{activeSearchQuery}»:{' '}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {selectedSource === 'bukhari' && bukhariSearchResults
                ? `${bukhariSearchResults.totalMatches} نتيجة مطابقة${
                    bukhariSearchResults.truncated ? ' (أول 40 نتيجة)' : ''
                  }`
                : selectedSource === 'shifa' && shifaSearchResults
                ? `${shifaSearchResults.totalMatches} فصلاً مطابقاً${
                    shifaSearchResults.truncated ? ' (أول 40 نتيجة)' : ''
                  }`
                : ''}
            </span>
          </div>
          <button
            type="button"
            onClick={clearSearch}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-[#0B1E17] border border-[#C5A059]/30 text-[#143628] dark:text-[#E5C378] hover:bg-[#C5A059]/10 cursor-pointer"
          >
            العودة لتصفح الفصول
          </button>
        </div>
      ) : selectedSource === 'bukhari' ? (
        <div className="bg-gradient-to-l from-[#143628] to-[#0E271D] text-white rounded-2xl p-5 mb-6 border border-[#C5A059]/40 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs text-[#E5C378] font-bold mb-1">
                صحيح الإمام البخاري • الكتاب {bukhariData.meta.bookNumber} من ٩٧
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
            {isSearching ? 'جارٍ البحث في النصوص الكاملة...' : 'جارٍ تحميل نصوص الكتاب...'}
          </p>
        </div>
      ) : (
        <>
          {/* قائمة البطاقات */}
          <div className="space-y-6">
            {selectedSource === 'bukhari' ? (
              pagedBukhariEntries.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#122820] rounded-2xl border border-dashed border-gray-300 dark:border-[#203A2F]">
                  لا توجد أحاديث مطابقة في هذا القسم.
                </div>
              ) : (
                pagedBukhariEntries.map(({ bookMeta, bab, hadith }: {
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
                            {bab.title_ar}
                          </span>
                          {activeSearchQuery && (
                            <button
                              type="button"
                              onClick={() => {
                                loadBukhariBook(bookMeta.bookNumber);
                                scrollToTop();
                              }}
                              className="text-[11px] font-bold text-[#143628] dark:text-[#E5C378] underline hover:text-[#C5A059] cursor-pointer"
                            >
                              (فتح الكتاب كاملاً)
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
                          {hadith.text_ar}
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
                          {hadith.text_fr}
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
                          {hadith.text_en}
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-[#203A2F]">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs font-bold text-[#8F7032] dark:text-[#C5A059]">
                            ✦ {bab.has_ibn_battal ? 'الشرح المالكي (ابن بطال القرطبي):' : 'مرجع وتوجيه مالكي مغربي:'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({bab.sharh_scholar})
                          </span>
                        </div>
                        <div className="bg-amber-50/50 dark:bg-[#162A22] p-3.5 rounded-xl border border-amber-200/40 dark:border-[#203A2F]">
                          {renderSharhText(`sharh-${hadith.id}`, bab.sharh_ar)}
                        </div>
                      </div>
                    </article>
                  );
                })
              )
            ) : pagedShifaEntries.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#122820] rounded-2xl border border-dashed border-gray-300 dark:border-[#203A2F]">
                لا توجد فصول مطابقة لبحثك في كتاب الشِّفا.
              </div>
            ) : (
              pagedShifaEntries.map(({ chapterMeta, fasl }: {
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
                        {fasl.title_ar}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {chapterMeta.title_ar}
                      </span>
                      {activeSearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            loadShifaChapter(chapterMeta.chapterNumber);
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
                    {fasl.text_ar}
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
                      {renderSharhText(`sharh-${fasl.id}`, fasl.sharh_ar)}
                    </div>
                  </div>
                </article>
              ))
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
