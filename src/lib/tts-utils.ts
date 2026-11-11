export type TtsVoiceId = "Charon" | "Orus" | "Kore" | "Aoede" | "Puck";

export interface TtsVoiceOption {
  id: TtsVoiceId;
  label: string;
  tone: string;
}

export const GEMINI_TTS_VOICES: TtsVoiceOption[] = [
  { id: "Charon", label: "صوت وقور رصين", tone: "رجالي رصين ومناسب للسير والدروس" },
  { id: "Orus", label: "صوت خطابي واضح", tone: "رجالي جهوري واضح المخارج" },
  { id: "Kore", label: "صوت دافئ متزن", tone: "واضح ومتزن للقراءة اليومية" },
  { id: "Aoede", label: "صوت هادئ لطيف", tone: "نبرة ناعمة هادئة" },
  { id: "Puck", label: "صوت حيوي متوسط", tone: "إلقاء حيوي متسارع نسبياً" },
];

export const DEFAULT_GEMINI_VOICE: TtsVoiceId = "Charon";
export const PREVIEW_TEST_MAX_CHARS = 220;
export const FULL_SYNTH_MAX_CHARS = 1600;

/**
 * Clean Arabic / French / English text for natural TTS reading.
 */
export function sanitizeTextForSpeech(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/ﷺ/g, " صلى الله عليه وسلم ")
    .replace(/ﷻ/g, " جل جلاله ")
    .replace(/رضي الله عنهم?/g, (m) => ` ${m} `)
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/[«»﴿﴾*#_`~•✦❖◆▪►▼▲—–]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Truncates text cleanly on sentence or word boundaries for short test previews (~8 seconds).
 */
export function sliceTextForPreview(
  text: string,
  maxChars: number = PREVIEW_TEST_MAX_CHARS
): { snippet: string; isTruncated: boolean } {
  const clean = sanitizeTextForSpeech(text);
  if (clean.length <= maxChars) {
    return { snippet: clean, isTruncated: false };
  }

  const head = clean.slice(0, maxChars);
  const lastSentenceStop = Math.max(
    head.lastIndexOf("."),
    head.lastIndexOf("،"),
    head.lastIndexOf("؛"),
    head.lastIndexOf("؟"),
    head.lastIndexOf("!")
  );
  if (lastSentenceStop > Math.floor(maxChars * 0.55)) {
    return {
      snippet: clean.slice(0, lastSentenceStop + 1).trim(),
      isTruncated: true,
    };
  }

  const lastSpace = head.lastIndexOf(" ");
  if (lastSpace > Math.floor(maxChars * 0.5)) {
    return {
      snippet: `${clean.slice(0, lastSpace).trim()}...`,
      isTruncated: true,
    };
  }

  return {
    snippet: `${head.trim()}...`,
    isTruncated: true,
  };
}

/**
 * Estimates Gemini 2.5 Flash Preview TTS cost (~13.5 Arabic chars/sec, ~32 audio tokens/sec @ $10/1M tokens).
 */
export function estimateGeminiTtsCost(charCount: number): {
  estimatedSeconds: number;
  estimatedUsd: number;
  estimatedMad: number;
} {
  const clampedChars = Math.max(0, charCount);
  const estimatedSeconds = Math.max(1, Math.round(clampedChars / 13.5));
  const outputTokens = estimatedSeconds * 32;
  const inputTokens = Math.ceil(clampedChars / 2.2) + 25;
  const estimatedUsd =
    (outputTokens / 1_000_000) * 10.0 + (inputTokens / 1_000_000) * 0.5;
  const estimatedMad = estimatedUsd * 10; // ~10 MAD per USD conservative ceiling
  return {
    estimatedSeconds,
    estimatedUsd,
    estimatedMad,
  };
}

/**
 * Wraps raw 16-bit PCM bytes (24kHz mono default for Gemini Native Audio TTS) in a standard RIFF WAV container.
 */
export function createWavBufferFromPcm(
  pcmData: Buffer,
  sampleRate: number = 24000,
  numChannels: number = 1,
  bitsPerSample: number = 16
): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (PCM)
  header.writeUInt16LE(1, 20); // AudioFormat = 1 (PCM)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmData]);
}
