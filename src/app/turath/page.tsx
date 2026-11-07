import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import TurathReader from "@/components/TurathReader";
import turathData from "@/data/turath_sample.json";
import { TurathItem } from "@/types/turath";

export const metadata = {
  title: "الحديث والشمائل (البخاري والشِّفا) • منهاج الفقير",
  description:
    "صحيح البخاري والشفا للقاضي عياض بتأصيل وسياق مالكي مغربي مع الترجمة الفرنسية والإنجليزية",
};

export default function TurathPage() {
  return (
    <div
      className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC]"
      dir="rtl"
    >
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#9BB0A5]">
            <Link href="/" className="hover:text-[#C5A059] transition">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <Link href="/maktaba" className="hover:text-[#C5A059] transition">
              المكتبة والتأصيل
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[#143628] dark:text-[#E5C378] font-bold">
              الحديث والشمائل (البخاري والشفا)
            </span>
          </div>
        </div>

        <TurathReader initialItems={turathData as TurathItem[]} />
      </main>

      <Footer />
    </div>
  );
}
