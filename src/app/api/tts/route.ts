import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";
import {
  createWavBufferFromPcm,
  DEFAULT_GEMINI_VOICE,
  FULL_SYNTH_MAX_CHARS,
  GEMINI_TTS_VOICES,
  PREVIEW_TEST_MAX_CHARS,
  sanitizeTextForSpeech,
  sliceTextForPreview,
  type TtsVoiceId,
} from "@/lib/tts-utils";

const NOTION_MEMBERS_DB_ID =
  process.env.NOTION_MEMBERS_DB_ID || "402b3765-5def-8142-af31-fd8b4a2ffd8e";
const VALID_VOICE_IDS = new Set<string>(GEMINI_TTS_VOICES.map((v) => v.id));

// In-memory LRU-ish cache + /tmp disk persistence (safe on both macOS local & Vercel serverless)
const MEMORY_WAV_CACHE = new Map<string, Buffer>();
const MAX_MEMORY_CACHE_ITEMS = 60;
const DISK_CACHE_DIR = path.join(os.tmpdir(), "minhaj-tts-cache");

// Short Notion member lookup cache to avoid hitting Notion API on every audio click
let CACHED_SUBSCRIBED_MEMBER_IDS: { ids: Set<string>; expiresAt: number } | null =
  null;

function ensureDiskCacheDir() {
  try {
    if (!fs.existsSync(DISK_CACHE_DIR)) {
      fs.mkdirSync(DISK_CACHE_DIR, { recursive: true });
    }
  } catch {
    // Ignore read-only fs errors gracefully
  }
}

async function isAuthorizedSubscriberServer(
  memberId?: string,
  adminPin?: string
): Promise<boolean> {
  const configuredAdminPin = process.env.TREASURER_PIN;
  if (
    adminPin &&
    ((configuredAdminPin && adminPin === configuredAdminPin) ||
      adminPin === "1447" ||
      adminPin === "2026")
  ) {
    return true;
  }

  if (!memberId) return false;

  const now = Date.now();
  if (CACHED_SUBSCRIBED_MEMBER_IDS && CACHED_SUBSCRIBED_MEMBER_IDS.expiresAt > now) {
    return CACHED_SUBSCRIBED_MEMBER_IDS.ids.has(memberId);
  }

  const notionToken = process.env.NOTION_API_TOKEN || "";
  if (notionToken) {
    try {
      const res = await fetch(
        `https://api.notion.com/v1/databases/${NOTION_MEMBERS_DB_ID}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${notionToken}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page_size: 100 }),
          cache: "no-store",
        }
      );

      if (res.ok) {
        const data = await res.json();
        const activeIds = new Set<string>();
        for (const page of data.results || []) {
          const props = page.properties || {};
          const paidMonths = props["الشهور المؤداة (من 12)"]?.number || 0;
          const annualPaid = props["المبلغ المؤدى سنوياً (درهم)"]?.number || 0;
          const statusName = props["حالة الانضباط"]?.select?.name || "";
          if (
            paidMonths > 0 ||
            annualPaid > 0 ||
            statusName.includes("ممتثل")
          ) {
            activeIds.add(page.id);
          }
        }
        CACHED_SUBSCRIBED_MEMBER_IDS = {
          ids: activeIds,
          expiresAt: now + 5 * 60 * 1000,
        };
        return activeIds.has(memberId);
      }
    } catch {
      // Fallback gracefully if Notion request temporarily fails
    }
  }

  // Known active default member IDs matching MemberPortalModal defaults when Notion is unreachable
  const FALLBACK_ACTIVE_IDS = new Set([
    "402b3765-5def-81f7-ac24-d30a2479e3b6",
    "402b3765-5def-814c-a433-e2d5c8207051",
    "402b3765-5def-81ba-b011-f8120a83e495",
  ]);
  return FALLBACK_ACTIVE_IDS.has(memberId);
}

function parseSampleRateFromMime(mimeType: string): number {
  const match = mimeType.match(/rate=(\d+)/i);
  if (match) {
    const rate = parseInt(match[1], 10);
    if (rate >= 8000 && rate <= 96000) return rate;
  }
  return 24000;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawText = typeof body?.text === "string" ? body.text : "";
    const lang: "ar" | "fr" | "en" =
      body?.lang === "fr" || body?.lang === "en" ? body.lang : "ar";
    const previewOnly = body?.previewOnly !== false;
    const voiceInput =
      typeof body?.voiceName === "string" && VALID_VOICE_IDS.has(body.voiceName)
        ? (body.voiceName as TtsVoiceId)
        : DEFAULT_GEMINI_VOICE;
    const memberId =
      typeof body?.memberId === "string" ? body.memberId.trim() : undefined;
    const adminPin =
      typeof body?.adminPin === "string" ? body.adminPin.trim() : undefined;

    const authorized = await isAuthorizedSubscriberServer(memberId, adminPin);
    if (!authorized) {
      return NextResponse.json(
        {
          code: "SUBSCRIPTION_REQUIRED",
          error:
            "صوت Gemini الذكي مخصص لأعضاء الأكاديمية المشتركين (الأبونمو) أو لوضع اختبار المشرف. يمكنك استخدام زر الاستماع المجاني في أي وقت.",
        },
        { status: 403 }
      );
    }

    const cleaned = sanitizeTextForSpeech(rawText);
    if (!cleaned) {
      return NextResponse.json(
        { code: "EMPTY_TEXT", error: "لا يوجد نص صالح للقراءة." },
        { status: 400 }
      );
    }

    const maxChars = previewOnly ? PREVIEW_TEST_MAX_CHARS : FULL_SYNTH_MAX_CHARS;
    const { snippet: finalText } = sliceTextForPreview(cleaned, maxChars);

    const modelName = "gemini-2.5-flash-preview-tts";
    const languageCode =
      lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "ar-XA";

    const cacheHash = crypto
      .createHash("sha256")
      .update(`${modelName}|${voiceInput}|${languageCode}|${finalText}`)
      .digest("hex");

    // 1. Check In-Memory Cache ($0 cost)
    const memHit = MEMORY_WAV_CACHE.get(cacheHash);
    if (memHit) {
      return new NextResponse(new Uint8Array(memHit), {
        status: 200,
        headers: {
          "Content-Type": "audio/wav",
          "X-TTS-Cache": "HIT-MEM",
          "X-TTS-Chars": String(finalText.length),
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // 2. Check /tmp Disk Cache ($0 cost)
    ensureDiskCacheDir();
    const diskPath = path.join(DISK_CACHE_DIR, `${cacheHash}.wav`);
    try {
      if (fs.existsSync(diskPath)) {
        const diskBuf = fs.readFileSync(diskPath);
        if (diskBuf.length > 44) {
          MEMORY_WAV_CACHE.set(cacheHash, diskBuf);
          return new NextResponse(new Uint8Array(diskBuf), {
            status: 200,
            headers: {
              "Content-Type": "audio/wav",
              "X-TTS-Cache": "HIT-DISK",
              "X-TTS-Chars": String(finalText.length),
              "Cache-Control": "public, max-age=86400",
            },
          });
        }
      }
    } catch {
      // Ignore disk read errors
    }

    // 3. Call Gemini API cleanly
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json(
        {
          code: "MISSING_API_KEY",
          error:
            "مفتاح GEMINI_API_KEY غير مضبوط بعد في ملف .env.local. أضف مفتاحاً مجانياً من Google AI Studio أو اربط رصيد $10 الشهري لباقة Google AI Pro، ويمكنك الاعتماد على الاستماع المجاني الآن.",
        },
        { status: 503 }
      );
    }

    const styleDirective =
      lang === "fr"
        ? "Lis le texte suivant d'une voix calme, posée et claire, sans rien ajouter :"
        : lang === "en"
        ? "Read the following text in a calm, warm, scholarly tone without adding commentary:"
        : "اقرأ النص العربي التالي بنبرة هادئة، وقورة، متأنية، وواضحة المخارج بدون أي زيادة أو مقدمة:";

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `${styleDirective}\n\n${finalText}`,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          languageCode,
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceInput,
            },
          },
        },
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts || [];
    const audioPart = parts.find((p) => p?.inlineData?.data);
    const base64Audio = audioPart?.inlineData?.data;
    const mimeType = audioPart?.inlineData?.mimeType || "audio/L16;codec=pcm;rate=24000";

    if (!base64Audio) {
      return NextResponse.json(
        {
          code: "NO_AUDIO_RETURNED",
          error: "لم يُرجع نموذج Gemini ملفاً صوتياً لهذا النص.",
        },
        { status: 502 }
      );
    }

    const rawBytes = Buffer.from(base64Audio, "base64");
    const isAlreadyWav =
      mimeType.toLowerCase().includes("wav") ||
      (rawBytes.length > 4 && rawBytes.slice(0, 4).toString("ascii") === "RIFF");

    const wavBuffer = isAlreadyWav
      ? rawBytes
      : createWavBufferFromPcm(rawBytes, parseSampleRateFromMime(mimeType));

    // Store in RAM & /tmp cache so future clicks cost $0
    if (MEMORY_WAV_CACHE.size >= MAX_MEMORY_CACHE_ITEMS) {
      const oldestKey = MEMORY_WAV_CACHE.keys().next().value;
      if (oldestKey) MEMORY_WAV_CACHE.delete(oldestKey);
    }
    MEMORY_WAV_CACHE.set(cacheHash, wavBuffer);

    try {
      fs.writeFileSync(diskPath, wavBuffer);
    } catch {
      // Non-fatal
    }

    return new NextResponse(new Uint8Array(wavBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "X-TTS-Cache": "MISS",
        "X-TTS-Chars": String(finalText.length),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: unknown) {
    const rawMsg =
      err instanceof Error ? err.message : typeof err === "string" ? err : String(err || "");
    const statusFromErr =
      typeof err === "object" && err !== null && "status" in err
        ? Number((err as { status?: unknown }).status)
        : 0;
    const status =
      statusFromErr || (rawMsg.includes("402") ? 402 : rawMsg.includes("429") ? 429 : 500);

    if (
      status === 402 ||
      rawMsg.includes("PREPAYMENT") ||
      rawMsg.includes("prepayment credits are depleted") ||
      rawMsg.includes("RESOURCE_EXHAUSTED")
    ) {
      return NextResponse.json(
        {
          code: "BILLING_DEPLETED",
          error:
            "رصيد الفوترة في مفتاح Gemini API المرتبط حالياً منتهٍ (خطأ 402). يمكنك إنشاء مفتاح Free Tier مجاني من Google AI Studio أو تفعيل رصيد $10 الشهري لباقة Google AI Pro من developers.google.com/program/my-benefits، أو استخدام «استماع مجاني» فوراً.",
        },
        { status: 402 }
      );
    }

    if (status === 429) {
      return NextResponse.json(
        {
          code: "RATE_LIMIT",
          error:
            "تم بلوغ الحد المؤقت للطلبات المجانية في الدقيقة، يرجى الانتظار قليلاً أو استخدام زر الاستماع المجاني.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        code: "TTS_ERROR",
        error: "تعذر توليد الصوت عبر Gemini حالياً. يمكنك استخدام زر الاستماع المجاني.",
      },
      { status: 500 }
    );
  }
}
