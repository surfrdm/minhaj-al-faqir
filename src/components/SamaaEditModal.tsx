"use client";

import React, { useState } from "react";
import {
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Edit3,
  Check,
  BookOpen,
  AlignRight,
  List,
} from "lucide-react";

export interface PoemData {
  id: string;
  title: string;
  poet: string;
  diwan?: string;
  category?: string;
  maqam: string;
  keywords?: string[];
  allVerses: string[];
  spiritualExplanation: string;
  nextSuggestedPoems?: { id: string; title: string; poet: string }[];
}

interface SamaaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  poem: PoemData;
  originalPoem?: PoemData;
  onSave: (updatedPoem: PoemData) => void | Promise<void>;
  onResetToOriginal?: () => void;
}

export function SamaaEditModal({
  isOpen,
  onClose,
  poem,
  originalPoem,
  onSave,
  onResetToOriginal,
}: SamaaEditModalProps) {
  const [title, setTitle] = useState(poem.title);
  const [poet, setPoet] = useState(poem.poet);
  const [maqam, setMaqam] = useState(poem.maqam);
  const [diwan, setDiwan] = useState(poem.diwan || "");
  const [explanation, setExplanation] = useState(poem.spiritualExplanation || "");
  const [verses, setVerses] = useState<string[]>([...poem.allVerses]);
  const [mode, setMode] = useState<"individual" | "raw">("individual");
  const [rawText, setRawText] = useState(poem.allVerses.join("\n"));
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle switching to individual mode: parse rawText by lines
  const handleSwitchToIndividual = () => {
    const lines = rawText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    setVerses(lines.length > 0 ? lines : [""]);
    setMode("individual");
  };

  // Handle switching to raw text mode: join verses
  const handleSwitchToRaw = () => {
    setRawText(verses.join("\n"));
    setMode("raw");
  };

  const handleVerseChange = (index: number, value: string) => {
    const updated = [...verses];
    updated[index] = value;
    setVerses(updated);
  };

  const handleAddVerse = (afterIndex?: number) => {
    const updated = [...verses];
    const insertAt = typeof afterIndex === "number" ? afterIndex + 1 : updated.length;
    updated.splice(insertAt, 0, "");
    setVerses(updated);
  };

  const handleDeleteVerse = (index: number) => {
    if (verses.length <= 1) {
      setVerses([""]);
      return;
    }
    const updated = verses.filter((_, i) => i !== index);
    setVerses(updated);
  };

  const handleMoveVerse = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= verses.length) return;
    const updated = [...verses];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setVerses(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    let finalVerses: string[] = [];
    if (mode === "raw") {
      finalVerses = rawText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    } else {
      finalVerses = verses.map((v) => v.trim()).filter(Boolean);
    }

    if (finalVerses.length === 0) {
      finalVerses = [""];
    }

    const updatedPoem: PoemData = {
      ...poem,
      title: title.trim() || poem.title,
      poet: poet.trim() || poem.poet,
      maqam: maqam.trim() || poem.maqam,
      diwan: diwan.trim() || undefined,
      spiritualExplanation: explanation.trim(),
      allVerses: finalVerses,
    };

    try {
      await onSave(updatedPoem);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-[#FAF7F2] dark:bg-[#0C1E17] rounded-3xl border-2 border-[#C5A059] shadow-2xl flex flex-col overflow-hidden text-[#1D2A24] dark:text-[#E8F0EC]"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-white via-[#FCFAF5] to-white dark:from-[#0E221B] dark:via-[#132A21] dark:to-[#0E221B] border-b border-[#E7DFD5] dark:border-[#1F3D2F] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#C5A059]/20 text-[#826122] dark:text-[#E5C378] border border-[#C5A059]/40">
              <Edit3 className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                تصحيح وتنقيح القصيدة
              </h3>
              <p className="font-ibm text-xs text-[#6B7D74] dark:text-[#95B8A8]">
                عدّل الكلمات، الشكْل (التشكيل)، ترتيب الأبيات، أو أضف أبياتاً جديدة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 font-ibm text-sm">
          {/* Top metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#143628] dark:text-[#E5C378]">
                عنوان القصيدة *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان القصيدة أو مطلعها"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] focus:border-[#C5A059] focus:outline-none font-amiri text-base font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#143628] dark:text-[#E5C378]">
                الشاعر / الناظم *
              </label>
              <input
                type="text"
                value={poet}
                onChange={(e) => setPoet(e.target.value)}
                placeholder="اسم الناظم (مثال: سيدي محمد الحراق)"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] focus:border-[#C5A059] focus:outline-none font-amiri text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#143628] dark:text-[#E5C378]">
                المقام الموسيقي أو النوبة
              </label>
              <input
                type="text"
                value={maqam}
                onChange={(e) => setMaqam(e.target.value)}
                placeholder="مثال: مقام البياتي / نوبة رمل الماية"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] focus:border-[#C5A059] focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#143628] dark:text-[#E5C378]">
                المصدر أو الديوان المعتمد
              </label>
              <input
                type="text"
                value={diwan}
                onChange={(e) => setDiwan(e.target.value)}
                placeholder="مثال: ديوان الحراق ص 14 أو كتاب قصائد السماع"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] focus:border-[#C5A059] focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Verses Editor Section */}
          <div className="space-y-3 pt-2 border-t border-[#E7DFD5] dark:border-[#1F3D2F]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>أبيات القصيدة ({mode === "individual" ? verses.length : rawText.split("\n").filter(Boolean).length} بيت)</span>
                </h4>
                <p className="text-[11px] text-[#6B7D74] dark:text-[#95B8A8]">
                  افصل بين الشطرين (الصدر والعجز) بعلامة <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-bold">...</code>
                </p>
              </div>

              {/* Mode switch pills */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] text-xs">
                <button
                  type="button"
                  onClick={handleSwitchToIndividual}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    mode === "individual"
                      ? "bg-[#1B4332] text-white font-bold"
                      : "text-gray-600 dark:text-gray-300 hover:text-black"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>بيت ببيت</span>
                </button>
                <button
                  type="button"
                  onClick={handleSwitchToRaw}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    mode === "raw"
                      ? "bg-[#1B4332] text-white font-bold"
                      : "text-gray-600 dark:text-gray-300 hover:text-black"
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                  <span>نص شامل (لصق سريع)</span>
                </button>
              </div>
            </div>

            {/* Individual Verses Mode */}
            {mode === "individual" ? (
              <div className="space-y-2.5">
                {verses.map((verse, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] flex items-center gap-2 group hover:border-[#C5A059]/60 transition"
                  >
                    <span className="font-mono text-xs text-[#C5A059] font-bold px-1.5 shrink-0">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={verse}
                      onChange={(e) => handleVerseChange(idx, e.target.value)}
                      placeholder={`أدخل البيت ${idx + 1} (الصدر ... العجز)`}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#0C1E17] border border-[#E7DFD5] dark:border-[#1F3D2F] focus:border-[#C5A059] focus:outline-none font-amiri text-base leading-relaxed"
                    />

                    {/* Action buttons per verse */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveVerse(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                        title="تحريك لأعلى"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveVerse(idx, "down")}
                        disabled={idx === verses.length - 1}
                        className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                        title="تحريك لأسفل"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddVerse(idx)}
                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-950/30 cursor-pointer"
                        title="إضافة بيت تحته"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteVerse(idx)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 dark:hover:bg-red-950/30 cursor-pointer"
                        title="حذف هذا البيت"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddVerse()}
                  className="w-full py-2.5 rounded-xl border border-dashed border-[#C5A059] text-xs font-bold text-[#826122] dark:text-[#E5C378] hover:bg-[#C5A059]/10 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة بيت في نهاية القصيدة</span>
                </button>
              </div>
            ) : (
              /* Raw Multi-line Editor Mode */
              <div className="space-y-2">
                <textarea
                  rows={10}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="الصق أو اكتب الأبيات هنا، سطراً بسطر. وافصل بين الصدر والعجز بـ (...)"
                  className="w-full p-4 rounded-2xl bg-white dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] focus:border-[#C5A059] focus:outline-none font-amiri text-base leading-loose"
                />
                <p className="text-[11px] text-gray-500">
                  💡 عند التبديل إلى «بيت ببيت»، سيتم تحويل كل سطر تلقائياً إلى بيت مستقل.
                </p>
              </div>
            )}
          </div>

          {/* Spiritual Explanation Field */}
          <div className="space-y-1.5 pt-2 border-t border-[#E7DFD5] dark:border-[#1F3D2F]">
            <label className="text-xs font-bold text-[#143628] dark:text-[#E5C378]">
              البيان الصوفي والنفحات الذوقية (اختياري)
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="اكتب نبذة أو شرحاً رمزياً لمعاني القصيدة ومقاماتها في السير إلى الله..."
              className="w-full p-3 rounded-xl bg-white dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#1F3D2F] focus:border-[#C5A059] focus:outline-none text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#0E221B] border-t border-[#E7DFD5] dark:border-[#1F3D2F] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onResetToOriginal && originalPoem && (
              <button
                type="button"
                onClick={onResetToOriginal}
                className="px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-1.5 cursor-pointer"
                title="استعادة النص الأصلي قبل أي تعديل"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span>إعادة ضبط للأصل</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                saveSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-[#1B4332] hover:bg-[#143628] text-white border border-[#C5A059]/40"
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>تم حفظ التصحيح بنجاح!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#C5A059]" />
                  <span>{isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
