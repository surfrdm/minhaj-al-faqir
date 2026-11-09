import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import TurathReader from "@/components/TurathReader";
import bukhariIndex from "@/data/turath/bukhari_index.json";
import shifaIndex from "@/data/turath/shifa_index.json";
import initialBukhariBook from "@/data/turath/bukhari/book_1.json";
import initialShifaChapter from "@/data/turath/shifa/chapter_0.json";
import type {
  BukhariBookData,
  BukhariBookMeta,
  ShifaChapterData,
  ShifaChapterMeta,
} from "@/types/turath";

export const metadata = {
  title: "الحديث والشمائل (البخاري والشِّفا) • منهاج الفقير",
  description:
    "المتن الكامل لصحيح البخاري وكتاب الشفا للقاضي عياض بتأصيل وسياق مالكي مغربي مع شرح ابن بطال وشرح الملا علي القاري والترجمة الفرنسية والإنجليزية",
};

export default function TurathPage() {
  return (
    <div
      className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC]"
      dir="rtl"
    >
      <Navbar />

      <main className="flex-1 pt-6 sm:pt-8 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-4 mb-2">
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

        <TurathReader
          bukhariIndex={bukhariIndex as BukhariBookMeta[]}
          shifaIndex={shifaIndex as ShifaChapterMeta[]}
          initialBukhariBook={initialBukhariBook as BukhariBookData}
          initialShifaChapter={initialShifaChapter as ShifaChapterData}
        />
      </main>

      <Footer />
    </div>
  );
}
