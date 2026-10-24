import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HikmaReader } from "@/components/HikmaReader";
import { HIKAM_LIST, getHikmaByNumber, TOTAL_HIKAM } from "@/lib/hikam";
import { ChevronRight } from "lucide-react";

export function generateStaticParams() {
  return HIKAM_LIST.map((h) => ({
    id: String(h.number),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const num = parseInt(id, 10);
  const hikma = getHikmaByNumber(num);

  if (!hikma) {
    return {
      title: "الحكمة غير موجودة | منصة منهاج الفقير",
    };
  }

  return {
    title: `الحكمة العطائية #${hikma.number} | ابن عطاء الله السكندري | منهاج الفقير`,
    description: `«${hikma.text_ar.slice(0, 150)}» - ${hikma.explanation_ar.slice(0, 120)}...`,
  };
}

export default async function HikmaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const num = parseInt(id, 10);
  const hikma = getHikmaByNumber(num);

  if (!hikma) {
    notFound();
  }

  const prevHikmaNum = num > 1 ? num - 1 : undefined;
  const nextHikmaNum = num < TOTAL_HIKAM ? num + 1 : undefined;

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
              <Link href="/#hikam" className="hover:text-[#1B4332] dark:hover:text-[#E5C378] transition-colors">
                الحِكم العطائية
              </Link>
              <span>/</span>
              <span className="text-[#1B4332] dark:text-[#E5C378] font-semibold truncate">
                الحكمة #{hikma.number}
              </span>
            </div>

            <Link
              href="/#hikam"
              className="text-xs text-[#C5A059] font-semibold hover:underline flex items-center gap-1 shrink-0"
            >
              <span>خزانة الحِكم</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Reader Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="bg-white dark:bg-[#0E2019] rounded-3xl border border-[#C5A059]/35 shadow-xl p-6 sm:p-10">
            <HikmaReader
              hikma={hikma}
              prevHikmaNum={prevHikmaNum}
              nextHikmaNum={nextHikmaNum}
              isStandalonePage={true}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
