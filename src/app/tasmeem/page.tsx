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
  Upload,
  Layers,
  Crown,
  Eye,
  EyeOff,
  Sliders,
  RotateCcw,
  Sparkle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import * as htmlToImage from "html-to-image";

interface PosterFormat {
  id: string;
  name: string;
  ratioName: string;
  aspectClass: string;
  canvasClass: string;
}

const POSTER_FORMATS: PosterFormat[] = [
  {
    id: "portrait",
    name: "عمودي بوستر رسمي (4:5)",
    ratioName: "4:5 (المقاس الرسمي للزاوية)",
    aspectClass: "aspect-[4/5]",
    canvasClass: "min-h-[640px] max-w-[512px]",
  },
  {
    id: "square",
    name: "مربع فيسبوك / إنستغرام (1:1)",
    ratioName: "1:1 (منشور كلاسيكي)",
    aspectClass: "aspect-square",
    canvasClass: "min-h-[512px] max-w-[512px]",
  },
  {
    id: "story",
    name: "ستوري فيسبوك وواتساب (9:16)",
    ratioName: "9:16 (شاشة الهاتف كاملة)",
    aspectClass: "aspect-[9/16]",
    canvasClass: "min-h-[720px] max-w-[405px]",
  },
  {
    id: "landscape",
    name: "أفقي للروابط والمجموعات (1.91:1)",
    ratioName: "1.91:1 (بانر عريض)",
    aspectClass: "aspect-[1.91/1]",
    canvasClass: "min-h-[380px] max-w-[620px]",
  },
  {
    id: "event",
    name: "غلاف مناسبات الزاوية (16:9)",
    ratioName: "16:9 (غلاف فيسبوك)",
    aspectClass: "aspect-[16/9]",
    canvasClass: "min-h-[360px] max-w-[640px]",
  },
];

// Presets pour les photos du Cheikh
interface SheikhPhotoPreset {
  id: string;
  name: string;
  url: string;
  description: string;
}

const SHEIKH_PHOTOS: SheikhPhotoPreset[] = [
  {
    id: "arch-dua",
    name: "صورة القوس بالدعاء والسبحة (الرسمية)",
    url: "/images/sheikh/sheikh_arch_dua.png",
    description: "بالجلسة الشريفة ورفع اليدين بالدعاء داخل القوس الذهبي",
  },
  {
    id: "official-white",
    name: "الصورة الرسمية بالجلابة المغربية",
    url: "/images/sheikh/sheikh_official_white.png",
    description: "كاملة بالزي المغربي الأصيل والطربوش",
  },
  {
    id: "portrait-close",
    name: "صورة مقربة للوجه الشريف",
    url: "/images/sheikh/sheikh_portrait_close.png",
    description: "بورتريه دائري مقرب ومناسب للأوسمة",
  },
];

// Presets pour les arrière-plans
interface BackgroundPreset {
  id: string;
  name: string;
  type: "image" | "color";
  value: string;
  textColor: string;
  accentColor: string;
}

const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: "moroccan-watermark",
    name: "عاجي بزخرفة الزليج المائي (الأصلي)",
    type: "image",
    value: "/images/poster_bg_moroccan_watermark.png",
    textColor: "#143628",
    accentColor: "#C5A059",
  },
  {
    id: "royal-emerald",
    name: "أخضر ملكي مذهب",
    type: "color",
    value: "linear-gradient(135deg, #143628 0%, #1B4332 50%, #0A1E16 100%)",
    textColor: "#FAF7F2",
    accentColor: "#E5C378",
  },
  {
    id: "pure-parchment",
    name: "ورق مخطوطات صافي",
    type: "color",
    value: "linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 100%)",
    textColor: "#143628",
    accentColor: "#C5A059",
  },
  {
    id: "nocturnal-spiritual",
    name: "ليل صوفي كحلي",
    type: "color",
    value: "linear-gradient(135deg, #07130E 0%, #0E2019 50%, #050D0A 100%)",
    textColor: "#FAF7F2",
    accentColor: "#D4AF37",
  },
];

// Presets pour l'image du haut (المناسبات الوطنية والدينية)
interface TopOccasionPreset {
  id: string;
  name: string;
  title: string;
  tag: string;
}

const TOP_OCCASIONS: TopOccasionPreset[] = [
  {
    id: "sahara",
    name: "الصحراء المغربية والمسيرة الخضراء",
    title: "مغربية الصحراء • وحدة الأمة والوطن",
    tag: "مناسبة وطنية غالية",
  },
  {
    id: "king",
    name: "صاحب الجلالة الملك محمد السادس نصره الله",
    title: "أمير المؤمنين حامي الملة والدين",
    tag: "الرعاية السامية",
  },
  {
    id: "mawlid",
    name: "ذكرى المولد النبوي الشريف",
    title: "ولد الهدى فالكائنات ضياء",
    tag: "مناسبة دينية مباركة",
  },
  {
    id: "qadr",
    name: "ليلة القدر المباركة / ختم القرآن",
    title: "ليلة مباركة في رحاب القرآن العظيم",
    tag: "موسم نفحات",
  },
];

export default function TasmeemStudioPage() {
  const [activeTab, setActiveTab] = useState<"layers" | "texts" | "style">("layers");

  // 1. Format
  const [selectedFormat, setSelectedFormat] = useState<PosterFormat>(POSTER_FORMATS[0]); // default 4:5

  // 2. Background Layer
  const [selectedBg, setSelectedBg] = useState<BackgroundPreset>(BACKGROUND_PRESETS[0]);
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [bgOpacity, setBgOpacity] = useState<number>(100);

  // 3. Top Occasion Image Layer (تصويرة الفوق على حسب المناسبة)
  const [showTopImage, setShowTopImage] = useState<boolean>(false);
  const [topImageOccasion, setTopImageOccasion] = useState<string>("sahara");
  const [customTopImageUrl, setCustomTopImageUrl] = useState<string | null>(null);
  const [topImageBannerText, setTopImageBannerText] = useState<string>("بمناسبة تخليد الذكرى الوطنية المجيدة");

  // 4. Bottom Sheikh Image Layer (تصويرة الشيخ بوحدها لتحت)
  const [showSheikhImage, setShowSheikhImage] = useState<boolean>(true);
  const [selectedSheikhPhoto, setSelectedSheikhPhoto] = useState<string>(SHEIKH_PHOTOS[0].url);
  const [customSheikhUrl, setCustomSheikhUrl] = useState<string | null>(null);
  const [sheikhPosition, setSheikhPosition] = useState<"left" | "right">("left"); // Left is default per user poster
  const [sheikhFrameStyle, setSheikhFrameStyle] = useState<"arch" | "rounded" | "none">("arch");
  const [sheikhSize, setSheikhSize] = useState<"sm" | "md" | "lg">("md");

  // 5. Official Poster Texts (Matching the sent official poster)
  const [zawiyaHeader, setZawiyaHeader] = useState("الطريقة القادرية البودشيشية • مدينة المحمدية");
  const [idhnPrefix, setIdhnPrefix] = useState("بالإذن المبارك من شيخ الطريقة القادرية البودشيشية");
  const [sheikhName, setSheikhName] = useState("الدكتور مولاي منير القادري بودشيش");
  const [organizerText, setOrganizerText] = useState("تنظم الطريقة القادرية البودشيشية بمدينة المحمدية");
  const [eventTitle, setEventTitle] = useState("أمسية روحية");
  const [eventProgram, setEventProgram] = useState("نختم سلكات القرآن الكريم والصلوات على رسول الله صلى الله عليه وسلم والأذكار والمديح والسماع");
  const [hijriDate, setHijriDate] = useState("يوم السبت 12 جمادى الأولى 1448 هـ");
  const [gregorianDate, setGregorianDate] = useState("الموافق لـ 24 أكتوبر 2026 م");
  const [eventTiming, setEventTiming] = useState("مباشرة بعد صلاة المغرب");
  const [locationTitle, setLocationTitle] = useState("في رحاب الزاوية :");
  const [locationAddress, setLocationAddress] = useState("تجزئة أنفا، شارع سبتة، رقم 1\nالعالية — المحمدية");
  const [invitationNote, setInvitationNote] = useState("والدعوة عامة لجميع الفقراء والمحبين");

  // Toggles
  const [showOfficialLogo, setShowOfficialLogo] = useState(true);
  const [showGoldDividers, setShowGoldDividers] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const posterRef = useRef<HTMLDivElement>(null);

  // File Upload Handlers
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBgUrl(url);
    }
  };

  const handleTopImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomTopImageUrl(url);
      setShowTopImage(true);
    }
  };

  const handleSheikhUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomSheikhUrl(url);
      setSelectedSheikhPhoto(url);
      setShowSheikhImage(true);
    }
  };

  // Quick Template Loader: Reset to the exact real poster sent by user
  const loadOfficialTemplate = () => {
    setSelectedFormat(POSTER_FORMATS[0]); // 4:5
    setSelectedBg(BACKGROUND_PRESETS[0]);
    setCustomBgUrl(null);
    setBgOpacity(100);
    setShowTopImage(false);
    setShowSheikhImage(true);
    setSelectedSheikhPhoto(SHEIKH_PHOTOS[0].url);
    setCustomSheikhUrl(null);
    setSheikhPosition("left");
    setSheikhFrameStyle("arch");
    setSheikhSize("md");
    setZawiyaHeader("الطريقة القادرية البودشيشية • مدينة المحمدية");
    setIdhnPrefix("بالإذن المبارك من شيخ الطريقة القادرية البودشيشية");
    setSheikhName("الدكتور مولاي منير القادري بودشيش");
    setOrganizerText("تنظم الطريقة القادرية البودشيشية بمدينة المحمدية");
    setEventTitle("أمسية روحية");
    setEventProgram("نختم سلكات القرآن الكريم والصلوات على رسول الله صلى الله عليه وسلم والأذكار والمديح والسماع");
    setHijriDate("يوم السبت 12 جمادى الأولى 1448 هـ");
    setGregorianDate("الموافق لـ 24 أكتوبر 2026 م");
    setEventTiming("مباشرة بعد صلاة المغرب");
    setLocationTitle("في رحاب الزاوية :");
    setLocationAddress("تجزئة أنفا، شارع سبتة، رقم 1\nالعالية — المحمدية");
    setInvitationNote("والدعوة عامة لجميع الفقراء والمحبين");
    setShowOfficialLogo(true);
    setShowGoldDividers(true);
  };

  // High Resolution Retina Export
  const handleDownload = async () => {
    if (!posterRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        pixelRatio: 2.5,
        quality: 1,
        backgroundColor: "#FAF7F2",
      });
      const link = document.createElement("a");
      link.download = `minhaj-zawiya-${selectedFormat.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Error generating poster image", e);
      alert("تعذر حفظ الصورة، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsDownloading(false);
    }
  };

  const activeSheikhPhotoUrl = customSheikhUrl || selectedSheikhPhoto;

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC] font-sans antialiased" dir="rtl">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6">
        {/* Breadcrumb & Action Header */}
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

          <div className="flex items-center gap-2">
            <button
              onClick={loadOfficialTemplate}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#122820] text-[#143628] dark:text-[#E5C378] border border-[#C5A059]/40 hover:border-[#C5A059] text-xs font-bold flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
              title="إعادة تعيين إلى قالب الأمسية الرسمية لزاوية المحمدية"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>قالب الأمسية الرسمي</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1B4332] via-[#143628] to-[#0A1E16] text-[#FAF7F2] text-xs font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer disabled:opacity-50 border border-[#C5A059]/60"
            >
              {isDownloading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
              ) : (
                <Download className="w-4 h-4 text-[#C5A059]" />
              )}
              <span>{isDownloading ? "جاري التصدير فائق الدقة..." : "تحميل الملصق جاهز للنشر HD"}</span>
            </button>
          </div>
        </div>

        {/* Studio Workspace: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ============================================================== */}
          {/* COLUMN 1: CONTROLS & LAYERS PANEL (5 cols)                      */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 space-y-4">
            {/* Format Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-2">
              <label className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layout className="w-4 h-4 text-[#C5A059]" />
                  مقاس الملصق:
                </span>
                <span className="text-[11px] text-[#C5A059] font-normal">{selectedFormat.ratioName}</span>
              </label>

              <div className="grid grid-cols-5 gap-1.5">
                {POSTER_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center text-[10px] cursor-pointer ${
                      selectedFormat.id === fmt.id
                        ? "bg-[#1B4332] text-white border-[#C5A059] shadow-sm font-bold"
                        : "bg-[#FAF7F2] dark:bg-[#07130E] border-[#E7DFD5] dark:border-[#203D31] text-[#1D2A24] dark:text-[#E8F0EC] hover:border-[#C5A059]"
                    }`}
                  >
                    <span>{fmt.name.split(" ")[0]}</span>
                    <span className="text-[9px] opacity-75">{fmt.id === "portrait" ? "4:5" : fmt.id === "square" ? "1:1" : fmt.id === "story" ? "9:16" : "أفقي"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex rounded-xl bg-white dark:bg-[#0E2019] p-1 border border-[#E7DFD5] dark:border-[#203D31] shadow-sm">
              <button
                onClick={() => setActiveTab("layers")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === "layers"
                    ? "bg-[#1B4332] text-white shadow-sm"
                    : "text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/10"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>الطبقات والصور</span>
              </button>

              <button
                onClick={() => setActiveTab("texts")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === "texts"
                    ? "bg-[#1B4332] text-white shadow-sm"
                    : "text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/10"
                }`}
              >
                <Type className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>نصوص البرنامج</span>
              </button>

              <button
                onClick={() => setActiveTab("style")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === "style"
                    ? "bg-[#1B4332] text-white shadow-sm"
                    : "text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/10"
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>الثيم والهوية</span>
              </button>
            </div>

            {/* TAB 1: LAYERS & IMAGES (خلفية + تصويرة الفوق + تصويرة الشيخ لتحت) */}
            {activeTab === "layers" && (
              <div className="space-y-4">
                {/* 1. LAYER: ARRIÈRE-PLAN (BACKGROUND) */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#C5A059]" />
                      الطبقة 1: خلفية الملصق (الأريير بلان)
                    </span>
                    <label className="text-[11px] text-[#C5A059] hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      رفع خلفية من عندك
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBgUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {BACKGROUND_PRESETS.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => {
                          setSelectedBg(bg);
                          setCustomBgUrl(null);
                        }}
                        className={`p-2.5 rounded-xl border text-right transition cursor-pointer flex items-center gap-2 ${
                          !customBgUrl && selectedBg.id === bg.id
                            ? "border-2 border-[#C5A059] bg-[#C5A059]/10 shadow-sm"
                            : "border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]/50"
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-lg border border-[#C5A059]/50 flex-shrink-0"
                          style={{
                            background:
                              bg.type === "color"
                                ? bg.value
                                : `url(${bg.value}) center/cover`,
                          }}
                        />
                        <span className="text-[11px] font-bold line-clamp-1">{bg.name}</span>
                      </button>
                    ))}
                  </div>

                  {customBgUrl && (
                    <div className="p-2 rounded-xl bg-[#C5A059]/15 border border-[#C5A059] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#143628] dark:text-[#E5C378]">تم تفعيل الخلفية المرفوعة</span>
                      <button
                        onClick={() => setCustomBgUrl(null)}
                        className="text-[10px] text-red-500 hover:underline"
                      >
                        إلغاء والعودة للأصلية
                      </button>
                    </div>
                  )}

                  {/* Opacity slider */}
                  <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                    <span className="text-[11px] text-gray-500 font-medium">شفافية الخلفية:</span>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={bgOpacity}
                      onChange={(e) => setBgOpacity(Number(e.target.value))}
                      className="w-32 accent-[#C5A059]"
                    />
                    <span className="text-[11px] font-mono font-bold text-[#C5A059]">{bgOpacity}%</span>
                  </div>
                </div>

                {/* 2. LAYER: TOP OCCASION IMAGE (تصويرة الفوق على حسب المناسبة) */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showTopImage}
                        onChange={(e) => setShowTopImage(e.target.checked)}
                        className="w-4 h-4 rounded text-[#1B4332] accent-[#1B4332]"
                      />
                      <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-[#C5A059]" />
                        الطبقة 2: تصويرة المناسبة العلوية (الفوق)
                      </span>
                    </label>

                    <label className="text-[11px] text-[#C5A059] hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      رفع صورة للمناسبة
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleTopImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {showTopImage && (
                    <div className="space-y-3 pt-2 border-t border-[#E7DFD5] dark:border-[#203D31]">
                      <div className="grid grid-cols-2 gap-2">
                        {TOP_OCCASIONS.map((occ) => (
                          <button
                            key={occ.id}
                            onClick={() => {
                              setTopImageOccasion(occ.id);
                              setTopImageBannerText(occ.title);
                            }}
                            className={`p-2 rounded-xl border text-right transition cursor-pointer text-xs ${
                              topImageOccasion === occ.id && !customTopImageUrl
                                ? "border-2 border-[#C5A059] bg-[#C5A059]/10 font-bold"
                                : "border-[#E7DFD5] dark:border-[#203D31]"
                            }`}
                          >
                            <span className="block text-[11px] font-bold">{occ.name}</span>
                            <span className="text-[9px] text-gray-500 block">{occ.tag}</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-gray-500 font-bold">شريط عنوان المناسبة العلوية:</span>
                        <input
                          type="text"
                          value={topImageBannerText}
                          onChange={(e) => setTopImageBannerText(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. LAYER: BOTTOM SHEIKH IMAGE (تصويرة الشيخ بوحدها لتحت) */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showSheikhImage}
                        onChange={(e) => setShowSheikhImage(e.target.checked)}
                        className="w-4 h-4 rounded text-[#1B4332] accent-[#1B4332]"
                      />
                      <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        الطبقة 3: صورة فضيلة الشيخ (لتحت)
                      </span>
                    </label>

                    <label className="text-[11px] text-[#C5A059] hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      رفع صورة خاصة للشيخ
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSheikhUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {showSheikhImage && (
                    <div className="space-y-3 pt-2 border-t border-[#E7DFD5] dark:border-[#203D31]">
                      {/* Photo Choice */}
                      <div className="grid grid-cols-1 gap-2">
                        {SHEIKH_PHOTOS.map((sp) => (
                          <button
                            key={sp.id}
                            onClick={() => {
                              setSelectedSheikhPhoto(sp.url);
                              setCustomSheikhUrl(null);
                            }}
                            className={`p-2 rounded-xl border text-right transition cursor-pointer flex items-center gap-3 ${
                              !customSheikhUrl && selectedSheikhPhoto === sp.url
                                ? "border-2 border-[#C5A059] bg-[#C5A059]/10 shadow-sm"
                                : "border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]/50"
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#C5A059]/60 flex-shrink-0 bg-white">
                              <img
                                src={sp.url}
                                alt={sp.name}
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                            <div>
                              <span className="text-xs font-bold block">{sp.name}</span>
                              <span className="text-[10px] text-gray-500">{sp.description}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Position & Arch Options */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-bold">تموضع الصورة بالأسفل:</span>
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              onClick={() => setSheikhPosition("left")}
                              className={`py-1 px-2 rounded-lg text-xs font-bold border transition ${
                                sheikhPosition === "left"
                                  ? "bg-[#1B4332] text-white border-[#C5A059]"
                                  : "border-[#E7DFD5] dark:border-[#203D31]"
                              }`}
                            >
                              يسار (الأصلي)
                            </button>
                            <button
                              onClick={() => setSheikhPosition("right")}
                              className={`py-1 px-2 rounded-lg text-xs font-bold border transition ${
                                sheikhPosition === "right"
                                  ? "bg-[#1B4332] text-white border-[#C5A059]"
                                  : "border-[#E7DFD5] dark:border-[#203D31]"
                              }`}
                            >
                              يمين
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-bold">حجم الصورة:</span>
                          <div className="grid grid-cols-3 gap-1">
                            {(["sm", "md", "lg"] as const).map((sz) => (
                              <button
                                key={sz}
                                onClick={() => setSheikhSize(sz)}
                                className={`py-1 rounded-lg text-xs font-bold border transition uppercase ${
                                  sheikhSize === sz
                                    ? "bg-[#1B4332] text-white border-[#C5A059]"
                                    : "border-[#E7DFD5] dark:border-[#203D31]"
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: TEXTS & PROGRAM DETAILS */}
            {activeTab === "texts" && (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#C5A059]" />
                  نصوص وفقرات البرنامج الرسمي:
                </span>

                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold">ترويسة الزاوية العلوية:</span>
                  <input
                    type="text"
                    value={zawiyaHeader}
                    onChange={(e) => setZawiyaHeader(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-bold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold">صيغة الإذن والبركة:</span>
                  <input
                    type="text"
                    value={idhnPrefix}
                    onChange={(e) => setIdhnPrefix(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold">اسم فضيلة الشيخ:</span>
                  <input
                    type="text"
                    value={sheikhName}
                    onChange={(e) => setSheikhName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-bold text-[#143628] dark:text-[#E5C378] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold">عنوان الحدث أو الأمسية:</span>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-sm font-amiri font-bold text-[#143628] dark:text-[#E5C378] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold">فقرات البرنامج والأعمال:</span>
                  <textarea
                    value={eventProgram}
                    onChange={(e) => setEventProgram(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-500 font-bold">التاريخ الهجري:</span>
                    <input
                      type="text"
                      value={hijriDate}
                      onChange={(e) => setHijriDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-[11px] font-bold focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-500 font-bold">الموافق الميلادي:</span>
                    <input
                      type="text"
                      value={gregorianDate}
                      onChange={(e) => setGregorianDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-[11px] font-bold focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold">التوقيت:</span>
                  <input
                    type="text"
                    value={eventTiming}
                    onChange={(e) => setEventTiming(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-bold text-[#C5A059] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold">عنوان ومقر الزاوية:</span>
                  <textarea
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold">عبارة الدعوة الختامية:</span>
                  <input
                    type="text"
                    value={invitationNote}
                    onChange={(e) => setInvitationNote(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-medium focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: STYLE & BRANDING */}
            {activeTab === "style" && (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-4">
                <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#C5A059]" />
                  خيارات الهوية والزخارف:
                </span>

                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-bold cursor-pointer p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E]">
                    <span>إظهار شعار الزاوية الرسمي بأعلى البوستر</span>
                    <input
                      type="checkbox"
                      checked={showOfficialLogo}
                      onChange={(e) => setShowOfficialLogo(e.target.checked)}
                      className="w-4 h-4 accent-[#1B4332]"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-bold cursor-pointer p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E]">
                    <span>إظهار الفواصل الزخرفية الذهبية</span>
                    <input
                      type="checkbox"
                      checked={showGoldDividers}
                      onChange={(e) => setShowGoldDividers(e.target.checked)}
                      className="w-4 h-4 accent-[#1B4332]"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* COLUMN 2: LIVE PREVIEW & RENDER CANVAS (7 cols)                 */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full flex flex-col items-center space-y-3">
              <div className="w-full flex items-center justify-between text-xs text-[#52796F] dark:text-[#A1B3A9] px-2 max-w-[512px]">
                <span className="flex items-center gap-1 font-bold">
                  <Sparkle className="w-3.5 h-3.5 text-[#C5A059]" />
                  معاينة حية للملصق الرسمي ({selectedFormat.ratioName})
                </span>
                <span className="text-[#826122] dark:text-[#E5C378] text-[11px]">جاهز للنشر على فيسبوك وواتساب</span>
              </div>

              {/* THE MASTER RENDERED POSTER CANVAS (HTML-TO-IMAGE TARGET) */}
              <div
                ref={posterRef}
                className={`w-full ${selectedFormat.aspectClass} ${selectedFormat.canvasClass} rounded-3xl relative overflow-hidden shadow-2xl border-4 border-[#C5A059] flex flex-col justify-between p-6 sm:p-8 select-none transition-all`}
                style={{
                  direction: "rtl",
                  backgroundColor: "#FAF7F2",
                  color: selectedBg.textColor,
                }}
              >
                {/* 1. BACKGROUND LAYER (Image or Gradient with Opacity) */}
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    opacity: bgOpacity / 100,
                    background: customBgUrl
                      ? `url(${customBgUrl}) center/cover no-repeat`
                      : selectedBg.type === "image"
                      ? `url(${selectedBg.value}) center/cover repeat`
                      : selectedBg.value,
                  }}
                />

                {/* Subtle Inner Gold Border Frame */}
                <div className="absolute inset-2 border border-[#C5A059]/40 rounded-2xl pointer-events-none z-10" />

                {/* Islamic Corner Filigrees */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#C5A059] rounded-tr-lg pointer-events-none z-10" />
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#C5A059] rounded-tl-lg pointer-events-none z-10" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#C5A059] rounded-br-lg pointer-events-none z-10" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#C5A059] rounded-bl-lg pointer-events-none z-10" />

                {/* ========================================================== */}
                {/* 2. TOP SECTION: LOGO + OCCASION BANNER + IDHN              */}
                {/* ========================================================== */}
                <div className="relative z-20 space-y-2 text-center pt-1">
                  {/* Official Octagram Seal & Zaouia Header */}
                  {showOfficialLogo && (
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <img
                        src="/images/logo_zawiya_mohammedia_clean.png"
                        alt="شعار زاوية المحمدية"
                        className="h-12 sm:h-14 w-auto object-contain drop-shadow-sm"
                      />
                      <span className="font-amiri text-xs font-bold text-[#826122] tracking-wider block">
                        {zawiyaHeader}
                      </span>
                    </div>
                  )}

                  {/* TOP OCCASION IMAGE / BANNER (عند تفعيل مناسبة وطنية كالمسيرة الخضراء أو المولد) */}
                  {showTopImage && (
                    <div className="my-2 p-2 rounded-xl bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-white border border-[#C5A059] shadow-sm flex items-center justify-center gap-2">
                      {customTopImageUrl && (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C5A059] flex-shrink-0">
                          <img
                            src={customTopImageUrl}
                            alt="صورة المناسبة"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span className="font-amiri text-xs sm:text-sm font-bold text-[#E5C378]">
                        {topImageBannerText}
                      </span>
                    </div>
                  )}

                  {/* Idhn Mubarak Formula */}
                  <div className="space-y-0.5 pt-1">
                    <p className="font-amiri text-xs sm:text-sm font-semibold text-[#826122]">
                      {idhnPrefix}
                    </p>
                    <h2 className="font-amiri text-lg sm:text-2xl font-bold text-[#143628] tracking-wide leading-tight drop-shadow-xs">
                      {sheikhName}
                    </h2>
                  </div>

                  {/* Moroccan Arabesque Divider 1 */}
                  {showGoldDividers && (
                    <div className="flex items-center justify-center py-0.5">
                      <img
                        src="/images/poster_divider_gold.png"
                        alt="فاصل ذهبي"
                        className="h-4 sm:h-5 w-auto object-contain opacity-90"
                      />
                    </div>
                  )}
                </div>

                {/* ========================================================== */}
                {/* 3. MIDDLE SECTION: EVENT TITLE & PROGRAM DESCRIPTION       */}
                {/* ========================================================== */}
                <div className="relative z-20 space-y-2 text-center my-auto px-2">
                  <p className="font-amiri text-xs sm:text-sm text-[#1D2A24] font-bold">
                    {organizerText}
                  </p>

                  {/* Big Calligraphic Title */}
                  <div className="py-1">
                    <h1 className="font-amiri text-3xl sm:text-5xl font-bold text-[#143628] tracking-wider drop-shadow-sm leading-tight">
                      {eventTitle}
                    </h1>
                  </div>

                  {/* Program Description */}
                  <p className="font-amiri text-xs sm:text-sm text-[#1D2A24] font-medium leading-relaxed max-w-sm mx-auto">
                    {eventProgram}
                  </p>

                  {/* Moroccan Arabesque Divider 2 */}
                  {showGoldDividers && (
                    <div className="flex items-center justify-center py-0.5">
                      <img
                        src="/images/poster_divider_gold.png"
                        alt="فاصل ذهبي"
                        className="h-4 sm:h-5 w-auto object-contain opacity-90"
                      />
                    </div>
                  )}
                </div>

                {/* ========================================================== */}
                {/* 4. BOTTOM SECTION: SHEIKH IMAGE + DATE, LOCATION & INVITATION */}
                {/* ========================================================== */}
                <div
                  className={`relative z-20 flex items-end justify-between gap-3 pt-2 ${
                    sheikhPosition === "right" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* THE SHEIKH VISUAL (EXTRACTED ARCH OR PORTRAIT) */}
                  {showSheikhImage && (
                    <div
                      className={`flex-shrink-0 transition-all ${
                        sheikhSize === "sm"
                          ? "w-24 sm:w-28"
                          : sheikhSize === "lg"
                          ? "w-36 sm:w-44"
                          : "w-32 sm:w-36"
                      }`}
                    >
                      <div className="relative rounded-t-3xl overflow-hidden drop-shadow-lg filter">
                        <img
                          src={activeSheikhPhotoUrl}
                          alt="فضيلة الشيخ الدكتور سيدي منير القادري بودشيش"
                          className="w-full h-auto object-contain object-bottom pointer-events-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* DATE, TIME, LOCATION & INVITATION (ALIGNED BESIDE SHEIKH) */}
                  <div className="flex-1 text-right space-y-1 sm:space-y-1.5 pb-1">
                    {/* Hijri & Gregorian Dates */}
                    <div className="space-y-0.5">
                      <p className="font-amiri text-xs sm:text-sm font-bold text-[#143628] leading-tight">
                        {hijriDate}
                      </p>
                      <p className="font-amiri text-xs sm:text-sm font-bold text-[#143628] leading-tight">
                        {gregorianDate}
                      </p>
                    </div>

                    {/* Timing */}
                    <p className="font-amiri text-xs sm:text-sm font-bold text-[#826122] leading-tight">
                      {eventTiming}
                    </p>

                    {/* Location */}
                    <div className="pt-0.5 space-y-0.5">
                      <span className="font-amiri text-[11px] sm:text-xs font-bold text-[#143628] block">
                        {locationTitle}
                      </span>
                      <p className="text-[10px] sm:text-[11px] text-[#1D2A24] font-medium leading-tight whitespace-pre-line">
                        {locationAddress}
                      </p>
                    </div>

                    {/* Public Invitation Note */}
                    <p className="font-amiri text-[10px] sm:text-xs font-bold text-[#826122] pt-1">
                      {invitationNote}
                    </p>
                  </div>
                </div>
              </div>

              {/* Helper guide */}
              <p className="text-[11px] text-gray-500 text-center max-w-md font-ibm">
                💡 تم تصميم هذا الملصق بنظام الطبقات المنفصلة (خلفية الزليج المائي + تصويرة المناسبة العلوية + صورة الشيخ داخل القوس بالأسفل) لمطابقة المعايير الرسمية لزاوية المحمدية.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
