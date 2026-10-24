import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CircularShowcase3D } from "@/components/CircularShowcase3D";
import { PillarsOverview } from "@/components/PillarsOverview";
import { UnifiedKnowledgeHub } from "@/components/UnifiedKnowledgeHub";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <Suspense fallback={<div className="h-40 flex items-center justify-center text-xs text-[#84928A]">جاري تحميل المعرض الدائري...</div>}>
          <CircularShowcase3D />
        </Suspense>
        <PillarsOverview />
        <UnifiedKnowledgeHub />
      </main>
      <Footer />
    </div>
  );
}
