import { Navbar } from "@/components/Navbar";
import { SpiritualHeaderBar } from "@/components/SpiritualHeaderBar";
import { ZaouiaSchedule } from "@/components/ZaouiaSchedule";
import { DailyQuranAhzabCard } from "@/components/DailyQuranAhzabCard";
import { DailyTrio } from "@/components/DailyTrio";
import { AnnouncementsVideoSection } from "@/components/AnnouncementsVideoSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC]" dir="rtl">
      {/* 1. Navbar épurée avec accès direct au Drawer complet */}
      <Navbar />

      <main className="flex-1 space-y-4 pb-8">
        {/* 2. شريط المواقيت الروحية: التاريخ الهجري والميلادي • حزبا الراتب اليومي • أوقات الصلاة بالمغرب */}
        <SpiritualHeaderBar />

        {/* 3. البرنامج اليومي للزاوية المحمدية (مباشر بعد المغرب: الحزب الراتب + الوظيفة، والجمعة ذكر المخلصين) */}
        <ZaouiaSchedule />

        {/* 4. حزبا القرآن الكريم لليوم: الصباح والمساء برواية ورش عن نافع مع القراءة والتأشير */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DailyQuranAhzabCard />
        </section>

        {/* 5. التكوين اليومي للفقير: حكمة عطائية • حديث نبوي في السلوك • فقه العبادات (شرح فوري عند النقر) */}
        <DailyTrio />

        {/* 6. المساحة المخصصة للإعلانات الرسمية والفيديوهات المعتمدة للزاوية */}
        <AnnouncementsVideoSection />
      </main>

      {/* 7. التذييل الخفيف والموجز */}
      <Footer />
    </div>
  );
}
