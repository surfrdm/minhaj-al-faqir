import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HadithReader } from "@/components/HadithReader";
import { ARBAEEN_LIST, getHadithById, TOTAL_HADITH } from "@/lib/arbaeen";
import { ChevronRight, BookOpen } from "lucide-react";

export function generateStaticParams() {
  return ARBAEEN_LIST.map((h) => ({
    id: String(h.id),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const num = parseInt(id, 10);
  const hadith = getHadithById(num);

  if (!hadith) {
    return {
      title: "الحديث غير موجود | منصة منهاج الفقير",
    };
  }

  return {
    title: `الحديث #${hadith.id}: ${hadith.title} | الأربعين النووية | منهاج الفقير`,
    description: `${hadith.title} - ${hadith.text_ar.slice(0, 150)}...`,
  };
}

export default async function HadithDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const num = parseInt(id, 10);
  const hadith = getHadithById(num);

  if (!hadith) {
    notFound();
  }

  const prevHadithId = num > 1 ? num - 1 : undefined;
  const nextHadithId = num < TOTAL_HADITH ? num + 1 : undefined;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC]" dir="rtl">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="bg-[#F3ECE0] dark:bg-[#0B1A14] border-b border-[#E7DFD5] dark:border-[#1E382C] py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs sm:text-sm font-ibm">
            <div className="flex items-center gap-2 text-[#6B7D74] dark:text-[#95B8A8] overflow-hidden text-ellipsis whitespace-nowrap">
              <Link href="/" className="hover:text-[#1B4332] dark:hover:text-[#E5C378] transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <Link href="/#arbaeen" className="hover:text-[#1B4332] dark:hover:text-[#E5C378] transition-colors">
                الأربعين النووية
              </Link>
              <span>/</span>
              <span className="text-[#1B4332] dark:text-[#E5C378] font-semibold truncate">
                الحديث #{hadith.id}: {hadith.title}
              </span>
            </div>

            <Link
              href="/#arbaeen"
              className="text-xs text-[#C5A059] font-semibold hover:underline flex items-center gap-1 shrink-0"
            >
              <span>قائمة الأحاديث</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Reader Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="bg-white dark:bg-[#0E2019] rounded-3xl border border-[#C5A059]/35 shadow-xl p-6 sm:p-10">
            <HadithReader
              hadith={hadith}
              prevHadithId={prevHadithId}
              nextHadithId={nextHadithId}
              isStandalonePage={true}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
