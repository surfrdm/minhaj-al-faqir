export type WarshReciterId = "kazabri" | "kouchi" | "saayed" | "benkirane";

export interface WarshReciterMeta {
  id: WarshReciterId;
  name: string;
  cityOrRole: string;
  serverBase: string;
  hasLocalOpeningDemo: boolean;
}

export const QURAN_WARSH_DEMO_COMBINED_URL =
  "/audio/demo/quran-warsh-demo-fatiha-baqarah.mp3";

export const QURAN_WARSH_RECITERS: WarshReciterMeta[] = [
  {
    id: "kazabri",
    name: "الشيخ عمر القزابري",
    cityOrRole: "الدار البيضاء • مرتل برواية ورش",
    serverBase: "https://cdn.mp3quran.net/audio/omar-kazabri/r1/",
    hasLocalOpeningDemo: true,
  },
  {
    id: "kouchi",
    name: "الشيخ العيون الكوشي",
    cityOrRole: "آسفي / الدار البيضاء • برواية ورش",
    serverBase: "https://cdn.mp3quran.net/audio/laayoun-kouchi/r1/",
    hasLocalOpeningDemo: true,
  },
  {
    id: "saayed",
    name: "الشيخ محمد سايد",
    cityOrRole: "مرتل مغربي • برواية ورش",
    serverBase: "https://cdn.mp3quran.net/audio/muhammad-saayed/r1/",
    hasLocalOpeningDemo: false,
  },
  {
    id: "benkirane",
    name: "الشيخ عبد المجيب بنكيران",
    cityOrRole: "القراءة المغربية المعتمدة • ورش",
    serverBase: "https://cdn.mp3quran.net/audio/abdelmoujib-benkirane/r1/",
    hasLocalOpeningDemo: false,
  },
];

export interface ResolvedQuranAudioTrack {
  id: string;
  url: string;
  label: string;
  reciterName: string;
  sourceType: "local-demo" | "mp3quran-cdn";
  surahNumber: number;
}

export function resolveWarshAudioTrack(params: {
  reciterId: WarshReciterId;
  hizbNumber: number;
  surahNumber: number;
  isOpening?: boolean;
  forceCombinedDemo?: boolean;
}): ResolvedQuranAudioTrack {
  const { reciterId, hizbNumber, surahNumber, isOpening, forceCombinedDemo } = params;
  const reciter =
    QURAN_WARSH_RECITERS.find((r) => r.id === reciterId) || QURAN_WARSH_RECITERS[0];

  if (forceCombinedDemo) {
    return {
      id: "demo-combined-fatiha-baqarah",
      url: QURAN_WARSH_DEMO_COMBINED_URL,
      label: "النموذج الكامل (الفاتحة + بداية البقرة 1-5)",
      reciterName: QURAN_WARSH_RECITERS[0].name,
      sourceType: "local-demo",
      surahNumber: 1,
    };
  }

  // Local ultra-compact demo MP3s for Hizb 1 Pages 1-2 (Al-Fatiha & Al-Baqarah 1-5)
  if (hizbNumber === 1 && reciter.hasLocalOpeningDemo) {
    if (surahNumber === 1) {
      return {
        id: `demo-p1-fatiha-${reciter.id}`,
        url: `/audio/demo/quran-warsh-p1-fatiha-${reciter.id}.mp3`,
        label: "سورة الفاتحة (نموذج الصفحة 1)",
        reciterName: reciter.name,
        sourceType: "local-demo",
        surahNumber: 1,
      };
    }
    if (isOpening && surahNumber === 2) {
      return {
        id: `demo-p2-baqarah-${reciter.id}`,
        url: `/audio/demo/quran-warsh-p2-baqarah-${reciter.id}.mp3`,
        label: "بداية سورة البقرة 1-5 (نموذج الصفحة 2)",
        reciterName: reciter.name,
        sourceType: "local-demo",
        surahNumber: 2,
      };
    }
  }

  const normalizedSurah = Math.max(1, Math.min(114, Math.floor(surahNumber || 1)));
  const paddedSurah = String(normalizedSurah).padStart(3, "0");

  return {
    id: `cdn-${reciter.id}-s${paddedSurah}`,
    url: `${reciter.serverBase}${paddedSurah}.mp3`,
    label: `تلاوة السورة كاملة (${normalizedSurah})`,
    reciterName: reciter.name,
    sourceType: "mp3quran-cdn",
    surahNumber: normalizedSurah,
  };
}

export function formatAudioClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
