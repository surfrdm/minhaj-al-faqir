import { Navbar } from "@/components/Navbar";
import { UnifiedKnowledgeHub } from "@/components/UnifiedKnowledgeHub";
import { ThawabitSection } from "@/components/ThawabitSection";
import { Footer } from "@/components/Footer";
import { BookOpen, Sparkles, Scroll, ShieldCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "المكتبة والمتون والتأصيل الشرعي | منهاج الفقير",
  description: "الفهرس العلمي الشامل لمتون وأصول الطريقة القادرية البودشيشية: الأربعون النووية، الحكم العطائية، متن ابن عاشر، أدلة الطريق، ومعجم مصطلحات السلوك.",
};

export default function MaktabaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC]" dir="rtl">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1 space-y-6 pb-12">
        {/* Breadcrumb & Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#95B8A8]">
            <Link href="/" className="hover:text-[#C5A059] transition">الرئيسية</Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[#143628] dark:text-[#E5C378] font-bold">المكتبة والمتون والتأصيل</span>
          </div>
        </div>

        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0A1E16] text-[#FAF7F2] border-2 border-[#C5A059]/40 shadow-xl">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>مَعَالِمُ المِنْهَاجِ وَمَدَارِجُ الِارْتِقَاءِ الرُّوحِيِّ</span>
              </div>

              <h1 className="font-amiri text-2xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#FAF7F2] leading-tight">
                المَكْتَبَةُ وَالمُتُونُ وَالتَّأْصِيلُ الشَّرْعِيُّ
              </h1>

              <p className="text-xs sm:text-sm text-[#FAF7F2]/85 leading-relaxed font-ibm max-w-2xl">
                الفضاء العلمي والتكويني الشامل لسالكي الطريقة القادرية البودشيشية؛ يجمع بين الأربعين النووية بمساقها السلوكي، الشروح المقارنة للحكم العطائية، الفقه المالكي والتصوف السني من متن ابن عاشر، أدلة الطريق المعتمدة، ومعجم مصطلحات السلوك.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Unified Knowledge Hub (Arbaeen, Hikam, Ibn Ashir, Evidence, Glossary) */}
        <UnifiedKnowledgeHub />

        {/* 3. The Five Pillars / Thawabit Section */}
        <ThawabitSection />
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
