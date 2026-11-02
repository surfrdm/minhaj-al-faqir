import { Navbar } from "@/components/Navbar";
import { DailyTrio } from "@/components/DailyTrio";
import { HeroSection } from "@/components/HeroSection";
import { DailySpiritualHub } from "@/components/DailySpiritualHub";
import { UnifiedKnowledgeHub } from "@/components/UnifiedKnowledgeHub";
import { ThawabitSection } from "@/components/ThawabitSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC]" dir="rtl">
      {/* 1. Navbar épurée avec les 3 raccourcis + Drawer latéral */}
      <Navbar />

      <main className="flex-1">
        {/* 2. الثلاثية اليومية (Hikma + Hadith + Ibn Ashir) للفقير المستعجل في الصدارة */}
        <DailyTrio />

        {/* 3. Micro-Hero Definition + Three Entry Portals («ابدأ من هنا» — «زاد اليوم» — «تصفح المكتبة») */}
        <HeroSection />

        {/* 4. Zad Al-Yawm: الشروح الموسعة والتراجم */}
        <DailySpiritualHub />

        {/* 5. Library Hub: Clear Tabs (Hadith, Hikam, Mutun, Ta'sil, Awrad) */}
        <UnifiedKnowledgeHub />

        {/* 6. The Five Pillars: Equal Cards with Concise Summary, Details on Click */}
        <ThawabitSection />
      </main>

      {/* 7. Platform Overview, Sources & Contact */}
      <Footer />
    </div>
  );
}
