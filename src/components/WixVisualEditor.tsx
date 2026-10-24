"use client";

import { useState, useEffect } from "react";
import {
  Edit3,
  Check,
  X,
  Save,
  Sliders,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Clock,
  Layers,
  RotateCcw,
  AlertCircle,
  Eye,
} from "lucide-react";
import initialEdits from "@/data/user_edits.json";

export function WixVisualEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [directMode, setDirectMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "adab" | "thawabit">("hero");
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states initialized from data/user_edits.json
  const [heroBadge, setHeroBadge] = useState(initialEdits.hero.badge);
  const [heroTitle, setHeroTitle] = useState(initialEdits.hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(initialEdits.hero.subtitle);
  const [heroDescription, setHeroDescription] = useState(initialEdits.hero.description);

  const [adabTitle, setAdabTitle] = useState(initialEdits.adab_dhikr.title);
  const [adabIntro, setAdabIntro] = useState(initialEdits.adab_dhikr.intro);
  const [adabPoints, setAdabPoints] = useState<string[]>(initialEdits.adab_dhikr.points);

  const [thawabit, setThawabit] = useState(initialEdits.thawabit);

  // Load latest edits from API on mount
  useEffect(() => {
    fetch("/api/wix-save")
      .then((res) => res.json())
      .then((data) => {
        if (data.hero) {
          setHeroBadge(data.hero.badge || initialEdits.hero.badge);
          setHeroTitle(data.hero.title || initialEdits.hero.title);
          setHeroSubtitle(data.hero.subtitle || initialEdits.hero.subtitle);
          setHeroDescription(data.hero.description || initialEdits.hero.description);
        }
        if (data.adab_dhikr) {
          setAdabTitle(data.adab_dhikr.title || initialEdits.adab_dhikr.title);
          setAdabIntro(data.adab_dhikr.intro || initialEdits.adab_dhikr.intro);
          if (Array.isArray(data.adab_dhikr.points)) {
            setAdabPoints(data.adab_dhikr.points);
          }
        }
        if (Array.isArray(data.thawabit)) {
          setThawabit(data.thawabit);
        }
      })
      .catch(() => {});
  }, []);

  // Handle direct designMode toggle (Click and edit anywhere on page)
  const toggleDirectMode = () => {
    if (typeof document !== "undefined") {
      const nextState = !directMode;
      document.designMode = nextState ? "on" : "off";
      setDirectMode(nextState);
      if (nextState) {
        showToast("✏️ وضع التعديل المباشر مفعّل! انقر الآن على أي كلمة في الصفحة واكتب بحرية.");
      } else {
        showToast("✓ تم إيقاف وضع التعديل المباشر.");
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveStudio = async () => {
    setSaving(true);
    try {
      const payload = {
        hero: {
          badge: heroBadge,
          title: heroTitle,
          subtitle: heroSubtitle,
          description: heroDescription,
        },
        adab_dhikr: {
          title: adabTitle,
          intro: adabIntro,
          points: adabPoints,
        },
        thawabit: thawabit,
      };

      const res = await fetch("/api/wix-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("✓ تم حفظ تعديلاتك بنجاح في الموقع!");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        showToast("حدث خطأ أثناء الحفظ، يرجى المحاولة ثانية.");
      }
    } catch (e) {
      showToast("تعذر الاتصال بالخادم لحفظ التعديلات.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#143628] text-[#FAF7F2] border-2 border-[#C5A059] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 font-sans text-sm">
          <Sparkles className="w-5 h-5 text-[#C5A059] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Direct In-Page Editing Top Alert Bar (when directMode is ON) */}
      {directMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-[#FAF7F2] border-b-2 border-[#C5A059] px-4 py-2.5 shadow-xl flex items-center justify-between text-xs sm:text-sm font-sans" dir="rtl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-[#E5C378]">وضع التعديل المباشر (مثل Wix) نَشِط:</span>
            <span className="hidden sm:inline text-white/90">
              انقر على أي نص أو عنوان على الشاشة واكتب للتعديل مباشرة.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="px-3 py-1 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-[#143628] font-bold text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>لوحة النصوص المنظمة</span>
            </button>
            <button
              onClick={toggleDirectMode}
              className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>إنهاء</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2" dir="rtl">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] border-2 border-[#C5A059] shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          title="افتح لوحة تعديل النصوص مباشرة كما في Wix"
        >
          <div className="p-1 rounded-full bg-[#C5A059] text-[#143628]">
            <Edit3 className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-[#E5C378]">
            تعديل النصوص (مثل Wix)
          </span>
        </button>
      </div>

      {/* Visual Studio Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
          <div className="w-full max-w-xl h-full bg-[#FAF7F2] dark:bg-[#0B1914] text-[#1D2A24] dark:text-[#E8F0EC] shadow-2xl border-r border-[#C5A059]/40 flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#C5A059]/15 text-[#C5A059]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                    محرر نصوص المنهاج البصري (Wix Studio)
                  </h3>
                  <p className="text-xs text-[#84928A]">
                    عدّل أي نص بسهولة واضغط «حفظ التعديلات» ليتم تطبيقها فوراً.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-[#E7DFD5]/50 dark:hover:bg-[#1E3B30] text-[#84928A] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick In-Page Direct Toggle inside Drawer */}
            <div className="p-3 bg-[#C5A059]/15 border-b border-[#C5A059]/30 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#143628] dark:text-[#FAF7F2]">
                أو اكتب مباشرة داخل الصفحة نفسها:
              </span>
              <button
                onClick={toggleDirectMode}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  directMode
                    ? "bg-[#1B4332] text-[#FAF7F2]"
                    : "bg-[#C5A059] text-[#143628] hover:bg-[#D4AF37]"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{directMode ? "إيقاف التعديل المباشر" : "تفعيل الكتابة بالصفحة"}</span>
              </button>
            </div>

            {/* Section Tabs */}
            <div className="flex border-b border-[#E7DFD5] dark:border-[#203A2F] bg-white/70 dark:bg-[#0E2019]/70 px-4 pt-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("hero")}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "hero"
                    ? "border-[#C5A059] text-[#143628] dark:text-[#E5C378]"
                    : "border-transparent text-[#84928A] hover:text-[#143628]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>الرئيسية والتعريف</span>
              </button>

              <button
                onClick={() => setActiveTab("adab")}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "adab"
                    ? "border-[#C5A059] text-[#143628] dark:text-[#E5C378]"
                    : "border-transparent text-[#84928A] hover:text-[#143628]"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>آداب الذكر (11 أدباً)</span>
              </button>

              <button
                onClick={() => setActiveTab("thawabit")}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "thawabit"
                    ? "border-[#C5A059] text-[#143628] dark:text-[#E5C378]"
                    : "border-transparent text-[#84928A] hover:text-[#143628]"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>الثوابت الخمسة</span>
              </button>
            </div>

            {/* Drawer Body Forms */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* TAB 1: HERO */}
              {activeTab === "hero" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      شارة أعلى الصفحة:
                    </label>
                    <input
                      type="text"
                      value={heroBadge}
                      onChange={(e) => setHeroBadge(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-xs font-medium focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      العنوان الرئيسي للموقع:
                    </label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-base font-bold font-amiri focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      العنوان الفرعي:
                    </label>
                    <input
                      type="text"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-xs font-medium focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      فقرة التعريف الشاملة:
                    </label>
                    <textarea
                      rows={4}
                      value={heroDescription}
                      onChange={(e) => setHeroDescription(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-xs leading-relaxed focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: ADAB DHIKR */}
              {activeTab === "adab" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      عنوان القسم:
                    </label>
                    <input
                      type="text"
                      value={adabTitle}
                      onChange={(e) => setAdabTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-sm font-bold font-amiri"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      مقدمة آداب الذكر:
                    </label>
                    <textarea
                      rows={2}
                      value={adabIntro}
                      onChange={(e) => setAdabIntro(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-xs leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2]">
                      بنود آداب الذكر (عدّل أي بند مباشرة):
                    </label>
                    {adabPoints.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center text-[10px] font-mono shrink-0 mt-1">
                          {pIdx + 1}
                        </span>
                        <textarea
                          rows={2}
                          value={point}
                          onChange={(e) => {
                            const updated = [...adabPoints];
                            updated[pIdx] = e.target.value;
                            setAdabPoints(updated);
                          }}
                          className="flex-1 p-2 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-xs leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: THAWABIT */}
              {activeTab === "thawabit" && (
                <div className="space-y-5">
                  <p className="text-xs text-[#84928A]">
                    عدّل نصوص وبنود الثوابت الخمسة الموصى بها من فضيلة الشيخ:
                  </p>

                  {thawabit.map((item, tIdx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203A2F] space-y-2.5"
                    >
                      <div className="flex items-center gap-2 text-[#C5A059]">
                        <ShieldCheck className="w-4 h-4" />
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...thawabit];
                            updated[tIdx].title = e.target.value;
                            setThawabit(updated);
                          }}
                          className="font-amiri font-bold text-sm text-[#143628] dark:text-[#FAF7F2] bg-transparent border-b border-[#C5A059]/40 w-full"
                        />
                      </div>

                      <div className="space-y-2 pt-1">
                        {item.points.map((pt, pIdx) => (
                          <textarea
                            key={pIdx}
                            rows={2}
                            value={pt}
                            onChange={(e) => {
                              const updated = [...thawabit];
                              updated[tIdx].points[pIdx] = e.target.value;
                              setThawabit(updated);
                            }}
                            className="w-full p-2 rounded-lg border border-[#E7DFD5]/70 dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#0E2019] text-xs leading-relaxed"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] flex items-center justify-between gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] text-xs font-semibold text-[#84928A] hover:bg-[#FAF7F2] dark:hover:bg-[#1E3B30] transition cursor-pointer"
              >
                إلغاء
              </button>

              <button
                onClick={handleSaveStudio}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] border border-[#C5A059] text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>{saving ? "جاري الحفظ..." : "💾 حفظ التعديلات في الموقع فوراً"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
