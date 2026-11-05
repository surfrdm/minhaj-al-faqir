import { Navbar } from "@/components/Navbar";
import { SpiritualHeaderBar } from "@/components/SpiritualHeaderBar";
import { ZaouiaSchedule } from "@/components/ZaouiaSchedule";
import { GrandQasaidHomeSection } from "@/components/GrandQasaidHomeSection";
import { DailyQuranAhzabCard } from "@/components/DailyQuranAhzabCard";
import { DailyTrio } from "@/components/DailyTrio";
import { AnnouncementsVideoSection } from "@/components/AnnouncementsVideoSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC]" dir="rtl">
      {/* 1. Navbar épurée avec accès direct au Drawer complet */}
      <Navbar />

      <main className="flex-1 space-y-6 pb-12">
        {/* 2. شريط المواقيت الروحية: التاريخ الهجري والميلادي • حزبا الراتب اليومي • أوقات الصلاة بالمغرب */}
        <SpiritualHeaderBar />

        {/* 3. البرنامج اليومي للزاوية المحمدية (مباشر بعد المغرب: الحزب الراتب + الوظيفة، والجمعة ذكر المخلصين) */}
        <ZaouiaSchedule />

        {/* 4. أمهات الأوراد والقصائد الكبرى (مفاتيح الفرج، سيف الاستنصار، وأمهات المدائح البوصيرية) قبل الزاد اليومي */}
        <GrandQasaidHomeSection />

        {/* 5. الزاد اليومي القرآني: حزبا الصباح والمساء برواية ورش عن نافع */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DailyQuranAhzabCard />
        </section>

        {/* 6. التكوين والزاد اليومي للفقير: حكمة عطائية • حديث نبوي في السلوك • فقه العبادات */}
        <DailyTrio />

        {/* 7. المساحة المخصصة للإعلانات الرسمية والفيديوهات المعتمدة للزاوية */}
        <AnnouncementsVideoSection />
      </main>

      {/* 8. التذييل الخفيف والموجز */}
      <Footer />
    </div>
  );
}
