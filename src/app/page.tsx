import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { DailySpiritualHub } from "@/components/DailySpiritualHub";
import { UnifiedKnowledgeHub } from "@/components/UnifiedKnowledgeHub";
import { ThawabitSection } from "@/components/ThawabitSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC]" dir="rtl">
      {/* 1. Navbar: Clean & Simplified */}
      <Navbar />

      <main className="flex-1">
        {/* 1 & 2. Micro-Hero Definition + Three Entry Portals («ابدأ من هنا» — «زاد اليوم» — «تصفح المكتبة») */}
        <HeroSection />

        {/* 3. Zad Al-Yawm: Hikma + Hadith + Ibn Ashir Verse */}
        <DailySpiritualHub />

        {/* 4. Library Hub: Clear Tabs (Hadith, Hikam, Mutun, Ta'sil, Awrad) */}
        <UnifiedKnowledgeHub />

        {/* 5. The Five Pillars: Equal Cards with Concise Summary, Details on Click */}
        <ThawabitSection />
      </main>

      {/* 6. Platform Overview, Sources & Contact */}
      <Footer />
    </div>
  );
}
