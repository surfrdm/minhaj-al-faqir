"use client";

import { useState } from "react";
import { HelpCircle, Search, Sparkles, BookOpen, Quote } from "lucide-react";
import { GLOSSARY_ITEMS, GlossaryItem } from "@/lib/curriculum";

export function GlossarySection() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "ألقاب السالكين", "العبادات والسلوك", "الأخلاق والمعاملات", "المعاني الروحية", "الآداب والمجالس"];

  const filteredItems = GLOSSARY_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      item.term.includes(search.trim()) ||
      item.definition.includes(search.trim()) ||
      item.category.includes(search.trim());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="glossary" className="scroll-mt-24 py-16 sm:py-24 bg-white/60 dark:bg-[#0B1914]/60 border-t border-[#E7DFD5] dark:border-[#203A2F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378] text-xs font-semibold mb-4 border border-[#C5A059]/30">
            <HelpCircle className="w-4 h-4 text-[#C5A059]" />
            <span>لُغَةُ القَوْمِ وَإِشَارَاتُهُمْ</span>
          </div>
          <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-3">
            مُعْجَمُ مُصْطَلَحَاتِ أَهْلِ الطَّرِيقِ
          </h2>
          <p className="text-sm sm:text-base text-[#596B62] dark:text-[#9BB0A5] font-ibm">
            دليل إرشادي ميسر لشرح المفاهيم الصوفية الأساسية حتى يفهم السالك والباحث
            المعاني الدقيقة للمصطلحات المتداولة بين الفقراء.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-[#1B4332] text-white font-semibold"
                    : "bg-white dark:bg-[#12241D] text-[#596B62] dark:text-[#9BB0A5] border border-[#E7DFD5] dark:border-[#203A2F] hover:border-[#C5A059]"
                }`}
              >
                {cat === "all" ? "كافة المصطلحات" : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#C5A059] absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن مصطلح..."
              className="w-full pr-9 pl-3 py-2 rounded-xl bg-white dark:bg-[#12241D] border border-[#E7DFD5] dark:border-[#203A2F] text-xs text-[#1D2A24] dark:text-[#E8F0EC] focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        {/* Glossary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#12241D] rounded-2xl border border-[#E7DFD5] dark:border-[#203A2F] p-6 shadow-sm hover:border-[#C5A059] transition-all duration-200 text-right flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 text-[#9E7B35] dark:text-[#E5C378]">
                    {item.category}
                  </span>
                  {item.plural !== "-" && (
                    <span className="text-xs text-[#596B62] dark:text-[#9BB0A5]">
                      جمع: {item.plural}
                    </span>
                  )}
                </div>

                <h3 className="font-amiri text-2xl font-bold text-[#143628] dark:text-[#FAF7F2] mb-2">
                  {item.term}
                </h3>

                <p className="text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#C5D5CC] font-ibm leading-relaxed mb-4">
                  {item.definition}
                </p>
              </div>

              {item.quote && (
                <div className="pt-3 border-t border-[#E7DFD5] dark:border-[#203A2F] flex items-start gap-2 text-xs text-[#C5A059] italic font-amiri font-semibold">
                  <Quote className="w-3.5 h-3.5 shrink-0 mt-0.5 rotate-180" />
                  <span>«{item.quote}»</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
