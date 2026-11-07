'use client';

import React, { useState, useMemo } from 'react';
import { TurathItem, TurathSource, LanguageView } from '@/types/turath';

interface TurathReaderProps {
  initialItems: TurathItem[];
}

export default function TurathReader({ initialItems }: TurathReaderProps) {
  const [selectedSource, setSelectedSource] = useState<TurathSource>('bukhari');
  const [langView, setLangView] = useState<LanguageView>('ar');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchSource = item.source === selectedSource;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchSource;

      const matchSearch =
        item.text_ar.includes(q) ||
        item.chapter.includes(q) ||
        item.sharh_maliki.text.includes(q) ||
        (item.translations.fr?.text.toLowerCase().includes(q) ?? false) ||
        (item.translations.en?.text.toLowerCase().includes(q) ?? false);

      return matchSource && matchSearch;
    });
  }, [initialItems, selectedSource, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8" dir="rtl">
      {/* الترويسة */}
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-bold text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/30 mb-3">
          مِنْهَاجُ الفَقِير • التُّرَاثُ وَالسُّنَّةُ
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-amiri text-[#143628] dark:text-[#E8F0EC] mb-3">
          الرِّحَابُ الحَدِيثِيَّةُ وَالشَّمَائِلُ النَّبَوِيَّةُ
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          صحيح الإمام البخاري وكتاب الشِّفا للقاضي عياض مؤصَّلَين على مذهب السادة المالكية والمدرسة المغربية.
        </p>
      </div>

      {/* أشرطة التحكم: التبديل بين الكتب واختيار اللغة */}
      <div className="bg-white dark:bg-[#122820] rounded-2xl p-4 shadow-sm border border-[#C5A059]/30 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* اختيار الكتاب */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#07130E] p-1.5 rounded-xl border border-[#C5A059]/20 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setSelectedSource('bukhari')}
            className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              selectedSource === 'bukhari'
                ? 'bg-[#143628] text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#C5A059]'
            }`}
          >
            📖 صحيح البخاري
          </button>
          <button
            type="button"
            onClick={() => setSelectedSource('shifa')}
            className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              selectedSource === 'shifa'
                ? 'bg-[#143628] text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#C5A059]'
            }`}
          >
            🌸 الشِّفا للقاضي عياض
          </button>
        </div>

        {/* اختيار اللغة */}
        <div className="flex items-center gap-1 bg-[#FAF7F2] dark:bg-[#07130E] p-1 rounded-xl text-xs font-medium w-full md:w-auto justify-center">
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
              {lang === 'all' && 'عرض اللغات'}
            </button>
          ))}
        </div>
      </div>

      {/* حقل البحث */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث في المتن، الباب، الشرح، أو الترجمة..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#203A2F] bg-white dark:bg-[#122820] text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
        />
      </div>

      {/* قائمة البطاقات */}
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#122820] rounded-2xl border border-dashed border-gray-300 dark:border-[#203A2F]">
            لا توجد نصوص مطابقة لبحثك في هذا القسم.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#122820] rounded-2xl p-6 shadow-sm border border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]/60 transition-all duration-200"
            >
              {/* ترويسة البطاقة */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100 dark:border-[#203A2F]/60">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#C5A059]/15 text-[#8F7032] dark:text-[#E5C378]">
                    {item.chapter}
                  </span>
                  {item.number && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      رقم: {item.number}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.text_ar)}
                  className="text-xs text-gray-500 hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  {copiedId === item.id ? '✓ تم النسخ' : '📋 نسخ المتن'}
                </button>
              </div>

              {/* الراوي إن وجد */}
              {item.narrator && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  عن: {item.narrator}
                </div>
              )}

              {/* النص العربي المشكول */}
              {(langView === 'ar' || langView === 'all') && (
                <div className="font-amiri text-lg sm:text-xl leading-relaxed text-[#143628] dark:text-[#E8F0EC] mb-4 p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border-r-4 border-[#C5A059]">
                  {item.text_ar}
                </div>
              )}

              {/* الترجمة الفرنسية */}
              {(langView === 'fr' || langView === 'all') && item.translations.fr && (
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0B1E17] border-l-2 border-blue-400" dir="ltr">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mb-1">Français :</span>
                  {item.translations.fr.text}
                </div>
              )}

              {/* الترجمة الإنجليزية */}
              {(langView === 'en' || langView === 'all') && item.translations.en && (
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0B1E17] border-l-2 border-emerald-500" dir="ltr">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">English :</span>
                  {item.translations.en.text}
                </div>
              )}

              {/* بطاقة الشرح والتأصيل المالكي المغربي */}
              <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-[#203A2F]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-[#C5A059]">✦ التأصيل والمساق المالكي المغربي:</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">({item.sharh_maliki.scholar})</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-normal bg-amber-50/50 dark:bg-[#162A22] p-3 rounded-xl border border-amber-200/40 dark:border-[#203A2F]">
                  {item.sharh_maliki.text}
                </p>
              </div>

              {/* الوسوم السلوكية */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#1A3329] text-gray-600 dark:text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
