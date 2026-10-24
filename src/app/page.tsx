import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { DailySpiritualHub } from "@/components/DailySpiritualHub";
import { UnifiedKnowledgeHub } from "@/components/UnifiedKnowledgeHub";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <DailySpiritualHub />
        <UnifiedKnowledgeHub />
      </main>
      <Footer />
    </div>
  );
}
