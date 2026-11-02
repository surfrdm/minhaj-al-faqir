"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Palette,
  Download,
  Share2,
  ChevronLeft,
  Sparkles,
  Layout,
  Image as ImageIcon,
  Type,
  Calendar,
  MapPin,
  User,
  Check,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import * as htmlToImage from "html-to-image";

interface PosterFormat {
  id: string;
  name: string;
  ratioName: string;
  width: number;
  height: number;
  aspectClass: string;
}

const POSTER_FORMATS: PosterFormat[] = [
  {
    id: "square",
    name: "مربع فيسبوك / إنستغرام",
    ratioName: "1:1 (1080x1080)",
    width: 1080,
    height: 1080,
    aspectClass: "aspect-square",
  },
  {
    id: "portrait",
    name: "عمودي موبايل (الأكثر تفاعلاً)",
    ratioName: "4:5 (1080x1350)",
    width: 1080,
    height: 1350,
    aspectClass: "aspect-[4/5]",
  },
  {
    id: "story",
    name: "ستوري فيسبوك وواتساب",
    ratioName: "9:16 (1080x1920)",
    width: 1080,
    height: 1920,
    aspectClass: "aspect-[9/16]",
  },
  {
    id: "landscape",
    name: "أفقي للمنشورات والروابط",
    ratioName: "1.91:1 (1200x630)",
    width: 1200,
    height: 630,
    aspectClass: "aspect-[1.91/1]",
  },
  {
    id: "event",
    name: "غلاف مناسبات الزاوية",
    ratioName: "16:9 (1920x1005)",
    width: 1920,
    height: 1005,
    aspectClass: "aspect-[16/9]",
  },
];

const THEMES = [
  {
    id: "royal-green",
    name: "أخضر ملكي بودشيشي",
    bgClass: "bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0A1E16] text-[#FAF7F2]",
    borderClass: "border-[#C5A059]",
    accentText: "text-[#E5C378]",
  },
  {
    id: "zellige-night",
    name: "ليل زليج عميق",
    bgClass: "bg-gradient-to-br from-[#07130E] via-[#0E2019] to-[#050D0A] text-[#FAF7F2]",
    borderClass: "border-[#D4AF37]",
    accentText: "text-[#D4AF37]",
  },
  {
    id: "ivory-parchment",
    name: "عاجي ورق أصيل",
    bgClass: "bg-gradient-to-br from-[#FAF7F2] via-[#F4EFE6] to-[#EAE2D5] text-[#143628]",
    borderClass: "border-[#C5A059]",
    accentText: "text-[#826122]",
  },
];

export default function TasmeemStudioPage() {
  const [selectedFormat, setSelectedFormat] = useState<PosterFormat>(POSTER_FORMATS[1]); // default 4:5
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [title, setTitle] = useState("مَجْلِسُ الذِّكْرِ وَالمُذَاكَرَةِ السَّبْتِيَّةِ");
  const [quote, setQuote] = useState("«الصدق هو سيف الله في أرضه؛ فإذا صحت البدايات أشرقت النهايات»");
  const [speaker, setSpeaker] = useState("فضيلة الشيخ الدكتور سيدي منير القادري بودشيش");
  const [dateText, setDateText] = useState("السبت المبارك • بعد صلاة العصر مباشرة");
  const [locationText, setLocationText] = useState("زاوية مدينة المحمدية • المقر المركزي");
  const [showPortrait, setShowPortrait] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!posterRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        pixelRatio: 2,
        quality: 1,
      });
      const link = document.createElement("a");
      link.download = `minhaj-affiche-${selectedFormat.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Error generating poster image", e);
      alert("تعذر حفظ الصورة، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC] font-sans antialiased" dir="rtl">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#A1B3A9]">
            <Link href="/" className="hover:text-[#C5A059] transition">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[#143628] dark:text-[#E5C378] font-bold">
              استوديو تصميم ملصقات الزاوية
            </span>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#143628] hover:from-[#143628] hover:to-[#0A1E16] text-[#FAF7F2] text-xs font-bold flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
            ) : (
              <Download className="w-4 h-4 text-[#C5A059]" />
            )}
            <span>{isDownloading ? "جاري تصدير الصورة HD..." : "تحميل الملصق بدقة فائقة HD"}</span>
          </button>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0E2019] text-[#FAF7F2] border border-[#C5A059]/40 shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold">
              <Palette className="w-3.5 h-3.5" />
              <span>الإعلام والنشر الرسمي • زاوية المحمدية</span>
            </div>
            <h1 className="font-amiri text-2xl sm:text-3xl font-bold tracking-wide text-[#FAF7F2]">
              اسْتُودْيُو تَصْمِيمِ المُلْصَقَاتِ وَالإِعْلاَنَاتِ الرَّسْمِيَّةِ
            </h1>
            <p className="text-xs text-[#FAF7F2]/80 leading-relaxed font-ibm">
              أنشئ ملصقات دعوية وإعلانات احترافية لمجالس الزاوية في ثوانٍ، بـ 5 صيغ رسمية متوافقة مع خوارزميات فيسبوك وواتساب بدقة فائقة.
            </p>
          </div>
        </section>

        {/* 2-Columns Studio Layout: Controls (Right in RTL) + Live Preview Canvas (Left) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMN 1: FORM CONTROLS (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Format Choice */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
              <label className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-[#C5A059]" />
                <span>1. اختر صيغة ومقاس الملصق (5 صيغ):</span>
              </label>

              <div className="grid grid-cols-1 gap-2">
                {POSTER_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`p-3 rounded-xl border text-right transition flex items-center justify-between text-xs cursor-pointer ${
                      selectedFormat.id === fmt.id
                        ? "bg-[#1B4332] text-white border-[#C5A059] shadow-sm"
                        : "bg-[#FAF7F2] dark:bg-[#07130E] border-[#E7DFD5] dark:border-[#203D31] text-[#1D2A24] dark:text-[#E8F0EC] hover:border-[#C5A059]"
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{fmt.name}</span>
                      <span className="text-[11px] opacity-80">{fmt.ratioName}</span>
                    </div>
                    {selectedFormat.id === fmt.id && <Check className="w-4 h-4 text-[#C5A059]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Theme Choice */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
              <label className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#C5A059]" />
                <span>2. الهوية البصرية والثيم:</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setSelectedTheme(th)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                      selectedTheme.id === th.id
                        ? "border-2 border-[#C5A059] shadow-md ring-2 ring-[#C5A059]/30"
                        : "border-[#E7DFD5] dark:border-[#203D31]"
                    } ${th.bgClass}`}
                  >
                    <span className="text-[11px] line-clamp-1">{th.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Text Fields */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3.5">
              <label className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                <Type className="w-4 h-4 text-[#C5A059]" />
                <span>3. النصوص والبيانات:</span>
              </label>

              <div className="space-y-1">
                <span className="text-[11px] text-gray-500 font-bold">عنوان المجلس أو الحدث:</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-bold focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-gray-500 font-bold">الحكمة أو الآية أو التذكير:</span>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059] leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-gray-500 font-bold">المحاضر أو المؤطر:</span>
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold">الموعد والتوقيت:</span>
                  <input
                    type="text"
                    value={dateText}
                    onChange={(e) => setDateText(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold">المكان:</span>
                  <input
                    type="text"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={showPortrait}
                    onChange={(e) => setShowPortrait(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1B4332] accent-[#1B4332]"
                  />
                  <span>صورة فضيلة الشيخ</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1B4332] accent-[#1B4332]"
                  />
                  <span>شعار الزاوية الرسمي</span>
                </label>
              </div>
            </div>
          </div>

          {/* COLUMN 2: LIVE PREVIEW CANVAS (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-[#52796F] dark:text-[#A1B3A9] px-1">
                <span>معاينة حية للملصق ({selectedFormat.ratioName})</span>
                <span className="text-[#826122] dark:text-[#E5C378] font-bold">جاهز للتحميل 2x Retina</span>
              </div>

              {/* THE RENDERED POSTER CANVAS (REF FOR HTML-TO-IMAGE) */}
              <div
                ref={posterRef}
                className={`w-full ${selectedFormat.aspectClass} ${selectedTheme.bgClass} rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl border-4 ${selectedTheme.borderClass} select-none`}
                style={{ direction: "rtl" }}
              >
                {/* Decorative Islamic Corner Ornaments */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#C5A059]/60 rounded-tr-lg" />
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#C5A059]/60 rounded-tl-lg" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#C5A059]/60 rounded-br-lg" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#C5A059]/60 rounded-bl-lg" />

                {/* Top Poster Bar: Logo & Zawiya Identity */}
                <div className="flex items-center justify-between gap-3 relative z-10 border-b border-[#C5A059]/30 pb-3">
                  {showLogo && (
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/logo_zawiya_mohammedia_clean.png"
                        alt="Logo Zawiya"
                        className="h-10 sm:h-12 w-auto object-contain filter drop-shadow"
                      />
                      <div className="text-right">
                        <span className="font-amiri text-xs sm:text-sm font-bold block leading-tight">
                          الزَّاوِيَةُ القَادِرِيَّةُ البُودْشِيشِيَّةُ
                        </span>
                        <span className={`text-[10px] font-sans ${selectedTheme.accentText}`}>
                          مقر مدينة المحمدية
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="text-left font-amiri text-[11px] font-bold opacity-80">
                    <span>مِنْهَاجُ الفَقِيرِ</span>
                  </div>
                </div>

                {/* Center Content: Title, Quote & Sheikh Portrait */}
                <div className="my-auto py-4 space-y-4 text-center relative z-10">
                  {/* Title */}
                  <h2 className="font-amiri text-xl sm:text-2xl font-bold tracking-wide leading-tight drop-shadow-sm">
                    {title}
                  </h2>

                  {/* Quote with Calligraphy Border */}
                  {quote && (
                    <div className="max-w-xs mx-auto p-3.5 rounded-2xl bg-black/10 dark:bg-white/5 border border-[#C5A059]/40 backdrop-blur-sm">
                      <p className="font-amiri text-sm sm:text-base font-bold leading-relaxed">
                        {quote}
                      </p>
                    </div>
                  )}

                  {/* Sheikh Portrait */}
                  {showPortrait && (
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 border-2 border-[#C5A059] shadow-xl overflow-hidden bg-[#FAF7F2]">
                        <img
                          src="/images/sidi_mounir_portrait.png"
                          alt="فضيلة الشيخ الدكتور سيدي منير القادري بودشيش"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <span className={`font-amiri text-xs sm:text-sm font-bold ${selectedTheme.accentText}`}>
                        {speaker}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Footer Info: Date & Location */}
                <div className="relative z-10 pt-3 border-t border-[#C5A059]/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-bold">
                  <div className="flex items-center gap-1.5 opacity-90">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{dateText}</span>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-90">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{locationText}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#1B4332] via-[#143628] to-[#1B4332] text-white font-bold text-xs shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 border border-[#C5A059]/50"
              >
                <Download className="w-4 h-4 text-[#C5A059]" />
                <span>تحميل الصورة عالية الدقة بدقة HD (100% جاهزة للفيسبوك والواتساب)</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
