import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArbaeenSection } from "@/components/ArbaeenSection";
import { Scroll, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "الأربعين النووية كاملة بالسند والشرح السلوكي | منصة منهاج الفقير",
  description:
    "مجموعة الأربعين النووية كاملة (42 حديثاً شريفاً) محققة المتن والسند مع الشروح التربوية والسلوكية لفقراء الطريقة القادرية البودشيشية والترجمات الفرنسية والإنجليزية.",
};

export default function ArbaeenIndexPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC]" dir="rtl">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="bg-[#F3ECE0] dark:bg-[#0B1A14] border-b border-[#E7DFD5] dark:border-[#1E382C] py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm font-ibm">
            <div className="flex items-center gap-2 text-[#6B7D74] dark:text-[#95B8A8]">
              <Link href="/" className="hover:text-[#1B4332] dark:hover:text-[#E5C378] transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-[#1B4332] dark:text-[#E5C378] font-semibold">
                الأربعين النووية (المساق الكامل)
              </span>
            </div>

            <Link
              href="/#daily-spiritual"
              className="text-xs text-[#C5A059] font-semibold hover:underline flex items-center gap-1"
            >
              <span>زاد اليوم</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Full Arbaeen Component */}
        <ArbaeenSection isEmbedded={false} />
      </main>

      <Footer />
    </div>
  );
}
