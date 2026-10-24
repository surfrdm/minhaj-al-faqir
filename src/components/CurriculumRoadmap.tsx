"use client";

import { useState } from "react";
import {
  GraduationCap,
  Scale,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronDown,
  Quote,
} from "lucide-react";
import { CURRICULUM_TRACKS, CurriculumTrack } from "@/lib/curriculum";

export function CurriculumRoadmap() {
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const currentTrack: CurriculumTrack = CURRICULUM_TRACKS[activeTrackIndex] || CURRICULUM_TRACKS[0];

  const trackIcons = [GraduationCap, Scale, Clock, BookOpen];

  return (
    <section
      id="tracks"
      className="scroll-mt-24 py-16 sm:py-24 bg-white/60 dark:bg-[#0B1914]/60 border-y border-[#E7DFD5] dark:border-[#203A2F]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378] text-xs font-semibold mb-4 border border-[#C5A059]/30">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>مَعَالِمُ التَّكْوِينِ الذَّاتِيِّ وَالارْتِقَاءِ الرُّوحِيِّ</span>
          </div>
          <h2 className="font-amiri text-3xl sm:text-5xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-4">
            مَدَارِجُ مِنْهَاجِ الفَقِيرِ (مَسَارَاتُ التَّزْكِيَةِ وَالسُّلُوكِ)
          </h2>
          <p className="text-[#596B62] dark:text-[#9BB0A5] font-ibm text-base sm:text-lg leading-relaxed">
            تدرج روحي وسلوكي مبارك يصحب المريد في مدارج القرب:
            من فهم حقيقة الفقر ولزوم صحبة العارفين، إلى امتلاك التأصيل الشرعي الراسخ لآداب الطريق،
            وصولاً إلى ثبات الأوراد والوظيفة، ومدارسة الأربعين النووية وأمهات درر السلوك.
          </p>
        </div>

        {/* 4 Tracks Stepper / Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {CURRICULUM_TRACKS.map((track, idx) => {
            const isActive = idx === activeTrackIndex;
            const Icon = trackIcons[idx] || GraduationCap;
            return (
              <button
                key={track.id}
                onClick={() => setActiveTrackIndex(idx)}
                className={`text-right p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? "bg-[#1B4332] text-white border-[#C5A059] shadow-xl shadow-[#1B4332]/25 translate-y-[-2px]"
                    : "bg-white dark:bg-[#12241D] text-[#1D2A24] dark:text-[#E8F0EC] border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]/60"
                }`}
              >
                {/* Active Indicator bar */}
                {isActive && (
                  <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#C5A059] via-[#E5C378] to-[#C5A059]" />
                )}

                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isActive
                        ? "bg-[#C5A059] text-[#143628]"
                        : "bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378]"
                    }`}
                  >
                    {track.badge}
                  </span>
                  <span
                    className={`font-mono text-sm font-bold ${
                      isActive ? "text-[#E5C378]" : "text-[#596B62] dark:text-[#9BB0A5]"
                    }`}
                  >
                    0{track.step}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#E5C378]" : "text-[#C5A059]"}`} />
                  <h3 className="font-amiri text-lg sm:text-xl font-bold">
                    {track.title}
                  </h3>
                </div>

                <p
                  className={`text-xs leading-relaxed ${
                    isActive ? "text-emerald-100" : "text-[#596B62] dark:text-[#9BB0A5]"
                  }`}
                >
                  {track.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Track Banner */}
        <div
          id={
            activeTrackIndex === 1
              ? "evidence"
              : activeTrackIndex === 2
              ? "wazifa"
              : activeTrackIndex === 3
              ? "academy"
              : "madkhal"
          }
          className="scroll-mt-28 bg-[#FAF7F2] dark:bg-[#12241D] rounded-3xl border border-[#E7DFD5] dark:border-[#203A2F] p-8 sm:p-10 mb-8 shadow-sm"
        >
          <div className="max-w-4xl mx-auto text-right">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] mb-3">
              <Sparkles className="w-4 h-4" />
              <span>مَقْصِدُ {currentTrack.badge}</span>
            </div>
            <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-3">
              {currentTrack.title}
            </h3>
            <p className="text-[#596B62] dark:text-[#9BB0A5] font-ibm leading-relaxed mb-6">
              {currentTrack.description}
            </p>

            {/* Spiritual Quote banner */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#0B1914] border-r-4 border-[#C5A059] shadow-inner">
              <p className="font-amiri text-lg font-bold text-[#1B4332] dark:text-[#E5C378]">
                «{currentTrack.quote}»
              </p>
            </div>
          </div>
        </div>

        {/* Modules Display */}
        {/* Track 1: المدخل التمهيدي */}
        {activeTrackIndex === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTrack.modules.map((mod, i) => (
              <div
                key={mod.id}
                className="bg-white dark:bg-[#12241D] rounded-2xl border border-[#E7DFD5] dark:border-[#203A2F] p-6 sm:p-7 shadow-sm hover:border-[#C5A059] transition-all duration-300 text-right flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378] flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-[#C5A059]">
                      مستوى تأسيسي
                    </span>
                  </div>

                  <h4 className="font-amiri text-xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-3">
                    {mod.title}
                  </h4>
                  <p className="text-sm text-[#596B62] dark:text-[#9BB0A5] font-ibm leading-relaxed mb-6">
                    {mod.summary}
                  </p>
                </div>

                {mod.key_takeaways && (
                  <div className="pt-4 border-t border-[#E7DFD5] dark:border-[#203A2F] space-y-2">
                    <span className="text-xs font-bold text-[#143628] dark:text-[#E8F0EC] block mb-2">
                      أبرز الضوابط والمكتسبات:
                    </span>
                    {mod.key_takeaways.map((point, k) => (
                      <div
                        key={k}
                        className="flex items-start gap-2.5 text-xs text-[#1D2A24]/80 dark:text-[#C5D5CC]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Track 2: التأصيل الشرعي والعلمي (السبحة، الجهر، العمارة، التوسل) */}
        {activeTrackIndex === 1 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-right text-xs sm:text-sm text-[#143628] dark:text-[#E5C378] font-ibm mb-2">
              🛡️ <strong>مرتكز المنهج التأصيلي:</strong> كل حركة وسكون في الطريقة القادرية البودشيشية موثق بالأدلة القطعية من القرآن وصحيح السنة وعمل الصحابة والتابعين وفتاوى الحفاظ والمحققين.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentTrack.modules.map((mod, i) => (
                <div
                  key={mod.id}
                  className="bg-white dark:bg-[#12241D] rounded-2xl border border-[#E7DFD5] dark:border-[#203A2F] p-6 sm:p-7 shadow-sm hover:border-[#C5A059] transition-all text-right flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#1B4332] text-[#E5C378] text-xs font-bold">
                        تأصيل شرعي {i + 1}
                      </span>
                      <Scale className="w-5 h-5 text-[#C5A059]" />
                    </div>

                    <h4 className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-3">
                      {mod.title}
                    </h4>
                    <p className="text-sm text-[#596B62] dark:text-[#9BB0A5] font-ibm leading-relaxed mb-6">
                      {mod.summary}
                    </p>

                    {/* Evidences / الأدلة النقلية */}
                    {mod.evidence && (
                      <div className="space-y-3 mb-6 p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203A2F]">
                        <span className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5 mb-2">
                          <FileText className="w-3.5 h-3.5" />
                          <span>الأدلة النقلية وأقوال الحفاظ والمحققين:</span>
                        </span>
                        {mod.evidence.map((ev, eIdx) => (
                          <div
                            key={eIdx}
                            className="text-xs font-ibm leading-relaxed text-[#1D2A24]/90 dark:text-[#C5D5CC] border-r-2 border-[#C5A059] pr-2.5 my-1.5"
                          >
                            {ev}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {mod.key_takeaways && (
                    <div className="pt-4 border-t border-[#E7DFD5] dark:border-[#203A2F] space-y-2">
                      <span className="text-xs font-bold text-[#143628] dark:text-[#E8F0EC] block mb-2">
                        الخلاصة الفقهية والسلوكية:
                      </span>
                      {mod.key_takeaways.map((point, k) => (
                        <div
                          key={k}
                          className="flex items-start gap-2.5 text-xs text-[#1D2A24]/80 dark:text-[#C5D5CC]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Track 3: وظائف اليوم والليلة والأوراد */}
        {activeTrackIndex === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTrack.modules.map((mod, i) => (
              <div
                key={mod.id}
                className="bg-white dark:bg-[#12241D] rounded-2xl border border-[#E7DFD5] dark:border-[#203A2F] p-6 sm:p-7 shadow-sm hover:border-[#C5A059] transition-all text-right flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-[#1B4332]/10 dark:bg-[#C5A059]/15 text-[#1B4332] dark:text-[#E5C378] flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-[#C5A059]">
                      وظيفة وسلوك
                    </span>
                  </div>

                  <h4 className="font-amiri text-xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-3">
                    {mod.title}
                  </h4>
                  <p className="text-sm text-[#596B62] dark:text-[#9BB0A5] font-ibm leading-relaxed mb-6">
                    {mod.summary}
                  </p>
                </div>

                {mod.key_takeaways && (
                  <div className="pt-4 border-t border-[#E7DFD5] dark:border-[#203A2F] space-y-2">
                    <span className="text-xs font-bold text-[#143628] dark:text-[#E8F0EC] block mb-2">
                      آداب وتفاصيل الوظيفة:
                    </span>
                    {mod.key_takeaways.map((point, k) => (
                      <div
                        key={k}
                        className="flex items-start gap-2.5 text-xs text-[#1D2A24]/80 dark:text-[#C5D5CC]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Track 4: الأكاديمية العلمية وتلاخيص المتون الكبرى والأربعين النووية */}
        {activeTrackIndex === 3 && (
          <div className="space-y-12">
            {currentTrack.modules.map((levelMod) => (
              <div key={levelMod.id} className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C5A059] text-[#143628] flex items-center justify-center font-bold text-sm shadow-sm">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                      {levelMod.title}
                    </h4>
                    <p className="text-xs text-[#596B62] dark:text-[#9BB0A5]">
                      {levelMod.summary}
                    </p>
                  </div>
                </div>

                {/* Books & Metn Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {levelMod.books?.map((book, bIdx) => (
                    <div
                      key={bIdx}
                      className="bg-white dark:bg-[#12241D] rounded-2xl border border-[#E7DFD5] dark:border-[#203A2F] p-6 sm:p-7 shadow-sm hover:border-[#C5A059] transition-all text-right"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h5 className="font-amiri text-2xl font-bold text-[#1B4332] dark:text-[#E5C378]">
                            {book.name}
                          </h5>
                          <span className="text-xs text-[#596B62] dark:text-[#9BB0A5] font-medium">
                            {book.author}
                          </span>
                        </div>
                        <span className="p-2.5 rounded-xl bg-[#C5A059]/15 text-[#C5A059]">
                          <BookOpen className="w-5 h-5" />
                        </span>
                      </div>

                      <div className="space-y-3.5 text-xs sm:text-sm font-ibm mt-4">
                        <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#0B1914] border border-[#E7DFD5] dark:border-[#203A2F]">
                          <strong className="text-[#143628] dark:text-[#FAF7F2] block mb-1">
                            📖 علاش خاص الفقير يقراه؟ (المقصد المنهجي)
                          </strong>
                          <p className="text-[#596B62] dark:text-[#C5D5CC] leading-relaxed">
                            {book.why_read}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30">
                          <strong className="text-[#9E7B35] dark:text-[#E5C378] block mb-1">
                            🌱 شنو غيستافد منو؟ (الثمرة السلوكية والعلمية)
                          </strong>
                          <p className="text-[#1D2A24]/90 dark:text-[#FAF7F2] leading-relaxed">
                            {book.benefit}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
