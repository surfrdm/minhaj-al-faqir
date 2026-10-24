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
  Compass,
  Award,
  Eye,
  Clock,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import initialEdits from "@/data/user_edits.json";
import masarInitial from "@/data/masar.json";

export function WixVisualEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [directMode, setDirectMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"masar" | "shaykh" | "hero" | "adab" | "thawabit">("masar");
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Masar states
  const [masarNotice, setMasarNotice] = useState(masarInitial.meta.notice);
  const [masarStages, setMasarStages] = useState(masarInitial.stages);

  // 2. Shaykh states
  const [shaykhBadge, setShaykhBadge] = useState(
    initialEdits.shaykh?.badge || "الإرشاد والتربية الروحية • السند القادري المتصل"
  );
  const [shaykhName, setShaykhName] = useState(
    initialEdits.shaykh?.name || "الشيخ الدكتور سيدي منير القادري بودشيش"
  );
  const [shaykhRole, setShaykhRole] = useState(
    initialEdits.shaykh?.role || "شيخ الطريقة القادرية البودشيشية ومربيها الروحي"
  );
  const [shaykhDescription, setShaykhDescription] = useState(
    initialEdits.shaykh?.description ||
      "ورقة تعريفية شاملة تبرز استمرارية السند التربوي والروحي للطريقة، وتجمع بين رسوخ التكوين الشرعي الأصيل والانفتاح الأكاديمي والفكري المعاصر."
  );
  const [shaykhSannadP1, setShaykhSannadP1] = useState(
    initialEdits.shaykh?.sannad_p1 ||
      "يُعدّ الشيخ الدكتور سيدي منير القادري بودشيش أحد أبرز أعلام الطريقة القادرية البودشيشية في المرحلة الراهنة، حيث آلت إليه مهمة الإرشاد والتربية الروحية بناء على وصيتين مباركتين للشيخين سيدي حمزة بن العباس وسيدي جمال الدين، رحمهما الله، في سياق استمرارية السند التربوي والروحي للطريقة."
  );
  const [shaykhSannadP2, setShaykhSannadP2] = useState(
    initialEdits.shaykh?.sannad_p2 ||
      "وقد اقترن اسمه بحضور علمي متميز جمع بين التكوين الشرعي والمعرفة العصرية، إذ راكم سيدي منير مسارا أكاديميا متنوعا يعكس انفتاحا على الحقول الإنسانية والاجتماعية والاقتصادية، بما يعزز مقاربته للتصوف في أبعاده الفكرية والتواصلية المعاصرة."
  );

  // 3. Hero states
  const [heroBadge, setHeroBadge] = useState(initialEdits.hero.badge);
  const [heroTitle, setHeroTitle] = useState(initialEdits.hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(initialEdits.hero.subtitle);
  const [heroDescription, setHeroDescription] = useState(initialEdits.hero.description);

  // 4. Adab states
  const [adabTitle, setAdabTitle] = useState(initialEdits.adab_dhikr.title);
  const [adabIntro, setAdabIntro] = useState(initialEdits.adab_dhikr.intro);
  const [adabPoints, setAdabPoints] = useState<string[]>(initialEdits.adab_dhikr.points);

  // 5. Thawabit states
  const [thawabit, setThawabit] = useState(initialEdits.thawabit);

  // Detect current route when opened to auto-switch tab
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p.includes("/masar")) {
        setActiveTab("masar");
      } else if (p.includes("/shaykh")) {
        setActiveTab("shaykh");
      } else {
        setActiveTab("hero");
      }
    }
  }, [isOpen]);

  // Load saved edits from API
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
        if (data.shaykh) {
          if (data.shaykh.badge) setShaykhBadge(data.shaykh.badge);
          if (data.shaykh.name) setShaykhName(data.shaykh.name);
          if (data.shaykh.role) setShaykhRole(data.shaykh.role);
          if (data.shaykh.description) setShaykhDescription(data.shaykh.description);
          if (data.shaykh.sannad_p1) setShaykhSannadP1(data.shaykh.sannad_p1);
          if (data.shaykh.sannad_p2) setShaykhSannadP2(data.shaykh.sannad_p2);
        }
      })
      .catch(() => {});
  }, []);

  const toggleDirectMode = () => {
    if (typeof document !== "undefined") {
      const nextState = !directMode;
      document.designMode = nextState ? "on" : "off";
      setDirectMode(nextState);
      if (nextState) {
        showToast("✏️ وضع التعديل المباشر مفعّل! انقر الآن على أي كلمة بالصفحة واكتب لتغييرها.");
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
        masar: {
          notice: masarNotice,
          stages: masarStages.map((s) => ({
            id: s.id,
            title: s.title,
            duration: s.duration,
            goal: s.goal,
            practice: s.practice,
            review_questions: s.review_questions,
          })),
        },
        shaykh: {
          badge: shaykhBadge,
          name: shaykhName,
          role: shaykhRole,
          description: shaykhDescription,
          sannad_p1: shaykhSannadP1,
          sannad_p2: shaykhSannadP2,
        },
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
        }, 1000);
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

      {/* Direct In-Page Editing Top Alert Bar */}
      {directMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-[#FAF7F2] border-b-2 border-[#C5A059] px-4 py-2.5 shadow-xl flex items-center justify-between text-xs sm:text-sm font-sans" dir="rtl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-[#E5C378]">وضع التعديل المباشر (مثل Wix) نَشِط:</span>
            <span className="hidden sm:inline text-white/90">
              انقر على أي كلمة أو فقرة في الشاشة واكتب للتعديل مباشرة.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="px-3 py-1 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-[#143628] font-bold text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>لوحة النصوص</span>
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
            تعديل نصوص الصفحة (مثل Wix)
          </span>
        </button>
      </div>

      {/* Visual Studio Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
          <div className="w-full max-w-2xl h-full bg-[#FAF7F2] dark:bg-[#0B1914] text-[#1D2A24] dark:text-[#E8F0EC] shadow-2xl border-r border-[#C5A059]/40 flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#C5A059]/15 text-[#C5A059]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                    محرر نصوص المنصة الشامل (Wix Studio)
                  </h3>
                  <p className="text-xs text-[#52796F] dark:text-[#A1B3A9]">
                    عدّل نصوص المسار التكويني، صفحة الشيخ، أو الرئيسية واضغط «حفظ التعديلات».
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-[#E7DFD5]/50 dark:hover:bg-[#1E3B30] text-[#52796F] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick In-Page Direct Toggle */}
            <div className="p-3 bg-[#C5A059]/15 border-b border-[#C5A059]/30 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#143628] dark:text-[#FAF7F2]">
                أو اكتب مباشرة داخل الصفحة نفسها (بالنقر على النص):
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
                <span>{directMode ? "إيقاف التعديل المباشر" : "تفعيل الكتابة بالنقر بالصفحة"}</span>
              </button>
            </div>

            {/* Section Tabs (Now includes Masar and Shaykh) */}
            <div className="flex border-b border-[#E7DFD5] dark:border-[#203A2F] bg-white/70 dark:bg-[#0E2019]/70 px-4 pt-2 gap-1.5 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab("masar")}
                className={`pb-2.5 px-2.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "masar"
                    ? "border-[#C5A059] text-[#143628] dark:text-[#E5C378]"
                    : "border-transparent text-[#52796F] hover:text-[#143628]"
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>المسار التكويني (6 مراحل)</span>
              </button>

              <button
                onClick={() => setActiveTab("shaykh")}
                className={`pb-2.5 px-2.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "shaykh"
                    ? "border-[#C5A059] text-[#143628] dark:text-[#E5C378]"
                    : "border-transparent text-[#52796F] hover:text-[#143628]"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>صفحة الشيخ سيدي منير</span>
              </button>

              <button
                onClick={() => setActiveTab("hero")}
                className={`pb-2.5 px-2.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "hero"
                    ? "border-[#C5A059] text-[#143628] dark:text-[#E5C378]"
                    : "border-transparent text-[#52796F] hover:text-[#143628]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>الرئيسية</span>
              </button>

              <button
                onClick={() => setActiveTab("adab")}
                className={`pb-2.5 px-2.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "adab"
                    ? "border-[#C5A059] text-[#143628] dark:text-[#E5C378]"
                    : "border-transparent text-[#52796F] hover:text-[#143628]"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>آداب الذكر</span>
              </button>

              <button
                onClick={() => setActiveTab("thawabit")}
                className={`pb-2.5 px-2.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "thawabit"
                    ? "border-[#C5A059] text-[#143628] dark:text-[#E5C378]"
                    : "border-transparent text-[#52796F] hover:text-[#143628]"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>الثوابت</span>
              </button>
            </div>

            {/* Drawer Body Forms */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* TAB: MASAR (المسار التكويني) */}
              {activeTab === "masar" && (
                <div className="space-y-6">
                  {/* Notice alert edit */}
                  <div className="p-4 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/40 space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#143628] dark:text-[#FAF7F2]">
                      <AlertTriangle className="w-4 h-4 text-[#C5A059]" />
                      <span>تنبيه الزاوية الأصيل (الذي يظهر في الصندوق البارز بأعلى /masar):</span>
                    </label>
                    <textarea
                      rows={2}
                      value={masarNotice}
                      onChange={(e) => setMasarNotice(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#C5A059]/40 bg-white dark:bg-[#122820] text-xs leading-relaxed font-medium"
                    />
                  </div>

                  {/* 6 Stages Forms */}
                  <div className="space-y-4">
                    <h4 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                      تعديل محتوى المراحل الست للمسار التكويني:
                    </h4>

                    {masarStages.map((stage, sIdx) => (
                      <div
                        key={stage.id}
                        className="p-4 rounded-2xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203A2F] space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[#E7DFD5]/70 dark:border-[#203A2F]/70">
                          <span className="px-2 py-0.5 rounded-md bg-[#1B4332] text-[#C5A059] font-mono font-bold text-xs">
                            المرحلة {stage.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-[#52796F]">المدة:</span>
                            <input
                              type="text"
                              value={stage.duration}
                              onChange={(e) => {
                                const updated = [...masarStages];
                                updated[sIdx].duration = e.target.value;
                                setMasarStages(updated);
                              }}
                              className="p-1 px-2 rounded-md border border-[#E7DFD5] dark:border-[#203A2F] text-xs font-medium w-36"
                            />
                          </div>
                        </div>

                        {/* Stage Title */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#52796F] mb-1">
                            عنوان المرحلة:
                          </label>
                          <input
                            type="text"
                            value={stage.title}
                            onChange={(e) => {
                              const updated = [...masarStages];
                              updated[sIdx].title = e.target.value;
                              setMasarStages(updated);
                            }}
                            className="w-full p-2 rounded-lg border border-[#E7DFD5] dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#0E2019] text-xs font-bold font-amiri"
                          />
                        </div>

                        {/* Stage Goal */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#52796F] mb-1">
                            هدف المرحلة:
                          </label>
                          <textarea
                            rows={2}
                            value={stage.goal}
                            onChange={(e) => {
                              const updated = [...masarStages];
                              updated[sIdx].goal = e.target.value;
                              setMasarStages(updated);
                            }}
                            className="w-full p-2 rounded-lg border border-[#E7DFD5] dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#0E2019] text-xs leading-relaxed"
                          />
                        </div>

                        {/* Stage Practices */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-[#52796F]">
                            الممارسات الروحية والعملية:
                          </label>
                          {stage.practice.map((item, pIdx) => (
                            <input
                              key={pIdx}
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const updated = [...masarStages];
                                updated[sIdx].practice[pIdx] = e.target.value;
                                setMasarStages(updated);
                              }}
                              className="w-full p-1.5 px-2 rounded-lg border border-[#E7DFD5] dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#0E2019] text-xs"
                            />
                          ))}
                        </div>

                        {/* Stage Review Questions */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-[#52796F]">
                            أسئلة المراجعة الذاتية:
                          </label>
                          {stage.review_questions.map((q, qIdx) => (
                            <input
                              key={qIdx}
                              type="text"
                              value={q}
                              onChange={(e) => {
                                const updated = [...masarStages];
                                updated[sIdx].review_questions[qIdx] = e.target.value;
                                setMasarStages(updated);
                              }}
                              className="w-full p-1.5 px-2 rounded-lg border border-[#E7DFD5] dark:border-[#203A2F] bg-[#FAF7F2] dark:bg-[#0E2019] text-xs"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SHAYKH (صفحة الشيخ سيدي منير) */}
              {activeTab === "shaykh" && (
                <div className="space-y-4">
                  <p className="text-xs text-[#52796F] dark:text-[#A1B3A9]">
                    عدّل نصوص وفقرات صفحة الشيخ سيدي منير القادري بودشيش:
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      شارة السند:
                    </label>
                    <input
                      type="text"
                      value={shaykhBadge}
                      onChange={(e) => setShaykhBadge(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      الاسم الكامل مع الألقاب:
                    </label>
                    <input
                      type="text"
                      value={shaykhName}
                      onChange={(e) => setShaykhName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-sm font-bold font-amiri"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      المقام / الصفة:
                    </label>
                    <input
                      type="text"
                      value={shaykhRole}
                      onChange={(e) => setShaykhRole(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      فقرة التقديم في أعلى الصفحة:
                    </label>
                    <textarea
                      rows={3}
                      value={shaykhDescription}
                      onChange={(e) => setShaykhDescription(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      فقرة السند التربوي والوصيتين المباركتين:
                    </label>
                    <textarea
                      rows={4}
                      value={shaykhSannadP1}
                      onChange={(e) => setShaykhSannadP1(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                      فقرة الجمع بين التكوين الشرعي والمعرفة العصرية:
                    </label>
                    <textarea
                      rows={4}
                      value={shaykhSannadP2}
                      onChange={(e) => setShaykhSannadP2(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] bg-white dark:bg-[#122820] text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB: HERO */}
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

              {/* TAB: ADAB DHIKR */}
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

              {/* TAB: THAWABIT */}
              {activeTab === "thawabit" && (
                <div className="space-y-5">
                  <p className="text-xs text-[#52796F] dark:text-[#A1B3A9]">
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
                className="px-4 py-2 rounded-xl border border-[#E7DFD5] dark:border-[#203A2F] text-xs font-semibold text-[#52796F] hover:bg-[#FAF7F2] dark:hover:bg-[#1E3B30] transition cursor-pointer"
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
