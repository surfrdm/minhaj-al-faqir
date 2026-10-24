"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  HelpCircle,
  Compass,
  Clock,
  BookOpen,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MASAR_DATA, getApprovedBooks, type MasarStage } from "@/lib/masar";

export default function MasarPage() {
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("minhaj_masar_progress");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCompletedStages(parsed);
          }
        }
      } catch (e) {
        console.error("Error reading masar progress", e);
      }
    }
  }, []);

  // Save progress
  const toggleStage = (stageId: number) => {
    setCompletedStages((prev) => {
      const updated = prev.includes(stageId)
        ? prev.filter((id) => id !== stageId)
        : [...prev, stageId];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("minhaj_masar_progress", JSON.stringify(updated));
        } catch (e) {
          console.error("Error saving masar progress", e);
        }
      }
      return updated;
    });
  };

  const copyPageLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const progressPercentage = Math.round(
    (completedStages.length / MASAR_DATA.stages.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B1914] text-[#1D2A24] dark:text-[#E8F0EC] transition-colors duration-300 font-sans selection:bg-[#C5A059]/30" dir="rtl">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-[#52796F] dark:text-[#A1B3A9] mb-8 pb-4 border-b border-[#E7DFD5] dark:border-[#203A2F]">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hover:text-[#1B4332] dark:hover:text-[#D4AF37] transition-colors flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </Link>
            <span>/</span>
            <span className="text-[#143628] dark:text-[#FAF7F2] font-semibold">
              مسار الفقير التكويني
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyPageLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C5A059]/30 hover:border-[#C5A059] bg-white/60 dark:bg-[#122820] text-xs font-medium text-[#1B4332] dark:text-[#E8F0EC] transition-all hover:shadow-sm"
              title="نسخ رابط صفحة المسار"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#D4AF37]" />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>مشاركة المسار</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#9E7B35] dark:text-[#E5C378] text-xs font-semibold mb-4">
            <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>التدرج الروحي والعلمي المنضبط</span>
          </div>

          <h1 className="font-amiri text-3xl sm:text-4xl md:text-5xl font-bold text-[#143628] dark:text-[#FAF7F2] tracking-wide mb-4">
            مَسَارُ الفَقِيرِ التَّكْوِينِيُّ
          </h1>

          <p className="text-sm sm:text-base text-[#4A5D53] dark:text-[#A1B3A9] leading-relaxed max-w-2xl mx-auto">
            منهاج تربوي تسلسلي مستمد من أصول الطريقة القادرية البودشيشية وثوابتها، يجمع بين تصحيح العبادة وتزكية النفس وحضور القلب في الذكر والصحبة الصالحة.
          </p>
        </div>

        {/* Mandatory Pedagogical Notice Alert */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1B4332]/10 via-[#C5A059]/15 to-[#1B4332]/10 dark:from-[#122820] dark:via-[#1A382D] dark:to-[#122820] border-2 border-[#C5A059]/40 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h2 className="font-amiri text-base sm:text-lg font-bold text-[#143628] dark:text-[#FAF7F2] mb-1">
                تنبيه منهجي وتربوي مؤكد
              </h2>
              <p className="text-xs sm:text-sm text-[#2D3F36] dark:text-[#D1DDD6] font-medium leading-relaxed">
                «{MASAR_DATA.meta.notice}»
              </p>
              <p className="text-xs sm:text-xs text-[#6B7D74] dark:text-[#8FA097] mt-1.5">
                طريق القوم مبناه على الصحبة الحية واللقاء والمشافهة وأخذ الأوراد بالإذن المعتمد من شيخ الطريقة، وهذا المسار معين على الضبط والمذاكرة فقط.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracker Card */}
        <div className="mb-12 p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-[#122820]/90 border border-[#E7DFD5] dark:border-[#203A2F] shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="text-right w-full sm:w-auto">
              <h2 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
                مستوى تقدمك في المسار التكويني
              </h2>
              <p className="text-xs text-[#52796F] dark:text-[#A1B3A9]">
                أكملت {completedStages.length} من أصل {MASAR_DATA.stages.length} مراحل ({progressPercentage}%)
              </p>
            </div>

            {/* Quick Step Indicator Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
              {MASAR_DATA.stages.map((stage) => {
                const isCompleted = completedStages.includes(stage.id);
                const isActive = activeStageId === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStageId(stage.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-[#1B4332] text-[#FAF7F2] shadow-sm"
                        : isCompleted
                        ? "bg-[#C5A059]/20 text-[#9E7B35] dark:text-[#E5C378] border border-[#C5A059]/30"
                        : "bg-[#FAF7F2] dark:bg-[#0B1914] text-[#52796F] dark:text-[#A1B3A9] border border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-xs font-mono">
                        {stage.id}
                      </span>
                    )}
                    <span>المرحلة {stage.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#E7DFD5]/60 dark:bg-[#1E3B30] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-l from-[#C5A059] to-[#1B4332] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stages Timeline & Details */}
        <div className="space-y-8">
          {MASAR_DATA.stages.map((stage, idx) => {
            const isCompleted = completedStages.includes(stage.id);
            const approvedBooks = getApprovedBooks(stage);
            const isExpanded = activeStageId === stage.id;

            return (
              <section
                key={stage.id}
                id={`stage-${stage.id}`}
                className={`rounded-2xl transition-all duration-300 border ${
                  isExpanded
                    ? "bg-white dark:bg-[#122820] border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/30"
                    : "bg-white/60 dark:bg-[#0E2019]/70 border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]/50"
                } p-5 sm:p-7`}
              >
                {/* Stage Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E7DFD5]/70 dark:border-[#203A2F]/70">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#1B4332] text-[#C5A059] font-mono font-bold text-sm shadow-sm">
                      {stage.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#52796F] dark:text-[#A1B3A9]">
                          المرحلة {stage.id} من 6
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#9E7B35] dark:text-[#E5C378] bg-[#C5A059]/15 px-2 py-0.5 rounded-md border border-[#C5A059]/20">
                          <Clock className="w-3 h-3" />
                          <span>المدة: {stage.duration}</span>
                        </span>
                      </div>
                      <h2 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] mt-0.5">
                        {stage.title}
                      </h2>
                    </div>
                  </div>

                  {/* Stage Completion Checkbox */}
                  <button
                    onClick={() => toggleStage(stage.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto ${
                      isCompleted
                        ? "bg-[#1B4332] text-[#FAF7F2] border border-[#C5A059]/40 shadow-sm"
                        : "bg-[#FAF7F2] dark:bg-[#1A382D] text-[#52796F] dark:text-[#A1B3A9] border border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                        <span>أكملتُ هذه المرحلة</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-[#52796F] dark:text-[#A1B3A9]" />
                        <span>تحديد كمكتمل</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Stage Body Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Goal & Practice */}
                  <div className="space-y-5">
                    {/* Goal */}
                    <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#0E2019] border border-[#E7DFD5]/80 dark:border-[#203A2F]">
                      <div className="flex items-center gap-2 mb-2 text-[#C5A059]">
                        <Compass className="w-4 h-4" />
                        <h3 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                          الهدف من المرحلة
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#2D3F36] dark:text-[#D1DDD6] leading-relaxed">
                        {stage.goal}
                      </p>
                    </div>

                    {/* Spiritual Practice */}
                    <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#0E2019] border border-[#E7DFD5]/80 dark:border-[#203A2F]">
                      <div className="flex items-center gap-2 mb-3 text-[#C5A059]">
                        <Sparkles className="w-4 h-4" />
                        <h3 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                          الممارسة الروحية والعملية
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {stage.practice.map((item, pIdx) => (
                          <li
                            key={pIdx}
                            className="flex items-start gap-2 text-xs sm:text-sm text-[#2D3F36] dark:text-[#D1DDD6] leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Review Questions & Books */}
                  <div className="space-y-5">
                    {/* Review Questions */}
                    <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#0E2019] border border-[#E7DFD5]/80 dark:border-[#203A2F]">
                      <div className="flex items-center gap-2 mb-3 text-[#C5A059]">
                        <HelpCircle className="w-4 h-4" />
                        <h3 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                          أسئلة للمراجعة الذاتية
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {stage.review_questions.map((q, qIdx) => (
                          <li
                            key={qIdx}
                            className="flex items-start gap-2 text-xs sm:text-sm text-[#2D3F36] dark:text-[#D1DDD6] leading-relaxed font-medium"
                          >
                            <span className="font-mono text-[#C5A059] text-xs shrink-0 mt-0.5">
                              {qIdx + 1}.
                            </span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Books & Curriculum Section */}
                    <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#0E2019] border border-[#E7DFD5]/80 dark:border-[#203A2F]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-[#C5A059]">
                          <BookOpen className="w-4 h-4" />
                          <h3 className="font-amiri text-base font-bold text-[#143628] dark:text-[#FAF7F2]">
                            المقررات والكتب المعتمدة
                          </h3>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378] font-medium">
                          شرط الاعتماد
                        </span>
                      </div>

                      {approvedBooks.length > 0 ? (
                        <div className="space-y-2.5">
                          {approvedBooks.map((book) => (
                            <div
                              key={book.id}
                              className="p-3 rounded-lg bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203A2F]"
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-amiri text-sm font-bold text-[#143628] dark:text-[#FAF7F2]">
                                  {book.title || "عنوان قيد المراجعة"}
                                </h4>
                                <span className="text-xs text-[#C5A059]">
                                  {book.author || "قيد المراجعة"}
                                </span>
                              </div>
                              {book.note && (
                                <p className="text-xs text-[#52796F] dark:text-[#A1B3A9] mt-1">
                                  {book.note}
                                </p>
                              )}
                              <div className="mt-2 text-xs text-[#52796F] dark:text-[#A1B3A9] flex items-center gap-2">
                                <span>الطبعة: {book.edition || "قيد المراجعة"}</span>
                                <span>•</span>
                                <span>التحقيق: {book.editor || "قيد المراجعة"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-lg bg-white/60 dark:bg-[#122820]/60 border border-dashed border-[#C5A059]/40 text-center">
                          <p className="text-xs font-semibold text-[#143628] dark:text-[#FAF7F2] mb-1">
                            المقررات والكتب قيد مراجعة واعتماد اللجنة العلمية للطريقة
                          </p>
                          <p className="text-xs text-[#52796F] dark:text-[#A1B3A9] leading-relaxed">
                            لا يُنشر كتاب في هذا المسار إلا بعد إجازته الصريحة والتأكد من توافر طبعة محققة منضبطة تجمع بين الشريعة والحقيقة والاستقامة.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Next Stage Navigation Link */}
                <div className="mt-6 pt-4 border-t border-[#E7DFD5]/60 dark:border-[#203A2F]/60 flex items-center justify-between">
                  <span className="text-xs text-[#52796F] dark:text-[#A1B3A9]">
                    {isCompleted
                      ? "✓ تم إنجاز متطلبات هذه المرحلة"
                      : "احرص على المذاكرة مع المقدّم وإخوانك في الزاوية"}
                  </span>

                  {idx < MASAR_DATA.stages.length - 1 && (
                    <button
                      onClick={() => {
                        const nextId = stage.id + 1;
                        setActiveStageId(nextId);
                        const el = document.getElementById(`stage-${nextId}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B4332] dark:text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      <span>الانتقال للمرحلة {stage.id + 1} ({MASAR_DATA.stages[idx + 1].title})</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom Callout & Acceptance Criteria */}
        <div className="mt-12 p-6 rounded-2xl bg-white/80 dark:bg-[#122820]/90 border border-[#E7DFD5] dark:border-[#203A2F] text-right">
          <div className="flex items-center gap-2 mb-3 text-[#C5A059]">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="font-amiri text-lg font-bold text-[#143628] dark:text-[#FAF7F2]">
              معايير اعتماد المقررات العلمية في الطريقة
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5D53] dark:text-[#A1B3A9] leading-relaxed mb-4">
            تخضع جميع الكتب والمراجع التكوينية لتدقيق صارم من اللجنة العلمية وفق الضوابط التالية:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {MASAR_DATA.meta.acceptance_criteria.map((criterion, cIdx) => (
              <div
                key={cIdx}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAF7F2] dark:bg-[#0E2019] text-xs text-[#2D3F36] dark:text-[#D1DDD6]"
              >
                <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{criterion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] text-xs font-semibold shadow-sm transition-all hover:scale-105"
          >
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            <span>العودة إلى الصفحة الرئيسية لمنهاج الفقير</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
