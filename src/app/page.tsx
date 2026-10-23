import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HikmaOfTheDay } from "@/components/HikmaOfTheDay";
import { CurriculumRoadmap } from "@/components/CurriculumRoadmap";
import { HikamArchive } from "@/components/HikamArchive";
import { GlossarySection } from "@/components/GlossarySection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HikmaOfTheDay />
        <CurriculumRoadmap />
        <HikamArchive />
        <GlossarySection />
      </main>
      <Footer />
    </div>
  );
}
