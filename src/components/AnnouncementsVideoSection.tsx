"use client";

import { Video, Bell, Sparkles, ExternalLink, Play } from "lucide-react";
import Link from "next/link";

export function AnnouncementsVideoSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-4" dir="rtl">
      <div className="rounded-3xl bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0A1E16] text-[#FAF7F2] p-5 sm:p-7 border border-[#C5A059]/40 shadow-md relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Text & Header */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold">
              <Bell className="w-3.5 h-3.5" />
              <span>مساحة الإعلانات والمستجدات الرسمية</span>
            </div>

            <h2 className="font-amiri text-xl sm:text-2xl font-bold text-[#FAF7F2]">
              مِنْبَرُ الزَّاوِيَةِ المَرْئِيُّ وَالبَلاَغَاتُ
            </h2>

            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed font-ibm max-w-xl">
              هنا تُبث الإعلانات الرسمية، البلاغات الهامة، والتسجيلات المرئية المعتمدة لدروس ومجالس الطريقة القادرية البودشيشية بالمحمدية.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Link
                href="/dourous"
                className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#143628] font-bold text-xs shadow-sm hover:scale-[1.02] transition flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>مشاهدة مكتبة الدروس المرئية</span>
              </Link>

              <Link
                href="/tasmeem"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#FAF7F2] border border-white/20 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
                <span>الملصقات الرسمية المعتمدة</span>
              </Link>
            </div>
          </div>

          {/* Video Placeholder / Frame */}
          <div className="lg:col-span-5">
            <div className="relative aspect-video rounded-2xl bg-black/40 border border-[#C5A059]/40 overflow-hidden flex flex-col items-center justify-center text-center p-4 group">
              <div className="w-14 h-14 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#E5C378] group-hover:scale-110 transition duration-300 shadow-lg">
                <Play className="w-6 h-6 fill-current translate-x-[-1px]" />
              </div>
              <p className="font-amiri text-sm font-bold text-[#FAF7F2] mt-3">
                البث المرئي لدرس السبت الأسبوعي
              </p>
              <span className="text-[11px] text-[#E5C378] font-ibm mt-0.5">
                تحديث أسبوعي مستمر
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
