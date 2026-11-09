"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Palette,
  Download,
  ChevronLeft,
  Sparkles,
  Layout,
  Image as ImageIcon,
  Type,
  Upload,
  Layers,
  Crown,
  RotateCcw,
  Sparkle,
  Sliders,
  Move,
  ZoomIn,
  Space,
  Trash2,
  Plus,
  Info,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import * as htmlToImage from "html-to-image";

interface PosterFormat {
  id: "portrait" | "square" | "story" | "landscape" | "event";
  name: string;
  ratioName: string;
  aspectClass: string;
  canvasClass: string;
  defaultBgUrl: string;
}

const POSTER_FORMATS: PosterFormat[] = [
  {
    id: "portrait",
    name: "عمودي بوستر رسمي (4:5)",
    ratioName: "4:5 (المقاس الرسمي للزاوية)",
    aspectClass: "aspect-[4/5]",
    canvasClass: "min-h-[640px] max-w-[512px]",
    defaultBgUrl: "/images/backgrounds/1080x1350.webp",
  },
  {
    id: "square",
    name: "مربع فيسبوك / إنستغرام (1:1)",
    ratioName: "1:1 (منشور كلاسيكي)",
    aspectClass: "aspect-square",
    canvasClass: "min-h-[512px] max-w-[512px]",
    defaultBgUrl: "/images/backgrounds/1080x1080.webp",
  },
  {
    id: "story",
    name: "ستوري فيسبوك وواتساب (9:16)",
    ratioName: "9:16 (شاشة الهاتف كاملة)",
    aspectClass: "aspect-[9/16]",
    canvasClass: "min-h-[720px] max-w-[405px]",
    defaultBgUrl: "/images/backgrounds/1080x1920.webp",
  },
  {
    id: "landscape",
    name: "أفقي للروابط والمجموعات (1.91:1)",
    ratioName: "1.91:1 (بانر عريض)",
    aspectClass: "aspect-[1.91/1]",
    canvasClass: "min-h-[380px] max-w-[620px]",
    defaultBgUrl: "/images/backgrounds/1080x1350.webp",
  },
  {
    id: "event",
    name: "غلاف مناسبات الزاوية (16:9)",
    ratioName: "16:9 (غلاف فيسبوك)",
    aspectClass: "aspect-[16/9]",
    canvasClass: "min-h-[360px] max-w-[640px]",
    defaultBgUrl: "/images/backgrounds/1080x1350.webp",
  },
];

// Presets pour les logos
export interface LogoPreset {
  id: string;
  name: string;
  badge: string;
  url: string;
  defaultHeader: string;
  defaultOrganizer: string;
  isCustom?: boolean;
}

const INITIAL_LOGOS: LogoPreset[] = [
  {
    id: "mohammedia",
    name: "زاوية المحمدية",
    badge: "شعار رسمي بمدينة المحمدية (المعتمد)",
    url: "/images/logos/logo_tariqa_mohammedia.webp",
    defaultHeader: "الطريقة القادرية البودشيشية • مدينة المحمدية",
    defaultOrganizer: "تنظم الطريقة القادرية البودشيشية بمدينة المحمدية",
  },
  {
    id: "casablanca",
    name: "زاوية الدار البيضاء",
    badge: "شعار رسمي بمدينة الدار البيضاء",
    url: "/images/logos/logo_tariqa_casablanca.webp",
    defaultHeader: "الطريقة القادرية البودشيشية • مدينة الدار البيضاء",
    defaultOrganizer: "تنظم الطريقة القادرية البودشيشية بمدينة الدار البيضاء",
  },
  {
    id: "general",
    name: "الشعار العام للطريقة",
    badge: "بدون ذكر المدينة (عام لجميع الزوايا)",
    url: "/images/logos/logo_tariqa_general.webp",
    defaultHeader: "الطريقة القادرية البودشيشية",
    defaultOrganizer: "تنظم الطريقة القادرية البودشيشية",
  },
  {
    id: "rosette",
    name: "الوردة الهاسبية المذهبة فقط",
    badge: "رمز الزليج الهاسبي الأصيل بدون نص",
    url: "/images/logos/logo_rosette_gold.webp",
    defaultHeader: "الطريقة القادرية البودشيشية",
    defaultOrganizer: "تنظم الطريقة القادرية البودشيشية",
  },
];

// Presets pour les photos de فضيلة الشيخ (تنقية الصور والاحتفاظ بالصور الرسمية المعتمدة)
export interface SheikhPhotoPreset {
  id: string;
  name: string;
  url: string;
  description: string;
  isCustom?: boolean;
}

const INITIAL_SHEIKH_PHOTOS: SheikhPhotoPreset[] = [
  {
    id: "dua-white-sitting",
    name: "جلسة الدعاء بالجلابة البيضاء والسبحة (الأصلية المعتمدة)",
    url: "/images/sheikh/sheikh_dua_white_sitting.webp",
    description: "الصورة الرسمية المعتمدة في ملصق الإنديزاين لزاوية المحمدية",
  },
  {
    id: "blue-scarf-adab",
    name: "بالشال الأزرق المزخرف ووضع اليدين على الصدر",
    url: "/images/sheikh/sheikh_blue_scarf_adab.webp",
    description: "صورة عالية الدقة بابتسامة وهيبة ربانية مع الجلابة الصوفية والشال",
  },
];

// Presets pour l'image du haut (المناسبات الوطنية والدينية)
interface TopOccasionPreset {
  id: string;
  name: string;
  title: string;
  tag: string;
  imageUrl: string;
}

const TOP_OCCASIONS: TopOccasionPreset[] = [
  {
    id: "king-transparent",
    name: "صاحب الجلالة الملك محمد السادس نصره الله",
    title: "تحت القيادة الرشيدة لأمير المؤمنين جلالة الملك محمد السادس",
    tag: "الرعاية الملكية السامية",
    imageUrl: "/images/occasions/Visuel_Roi_Mohammed_VI.webp",
  },
  {
    id: "sahara-flag",
    name: "الصحراء المغربية ووحدة الوطن والراية",
    title: "مغربية الصحراء • ثوابت الأمة والوحدة الترابية",
    tag: "مناسبة وطنية غالية",
    imageUrl: "/images/occasions/Visuel_Sahara_Drapeau.webp",
  },
  {
    id: "dome-madagh",
    name: "قبة الزاوية المباركة بمداغ الشريفة",
    title: "رحاب الزاوية البودشيشية الشريفة بمداغ",
    tag: "معلم روحي مبارك",
    imageUrl: "/images/occasions/dome_madagh.webp",
  },
  {
    id: "king-classic",
    name: "جلالة الملك (الصورة الرسمية)",
    title: "أمير المؤمنين حامي الملة والدين",
    tag: "العرش العلوي المجيد",
    imageUrl: "/images/occasions/Roi-Mohammed-VI-1024x683.jpeg",
  },
  {
    id: "sahara-dunes",
    name: "رمال الصحراء المغربية والذكرى المجيدة",
    title: "ذكرى المسيرة الخضراء المظفرة وعيد الوحدة",
    tag: "ملحمة وطنية خالدة",
    imageUrl: "/images/occasions/sahara-marocain-3.jpg",
  },
];

const EVENT_TITLE_SUGGESTIONS = [
  "أَمْسِيَةٌ رُوحِيَّةٌ",
  "بالذكرى الوطنية لعيد الوحدة",
  "الاحتفال بذكرى المولد النبوي الشريف",
  "الليلة الصوفية الشهرية للذكر والسماع",
  "ختم سلكات القرآن الكريم والصلوات",
  "حفل تكريم حفاظ كتاب الله والمتفوقين",
];

export default function TasmeemStudioPage() {
  const [activeTab, setActiveTab] = useState<"layers" | "texts" | "dividers" | "style">("dividers");

  // 1. Format
  const [selectedFormat, setSelectedFormat] = useState<PosterFormat>(POSTER_FORMATS[0]);

  // 2. Background Layer (Official 2026 templates)
  const [bgType, setBgType] = useState<"official" | "custom">("official");
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [bgOpacity, setBgOpacity] = useState<number>(100);

  // 3. Logo Layer (Dynamic list with deletion and upload)
  const [logosList, setLogosList] = useState<LogoPreset[]>(INITIAL_LOGOS);
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [selectedLogoId, setSelectedLogoId] = useState<string>("mohammedia");
  const [logoSize, setLogoSize] = useState<"sm" | "md" | "lg">("md");
  const [logoOffsetX, setLogoOffsetX] = useState<number>(0);
  const [logoOffsetY, setLogoOffsetY] = useState<number>(0);

  // 4. Top Occasion Image Layer (تصويرة الفوق على حسب المناسبة)
  const [showTopImage, setShowTopImage] = useState<boolean>(false);
  const [selectedTopOccasionId, setSelectedTopOccasionId] = useState<string>("king-transparent");
  const [customTopImageUrl, setCustomTopImageUrl] = useState<string | null>(null);
  const [topImageBannerText, setTopImageBannerText] = useState<string>("تحت القيادة الرشيدة لأمير المؤمنين نصره الله");
  const [topImagePosition, setTopImagePosition] = useState<"center" | "right" | "left">("center");
  const [topImageSize, setTopImageSize] = useState<"sm" | "md" | "lg">("md");

  // 5. Bottom Sheikh Image Layer (Dynamic list with deletion and upload)
  const [sheikhPhotosList, setSheikhPhotosList] = useState<SheikhPhotoPreset[]>(INITIAL_SHEIKH_PHOTOS);
  const [showSheikhImage, setShowSheikhImage] = useState<boolean>(true);
  const [selectedSheikhPhotoId, setSelectedSheikhPhotoId] = useState<string>(INITIAL_SHEIKH_PHOTOS[0].id);
  const [sheikhPosition, setSheikhPosition] = useState<"left" | "right">("left");
  const [sheikhSize, setSheikhSize] = useState<"sm" | "md" | "lg">("md");

  // 6. Sheikh Photo Fine-Tuning (تحريك والتحكم الدقيق في موضع الصورة)
  const [sheikhOffsetX, setSheikhOffsetX] = useState<number>(0);
  const [sheikhOffsetY, setSheikhOffsetY] = useState<number>(0);
  const [sheikhZoom, setSheikhZoom] = useState<number>(100);

  // 7. Text Scale Sliders (% البرسونتاج ديال التكبير والتصغير)
  const [globalTextScale, setGlobalTextScale] = useState<number>(100);
  const [titleScale, setTitleScale] = useState<number>(100);
  const [protocolScale, setProtocolScale] = useState<number>(100);
  const [bottomScale, setBottomScale] = useState<number>(100);

  // 8. Text Positional Movement Sliders (إزاحة النصوص X و Y يميناً ويساراً وفوق وتحت)
  const [titleOffsetX, setTitleOffsetX] = useState<number>(0);
  const [titleOffsetY, setTitleOffsetY] = useState<number>(0);
  const [protocolOffsetX, setProtocolOffsetX] = useState<number>(0);
  const [protocolOffsetY, setProtocolOffsetY] = useState<number>(0);
  const [bottomOffsetX, setBottomOffsetX] = useState<number>(0);
  const [bottomOffsetY, setBottomOffsetY] = useState<number>(0);

  // 9. Margins & Spacing (تيساع الفوق والتباعد بين العناصر)
  const [topMargin, setTopMargin] = useState<number>(10);
  const [sectionSpacing, setSectionSpacing] = useState<number>(14);
  const [bottomPadding, setBottomPadding] = useState<number>(10);

  // 10. Gold Arabesque Dividers - 3 Independent Dividers with fine positional (X / Y / Align / Scale) controls
  const [divider1Show, setDivider1Show] = useState<boolean>(true);
  const [divider1Align, setDivider1Align] = useState<"center" | "left" | "right">("center");
  const [divider1OffsetY, setDivider1OffsetY] = useState<number>(0);
  const [divider1OffsetX, setDivider1OffsetX] = useState<number>(0);
  const [divider1Scale, setDivider1Scale] = useState<number>(100);

  const [divider2Show, setDivider2Show] = useState<boolean>(true);
  const [divider2Align, setDivider2Align] = useState<"center" | "left" | "right">("center");
  const [divider2OffsetY, setDivider2OffsetY] = useState<number>(0);
  const [divider2OffsetX, setDivider2OffsetX] = useState<number>(0);
  const [divider2Scale, setDivider2Scale] = useState<number>(100);

  const [divider3Show, setDivider3Show] = useState<boolean>(true);
  const [divider3Align, setDivider3Align] = useState<"center" | "left" | "right">("center");
  const [divider3OffsetY, setDivider3OffsetY] = useState<number>(0);
  const [divider3OffsetX, setDivider3OffsetX] = useState<number>(0);
  const [divider3Scale, setDivider3Scale] = useState<number>(100);

  // 11. Official Texts - Matching InDesign Master File
  const [showRoyalHeader, setShowRoyalHeader] = useState<boolean>(true);
  const [royalHeaderText, setRoyalHeaderText] = useState(
    "تحت القيادة الرشيدة لأمير المؤمنين صاحب الجلالة الملك محمد السادس نصره الله"
  );
  const [idhnPrefix, setIdhnPrefix] = useState(
    "وبالإذن المبارك من شيخ الطريقة القادرية البودشيشية"
  );
  const [sheikhName, setSheikhName] = useState(
    "فضيلة الدكتور مولاي منير القادري بودشيش"
  );
  const [organizerText, setOrganizerText] = useState(
    "تحتفل الطريقة القادرية البودشيشية بمدينة المحمدية"
  );
  const [eventTitle, setEventTitle] = useState("بالذكرى الوطنية لعيد الوحدة");
  const [eventProgram, setEventProgram] = useState(
    "ختم سلكات القرآن الكريم والصلوات على رسول الله صلى الله عليه وسلم والأذكار والمديح والسماع"
  );

  // Exact InDesign Bottom Section Fields
  const [hijriDate, setHijriDate] = useState("يوم السبت 12 جمادى الأولى 1448 هـ");
  const [gregorianDate, setGregorianDate] = useState("الموافق لـ 24 أكتوبر 2026 م");
  const [eventTiming, setEventTiming] = useState("مباشرة بعد صلاة المغرب");
  const [venueTitle, setVenueTitle] = useState("في رحاب الزاوية :");
  const [addressLine1, setAddressLine1] = useState("تجزئة أنفا، شارع سبتة، رقم 1");
  const [addressLine2, setAddressLine2] = useState("العالية — المحمدية");
  const [invitationText, setInvitationText] = useState("والدعوة عامة لجميع الفقراء والمحبين");

  // Invitation Badge Option (زر الدعوة عامة العنابي أو النص المباشر)
  const [badgeType, setBadgeType] = useState<"text" | "official" | "none">("text");

  const [isDownloading, setIsDownloading] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  // Handle Format Switch with intelligent automatic adaptive spacing
  const handleFormatChange = (fmt: PosterFormat) => {
    setSelectedFormat(fmt);
    if (bgType === "official") {
      setCustomBgUrl(null);
    }

    if (fmt.id === "square") {
      // 1:1 needs more compact spacing & text scaling
      setGlobalTextScale(78);
      setTitleScale(82);
      setProtocolScale(82);
      setBottomScale(82);
      setSectionSpacing(6);
      setTopMargin(0);
      setSheikhZoom(85);
      setSheikhOffsetX(-10);
      setSheikhOffsetY(10);
      setTitleOffsetY(0);
      setProtocolOffsetY(0);
      setBottomOffsetY(0);
    } else if (fmt.id === "portrait") {
      // 4:5 official format
      setGlobalTextScale(100);
      setTitleScale(100);
      setProtocolScale(100);
      setBottomScale(100);
      setSectionSpacing(14);
      setTopMargin(10);
      setSheikhZoom(100);
      setSheikhOffsetX(0);
      setSheikhOffsetY(0);
      setTitleOffsetY(0);
      setProtocolOffsetY(0);
      setBottomOffsetY(0);
    } else if (fmt.id === "story") {
      // 9:16 vertical has plenty of vertical breathing room
      setGlobalTextScale(105);
      setTitleScale(110);
      setProtocolScale(105);
      setBottomScale(105);
      setSectionSpacing(24);
      setTopMargin(35);
      setSheikhZoom(110);
      setSheikhOffsetX(0);
      setSheikhOffsetY(0);
      setTitleOffsetY(0);
      setProtocolOffsetY(0);
      setBottomOffsetY(0);
    } else {
      setGlobalTextScale(85);
      setSectionSpacing(8);
      setTopMargin(0);
    }
  };

  // Sync logo changes with city headers
  const handleLogoSelect = (preset: LogoPreset) => {
    setSelectedLogoId(preset.id);
    if (preset.defaultOrganizer) {
      setOrganizerText(preset.defaultOrganizer);
    }
  };

  // Delete a logo from the list
  const handleDeleteLogo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextList = logosList.filter((l) => l.id !== id);
    setLogosList(nextList);
    if (selectedLogoId === id && nextList.length > 0) {
      setSelectedLogoId(nextList[0].id);
      if (nextList[0].defaultOrganizer) {
        setOrganizerText(nextList[0].defaultOrganizer);
      }
    }
  };

  // Delete a sheikh photo from the list
  const handleDeleteSheikhPhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextList = sheikhPhotosList.filter((p) => p.id !== id);
    setSheikhPhotosList(nextList);
    if (selectedSheikhPhotoId === id && nextList.length > 0) {
      setSelectedSheikhPhotoId(nextList[0].id);
    }
  };

  // Upload handlers
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBgUrl(url);
      setBgType("custom");
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newLogo: LogoPreset = {
        id: `custom-logo-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, "") || "شعار جديد مخصص",
        badge: "شعار مرفوع من الجهاز",
        url,
        defaultHeader: "الطريقة القادرية البودشيشية",
        defaultOrganizer: "تنظم الطريقة القادرية البودشيشية",
        isCustom: true,
      };
      setLogosList((prev) => [newLogo, ...prev]);
      setSelectedLogoId(newLogo.id);
      setShowLogo(true);
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
      const newPhoto: SheikhPhotoPreset = {
        id: `custom-sheikh-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, "") || "صورة جديدة لفضيلة الشيخ",
        url,
        description: "صورة مخصصة مرفوعة من الجهاز",
        isCustom: true,
      };
      setSheikhPhotosList((prev) => [newPhoto, ...prev]);
      setSelectedSheikhPhotoId(newPhoto.id);
      setShowSheikhImage(true);
    }
  };

  // Quick reset to the exact official template
  const loadOfficialTemplate = () => {
    setSelectedFormat(POSTER_FORMATS[0]); // 4:5
    setBgType("official");
    setCustomBgUrl(null);
    setBgOpacity(100);
    setShowLogo(true);
    setLogosList(INITIAL_LOGOS);
    setSelectedLogoId("mohammedia");
    setLogoSize("md");
    setLogoOffsetX(0);
    setLogoOffsetY(0);

    setShowTopImage(false);
    setShowSheikhImage(true);
    setSheikhPhotosList(INITIAL_SHEIKH_PHOTOS);
    setSelectedSheikhPhotoId(INITIAL_SHEIKH_PHOTOS[0].id);
    setSheikhPosition("left");
    setSheikhSize("md");
    setSheikhOffsetX(0);
    setSheikhOffsetY(0);
    setSheikhZoom(100);

    setGlobalTextScale(100);
    setTitleScale(100);
    setProtocolScale(100);
    setBottomScale(100);

    setTitleOffsetX(0);
    setTitleOffsetY(0);
    setProtocolOffsetX(0);
    setProtocolOffsetY(0);
    setBottomOffsetX(0);
    setBottomOffsetY(0);

    setTopMargin(10);
    setSectionSpacing(14);
    setBottomPadding(10);

    setDivider1Show(true);
    setDivider1Align("center");
    setDivider1OffsetY(0);
    setDivider1OffsetX(0);
    setDivider1Scale(100);

    setDivider2Show(true);
    setDivider2Align("center");
    setDivider2OffsetY(0);
    setDivider2OffsetX(0);
    setDivider2Scale(100);

    setDivider3Show(true);
    setDivider3Align("center");
    setDivider3OffsetY(0);
    setDivider3OffsetX(0);
    setDivider3Scale(100);

    setShowRoyalHeader(true);
    setRoyalHeaderText("تحت القيادة الرشيدة لأمير المؤمنين صاحب الجلالة الملك محمد السادس نصره الله");
    setIdhnPrefix("وبالإذن المبارك من شيخ الطريقة القادرية البودشيشية");
    setSheikhName("فضيلة الدكتور مولاي منير القادري بودشيش");
    setOrganizerText("تحتفل الطريقة القادرية البودشيشية بمدينة المحمدية");
    setEventTitle("بالذكرى الوطنية لعيد الوحدة");
    setEventProgram("ختم سلكات القرآن الكريم والصلوات على رسول الله صلى الله عليه وسلم والأذكار والمديح والسماع");
    setHijriDate("يوم السبت 12 جمادى الأولى 1448 هـ");
    setGregorianDate("الموافق لـ 24 أكتوبر 2026 م");
    setEventTiming("مباشرة بعد صلاة المغرب");
    setVenueTitle("في رحاب الزاوية :");
    setAddressLine1("تجزئة أنفا، شارع سبتة، رقم 1");
    setAddressLine2("العالية — المحمدية");
    setInvitationText("والدعوة عامة لجميع الفقراء والمحبين");
    setBadgeType("text");
  };

  // High Resolution Retina Export
  const handleDownload = async () => {
    if (!posterRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        pixelRatio: 3,
        quality: 1,
        backgroundColor: "#FAF7F2",
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

  // Active logo preset
  const activeLogo = logosList.find((l) => l.id === selectedLogoId) || logosList[0];
  const activeLogoUrl = activeLogo?.url || INITIAL_LOGOS[0].url;

  // Active Sheikh photo preset
  const activeSheikhPhoto =
    sheikhPhotosList.find((p) => p.id === selectedSheikhPhotoId) || sheikhPhotosList[0];
  const activeSheikhPhotoUrl = activeSheikhPhoto?.url || INITIAL_SHEIKH_PHOTOS[0].url;

  // Current active Top occasion image URL
  const activeTopImageUrl =
    customTopImageUrl ||
    TOP_OCCASIONS.find((o) => o.id === selectedTopOccasionId)?.imageUrl ||
    TOP_OCCASIONS[0].imageUrl;

  // Background image URL
  const activeBgUrl = customBgUrl || selectedFormat.defaultBgUrl;

  // Font scale factors
  const gFactor = globalTextScale / 100;
  const tFactor = gFactor * (titleScale / 100);
  const pFactor = gFactor * (protocolScale / 100);
  const bFactor = gFactor * (bottomScale / 100);

  return (
    <div
      className="min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC] font-sans antialiased"
      dir="rtl"
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6">
        {/* Breadcrumb & Header Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#A1B3A9]">
            <Link href="/" className="hover:text-[#C5A059] transition">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[#143628] dark:text-[#E5C378] font-bold">
              استوديو تصميم ملصقات الزاوية الرسمي
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadOfficialTemplate}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#122820] text-[#143628] dark:text-[#E5C378] border border-[#C5A059]/40 hover:border-[#C5A059] text-xs font-bold flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
              title="إعادة ضبط القالب إلى ملصق زاوية المحمدية الأصلي"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>إعادة ضبط الملصق الأصلي</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1B4332] via-[#143628] to-[#0A1E16] text-[#FAF7F2] text-xs font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer disabled:opacity-50 border border-[#C5A059]/60"
            >
              <Download className="w-4 h-4 text-[#C5A059]" />
              <span>
                {isDownloading ? "جاري تصدير الملصق عالي الدقة..." : "تحميل الملصق جاهز للطباعة والنشر HD"}
              </span>
            </button>
          </div>
        </div>

        {/* Studio Workspace: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ============================================================== */}
          {/* COLUMN 1: CONTROLS & LAYERS PANEL (5 cols)                      */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 space-y-4">
            {/* Format Selection Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-2">
              <label className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layout className="w-4 h-4 text-[#C5A059]" />
                  مقاس الملصق والخلفية المعتمدة:
                </span>
                <span className="text-[11px] text-[#C5A059] font-normal font-mono">
                  {selectedFormat.ratioName}
                </span>
              </label>

              <div className="grid grid-cols-5 gap-1.5">
                {POSTER_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => handleFormatChange(fmt)}
                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center text-[10px] cursor-pointer ${
                      selectedFormat.id === fmt.id
                        ? "bg-[#1B4332] text-white border-[#C5A059] shadow-sm font-bold"
                        : "bg-[#FAF7F2] dark:bg-[#07130E] border-[#E7DFD5] dark:border-[#203D31] text-[#1D2A24] dark:text-[#E8F0EC] hover:border-[#C5A059]"
                    }`}
                  >
                    <span>{fmt.name.split(" ")[0]}</span>
                    <span className="text-[9px] opacity-75 font-mono">
                      {fmt.id === "portrait"
                        ? "4:5"
                        : fmt.id === "square"
                        ? "1:1"
                        : fmt.id === "story"
                        ? "9:16"
                        : "أفقي"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Tabs - 4 Distinct Workspaces */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xl bg-white dark:bg-[#0E2019] p-1.5 border border-[#E7DFD5] dark:border-[#203D31] shadow-sm">
              <button
                onClick={() => setActiveTab("layers")}
                className={`py-2 px-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                  activeTab === "layers"
                    ? "bg-[#1B4332] text-white shadow-sm ring-1 ring-[#C5A059]/40"
                    : "text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/10"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>الطبقات والصور</span>
              </button>

              <button
                onClick={() => setActiveTab("texts")}
                className={`py-2 px-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                  activeTab === "texts"
                    ? "bg-[#1B4332] text-white shadow-sm ring-1 ring-[#C5A059]/40"
                    : "text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/10"
                }`}
              >
                <Type className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>النصوص والمقاييس</span>
              </button>

              <button
                onClick={() => setActiveTab("dividers")}
                className={`py-2 px-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                  activeTab === "dividers"
                    ? "bg-gradient-to-r from-[#143628] to-[#1B4332] text-[#E5C378] shadow-md ring-2 ring-[#C5A059]"
                    : "text-[#826122] dark:text-[#E5C378] bg-[#FAF7F2] dark:bg-[#122820] hover:bg-[#C5A059]/15 border border-[#C5A059]/40"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>الفواصل والزواقات (3)</span>
              </button>

              <button
                onClick={() => setActiveTab("style")}
                className={`py-2 px-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                  activeTab === "style"
                    ? "bg-[#1B4332] text-white shadow-sm ring-1 ring-[#C5A059]/40"
                    : "text-[#1D2A24] dark:text-[#E8F0EC] hover:bg-[#C5A059]/10"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>المسافات والمظهر</span>
              </button>
            </div>

            {/* TAB 1: LAYERS & IMAGES */}
            {activeTab === "layers" && (
              <div className="space-y-4">
                {/* 1. LAYER: ARRIÈRE-PLAN (BACKGROUND) */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#C5A059]" />
                      الطبقة 1: خلفية الزليج الرسمية (الأريير بلان)
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
                    <button
                      onClick={() => {
                        setBgType("official");
                        setCustomBgUrl(null);
                      }}
                      className={`p-2.5 rounded-xl border text-right transition cursor-pointer flex items-center gap-2 ${
                        bgType === "official"
                          ? "border-2 border-[#C5A059] bg-[#C5A059]/10 shadow-sm"
                          : "border-[#E7DFD5] dark:border-[#203D31]"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg border border-[#C5A059]/50 flex-shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${selectedFormat.defaultBgUrl})` }}
                      />
                      <div>
                        <span className="text-[11px] font-bold block">الخلفية الرسمية</span>
                        <span className="text-[9px] text-gray-500">زليج مائي أصيل 2026</span>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-[11px]">
                      <span className="text-gray-500">شفافية الخلفية:</span>
                      <input
                        type="range"
                        min="30"
                        max="100"
                        value={bgOpacity}
                        onChange={(e) => setBgOpacity(Number(e.target.value))}
                        className="w-20 accent-[#C5A059]"
                      />
                      <span className="font-mono font-bold text-[#C5A059]">{bgOpacity}%</span>
                    </div>
                  </div>

                  {customBgUrl && (
                    <div className="p-2 rounded-xl bg-[#C5A059]/15 border border-[#C5A059] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#143628] dark:text-[#E5C378]">
                        ✓ تم تفعيل الخلفية المرفوعة بنجاح
                      </span>
                      <button
                        onClick={() => {
                          setCustomBgUrl(null);
                          setBgType("official");
                        }}
                        className="text-[10px] text-red-500 hover:underline cursor-pointer"
                      >
                        العودة للخلفية الأصلية
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. LAYER: LOGO WITH DELETE / UPLOAD / SPECS */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showLogo}
                        onChange={(e) => setShowLogo(e.target.checked)}
                        className="w-4 h-4 rounded text-[#1B4332] accent-[#1B4332]"
                      />
                      <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        الطبقة 2: شعار الزاوية (شعار المحمدية والشعارات المخصصة)
                      </span>
                    </label>

                    <label className="text-[11px] text-[#C5A059] hover:underline cursor-pointer flex items-center gap-1 bg-[#C5A059]/10 px-2 py-1 rounded-lg border border-[#C5A059]/30 font-bold">
                      <Plus className="w-3.5 h-3.5" />
                      إضافة شعار جديد
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Standard specs box for Logo */}
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-[#143628] dark:text-emerald-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-400">
                      <Info className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>المواصفات القياسية المطلوبة لشعار الزاوية (Logo) :</span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-gray-700 dark:text-gray-300">
                      (المقاس الموصى به: <strong>600 × 300 بكسل</strong> أو مربع <strong>500 × 500 بكسل</strong> • صيغة <strong>PNG مفرغة الشفافية (Fond transparent)</strong> • الوزن الأقصى: <strong>أقل من 500 كيلوبايت (Ko)</strong> لتفادي ثقل الملصق وسرعة الرندرة)
                    </p>
                  </div>

                  {showLogo && (
                    <div className="space-y-3 pt-2 border-t border-[#E7DFD5] dark:border-[#203D31]">
                      {/* Logo choices list with Delete (Corbeille) button */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {logosList.map((lp) => (
                          <div
                            key={lp.id}
                            onClick={() => handleLogoSelect(lp)}
                            className={`group relative p-2.5 rounded-xl border text-right transition cursor-pointer flex items-center justify-between gap-2 ${
                              selectedLogoId === lp.id
                                ? "border-2 border-[#C5A059] bg-[#C5A059]/15 shadow-sm"
                                : "border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]/40 bg-[#FAF7F2]/50 dark:bg-[#07130E]/50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <div className="w-9 h-9 rounded-lg bg-white/90 p-1 border border-[#C5A059]/40 flex-shrink-0 flex items-center justify-center shadow-xs">
                                <img
                                  src={lp.url}
                                  alt={lp.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="overflow-hidden">
                                <span className="text-[11px] font-bold block truncate text-[#143628] dark:text-[#E5C378]">
                                  {lp.name}
                                </span>
                                <span className="text-[9px] text-gray-500 block truncate">
                                  {lp.badge}
                                </span>
                              </div>
                            </div>

                            {/* Corbeille Delete Button */}
                            <button
                              onClick={(e) => handleDeleteLogo(lp.id, e)}
                              title="حذف هذا الشعار من القائمة"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer opacity-70 group-hover:opacity-100 flex-shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Logo Size & Position Fine-Tuning */}
                      <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-300 font-bold text-[11px]">حجم الشعار:</span>
                          <div className="grid grid-cols-3 gap-1">
                            {(["sm", "md", "lg"] as const).map((sz) => (
                              <button
                                key={sz}
                                onClick={() => setLogoSize(sz)}
                                className={`py-1 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                  logoSize === sz
                                    ? "bg-[#1B4332] text-white border-[#C5A059]"
                                    : "border-[#E7DFD5] dark:border-[#203D31]"
                                }`}
                              >
                                {sz === "sm" ? "صغير" : sz === "md" ? "متوسط" : "كبير"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Slider Décalage Logo X / Y */}
                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                          <div className="space-y-0.5">
                            <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                              <span>إزاحة أفقية X:</span>
                              <span className="font-mono text-[#C5A059]">{logoOffsetX}px</span>
                            </div>
                            <input
                              type="range"
                              min="-60"
                              max="60"
                              value={logoOffsetX}
                              onChange={(e) => setLogoOffsetX(Number(e.target.value))}
                              className="w-full accent-[#C5A059]"
                            />
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                              <span>إزاحة عمودية Y:</span>
                              <span className="font-mono text-[#C5A059]">{logoOffsetY}px</span>
                            </div>
                            <input
                              type="range"
                              min="-40"
                              max="40"
                              value={logoOffsetY}
                              onChange={(e) => setLogoOffsetY(Number(e.target.value))}
                              className="w-full accent-[#C5A059]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. LAYER: TOP OCCASION IMAGE (تصويرة الفوق على حسب المناسبة) */}
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
                        الطبقة 3: صورة المناسبة بالأعلى (الملك / الصحراء / القبة)
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
                      <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-1">
                        {TOP_OCCASIONS.map((occ) => (
                          <button
                            key={occ.id}
                            onClick={() => {
                              setSelectedTopOccasionId(occ.id);
                              setCustomTopImageUrl(null);
                              setTopImageBannerText(occ.title);
                            }}
                            className={`p-2 rounded-xl border text-right transition cursor-pointer flex items-center gap-2.5 ${
                              selectedTopOccasionId === occ.id && !customTopImageUrl
                                ? "border-2 border-[#C5A059] bg-[#C5A059]/10 font-bold"
                                : "border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]/40"
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#C5A059]/50 flex-shrink-0 bg-white">
                              <img
                                src={occ.imageUrl}
                                alt={occ.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="overflow-hidden">
                              <span className="text-xs font-bold block truncate">{occ.name}</span>
                              <span className="text-[10px] text-gray-500 block truncate">
                                {occ.tag}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Position & Size */}
                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-bold">الموضع:</span>
                          <div className="grid grid-cols-3 gap-1">
                            {(["right", "center", "left"] as const).map((pos) => (
                              <button
                                key={pos}
                                onClick={() => setTopImagePosition(pos)}
                                className={`py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                                  topImagePosition === pos
                                    ? "bg-[#1B4332] text-white border-[#C5A059]"
                                    : "border-[#E7DFD5] dark:border-[#203D31]"
                                }`}
                              >
                                {pos === "right" ? "يمين" : pos === "center" ? "وسط" : "يسار"}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-bold">الحجم:</span>
                          <div className="grid grid-cols-3 gap-1">
                            {(["sm", "md", "lg"] as const).map((sz) => (
                              <button
                                key={sz}
                                onClick={() => setTopImageSize(sz)}
                                className={`py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                                  topImageSize === sz
                                    ? "bg-[#1B4332] text-white border-[#C5A059]"
                                    : "border-[#E7DFD5] dark:border-[#203D31]"
                                }`}
                              >
                                {sz === "sm" ? "صغير" : sz === "md" ? "متوسط" : "كبير"}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-gray-500 font-bold">
                          شريط عنوان المناسبة العلوية:
                        </span>
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

                {/* 4. LAYER: BOTTOM SHEIKH IMAGE WITH CORBEILLE DELETE / UPLOAD / SPECS */}
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
                        الطبقة 4: صورة فضيلة الشيخ بالأسفل (إدارة، حذف، وإضافة)
                      </span>
                    </label>

                    <label className="text-[11px] text-[#C5A059] hover:underline cursor-pointer flex items-center gap-1 bg-[#C5A059]/10 px-2 py-1 rounded-lg border border-[#C5A059]/30 font-bold">
                      <Plus className="w-3.5 h-3.5" />
                      إضافة صورة جديدة
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSheikhUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Standard specs box for Sheikh Photo */}
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400">
                      <Info className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>المواصفات المطلوبة لصورة فضيلة الشيخ :</span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-gray-700 dark:text-gray-300">
                      (المقاس المثالي: <strong>800 × 1200 بكسل</strong> أو أعلى • مفرغة الخلفية <strong>PNG شفاف (Détourée)</strong> • الوزن الأقصى: <strong>أقل من 3 ميغابايت</strong> لضمان نقاء التفاصيل والجلسة المباركة)
                    </p>
                  </div>

                  {showSheikhImage && (
                    <div className="space-y-3 pt-2 border-t border-[#E7DFD5] dark:border-[#203D31]">
                      {/* Photo choices list with Corbeille (Delete) */}
                      <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                        {sheikhPhotosList.map((sp) => (
                          <div
                            key={sp.id}
                            onClick={() => setSelectedSheikhPhotoId(sp.id)}
                            className={`group relative p-2 rounded-xl border text-right transition cursor-pointer flex items-center justify-between gap-3 ${
                              selectedSheikhPhotoId === sp.id
                                ? "border-2 border-[#C5A059] bg-[#C5A059]/15 shadow-sm"
                                : "border-[#E7DFD5] dark:border-[#203D31] hover:border-[#C5A059]/40 bg-[#FAF7F2]/50 dark:bg-[#07130E]/50"
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#C5A059]/60 flex-shrink-0 bg-white/70 shadow-xs">
                                <img
                                  src={sp.url}
                                  alt={sp.name}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                              <div className="overflow-hidden">
                                <span className="text-xs font-bold block truncate text-[#143628] dark:text-[#E5C378]">
                                  {sp.name}
                                </span>
                                <span className="text-[10px] text-gray-500 block truncate">
                                  {sp.description}
                                </span>
                              </div>
                            </div>

                            {/* Corbeille Delete Button */}
                            <button
                              onClick={(e) => handleDeleteSheikhPhoto(sp.id, e)}
                              title="حذف هذه الصورة من القائمة"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer opacity-70 group-hover:opacity-100 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Side position (left vs right) */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-gray-500 font-bold">جهة التموضع:</span>
                        <div className="grid grid-cols-2 gap-1 w-48">
                          <button
                            onClick={() => setSheikhPosition("left")}
                            className={`py-1 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                              sheikhPosition === "left"
                                ? "bg-[#1B4332] text-white border-[#C5A059]"
                                : "border-[#E7DFD5] dark:border-[#203D31]"
                            }`}
                          >
                            يسار (ملصق الإنديزاين)
                          </button>
                          <button
                            onClick={() => setSheikhPosition("right")}
                            className={`py-1 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                              sheikhPosition === "right"
                                ? "bg-[#1B4332] text-white border-[#C5A059]"
                                : "border-[#E7DFD5] dark:border-[#203D31]"
                            }`}
                          >
                            يمين
                          </button>
                        </div>
                      </div>

                      {/* Precise Positioning Sliders: X, Y, Scale (تحريك على l'extrémité أو الهبوط) */}
                      <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1">
                            <Move className="w-3.5 h-3.5 text-[#C5A059]" />
                            التحكم الدقيق في موضع صورة الشيخ (X / Y / Scale):
                          </span>
                          <button
                            onClick={() => {
                              setSheikhOffsetX(0);
                              setSheikhOffsetY(0);
                              setSheikhZoom(100);
                            }}
                            className="text-[10px] text-[#C5A059] hover:underline cursor-pointer"
                          >
                            إعادة ضبط الموضع
                          </button>
                        </div>

                        {/* Slider X (إزاحة أفقية إلى الطرف) */}
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-[10px] text-gray-600 dark:text-gray-300 w-32 font-medium">
                            إزاحة أفقية X (يسار / يمين):
                          </span>
                          <input
                            type="range"
                            min="-140"
                            max="140"
                            value={sheikhOffsetX}
                            onChange={(e) => setSheikhOffsetX(Number(e.target.value))}
                            className="flex-1 accent-[#C5A059]"
                          />
                          <span className="text-[10px] font-mono font-bold w-10 text-left text-[#C5A059]">
                            {sheikhOffsetX > 0 ? `+${sheikhOffsetX}` : sheikhOffsetX}px
                          </span>
                        </div>

                        {/* Slider Y (هبوط أو صعود الصورة) */}
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-[10px] text-gray-600 dark:text-gray-300 w-32 font-medium">
                            إزاحة عمودية Y (نزول / صعود):
                          </span>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={sheikhOffsetY}
                            onChange={(e) => setSheikhOffsetY(Number(e.target.value))}
                            className="flex-1 accent-[#C5A059]"
                          />
                          <span className="text-[10px] font-mono font-bold w-10 text-left text-[#C5A059]">
                            {sheikhOffsetY > 0 ? `+${sheikhOffsetY}` : sheikhOffsetY}px
                          </span>
                        </div>

                        {/* Slider Zoom (تكبير وتصغير الصورة) */}
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-[10px] text-gray-600 dark:text-gray-300 w-32 font-medium">
                            تكبير / تصغير الصورة (%):
                          </span>
                          <input
                            type="range"
                            min="50"
                            max="160"
                            value={sheikhZoom}
                            onChange={(e) => setSheikhZoom(Number(e.target.value))}
                            className="flex-1 accent-[#C5A059]"
                          />
                          <span className="text-[10px] font-mono font-bold w-10 text-left text-[#C5A059]">
                            {sheikhZoom}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: TEXTS & SCALE PERCENTAGES + POSITIONAL NUDGE (تحريك النصوص يميناً ويساراً وفوق وتحت) */}
            {activeTab === "texts" && (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-4">
                {/* 1. GLOBAL & INDIVIDUAL TEXT SCALING SLIDERS */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#143628]/10 via-[#C5A059]/10 to-[#143628]/10 border-2 border-[#C5A059]/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                      <ZoomIn className="w-4 h-4 text-[#C5A059]" />
                      لوحة البرسونتاج لتكبير وتصغير النصوص (%)
                    </span>
                    <button
                      onClick={() => {
                        setGlobalTextScale(100);
                        setTitleScale(100);
                        setProtocolScale(100);
                        setBottomScale(100);
                      }}
                      className="text-[10px] text-[#C5A059] hover:underline cursor-pointer"
                    >
                      إعادة الضبط 100%
                    </button>
                  </div>

                  {/* Global Scale Slider */}
                  <div className="space-y-1 bg-white/80 dark:bg-[#122820] p-2 rounded-lg border border-[#C5A059]/30">
                    <div className="flex justify-between text-xs font-bold text-[#143628] dark:text-[#E5C378]">
                      <span>المقياس الشامل لجميع النصوص (Zoom):</span>
                      <span className="font-mono text-[#C5A059] font-extrabold">{globalTextScale}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={globalTextScale}
                      onChange={(e) => setGlobalTextScale(Number(e.target.value))}
                      className="w-full accent-[#C5A059]"
                    />
                  </div>

                  {/* Specific Scale Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white/70 dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31]">
                      <div className="flex justify-between text-[10px] font-bold text-gray-600 dark:text-gray-300">
                        <span>عنوان الحدث:</span>
                        <span className="font-mono text-[#C5A059]">{titleScale}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="160"
                        value={titleScale}
                        onChange={(e) => setTitleScale(Number(e.target.value))}
                        className="w-full accent-[#C5A059] mt-1"
                      />
                    </div>

                    <div className="p-2 rounded-lg bg-white/70 dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31]">
                      <div className="flex justify-between text-[10px] font-bold text-gray-600 dark:text-gray-300">
                        <span>الإذن والشيخ:</span>
                        <span className="font-mono text-[#C5A059]">{protocolScale}%</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="140"
                        value={protocolScale}
                        onChange={(e) => setProtocolScale(Number(e.target.value))}
                        className="w-full accent-[#C5A059] mt-1"
                      />
                    </div>

                    <div className="p-2 rounded-lg bg-white/70 dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31]">
                      <div className="flex justify-between text-[10px] font-bold text-gray-600 dark:text-gray-300">
                        <span>التاريخ والمقر:</span>
                        <span className="font-mono text-[#C5A059]">{bottomScale}%</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="140"
                        value={bottomScale}
                        onChange={(e) => setBottomScale(Number(e.target.value))}
                        className="w-full accent-[#C5A059] mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. TEXT POSITIONAL MOVEMENT (تحريك النصوص X / Y يمين/يسار وفوق/تحت) */}
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                      <Move className="w-4 h-4 text-[#C5A059]" />
                      التحكم الدقيق في موضع كتل النصوص (X و Y):
                    </span>
                    <button
                      onClick={() => {
                        setTitleOffsetX(0);
                        setTitleOffsetY(0);
                        setProtocolOffsetX(0);
                        setProtocolOffsetY(0);
                        setBottomOffsetX(0);
                        setBottomOffsetY(0);
                      }}
                      className="text-[10px] text-[#C5A059] hover:underline cursor-pointer"
                    >
                      تصفير مواضع النصوص
                    </button>
                  </div>

                  {/* Title Move X/Y */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-2">
                    <span className="text-[11px] font-bold text-[#826122] block">
                      موضع العنوان الرئيسي (بالخط المغربي) :
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-500">
                          <span>إزاحة أفقية X (يمين/يسار):</span>
                          <span className="font-mono font-bold text-[#C5A059]">{titleOffsetX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={titleOffsetX}
                          onChange={(e) => setTitleOffsetX(Number(e.target.value))}
                          className="w-full accent-[#C5A059]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-500">
                          <span>إزاحة عمودية Y (فوق/تحت):</span>
                          <span className="font-mono font-bold text-[#C5A059]">{titleOffsetY}px</span>
                        </div>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          value={titleOffsetY}
                          onChange={(e) => setTitleOffsetY(Number(e.target.value))}
                          className="w-full accent-[#C5A059]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Protocol Move X/Y */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-2">
                    <span className="text-[11px] font-bold text-[#143628] dark:text-[#E5C378] block">
                      موضع ديباجة الإذن واسم الشيخ :
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-500">
                          <span>إزاحة أفقية X:</span>
                          <span className="font-mono font-bold text-[#C5A059]">{protocolOffsetX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          value={protocolOffsetX}
                          onChange={(e) => setProtocolOffsetX(Number(e.target.value))}
                          className="w-full accent-[#C5A059]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-500">
                          <span>إزاحة عمودية Y:</span>
                          <span className="font-mono font-bold text-[#C5A059]">{protocolOffsetY}px</span>
                        </div>
                        <input
                          type="range"
                          min="-60"
                          max="60"
                          value={protocolOffsetY}
                          onChange={(e) => setProtocolOffsetY(Number(e.target.value))}
                          className="w-full accent-[#C5A059]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Block Move X/Y */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] space-y-2">
                    <span className="text-[11px] font-bold text-[#103C29] dark:text-emerald-300 block">
                      موضع كتلة التاريخ والمقر بالأسفل :
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-500">
                          <span>إزاحة أفقية X:</span>
                          <span className="font-mono font-bold text-[#C5A059]">{bottomOffsetX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          value={bottomOffsetX}
                          onChange={(e) => setBottomOffsetX(Number(e.target.value))}
                          className="w-full accent-[#C5A059]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-500">
                          <span>إزاحة عمودية Y:</span>
                          <span className="font-mono font-bold text-[#C5A059]">{bottomOffsetY}px</span>
                        </div>
                        <input
                          type="range"
                          min="-60"
                          max="60"
                          value={bottomOffsetY}
                          onChange={(e) => setBottomOffsetY(Number(e.target.value))}
                          className="w-full accent-[#C5A059]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. TEXT FIELDS CONTENT */}
                <div className="space-y-3 pt-1">
                  {/* Royal Formula */}
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] space-y-2">
                    <label className="flex items-center justify-between text-xs font-bold cursor-pointer">
                      <span className="flex items-center gap-1.5 text-[#143628] dark:text-[#E5C378]">
                        <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
                        الصيغة الملكية البروتوكولية (أمير المؤمنين)
                      </span>
                      <input
                        type="checkbox"
                        checked={showRoyalHeader}
                        onChange={(e) => setShowRoyalHeader(e.target.checked)}
                        className="w-4 h-4 accent-[#1B4332]"
                      />
                    </label>
                    {showRoyalHeader && (
                      <input
                        type="text"
                        value={royalHeaderText}
                        onChange={(e) => setRoyalHeaderText(e.target.value)}
                        className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-[11px] font-amiri focus:outline-none focus:border-[#C5A059]"
                      />
                    )}
                  </div>

                  {/* Idhn & Sheikh */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-500 font-bold">صيغة الإذن والبركة:</span>
                      <input
                        type="text"
                        value={idhnPrefix}
                        onChange={(e) => setIdhnPrefix(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-amiri focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-500 font-bold">اسم فضيلة الشيخ:</span>
                      <input
                        type="text"
                        value={sheikhName}
                        onChange={(e) => setSheikhName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-bold text-[#143628] dark:text-[#E5C378] font-amiri focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  {/* INLINE DIVIDER 1 HELPER (بين ديباجة الشيخ والعنوان) */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="font-bold text-[#143628] dark:text-[#E5C378] text-[11px]">
                        الفاصل الزخرفي 1 (بين الشيخ والعنوان) :
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        divider1Show
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                      }`}>
                        {divider1Show ? "مفعل ✓" : "مخفي ✕"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDivider1Show(!divider1Show)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-[#122820] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 transition cursor-pointer"
                      >
                        {divider1Show ? "إخفاء" : "إظهار"}
                      </button>
                      <button
                        onClick={() => setActiveTab("dividers")}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#143628] text-[#E5C378] hover:bg-[#1B4332] transition cursor-pointer flex items-center gap-0.5"
                      >
                        تحريك ⬆️⬇️
                      </button>
                    </div>
                  </div>

                  {/* Event Title */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-gray-500 font-bold">
                      عنوان الحدث الرئيسي (بالخط المغربي الكاليغرافي):
                    </span>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-sm font-maghribi font-bold text-[#826122] focus:outline-none focus:border-[#C5A059]"
                    />
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {EVENT_TITLE_SUGGESTIONS.map((sug) => (
                        <button
                          key={sug}
                          onClick={() => setEventTitle(sug)}
                          className="px-2 py-0.5 rounded-lg bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[10px] text-[#826122] font-bold border border-[#C5A059]/30 transition cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INLINE DIVIDER 2 HELPER (بين العنوان والبرنامج) */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="font-bold text-[#143628] dark:text-[#E5C378] text-[11px]">
                        الفاصل الزخرفي 2 (بين العنوان والبرنامج) :
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        divider2Show
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                      }`}>
                        {divider2Show ? "مفعل ✓" : "مخفي ✕"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDivider2Show(!divider2Show)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-[#122820] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 transition cursor-pointer"
                      >
                        {divider2Show ? "إخفاء" : "إظهار"}
                      </button>
                      <button
                        onClick={() => setActiveTab("dividers")}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#143628] text-[#E5C378] hover:bg-[#1B4332] transition cursor-pointer flex items-center gap-0.5"
                      >
                        تحريك ⬆️⬇️
                      </button>
                    </div>
                  </div>

                  {/* Program Description */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-500 font-bold">
                      فقرة البرنامج والأنشطة (اختياري) :
                    </span>
                    <textarea
                      rows={2}
                      value={eventProgram}
                      onChange={(e) => setEventProgram(e.target.value)}
                      placeholder="ختم سلك القرآن الكريم، قراءة دلائل الخيرات، وكلمات توجيهية..."
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-amiri focus:outline-none focus:border-[#C5A059] resize-none"
                    />
                  </div>

                  {/* INLINE DIVIDER 3 HELPER (بين البرنامج والتاريخ/المقر) */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="font-bold text-[#143628] dark:text-[#E5C378] text-[11px]">
                        الفاصل الزخرفي 3 (بين البرنامج والمقر) :
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        divider3Show
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                      }`}>
                        {divider3Show ? "مفعل ✓" : "مخفي ✕"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDivider3Show(!divider3Show)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-[#122820] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 transition cursor-pointer"
                      >
                        {divider3Show ? "إخفاء" : "إظهار"}
                      </button>
                      <button
                        onClick={() => setActiveTab("dividers")}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#143628] text-[#E5C378] hover:bg-[#1B4332] transition cursor-pointer flex items-center gap-0.5"
                      >
                        تحريك ⬆️⬇️
                      </button>
                    </div>
                  </div>

                  {/* Dates InDesign */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-500 font-bold">التاريخ الهجري:</span>
                      <input
                        type="text"
                        value={hijriDate}
                        onChange={(e) => setHijriDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-bold text-[#103C29] dark:text-[#E5C378] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-500 font-bold">الموافق الميلادي:</span>
                      <input
                        type="text"
                        value={gregorianDate}
                        onChange={(e) => setGregorianDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-bold text-[#103C29] dark:text-[#E5C378] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  {/* Timing & Venue */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-500 font-bold">التوقيت ومقر الزاوية:</span>
                    <input
                      type="text"
                      value={eventTiming}
                      onChange={(e) => setEventTiming(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-bold text-[#D37D4F] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  {/* Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-500 font-bold">شارع ورقم:</span>
                      <input
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-bold text-[#231E1C] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-500 font-bold">الحي والمدينة:</span>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-bold text-[#103C29] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  {/* Invitation */}
                  <div className="space-y-2 p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#E7DFD5] dark:border-[#203D31]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#143628] dark:text-[#E5C378]">
                        صيغة الدعوة بالأسفل:
                      </span>
                      <div className="flex gap-1 text-[10px]">
                        <button
                          onClick={() => setBadgeType("text")}
                          className={`px-2 py-0.5 rounded font-bold border transition cursor-pointer ${
                            badgeType === "text"
                              ? "bg-[#1B4332] text-white border-[#C5A059]"
                              : "border-[#E7DFD5]"
                          }`}
                        >
                          نص مباشر (InDesign)
                        </button>
                        <button
                          onClick={() => setBadgeType("official")}
                          className={`px-2 py-0.5 rounded font-bold border transition cursor-pointer ${
                            badgeType === "official"
                              ? "bg-[#1B4332] text-white border-[#C5A059]"
                              : "border-[#E7DFD5]"
                          }`}
                        >
                          زر مذهب (Fichier 3)
                        </button>
                        <button
                          onClick={() => setBadgeType("none")}
                          className={`px-2 py-0.5 rounded font-bold border transition cursor-pointer ${
                            badgeType === "none"
                              ? "bg-red-800 text-white border-red-900"
                              : "border-[#E7DFD5]"
                          }`}
                        >
                          إخفاء
                        </button>
                      </div>
                    </div>

                    {badgeType === "text" && (
                      <input
                        type="text"
                        value={invitationText}
                        onChange={(e) => setInvitationText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#122820] border border-[#E7DFD5] dark:border-[#203D31] text-xs font-amiri font-bold text-[#D37D4F] focus:outline-none focus:border-[#C5A059]"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SPACING, TAYSSA3 & GOLD DIVIDERS CONTROLS (التحكم في مواضع الفواصل الزخرفية) */}
            {activeTab === "style" && (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-4">
                {/* TAYSSA3 & SPACING CONTROLS */}
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#07130E] border border-[#C5A059]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                      <Space className="w-4 h-4 text-[#C5A059]" />
                      التحكم في المسافات والتيساع العلوي (Espaces):
                    </span>
                    <button
                      onClick={() => {
                        setTopMargin(10);
                        setSectionSpacing(14);
                        setBottomPadding(10);
                      }}
                      className="text-[10px] text-[#C5A059] hover:underline cursor-pointer"
                    >
                      إعادة الضبط
                    </button>
                  </div>

                  {/* 1. Top Margin Slider (تيساع الفوق كاع) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        تيساع أعلى الملصق (الهامش العلوي لبدء النص):
                      </span>
                      <span className="font-mono font-bold text-[#C5A059]">{topMargin}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="140"
                      value={topMargin}
                      onChange={(e) => setTopMargin(Number(e.target.value))}
                      className="w-full accent-[#C5A059]"
                    />
                  </div>

                  {/* 2. Section Vertical Spacing Slider (التباعد بين العناصر) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        التباعد العمودي بين كل قسم وآخر (Espace Espace):
                      </span>
                      <span className="font-mono font-bold text-[#C5A059]">{sectionSpacing}px</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="40"
                      value={sectionSpacing}
                      onChange={(e) => setSectionSpacing(Number(e.target.value))}
                      className="w-full accent-[#C5A059]"
                    />
                  </div>

                  {/* 3. Bottom Padding Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        الهامش السفلي للملصق:
                      </span>
                      <span className="font-mono font-bold text-[#C5A059]">{bottomPadding}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={bottomPadding}
                      onChange={(e) => setBottomPadding(Number(e.target.value))}
                      className="w-full accent-[#C5A059]"
                    />
                  </div>
                </div>

                {/* SHORTCUT TO DEDICATED DIVIDERS WORKSPACE */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#143628]/10 via-[#C5A059]/15 to-[#143628]/10 border-2 border-[#C5A059]/60 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      الفواصل والزواقات الذهبية (3 مواضع بين النصوص)
                    </span>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300">
                      تم تخصيص تبويب كامل للفواصل يتيح عزل 1 أو 2 أو 3 فواصل والتحكم في تحريكها X و Y.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("dividers")}
                    className="py-1.5 px-3 rounded-lg bg-[#1B4332] text-amber-300 font-bold text-xs border border-[#C5A059] shadow-sm hover:scale-105 transition cursor-pointer whitespace-nowrap"
                  >
                    فتح لوحة الفواصل ✨
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: DEDICATED GOLD DIVIDERS & ARABESQUES WORKSPACE (بلاصة خاصة بالفواصل والزواقات) */}
            {activeTab === "dividers" && (
              <div className="space-y-4">
                {/* 1. WELCOME & RESET HEADER */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#143628] via-[#1B4332] to-[#0A1A14] text-white border-2 border-[#C5A059] shadow-md space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#E5C378] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#C5A059] animate-pulse" />
                      بلاصة خاصة بالفواصل والزواقات الذهبية
                    </span>
                    <button
                      onClick={() => {
                        setDivider1OffsetY(0);
                        setDivider1OffsetX(0);
                        setDivider1Scale(100);
                        setDivider1Align("center");
                        setDivider2OffsetY(0);
                        setDivider2OffsetX(0);
                        setDivider2Scale(100);
                        setDivider2Align("center");
                        setDivider3OffsetY(0);
                        setDivider3OffsetX(0);
                        setDivider3Scale(100);
                        setDivider3Align("center");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-xs text-[#E5C378] font-bold border border-[#C5A059]/50 transition cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>إعادة ضبط المواضع الافتراضية</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    تحكم مخصص وشامل في الزواقات الذهبية الفاصلة بين كتل النصوص: يمكنك عزل (Sélectionner) فاصل واحد، فاصلين، أو ثلاثة فواصل، وتحريك كل زواقة بدقة للأعلى أو الأسفل ولليمين أو اليسار.
                  </p>
                </div>

                {/* 2. RAPID NUMBER SELECTION (عزل 0 أو 1 أو 2 أو 3 فواصل) */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143628] dark:text-[#E5C378]">
                      تحديد عدد الفواصل السريع في التصميم:
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#C5A059]">
                      {[divider1Show, divider2Show, divider3Show].filter(Boolean).length} من 3 مفعلة
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Option 0 */}
                    <button
                      onClick={() => {
                        setDivider1Show(false);
                        setDivider2Show(false);
                        setDivider3Show(false);
                      }}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        !divider1Show && !divider2Show && !divider3Show
                          ? "bg-red-900/15 dark:bg-red-950/50 border-red-600 text-red-700 dark:text-red-300 ring-2 ring-red-500/50"
                          : "bg-[#FAF7F2] dark:bg-[#122820] border-[#E7DFD5] dark:border-[#203D31] text-gray-700 dark:text-gray-300 hover:border-[#C5A059]"
                      }`}
                    >
                      <div className="text-base font-extrabold font-mono">0</div>
                      <div className="text-[11px] font-bold mt-0.5">بدون فواصل</div>
                      <div className="text-[9px] text-gray-500 mt-0.5">إخفاء كل الزواقات</div>
                    </button>

                    {/* Option 1 */}
                    <button
                      onClick={() => {
                        setDivider1Show(true);
                        setDivider2Show(false);
                        setDivider3Show(false);
                      }}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        divider1Show && !divider2Show && !divider3Show
                          ? "bg-[#143628]/15 dark:bg-[#143628]/50 border-[#C5A059] text-[#143628] dark:text-[#E5C378] ring-2 ring-[#C5A059]"
                          : "bg-[#FAF7F2] dark:bg-[#122820] border-[#E7DFD5] dark:border-[#203D31] text-gray-700 dark:text-gray-300 hover:border-[#C5A059]"
                      }`}
                    >
                      <div className="text-base font-extrabold font-mono text-[#C5A059]">1</div>
                      <div className="text-[11px] font-bold mt-0.5">فاصل 1 فقط</div>
                      <div className="text-[9px] text-gray-500 mt-0.5">العلوي (تحت الشيخ)</div>
                    </button>

                    {/* Option 2 */}
                    <button
                      onClick={() => {
                        setDivider1Show(true);
                        setDivider2Show(false);
                        setDivider3Show(true);
                      }}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        divider1Show && !divider2Show && divider3Show
                          ? "bg-[#143628]/15 dark:bg-[#143628]/50 border-[#C5A059] text-[#143628] dark:text-[#E5C378] ring-2 ring-[#C5A059]"
                          : "bg-[#FAF7F2] dark:bg-[#122820] border-[#E7DFD5] dark:border-[#203D31] text-gray-700 dark:text-gray-300 hover:border-[#C5A059]"
                      }`}
                    >
                      <div className="text-base font-extrabold font-mono text-[#C5A059]">2</div>
                      <div className="text-[11px] font-bold mt-0.5">فاصلان (2)</div>
                      <div className="text-[9px] text-gray-500 mt-0.5">علوي + سفلي متوازن</div>
                    </button>

                    {/* Option 3 */}
                    <button
                      onClick={() => {
                        setDivider1Show(true);
                        setDivider2Show(true);
                        setDivider3Show(true);
                      }}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        divider1Show && divider2Show && divider3Show
                          ? "bg-[#143628]/15 dark:bg-[#143628]/50 border-[#C5A059] text-[#143628] dark:text-[#E5C378] ring-2 ring-[#C5A059]"
                          : "bg-[#FAF7F2] dark:bg-[#122820] border-[#E7DFD5] dark:border-[#203D31] text-gray-700 dark:text-gray-300 hover:border-[#C5A059]"
                      }`}
                    >
                      <div className="text-base font-extrabold font-mono text-[#C5A059]">3</div>
                      <div className="text-[11px] font-bold mt-0.5">3 فواصل كاملة</div>
                      <div className="text-[9px] text-gray-500 mt-0.5">علوي + أوسط + سفلي</div>
                    </button>
                  </div>
                </div>

                {/* 3. CARD FOR DIVIDER 1 (الفاصل العلوي) */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  divider1Show
                    ? "bg-white dark:bg-[#0E2019] border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/40"
                    : "bg-gray-50 dark:bg-[#0A1612] border-gray-200 dark:border-gray-800 opacity-75"
                } space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDivider1Show(!divider1Show)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          divider1Show
                            ? "bg-emerald-600 text-white border-emerald-700"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300"
                        }`}
                        title={divider1Show ? "إخفاء الفاصل 1" : "إظهار الفاصل 1"}
                      >
                        {divider1Show ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <div>
                        <div className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                          <span>الفاصل 1: الزواقة العلوية</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            divider1Show ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-gray-100 text-gray-600"
                          }`}>
                            {divider1Show ? "مفعل ✓" : "مخفي ✕"}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          الموقع: تحت ديباجة الشيخ وفوق العنوان الرئيسي
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        src="/images/gold_divider_official.png"
                        alt="معاينة الفاصل"
                        className="h-3 max-w-[80px] object-contain hidden sm:block opacity-90"
                      />
                      <span className="text-[11px] font-mono font-bold text-[#C5A059] bg-[#FAF7F2] dark:bg-[#122820] px-2 py-0.5 rounded border border-[#C5A059]/30">
                        {divider1Scale}%
                      </span>
                    </div>
                  </div>

                  {divider1Show && (
                    <div className="space-y-3 pt-2 border-t border-[#E7DFD5] dark:border-[#203D31]">
                      {/* D-Pad Quick Directional Nudge Buttons */}
                      <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#C5A059]/30 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#143628] dark:text-[#E5C378]">
                          <span>أزرار التحريك السريع (Nudge):</span>
                          <span className="font-mono text-[10px] text-gray-500">
                            X: {divider1OffsetX}px | Y: {divider1OffsetY}px
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setDivider1OffsetY((prev) => prev - 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="صعود للأعلى"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>صعود</span>
                          </button>
                          <button
                            onClick={() => setDivider1OffsetY((prev) => prev + 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="نزول للأسفل"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>نزول</span>
                          </button>
                          <button
                            onClick={() => setDivider1OffsetX((prev) => prev + 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="إزاحة لليمين"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>يمين</span>
                          </button>
                          <button
                            onClick={() => setDivider1OffsetX((prev) => prev - 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="إزاحة لليسار"
                          >
                            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>يسار</span>
                          </button>
                          <button
                            onClick={() => {
                              setDivider1OffsetX(0);
                              setDivider1OffsetY(0);
                            }}
                            className="p-1.5 px-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[10px] font-bold transition cursor-pointer text-gray-700 dark:text-gray-300"
                            title="إعادة للوسط"
                          >
                            🎯 تمركز
                          </button>
                        </div>
                      </div>

                      {/* Precise Sliders Y and X */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
                          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                            <span>تحريك عمودي Y (صعود / نزول):</span>
                            <span className="font-mono font-bold text-[#C5A059]">{divider1OffsetY}px</span>
                          </div>
                          <input
                            type="range"
                            min="-200"
                            max="200"
                            value={divider1OffsetY}
                            onChange={(e) => setDivider1OffsetY(Number(e.target.value))}
                            className="w-full accent-[#C5A059]"
                          />
                        </div>

                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
                          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                            <span>تحريك أفقي X (يمين / يسار):</span>
                            <span className="font-mono font-bold text-[#C5A059]">{divider1OffsetX}px</span>
                          </div>
                          <input
                            type="range"
                            min="-200"
                            max="200"
                            value={divider1OffsetX}
                            onChange={(e) => setDivider1OffsetX(Number(e.target.value))}
                            className="w-full accent-[#C5A059]"
                          />
                        </div>
                      </div>

                      {/* Alignment & Scale */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between">
                          <span className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">المحاذاة:</span>
                          <div className="grid grid-cols-3 gap-1">
                            {(["right", "center", "left"] as const).map((al) => (
                              <button
                                key={al}
                                onClick={() => setDivider1Align(al)}
                                className={`py-1 px-2.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                                  divider1Align === al
                                    ? "bg-[#1B4332] text-white border-[#C5A059]"
                                    : "border-[#E7DFD5] dark:border-[#203D31]"
                                }`}
                              >
                                {al === "right" ? "يمين" : al === "center" ? "وسط" : "يسار"}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
                          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                            <span>حجم وتكبير الفاصل (Scale %):</span>
                            <span className="font-mono font-bold text-[#C5A059]">{divider1Scale}%</span>
                          </div>
                          <input
                            type="range"
                            min="30"
                            max="180"
                            value={divider1Scale}
                            onChange={(e) => setDivider1Scale(Number(e.target.value))}
                            className="w-full accent-[#C5A059]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. CARD FOR DIVIDER 2 (الفاصل الأوسط) */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  divider2Show
                    ? "bg-white dark:bg-[#0E2019] border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/40"
                    : "bg-gray-50 dark:bg-[#0A1612] border-gray-200 dark:border-gray-800 opacity-75"
                } space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDivider2Show(!divider2Show)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          divider2Show
                            ? "bg-emerald-600 text-white border-emerald-700"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300"
                        }`}
                        title={divider2Show ? "إخفاء الفاصل 2" : "إظهار الفاصل 2"}
                      >
                        {divider2Show ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <div>
                        <div className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                          <span>الفاصل 2: الزواقة الوسطى</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            divider2Show ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-gray-100 text-gray-600"
                          }`}>
                            {divider2Show ? "مفعل ✓" : "مخفي ✕"}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          الموقع: بين العنوان الرئيسي وفقرة البرنامج
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        src="/images/gold_divider_official.png"
                        alt="معاينة الفاصل"
                        className="h-3 max-w-[80px] object-contain hidden sm:block opacity-90"
                      />
                      <span className="text-[11px] font-mono font-bold text-[#C5A059] bg-[#FAF7F2] dark:bg-[#122820] px-2 py-0.5 rounded border border-[#C5A059]/30">
                        {divider2Scale}%
                      </span>
                    </div>
                  </div>

                  {divider2Show && (
                    <div className="space-y-3 pt-2 border-t border-[#E7DFD5] dark:border-[#203D31]">
                      {/* D-Pad Quick Directional Nudge Buttons */}
                      <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#C5A059]/30 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#143628] dark:text-[#E5C378]">
                          <span>أزرار التحريك السريع (Nudge):</span>
                          <span className="font-mono text-[10px] text-gray-500">
                            X: {divider2OffsetX}px | Y: {divider2OffsetY}px
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setDivider2OffsetY((prev) => prev - 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="صعود للأعلى"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>صعود</span>
                          </button>
                          <button
                            onClick={() => setDivider2OffsetY((prev) => prev + 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="نزول للأسفل"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>نزول</span>
                          </button>
                          <button
                            onClick={() => setDivider2OffsetX((prev) => prev + 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="إزاحة لليمين"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>يمين</span>
                          </button>
                          <button
                            onClick={() => setDivider2OffsetX((prev) => prev - 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="إزاحة لليسار"
                          >
                            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>يسار</span>
                          </button>
                          <button
                            onClick={() => {
                              setDivider2OffsetX(0);
                              setDivider2OffsetY(0);
                            }}
                            className="p-1.5 px-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[10px] font-bold transition cursor-pointer text-gray-700 dark:text-gray-300"
                            title="إعادة للوسط"
                          >
                            🎯 تمركز
                          </button>
                        </div>
                      </div>

                      {/* Precise Sliders Y and X */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
                          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                            <span>تحريك عمودي Y (صعود / نزول):</span>
                            <span className="font-mono font-bold text-[#C5A059]">{divider2OffsetY}px</span>
                          </div>
                          <input
                            type="range"
                            min="-200"
                            max="200"
                            value={divider2OffsetY}
                            onChange={(e) => setDivider2OffsetY(Number(e.target.value))}
                            className="w-full accent-[#C5A059]"
                          />
                        </div>

                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
                          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                            <span>تحريك أفقي X (يمين / يسار):</span>
                            <span className="font-mono font-bold text-[#C5A059]">{divider2OffsetX}px</span>
                          </div>
                          <input
                            type="range"
                            min="-200"
                            max="200"
                            value={divider2OffsetX}
                            onChange={(e) => setDivider2OffsetX(Number(e.target.value))}
                            className="w-full accent-[#C5A059]"
                          />
                        </div>
                      </div>

                      {/* Alignment & Scale */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between">
                          <span className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">المحاذاة:</span>
                          <div className="grid grid-cols-3 gap-1">
                            {(["right", "center", "left"] as const).map((al) => (
                              <button
                                key={al}
                                onClick={() => setDivider2Align(al)}
                                className={`py-1 px-2.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                                  divider2Align === al
                                    ? "bg-[#1B4332] text-white border-[#C5A059]"
                                    : "border-[#E7DFD5] dark:border-[#203D31]"
                                }`}
                              >
                                {al === "right" ? "يمين" : al === "center" ? "وسط" : "يسار"}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
                          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                            <span>حجم وتكبير الفاصل (Scale %):</span>
                            <span className="font-mono font-bold text-[#C5A059]">{divider2Scale}%</span>
                          </div>
                          <input
                            type="range"
                            min="30"
                            max="180"
                            value={divider2Scale}
                            onChange={(e) => setDivider2Scale(Number(e.target.value))}
                            className="w-full accent-[#C5A059]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. CARD FOR DIVIDER 3 (الفاصل السفلي) */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  divider3Show
                    ? "bg-white dark:bg-[#0E2019] border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/40"
                    : "bg-gray-50 dark:bg-[#0A1612] border-gray-200 dark:border-gray-800 opacity-75"
                } space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDivider3Show(!divider3Show)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          divider3Show
                            ? "bg-emerald-600 text-white border-emerald-700"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300"
                        }`}
                        title={divider3Show ? "إخفاء الفاصل 3" : "إظهار الفاصل 3"}
                      >
                        {divider3Show ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <div>
                        <div className="text-xs font-bold text-[#143628] dark:text-[#E5C378] flex items-center gap-1.5">
                          <span>الفاصل 3: الزواقة السفلية</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            divider3Show ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-gray-100 text-gray-600"
                          }`}>
                            {divider3Show ? "مفعل ✓" : "مخفي ✕"}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          الموقع: بين فقرة البرنامج وبيانات الموعد والمقر (فوق صورة الشيخ)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        src="/images/gold_divider_official.png"
                        alt="معاينة الفاصل"
                        className="h-3 max-w-[80px] object-contain hidden sm:block opacity-90"
                      />
                      <span className="text-[11px] font-mono font-bold text-[#C5A059] bg-[#FAF7F2] dark:bg-[#122820] px-2 py-0.5 rounded border border-[#C5A059]/30">
                        {divider3Scale}%
                      </span>
                    </div>
                  </div>

                  {divider3Show && (
                    <div className="space-y-3 pt-2 border-t border-[#E7DFD5] dark:border-[#203D31]">
                      {/* D-Pad Quick Directional Nudge Buttons */}
                      <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#122820] border border-[#C5A059]/30 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#143628] dark:text-[#E5C378]">
                          <span>أزرار التحريك السريع (Nudge):</span>
                          <span className="font-mono text-[10px] text-gray-500">
                            X: {divider3OffsetX}px | Y: {divider3OffsetY}px
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setDivider3OffsetY((prev) => prev - 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="صعود للأعلى"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>صعود</span>
                          </button>
                          <button
                            onClick={() => setDivider3OffsetY((prev) => prev + 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="نزول للأسفل"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>نزول</span>
                          </button>
                          <button
                            onClick={() => setDivider3OffsetX((prev) => prev + 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="إزاحة لليمين"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>يمين</span>
                          </button>
                          <button
                            onClick={() => setDivider3OffsetX((prev) => prev - 10)}
                            className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#0E2019] border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-xs font-bold transition cursor-pointer flex items-center gap-1 text-[#143628] dark:text-[#E5C378]"
                            title="إزاحة لليسار"
                          >
                            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>يسار</span>
                          </button>
                          <button
                            onClick={() => {
                              setDivider3OffsetX(0);
                              setDivider3OffsetY(0);
                            }}
                            className="p-1.5 px-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[10px] font-bold transition cursor-pointer text-gray-700 dark:text-gray-300"
                            title="إعادة للوسط"
                          >
                            🎯 تمركز
                          </button>
                        </div>
                      </div>

                      {/* Precise Sliders Y and X */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
                          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                            <span>تحريك عمودي Y (صعود / نزول):</span>
                            <span className="font-mono font-bold text-[#C5A059]">{divider3OffsetY}px</span>
                          </div>
                          <input
                            type="range"
                            min="-200"
                            max="200"
                            value={divider3OffsetY}
                            onChange={(e) => setDivider3OffsetY(Number(e.target.value))}
                            className="w-full accent-[#C5A059]"
                          />
                        </div>

                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
                          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                            <span>تحريك أفقي X (يمين / يسار):</span>
                            <span className="font-mono font-bold text-[#C5A059]">{divider3OffsetX}px</span>
                          </div>
                          <input
                            type="range"
                            min="-200"
                            max="200"
                            value={divider3OffsetX}
                            onChange={(e) => setDivider3OffsetX(Number(e.target.value))}
                            className="w-full accent-[#C5A059]"
                          />
                        </div>
                      </div>

                      {/* Alignment & Scale */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] flex items-center justify-between">
                          <span className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">المحاذاة:</span>
                          <div className="grid grid-cols-3 gap-1">
                            {(["right", "center", "left"] as const).map((al) => (
                              <button
                                key={al}
                                onClick={() => setDivider3Align(al)}
                                className={`py-1 px-2.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                                  divider3Align === al
                                    ? "bg-[#1B4332] text-white border-[#C5A059]"
                                    : "border-[#E7DFD5] dark:border-[#203D31]"
                                }`}
                              >
                                {al === "right" ? "يمين" : al === "center" ? "وسط" : "يسار"}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-white dark:bg-[#0E2019] border border-[#E7DFD5] dark:border-[#203D31] space-y-1">
                          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                            <span>حجم وتكبير الفاصل (Scale %):</span>
                            <span className="font-mono font-bold text-[#C5A059]">{divider3Scale}%</span>
                          </div>
                          <input
                            type="range"
                            min="30"
                            max="180"
                            value={divider3Scale}
                            onChange={(e) => setDivider3Scale(Number(e.target.value))}
                            className="w-full accent-[#C5A059]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
                <span className="text-[#826122] dark:text-[#E5C378] text-[11px]">
                  جاهز للنشر على فيسبوك وواتساب
                </span>
              </div>

              {/* THE MASTER RENDERED POSTER CANVAS (HTML-TO-IMAGE TARGET) */}
              <div
                ref={posterRef}
                className={`w-full ${selectedFormat.aspectClass} ${selectedFormat.canvasClass} rounded-2xl relative overflow-hidden shadow-2xl flex flex-col justify-between px-6 sm:px-8 select-none transition-all`}
                style={{
                  direction: "rtl",
                  backgroundColor: "#F7F3EB",
                  color: "#143628",
                  paddingTop: `${topMargin}px`,
                  paddingBottom: `${bottomPadding}px`,
                  rowGap: `${sectionSpacing}px`,
                }}
              >
                {/* 1. BACKGROUND LAYER (Official 2026 Background Template) */}
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    opacity: bgOpacity / 100,
                    backgroundImage: `url(${activeBgUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />

                {/* Subtle Inner Gold Frame */}
                <div className="absolute inset-3 border border-[#C5A059]/30 rounded-xl pointer-events-none z-10" />

                {/* ========================================================== */}
                {/* 2. TOP SECTION: LOGO + OCCASION + PROTOCOLE FORMULA        */}
                {/* ========================================================== */}
                <div className="relative z-20 space-y-1.5 text-center pt-1">
                  {/* Interchangeable Tariqa Logo with X/Y fine-tuning */}
                  {showLogo && (
                    <div
                      className="flex flex-col items-center justify-center transition-transform"
                      style={{
                        transform: `translate(${logoOffsetX}px, ${logoOffsetY}px)`,
                      }}
                    >
                      <img
                        src={activeLogoUrl}
                        alt="شعار الطريقة القادرية البودشيشية"
                        className={`w-auto object-contain drop-shadow-sm transition-all ${
                          logoSize === "sm"
                            ? "h-12 sm:h-14"
                            : logoSize === "lg"
                            ? "h-20 sm:h-24"
                            : "h-16 sm:h-18"
                        }`}
                      />
                    </div>
                  )}

                  {/* Top Occasion Image / Banner (الملك / الصحراء / القبة) */}
                  {showTopImage && (
                    <div
                      className={`my-1 flex items-center gap-2 ${
                        topImagePosition === "right"
                          ? "justify-start"
                          : topImagePosition === "left"
                          ? "justify-end"
                          : "justify-center"
                      }`}
                    >
                      <div className="p-1 rounded-xl bg-gradient-to-r from-[#143628] via-[#1B4332] to-[#143628] text-white border border-[#C5A059] shadow-sm flex items-center gap-2 px-3">
                        <div
                          className={`rounded-full overflow-hidden border border-[#C5A059] flex-shrink-0 bg-white/10 ${
                            topImageSize === "sm"
                              ? "w-7 h-7"
                              : topImageSize === "lg"
                              ? "w-11 h-11"
                              : "w-8 h-8"
                          }`}
                        >
                          <img
                            src={activeTopImageUrl}
                            alt="صورة المناسبة"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span
                          className="font-amiri font-bold text-[#E5C378]"
                          style={{ fontSize: `${0.85 * pFactor}rem` }}
                        >
                          {topImageBannerText}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Protocol Section Container (Royal Header + Idhn + Sheikh Name) with X/Y Move */}
                  <div
                    className="transition-transform space-y-0.5"
                    style={{
                      transform: `translate(${protocolOffsetX}px, ${protocolOffsetY}px)`,
                    }}
                  >
                    {/* Royal Header Formula */}
                    {showRoyalHeader && (
                      <p
                        className="font-maghribi text-[#143628] leading-tight font-semibold pt-0.5"
                        style={{ fontSize: `${0.88 * pFactor}rem` }}
                      >
                        {royalHeaderText}
                      </p>
                    )}

                    {/* Idhn Mubarak Formula */}
                    <div className="space-y-0.5 pt-0.5">
                      <p
                        className="font-maghribi text-[#143628] font-semibold"
                        style={{ fontSize: `${0.85 * pFactor}rem` }}
                      >
                        {idhnPrefix}
                      </p>
                      <h2
                        className="font-maghribi font-bold text-[#143628] tracking-wide leading-tight"
                        style={{ fontSize: `${1.3 * pFactor}rem` }}
                      >
                        {sheikhName}
                      </h2>
                    </div>
                  </div>

                  {/* Official Moroccan Gold Arabesque Divider 1 (العلوي - with fine position X/Y/Align and scale) */}
                  {divider1Show && (
                    <div
                      onClick={() => setActiveTab("dividers")}
                      title="الفاصل 1 (العلوي) - انقر لضبط الموضع في لوحة الفواصل"
                      className={`flex py-0.5 transition-transform cursor-pointer group ${
                        divider1Align === "right"
                          ? "justify-start"
                          : divider1Align === "left"
                          ? "justify-end"
                          : "justify-center"
                      }`}
                      style={{
                        transform: `translate(${divider1OffsetX}px, ${divider1OffsetY}px) scale(${divider1Scale / 100})`,
                      }}
                    >
                      <img
                        src="/images/gold_divider_official.png"
                        alt="فاصل زخرفي ذهبي علوي"
                        className="h-4.5 sm:h-5 md:h-6 max-w-[280px] sm:max-w-[320px] w-auto object-contain drop-shadow-[0_1px_3px_rgba(197,160,89,0.35)] group-hover:scale-105 transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* ========================================================== */}
                {/* 3. MIDDLE SECTION: EVENT TITLE & ANNOUNCEMENT              */}
                {/* ========================================================== */}
                <div
                  className="relative z-20 space-y-1 text-center px-2 transition-transform"
                  style={{
                    transform: `translate(${titleOffsetX}px, ${titleOffsetY}px)`,
                  }}
                >
                  <p
                    className="font-sans text-[#143628] font-bold"
                    style={{ fontSize: `${0.85 * gFactor}rem` }}
                  >
                    {organizerText}
                  </p>

                  {/* Big Calligraphic Gold Title (Scalable with titleScale) */}
                  <div className="py-0.5">
                    <h1
                      className="font-maghribi font-bold text-[#826122] tracking-wider drop-shadow-xs leading-tight"
                      style={{ fontSize: `${2.6 * tFactor}rem` }}
                    >
                      {eventTitle}
                    </h1>
                  </div>

                  {/* Official Moroccan Gold Arabesque Divider 2 (الأوسط - بين العنوان والبرنامج) */}
                  {divider2Show && (
                    <div
                      onClick={() => setActiveTab("dividers")}
                      title="الفاصل 2 (الأوسط) - انقر لضبط الموضع في لوحة الفواصل"
                      className={`flex py-0.5 transition-transform cursor-pointer group ${
                        divider2Align === "right"
                          ? "justify-start"
                          : divider2Align === "left"
                          ? "justify-end"
                          : "justify-center"
                      }`}
                      style={{
                        transform: `translate(${divider2OffsetX}px, ${divider2OffsetY}px) scale(${divider2Scale / 100})`,
                      }}
                    >
                      <img
                        src="/images/gold_divider_official.png"
                        alt="فاصل زخرفي ذهبي أوسط"
                        className="h-4.5 sm:h-5 md:h-6 max-w-[280px] sm:max-w-[320px] w-auto object-contain drop-shadow-[0_1px_3px_rgba(197,160,89,0.35)] group-hover:scale-105 transition-all"
                      />
                    </div>
                  )}

                  {/* Program Description */}
                  {eventProgram && (
                    <p
                      className="font-amiri text-[#143628] font-medium leading-relaxed max-w-sm mx-auto"
                      style={{ fontSize: `${0.85 * gFactor}rem` }}
                    >
                      {eventProgram}
                    </p>
                  )}

                  {/* Official Moroccan Gold Arabesque Divider 3 (السفلي - تحت البرنامج وفوق التاريخ والمقر) */}
                  {divider3Show && (
                    <div
                      onClick={() => setActiveTab("dividers")}
                      title="الفاصل 3 (السفلي) - انقر لضبط الموضع في لوحة الفواصل"
                      className={`flex py-0.5 transition-transform cursor-pointer group ${
                        divider3Align === "right"
                          ? "justify-start"
                          : divider3Align === "left"
                          ? "justify-end"
                          : "justify-center"
                      }`}
                      style={{
                        transform: `translate(${divider3OffsetX}px, ${divider3OffsetY}px) scale(${divider3Scale / 100})`,
                      }}
                    >
                      <img
                        src="/images/gold_divider_official.png"
                        alt="فاصل زخرفي ذهبي سفلي"
                        className="h-4.5 sm:h-5 md:h-6 max-w-[280px] sm:max-w-[320px] w-auto object-contain drop-shadow-[0_1px_3px_rgba(197,160,89,0.35)] group-hover:scale-105 transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* ========================================================== */}
                {/* 4. BOTTOM SECTION: EXACT INDESIGN LAYOUT (CHEIKH + INFOS) */}
                {/* ========================================================== */}
                <div className="relative z-20 space-y-1">
                  <div
                    className={`flex items-end justify-between gap-2 sm:gap-3 ${
                      sheikhPosition === "left" ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    {/* Right Block: Date, Timing, Location & Invitation (InDesign format) with X/Y nudge */}
                    <div
                      className="flex-1 space-y-0.5 text-right select-none pb-0.5 transition-transform"
                      style={{
                        transform: `translate(${bottomOffsetX}px, ${bottomOffsetY}px)`,
                      }}
                    >
                      {/* 1. Date Hégirienne & Grégorienne */}
                      <div className="space-y-0.5 leading-tight">
                        <p
                          className="font-sans font-extrabold text-[#103C29] tracking-tight"
                          style={{ fontSize: `${0.95 * bFactor}rem` }}
                        >
                          {hijriDate}
                        </p>
                        <p
                          className="font-sans font-extrabold text-[#103C29] tracking-tight"
                          style={{ fontSize: `${0.95 * bFactor}rem` }}
                        >
                          {gregorianDate}
                        </p>
                      </div>

                      {/* 2. Timing */}
                      <p
                        className="font-sans font-bold text-[#D37D4F] pt-0.5 leading-tight"
                        style={{ fontSize: `${0.88 * bFactor}rem` }}
                      >
                        {eventTiming}
                      </p>

                      {/* 3. Venue & Address */}
                      <div className="pt-0.5 space-y-0.5 leading-snug">
                        <p
                          className="font-amiri font-bold text-[#103C29]"
                          style={{ fontSize: `${0.88 * bFactor}rem` }}
                        >
                          {venueTitle}
                        </p>
                        <p
                          className="font-sans font-bold text-[#231E1C]"
                          style={{ fontSize: `${0.82 * bFactor}rem` }}
                        >
                          {addressLine1}
                        </p>
                        <p
                          className="font-sans font-extrabold text-[#103C29]"
                          style={{ fontSize: `${0.88 * bFactor}rem` }}
                        >
                          {addressLine2}
                        </p>
                      </div>

                      {/* 4. Invitation Line (Direct text from InDesign) */}
                      {badgeType === "text" && (
                        <p
                          className="font-amiri font-bold text-[#D37D4F] pt-0.5 leading-tight"
                          style={{ fontSize: `${0.88 * bFactor}rem` }}
                        >
                          {invitationText}
                        </p>
                      )}
                    </div>

                    {/* Left Block: Sheikh Photo (Precision Position X/Y/Zoom) */}
                    {showSheikhImage && (
                      <div
                        className={`flex-shrink-0 transition-transform ${
                          sheikhSize === "sm"
                            ? "w-28 sm:w-34"
                            : sheikhSize === "lg"
                            ? "w-42 sm:w-52"
                            : "w-34 sm:w-42"
                        }`}
                        style={{
                          transform: `translate(${sheikhOffsetX}px, ${sheikhOffsetY}px) scale(${sheikhZoom / 100})`,
                          transformOrigin: "bottom center",
                        }}
                      >
                        <div className="relative overflow-visible filter drop-shadow-md">
                          <img
                            src={activeSheikhPhotoUrl}
                            alt="فضيلة الشيخ الدكتور سيدي منير القادري بودشيش"
                            className="w-full h-auto object-contain object-bottom pointer-events-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Invitation Badge Button (Bottom Center) when official mode selected */}
                  {badgeType === "official" && (
                    <div className="flex justify-center pt-0.5">
                      <img
                        src="/images/badge_dawaa_aama.png"
                        alt="الدعوة عامة"
                        className="h-6 sm:h-7 w-auto object-contain drop-shadow-md select-none pointer-events-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Helper Legend */}
              <p className="text-[11px] text-gray-500 text-center max-w-md font-ibm">
                💡 تحكم متقدم 100% : إمكانية حذف وإضافة صور الشيخ والشعارات مع المعايير القياسية • تحريك النصوص والفواصل الذهبية يميناً ويساراً وفوق وتحت (X / Y) وتكبيرها بدقة تناسب كل المقاسات.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
